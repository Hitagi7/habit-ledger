"use server";

import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

// Default model for text generation
const DEFAULT_MODEL = "gemini-2.0-flash";

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

        const response = await genAI.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
        });

        return { data: response.text || null, error: null };
    } catch (error) {
        console.error("Gemini API error:", error);
        return { data: null, error: "Failed to generate content" };
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
    habits: { name: string; completionRate: number; streak: number }[];
}): Promise<{ data: string | null; error: string | null }> {
    const prompt = `You are a helpful habit coach. Based on these habit statistics, provide 2-3 brief, encouraging suggestions:

${data.habits.map((h) => `- ${h.name}: ${(h.completionRate * 100).toFixed(0)}% completion rate, ${h.streak} day streak`).join("\n")}

Keep your response concise (under 150 words). Be encouraging and practical.`;

    return generateContent(prompt);
}
