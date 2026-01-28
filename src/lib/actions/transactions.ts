"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { getCachedTransactions } from "./cached/transactions";
import { createAdminClient } from "@/lib/supabase/admin";

// Get all transactions for the current user
export async function getTransactions(filters?: {
    type?: "income" | "expense";
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Attempt to use cached version if Admin Client is available
    const adminClient = createAdminClient();
    if (adminClient) {
        try {
            const data = await getCachedTransactions(user.id, filters);
            return { error: null, data: data as any[] };
        } catch (e) {
            console.error("Cache fetch failed, falling back to dynamic fetch", e);
        }
    }

    // Table from supabase
    let query = supabase
        .from("transactions")
        .select(`
      *,
      categories (
        id,
        name,
        icon,
        color,
        type
      )
    `)
        .eq("user_id", user.id) // Equality check to confirm the user id
        .order("date", { ascending: false });

    // Apply filters
    if (filters?.type) {
        query = query.eq("type", filters.type);
    }
    if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.startDate) {
        query = query.gte("date", filters.startDate);
    }
    if (filters?.endDate) {
        query = query.lte("date", filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
}

// Create a new transaction
export async function createTransaction(formData: {
    amount: number;
    type: "income" | "expense";
    description?: string;
    categoryId?: string;
    date?: string;
    tags?: string[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: formData.amount,
        type: formData.type,
        description: formData.description || null,
        category_id: formData.categoryId || null,
        date: formData.date || new Date().toISOString().split("T")[0],
        tags: formData.tags || null,
    });

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

// Update a transaction
export async function updateTransaction(
    id: string,
    formData: {
        amount?: number;
        type?: "income" | "expense";
        description?: string;
        categoryId?: string;
        date?: string;
        tags?: string[];
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("transactions")
        .update({
            amount: formData.amount,
            type: formData.type,
            description: formData.description,
            category_id: formData.categoryId,
            date: formData.date,
            tags: formData.tags,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)   // Equality check to confirm the transaction id
        .eq("user_id", user.id); // Equality check to confirm the user id

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

// Delete a transaction
export async function deleteTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
    return { error: null, success: true };
}

import { getCachedTransactionStats } from "./cached/transactions";

// Get transaction stats
export async function getTransactionStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Attempt to use cached version if Admin Client is available
    const adminClient = createAdminClient();
    if (adminClient) {
        try {
            const data = await getCachedTransactionStats(user.id);
            return { error: null, data };
        } catch (e) {
            console.error("Cache fetch failed, falling back to dynamic fetch", e);
        }
    }

    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

    if (error) {
        return { error: error.message, data: null };
    }

    // Calculate the sum for income and expenses
    const income = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0); // Something like for each, it processes each elements

    const expenses = data
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
        error: null,
        data: {
            income,
            expenses,
            balance: income - expenses,
            transactionCount: data.length,
        },
    };
}

// Get category breakdown for expense/income
export async function getCategoryBreakdown(type: "income" | "expense" = "expense") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("transactions")
        .select(`
            amount,
            category_id,
            categories (
                id,
                name
            )
        `)
        .eq("user_id", user.id)
        .eq("type", type)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

    if (error) {
        return { error: error.message, data: null };
    }

    // Group by category
    const categoryTotals: Record<string, { name: string; amount: number; count: number }> = {};
    let totalAmount = 0;

    for (const transaction of data) {
        const amount = Number(transaction.amount);
        totalAmount += amount;

        const catId = transaction.category_id || "uncategorized";
        // Handle categories - Supabase returns single object for one-to-one relation
        const category = transaction.categories as unknown as { id: string; name: string } | null;
        const catName = category?.name || "Uncategorized";

        if (!categoryTotals[catId]) {
            categoryTotals[catId] = { name: catName, amount: 0, count: 0 };
        }
        categoryTotals[catId].amount += amount;
        categoryTotals[catId].count += 1;
    }

    // Convert to array with percentages, sorted by amount
    const breakdown = Object.entries(categoryTotals)
        .map(([id, { name, amount, count }]) => ({
            id,
            name,
            amount,
            count,
            percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    return {
        error: null,
        data: {
            breakdown,
            total: totalAmount,
            type,
        },
    };
}

// Get savings stats (Income vs Expense over time)
export async function getSavingsStats(months = 6) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Date range: Last X months
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1).toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("transactions")
        .select("amount, type, date")
        .eq("user_id", user.id)
        .gte("date", startDate)
        .order("date", { ascending: true });

    if (error) {
        return { error: error.message, data: null };
    }

    // Group by Month
    const monthlyStats: Record<string, { income: number; expenses: number; savings: number }> = {};
    const monthOrder: string[] = [];

    // Initialize months to ensure no gaps (optional, but good for charts)
    for (let i = 0; i < months; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
        const monthKey = d.toLocaleString("default", { month: "short" });
        if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { income: 0, expenses: 0, savings: 0 };
            monthOrder.push(monthKey);
        }
    }

    data.forEach((t) => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleString("default", { month: "short" });
        const amount = Number(t.amount);

        if (monthlyStats[monthKey]) {
            if (t.type === "income") {
                monthlyStats[monthKey].income += amount;
            } else if (t.type === "expense") {
                monthlyStats[monthKey].expenses += amount;
            }
        }
    });

    // Calculate savings and format for chart
    const chartData = monthOrder.map((month) => {
        const { income, expenses } = monthlyStats[month];
        return {
            month,
            income,
            expenses,
            savings: income - expenses,
        };
    });

    return { error: null, data: chartData };
}
