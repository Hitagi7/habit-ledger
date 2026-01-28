"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { getCachedBudgets } from "./cached/budgets";
import { createAdminClient } from "@/lib/supabase/admin";

// Get all budgets for the current user with spending progress
export async function getBudgets() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Attempt to use cached version
    const adminClient = createAdminClient();
    if (adminClient) {
        try {
            const data = await getCachedBudgets(user.id);
            return { error: null, data };
        } catch (e) {
            console.error("Cache fetch failed", e);
        }
    }

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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return { error: error.message, data: null };
    }

    // Calculate spending for each budget
    const now = new Date();
    const budgetsWithSpending = await Promise.all(
        budgets.map(async (budget) => {
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
                .eq("user_id", user.id)
                .eq("category_id", budget.category_id)
                .eq("type", "expense")
                .gte("date", startDate)
                .lte("date", endDate);

            const spent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
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

    return { error: null, data: budgetsWithSpending };
}

// Get budget statistics
export async function getBudgetStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { data: budgets } = await getBudgets();

    if (!budgets) {
        return {
            error: null,
            data: {
                totalBudgets: 0,
                onTrack: 0,
                overBudget: 0,
                totalAllocated: 0,
                totalSpent: 0,
            }
        };
    }

    const stats = {
        totalBudgets: budgets.length,
        onTrack: budgets.filter(b => !b.isOverBudget).length,
        overBudget: budgets.filter(b => b.isOverBudget).length,
        totalAllocated: budgets.reduce((sum, b) => sum + Number(b.amount), 0),
        totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
    };

    return { error: null, data: stats };
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

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    revalidateTag("budgets");
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

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    revalidateTag("budgets");
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

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard");
    revalidateTag("budgets");
    return { error: null, data: null };
}
