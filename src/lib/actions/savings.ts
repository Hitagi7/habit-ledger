"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSavings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { data, error } = await supabase
        .from("savings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
}

export async function createSaving(formData: {
    name: string;
    targetAmount: number;
    targetDate?: string;
    description?: string;
    color?: string;
    icon?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { data, error } = await supabase
        .from("savings")
        .insert({
            user_id: user.id,
            name: formData.name,
            target_amount: formData.targetAmount,
            target_date: formData.targetDate || null,
            description: formData.description || null,
            color: formData.color || null,
            icon: formData.icon || null,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard/budgets/savings");
    return { error: null, data };
}

export async function updateSaving(
    id: string,
    formData: {
        name?: string;
        targetAmount?: number;
        currentAmount?: number;
        targetDate?: string;
        description?: string;
        color?: string;
        icon?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    // Map camelCase to snake_case
    const updates: any = {
        updated_at: new Date().toISOString(),
    };
    if (formData.name !== undefined) updates.name = formData.name;
    if (formData.targetAmount !== undefined) updates.target_amount = formData.targetAmount;
    if (formData.currentAmount !== undefined) updates.current_amount = formData.currentAmount;
    if (formData.targetDate !== undefined) updates.target_date = formData.targetDate;
    if (formData.description !== undefined) updates.description = formData.description;
    if (formData.color !== undefined) updates.color = formData.color;
    if (formData.icon !== undefined) updates.icon = formData.icon;

    const { data, error } = await supabase
        .from("savings")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard/budgets/savings");
    return { error: null, data };
}

export async function deleteSaving(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated", data: null };
    }

    const { error } = await supabase
        .from("savings")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message, data: null };
    }

    revalidatePath("/dashboard/budgets");
    revalidatePath("/dashboard/budgets/savings");
    return { error: null, data: null };
}
