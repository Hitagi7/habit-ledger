"use server";

import { createClient, createClientWithToken } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

// Helper function to fetch budgets and calculate spending
// capable of running with any supabase client (including token-based)
async function getBudgetsData(supabase: any, userId: string) {
    // Get budgets with category info
    const { data: budgets, error } = await supabase
        .from("budgets")
        .select(`
            *,
            categories (
                id,
                name,
                icon,
                color
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Calculate spending for each budget
    const now = new Date();
    const budgetsWithSpending = await Promise.all(
        budgets.map(async (budget: any) => {
            let startDate: string;
            let endDate: string;

            if (budget.period === "monthly") {
                // Current month
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
            } else {
                // Current week (Monday to Sunday)
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                startDate = new Date(now.setDate(diff)).toISOString().split("T")[0];
                endDate = new Date(now.setDate(diff + 6)).toISOString().split("T")[0];
            }

            // Get transactions for this category in the period
            const { data: transactions } = await supabase
                .from("transactions")
                .select("amount")
                .eq("user_id", userId)
                .eq("category_id", budget.category_id)
                .eq("type", "expense")
                .gte("date", startDate)
                .lte("date", endDate);

            const spent = transactions?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0;
            const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

            return {
                ...budget,
                spent,
                percentage,
                remaining: budget.amount - spent,
                isOverBudget: spent > budget.amount,
            };
        })
    );

    return budgetsWithSpending;
}

// Get all budgets for the current user with spending progress
export async function getBudgets() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Not authenticated", data: null };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { error: "No session found", data: null };
    }

    return await unstable_cache(
        async (token: string) => {
            try {
                const supabase = await createClientWithToken(token);
                const data = await getBudgetsData(supabase, user.id);
                return { error: null, data };
            } catch (error: any) {
                return { error: error.message, data: null };
            }
        },
        [`budgets-list-${user.id}`],
        {
            tags: [`budgets-${user.id}`],
            revalidate: 3600
        }
    )(session.access_token);
}

// Get budget statistics
export async function getBudgetStats() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { error: "Not authenticated", data: null };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { error: "No session found", data: null };
    }

    return await unstable_cache(
        async (token: string) => {
            try {
                const supabase = await createClientWithToken(token);
                const budgets = await getBudgetsData(supabase, user.id);

                const stats = {
                    totalBudgets: budgets.length,
                    onTrack: budgets.filter((b: any) => !b.isOverBudget).length,
                    overBudget: budgets.filter((b: any) => b.isOverBudget).length,
                    totalAllocated: budgets.reduce((sum: number, b: any) => sum + Number(b.amount), 0),
                    totalSpent: budgets.reduce((sum: number, b: any) => sum + b.spent, 0),
                };

                return { error: null, data: stats };
            } catch (error: any) {
                return { error: error.message, data: null };
            }
        },
        [`budget-stats-${user.id}`],
        {
            tags: [`budgets-${user.id}`], // Same tag as list so it invalidates together
            revalidate: 3600
        }
    )(session.access_token);
}

// Create a new budget
export async function createBudget(formData: {
    categoryId: string;
    amount: number;
    period: "monthly" | "weekly";
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Check if budget already exists for this category
    const { data: existing } = await supabase
        .from("budgets")
        .select("id")
        .eq("user_id", user.id)
        .eq("category_id", formData.categoryId)
        .single();

    if (existing) {
        return { error: "Budget already exists for this category", data: null };
    }

    const { data, error } = await supabase
        .from("budgets")
        .insert({
            user_id: user.id,
            category_id: formData.categoryId,
            amount: formData.amount,
            period: formData.period,
            start_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    revalidateTag(`budgets-${user.id}`);
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { error: null, data };
}

// Update an existing budget
export async function updateBudget(
    id: string,
    formData: {
        amount?: number;
        period?: "monthly" | "weekly";
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { data, error } = await supabase
        .from("budgets")
        .update({
            amount: formData.amount,
            period: formData.period,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    revalidateTag(`budgets-${user.id}`);
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { error: null, data };
}

// Delete a budget
export async function deleteBudget(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, data: null };
    }

    revalidateTag(`budgets-${user.id}`);
    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    return { error: null, data: null };
}
