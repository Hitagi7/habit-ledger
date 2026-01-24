"use client";

import { useState } from "react";
import { generateHabitInsightsAction } from "@/lib/actions/dashboard";
import ReactMarkdown from "react-markdown";

export default function HabitAI() {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateHabitInsightsAction();
            if (result.error) {
                setError(result.error);
            } else {
                setInsight(result.data);
            }
        } catch (err) {
            setError("Failed to connect to AI service");
        }
        setLoading(false);
    };

    return (
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden mt-6">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">AI Habit Insights</h3>
                </div>
                {!insight && !loading && (
                    <button
                        onClick={handleGenerate}
                        className="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors font-medium hover:cursor-pointer"
                    >
                        Generate Tips
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-3 py-2 animate-pulse">
                    <div className="h-4 bg-amber-500/10 rounded w-3/4"></div>
                    <div className="h-4 bg-amber-500/10 rounded w-full"></div>
                    <div className="h-4 bg-amber-500/10 rounded w-5/6"></div>
                    <p className="text-xs text-amber-400 mt-2">Consulting Gemini AI...</p>
                </div>
            ) : error ? (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                    <button onClick={handleGenerate} className="block mt-2 text-xs underline hover:cursor-pointer">Try Again</button>
                </div>
            ) : insight ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-strong:text-white prose-li:text-zinc-300">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                    <button
                        onClick={handleGenerate}
                        className="mt-4 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:cursor-pointer"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            ) : (
                <p className="text-zinc-400 text-sm">
                    Generate personalized tips to improve your consistency and build better habits, powered by Google Gemini.
                </p>
            )}
        </div>
    );
}
