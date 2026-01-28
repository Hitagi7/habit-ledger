import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedBudgets = unstable_cache(
    async (userId: string) => {
        const supabase = createAdminClient();
        if (!supabase) throw new Error("Admin client not available");

        // 1. Get budgets
        const { data: budgets, error: budgetsError } = await supabase
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

        if (budgetsError) throw budgetsError;

        // 2. Fetch necessary transactions for calculations
        // Optimization: Fetch ALL expense transactions for the user for the relevant time range in one go?
        // Or just let it be sequential? Parallel is better.
        // Even better: Fetch all expenses for this month/week?
        // Since budget periods differ, let's just fetch per budget but in parallel.

        const now = new Date();

        const budgetsWithSpending = await Promise.all(
            budgets.map(async (budget) => {
                let startDate: string;
                let endDate: string;

                if (budget.period === "monthly") {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
                } else {
                    const day = now.getDay();
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                    startDate = new Date(now.setDate(diff)).toISOString().split("T")[0];
                    endDate = new Date(now.setDate(diff + 6)).toISOString().split("T")[0];
                }

                const { data: transactionsData } = await supabase
                    .from("transactions")
                    .select("amount")
                    .eq("user_id", userId)
                    .eq("category_id", budget.category_id)
                    .eq("type", "expense")
                    .gte("date", startDate)
                    .lte("date", endDate);

                const transactions = (transactionsData || []) as any[];

                const spent = transactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
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
    },
    ["budgets-full-list"],
    {
        tags: ["budgets", "transactions"],
        revalidate: 3600
    }
);
