"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Default model for text generation
const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Generate text content from a prompt
 */
export async function generateContent(prompt: string): Promise<{
    data: string | null;
    error: string | null;
}> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { data: null, error: "Gemini API key not configured" };
        }

        const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { data: text || null, error: null };
    } catch (error: any) {
        console.error("Gemini API error:", error);
        return { data: null, error: error.message || "Failed to generate content" };
    }
}

/**
 * Generate financial insights based on spending data
 */
export async function generateFinancialInsights(data: {
    totalIncome: number;
    totalExpenses: number;
    categoryBreakdown: { category: string; amount: number }[];
}): Promise<{ data: string | null; error: string | null }> {
    const prompt = `You are a helpful financial advisor. Analyze this spending data and provide 2-3 brief, actionable insights:
    
Monthly Income: $${data.totalIncome.toFixed(2)}
Monthly Expenses: $${data.totalExpenses.toFixed(2)}
Net Savings: $${(data.totalIncome - data.totalExpenses).toFixed(2)}

Spending by Category:
${data.categoryBreakdown.map((c) => `- ${c.category}: $${c.amount.toFixed(2)}`).join("\n")}

Keep your response concise (under 150 words). Focus on practical tips.`;

    return generateContent(prompt);
}

/**
 * Generate habit improvement suggestions
 */
export async function generateHabitInsights(data: {
    totalHabits: number;
    completionRate: number;
    topStreaks: { name: string; streak: number }[];
}): Promise<{ data: string | null; error: string | null }> {
    const prompt = `You are a helpful habit coach. Analyze this user's habit performance and provide 2-3 brief, motivating insights:

Current Status:
- Total Active Habits: ${data.totalHabits}
- Avg Completion Rate: ${data.completionRate}%
- Top Streaks: ${data.topStreaks.map(h => `${h.name} (${h.streak} days)`).join(", ") || "None yet"}

Keep your response concise (under 100 words). Be encouraging but practical. Suggest 1 specific small improvement.`;

    return generateContent(prompt);
}
