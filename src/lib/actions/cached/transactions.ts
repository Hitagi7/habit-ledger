import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedTransactions = unstable_cache(
    async (userId: string, filters?: { type?: "income" | "expense"; categoryId?: string; startDate?: string; endDate?: string }) => {
        const supabase = createAdminClient();
        if (!supabase) throw new Error("Admin client not available");

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
            .eq("user_id", userId)
            .order("date", { ascending: false });

        if (filters?.type) query = query.eq("type", filters.type);
        if (filters?.categoryId) query = query.eq("category_id", filters.categoryId);
        if (filters?.startDate) query = query.gte("date", filters.startDate);
        if (filters?.endDate) query = query.lte("date", filters.endDate);

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },
    ["transactions-list"],
    {
        tags: ["transactions"],
        revalidate: 3600 // 1 hour default
    }
);

export const getCachedTransactionStats = unstable_cache(
    async (userId: string) => {
        const supabase = createAdminClient();
        if (!supabase) throw new Error("Admin client not available");

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("transactions")
            .select("amount, type")
            .eq("user_id", userId)
            .gte("date", startOfMonth)
            .lte("date", endOfMonth);

        if (error || !data) throw error || new Error("No data found");

        const income = (data || [])
            .filter((t: any) => t.type === "income")
            .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

        const expenses = (data || [])
            .filter((t: any) => t.type === "expense")
            .reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            transactionCount: data.length,
        };
    },
    ["transactions-stats"],
    {
        tags: ["transactions"],
        revalidate: 3600
    }
);
