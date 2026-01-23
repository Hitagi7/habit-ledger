"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UserSettings = {
    currency: string;
};

export async function getUserSettings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { currency: "USD" };
    }

    const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error || !data) {
        // Return default if no settings found
        return { currency: "USD" };
    }

    return data;
}

export async function updateUserSettings(currency: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // Check if settings exist
    const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (existing) {
        const { error } = await supabase
            .from("user_settings")
            .update({ currency, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);

        if (error) throw error;
    } else {
        const { error } = await supabase
            .from("user_settings")
            .insert({ user_id: user.id, currency });

        if (error) throw error;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
}
