"use client";

import { useTransition } from "react";
import { deleteSaving, updateSaving } from "@/lib/actions/savings"; // We will need to export updateSaving from actions if not already
import { Database } from "@/lib/types/database";

type Saving = Database["public"]["Tables"]["savings"]["Row"];

interface SavingCardProps {
    saving: Saving;
    index?: number;
}

export default function SavingCard({ saving, index = 0 }: SavingCardProps) {
    const [isPending, startTransition] = useTransition();

    const percentage = Math.min(
        Math.round((saving.current_amount / saving.target_amount) * 100),
        100
    );

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this saving goal?")) {
            startTransition(async () => {
                await deleteSaving(saving.id);
            });
        }
    };

    const handleAddFunds = () => {
        const amount = prompt("Enter amount to add:");
        if (amount && !isNaN(Number(amount))) {
            startTransition(async () => {
                await updateSaving(saving.id, {
                    currentAmount: Number(saving.current_amount) + Number(amount),
                });
            });
        }
    };

    return (
        <div
            className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300 feature-card group relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Background progress bar - refined for smoother look */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000 ease-out opacity-20"
                style={{ width: `${percentage}%` }}
            />

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        {saving.icon || "💰"}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{saving.name}</h3>
                        {saving.target_date && (
                            <p className="text-xs text-zinc-400">
                                Target: {new Date(saving.target_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete Goal"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button
                        onClick={handleAddFunds}
                        disabled={isPending}
                        className="p-2 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-500 rounded-lg transition-colors"
                        title="Add Funds"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white font-medium">{percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-zinc-400">
                        Saved: <span className="text-orange-500 font-medium">${saving.current_amount.toLocaleString()}</span>
                    </span>
                    <span className="text-zinc-500">
                        Goal: ${saving.target_amount.toLocaleString()}
                    </span>
                </div>
            </div>
            {saving.description && (
                <p className="mt-4 text-sm text-zinc-500 line-clamp-2">
                    {saving.description}
                </p>
            )}
        </div>
    );
}
