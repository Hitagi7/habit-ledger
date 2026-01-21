"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
        .eq("user_id", user.id)
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
        .eq("id", id)
        .eq("user_id", user.id);

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

// Get transaction stats
export async function getTransactionStats() {
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
        .select("amount, type")
        .eq("user_id", user.id)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth);

    if (error) {
        return { error: error.message, data: null };
    }

    const income = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

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
