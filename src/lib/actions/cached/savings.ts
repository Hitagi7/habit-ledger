import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedSavings = unstable_cache(
    async (userId: string) => {
        const supabase = createAdminClient();
        if (!supabase) throw new Error("Admin client not available");

        const { data, error } = await supabase
            .from("savings")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },
    ["savings-list"],
    {
        tags: ["savings"],
        revalidate: 3600
    }
);
