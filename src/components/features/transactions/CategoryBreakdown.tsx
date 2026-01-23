"use client";

import { useState } from "react";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface CategoryBreakdownData {
    breakdown: {
        id: string;
        name: string;
        amount: number;
        count: number;
        percentage: number;
    }[];
    total: number;
    type: "income" | "expense";
}

interface CategoryBreakdownProps {
    expenseData: CategoryBreakdownData | null;
    incomeData: CategoryBreakdownData | null;
}

// Color palette for categories
const COLORS = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
];

export default function CategoryBreakdown({ expenseData, incomeData }: CategoryBreakdownProps) {
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

    const data = activeTab === "expense" ? expenseData : incomeData;
    const breakdown = data?.breakdown || [];
    const total = data?.total || 0;

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
            {/* Header with tabs */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Category Breakdown</h3>
                <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
                    <button
                        onClick={() => setActiveTab("expense")}
                        className={`px-3 py-1 text-xs font-medium rounded-md hover:cursor-pointer transition-all ${activeTab === "expense"
                            ? "bg-red-500/20 text-red-400"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setActiveTab("income")}
                        className={`px-3 py-1 text-xs font-medium rounded-md hover:cursor-pointer transition-all ${activeTab === "income"
                            ? "bg-green-500/20 text-green-400"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        Income
                    </button>
                </div>
            </div>

            {/* Total */}
            <div className="mb-4">
                <p className="text-xs text-zinc-400">Total This Month</p>
                <p className={`text-2xl font-bold ${activeTab === "expense" ? "text-red-400" : "text-green-400"}`}>
                    {formatCurrency(total)}
                </p>
            </div>

            {/* Progress bar visualization */}
            {breakdown.length > 0 && (
                <div className="h-3 rounded-full overflow-hidden flex mb-4">
                    {breakdown.map((cat, index) => (
                        <div
                            key={cat.id}
                            className={`${COLORS[index % COLORS.length]} first:rounded-l-full last:rounded-r-full`}
                            style={{ width: `${cat.percentage}%` }}
                            title={`${cat.name}: ${cat.percentage}%`}
                        />
                    ))}
                </div>
            )}

            {/* Category list */}
            {breakdown.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-zinc-400 text-sm">
                        No {activeTab === "expense" ? "expenses" : "income"} this month
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                    {breakdown.map((cat, index) => (
                        <div key={cat.id} className="flex items-center gap-3">
                            {/* Color indicator */}
                            <div className={`w-3 h-3 rounded-full ${COLORS[index % COLORS.length]}`} />

                            {/* Category info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white truncate">{cat.name}</span>
                                    <span className={`text-sm font-medium ${activeTab === "expense" ? "text-red-400" : "text-green-400"
                                        }`}>
                                        {formatCurrency(cat.amount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-xs text-zinc-500">{cat.count} transaction{cat.count !== 1 ? "s" : ""}</span>
                                    <span className="text-xs text-zinc-400">{cat.percentage}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
