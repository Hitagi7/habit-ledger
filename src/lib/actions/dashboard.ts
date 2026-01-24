"use server";

import { getTransactionStats, getCategoryBreakdown } from "@/lib/actions/transactions";
import { getHabitStats } from "@/lib/actions/habits";
import { generateFinancialInsights, generateHabitInsights } from "@/lib/gemini/client";

export async function generateDashboardInsightsAction() {
    // 1. Gather data
    const stats = await getTransactionStats();
    const breakdown = await getCategoryBreakdown("expense");

    if (stats.error || !stats.data || breakdown.error || !breakdown.data) {
        return { error: "Failed to fetch financial data for analysis", data: null };
    }

    // 2. Format for Gemini
    const aiData = {
        totalIncome: stats.data.income,
        totalExpenses: stats.data.expenses,
        categoryBreakdown: breakdown.data.breakdown.map(c => ({
            category: c.name,
            amount: c.amount
        })).slice(0, 5) // Top 5 categories only to save tokens
    };

    // 3. Call AI
    const result = await generateFinancialInsights(aiData);

    return result;
}

export async function generateHabitInsightsAction() {
    const habits = await getHabitStats();

    if (habits.error || !habits.data) {
        return { error: "Failed to fetch habit data for analysis", data: null };
    }

    const aiData = {
        totalHabits: habits.data.totalHabits,
        completionRate: habits.data.averageCompletion,
        topStreaks: habits.data.habitDetails?.sort((a, b) => b.streak - a.streak).slice(0, 3) || []
    };

    return await generateHabitInsights(aiData);
}
