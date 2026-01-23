"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBudget, updateBudget } from "@/lib/actions/budgets";

interface Category {
    id: string;
    name: string;
    type: string;
}

interface BudgetFormProps {
    categories: Category[];
    existingBudget?: {
        id: string;
        category_id: string;
        amount: number;
        period: string;
    };
    onClose?: () => void;
}

export default function BudgetForm({ categories, existingBudget, onClose }: BudgetFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categoryId, setCategoryId] = useState(existingBudget?.category_id || "");
    const [amount, setAmount] = useState(existingBudget?.amount?.toString() || "");
    const [period, setPeriod] = useState<"monthly" | "weekly">(
        (existingBudget?.period as "monthly" | "weekly") || "monthly"
    );

    const isEditing = !!existingBudget;

    // Filter to only expense categories
    const expenseCategories = categories.filter(c => c.type === "expense");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditing) {
                const result = await updateBudget(existingBudget.id, {
                    amount: parseFloat(amount),
                    period,
                });
                if (result.error) throw new Error(result.error);
            } else {
                const result = await createBudget({
                    categoryId,
                    amount: parseFloat(amount),
                    period,
                });
                if (result.error) throw new Error(result.error);
            }

            setIsOpen(false);
            onClose?.();
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
        setError(null);
    };

    // If used as inline edit, don't show button
    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Period</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as "monthly" | "weekly")}
                        className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 hover:cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:cursor-pointer transition-colors disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 hover:cursor-pointer transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Budget
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Create Budget</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                                >
                                    <option value="">Select a category</option>
                                    {expenseCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Budget Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="0.00"
                                        className="w-full pl-7 pr-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Period</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPeriod("monthly")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all hover:cursor-pointer ${period === "monthly"
                                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                                                : "bg-zinc-800 text-zinc-400 border border-white/10 hover:text-white"
                                            }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPeriod("weekly")}
                                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all hover:cursor-pointer ${period === "weekly"
                                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                                                : "bg-zinc-800 text-zinc-400 border border-white/10 hover:text-white"
                                            }`}
                                    >
                                        Weekly
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2.5 px-4 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 hover:cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !categoryId || !amount}
                                    className="flex-1 py-2.5 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Creating..." : "Create Budget"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
