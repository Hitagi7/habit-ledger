"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Get all categories for the current user
export async function getCategories(type?: "income" | "expense") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    let query = supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

    if (type) {
        query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
}

// Create a new category
export async function createCategory(formData: {
    name: string;
    type: "income" | "expense";
    icon?: string;
    color?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { data, error } = await supabase
        .from("categories")
        .insert({
            user_id: user.id,
            name: formData.name,
            type: formData.type,
            icon: formData.icon || "📁",
            color: formData.color || "#ff6b00",
        })
        .select()
        .single();

    if (error) {
        return { error: error.message, success: false, data: null };
    }

    revalidatePath("/dashboard/transactions");
    return { error: null, success: true, data };
}

// Update a category
export async function updateCategory(
    id: string,
    formData: {
        name?: string;
        type?: "income" | "expense";
        icon?: string;
        color?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("categories")
        .update({
            name: formData.name,
            type: formData.type,
            icon: formData.icon,
            color: formData.color,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    return { error: null, success: true };
}

// Delete a category
export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    return { error: null, success: true };
}

// Seed default categories for new users
export async function seedDefaultCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", success: false };
    }

    // Check if user already has categories
    const { data: existing } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

    if (existing && existing.length > 0) {
        return { error: null, success: true, message: "Categories already exist" };
    }

    const defaultCategories = [
        // Expense categories
        { name: "Food & Dining", type: "expense", icon: "🍔", color: "#ef4444" },
        { name: "Transportation", type: "expense", icon: "🚗", color: "#f97316" },
        { name: "Shopping", type: "expense", icon: "🛍️", color: "#eab308" },
        { name: "Entertainment", type: "expense", icon: "🎬", color: "#22c55e" },
        { name: "Bills & Utilities", type: "expense", icon: "💡", color: "#06b6d4" },
        { name: "Health", type: "expense", icon: "💊", color: "#8b5cf6" },
        { name: "Other Expense", type: "expense", icon: "📦", color: "#6b7280" },
        // Income categories
        { name: "Salary", type: "income", icon: "💰", color: "#22c55e" },
        { name: "Freelance", type: "income", icon: "💻", color: "#06b6d4" },
        { name: "Investments", type: "income", icon: "📈", color: "#8b5cf6" },
        { name: "Other Income", type: "income", icon: "💵", color: "#f97316" },
    ];

    const { error } = await supabase.from("categories").insert(
        defaultCategories.map((cat) => ({
            ...cat,
            user_id: user.id,
        }))
    );

    if (error) {
        return { error: error.message, success: false };
    }

    revalidatePath("/dashboard/transactions");
    return { error: null, success: true };
}
