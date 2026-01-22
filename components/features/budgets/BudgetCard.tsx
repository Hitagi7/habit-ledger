"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBudget } from "@/lib/actions/budgets";
import BudgetForm from "./BudgetForm";

interface Budget {
    id: string;
    amount: number;
    period: string;
    category_id: string;
    spent: number;
    percentage: number;
    remaining: number;
    isOverBudget: boolean;
    categories: {
        id: string;
        name: string;
        icon: string | null;
        color: string | null;
    } | null;
}

interface Category {
    id: string;
    name: string;
    type: string;
}

interface BudgetCardProps {
    budget: Budget;
    categories: Category[];
}

export default function BudgetCard({ budget, categories }: BudgetCardProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        await deleteBudget(budget.id);
        setDeleting(false);
        setShowDeleteModal(false);
        router.refresh();
    };

    // Determine status color
    const getStatusColor = () => {
        if (budget.isOverBudget) return "red";
        if (budget.percentage >= 80) return "yellow";
        return "green";
    };

    const statusColor = getStatusColor();
    const colorClasses = {
        red: {
            bg: "bg-red-500",
            text: "text-red-400",
            badge: "bg-red-500/20 text-red-400",
        },
        yellow: {
            bg: "bg-yellow-500",
            text: "text-yellow-400",
            badge: "bg-yellow-500/20 text-yellow-400",
        },
        green: {
            bg: "bg-green-500",
            text: "text-green-400",
            badge: "bg-green-500/20 text-green-400",
        },
    };

    const colors = colorClasses[statusColor];

    if (isEditing) {
        return (
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-4">{budget.categories?.name || "Budget"}</h3>
                <BudgetForm
                    categories={categories}
                    existingBudget={{
                        id: budget.id,
                        category_id: budget.category_id,
                        amount: budget.amount,
                        period: budget.period,
                    }}
                    onClose={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <>
            <div className={`bg-zinc-900 border rounded-xl p-4 transition-all ${budget.isOverBudget ? "border-red-500/50" : "border-white/10"
                }`}>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{budget.categories?.name || "Uncategorized"}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                            {budget.period}
                        </span>
                        {budget.isOverBudget && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                Over Budget!
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-zinc-500 hover:text-white hover:cursor-pointer transition-colors"
                            title="Edit budget"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:cursor-pointer transition-colors"
                            title="Delete budget"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Amounts */}
                <div className="flex items-baseline justify-between mb-2">
                    <div>
                        <span className={`text-2xl font-bold ${colors.text}`}>
                            ${budget.spent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-zinc-500 ml-1">
                            / ${budget.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${colors.text}`}>
                        {budget.percentage}%
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bg} transition-all duration-300`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                </div>

                {/* Remaining */}
                <p className="text-xs text-zinc-500 mt-2">
                    {budget.isOverBudget
                        ? `$${Math.abs(budget.remaining).toLocaleString("en-US", { minimumFractionDigits: 2 })} over budget`
                        : `$${budget.remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining`
                    }
                </p>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Delete Budget?</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Are you sure you want to delete the budget for <span className="text-white font-medium">&quot;{budget.categories?.name}&quot;</span>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 px-4 bg-zinc-800 text-white font-medium rounded-lg hover:cursor-pointer hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 px-4 bg-red-500 text-white font-medium rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
