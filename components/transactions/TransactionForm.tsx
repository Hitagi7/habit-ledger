"use client";

import { useState } from "react";
import { createTransaction } from "@/lib/actions/transactions";
import { createCategory } from "@/lib/actions/categories";

interface Category {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: string;
}

interface TransactionFormProps {
    categories: Category[];
}

export default function TransactionForm({ categories }: TransactionFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [type, setType] = useState<"income" | "expense">("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    // New category form
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const filteredCategories = categories.filter((c) => c.type === type);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await createTransaction({
            amount: parseFloat(amount),
            type,
            description: description || undefined,
            categoryId: categoryId || undefined,
            date,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Reset form
            setAmount("");
            setDescription("");
            setCategoryId("");
            setDate(new Date().toISOString().split("T")[0]);
            setIsOpen(false);
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        const result = await createCategory({
            name: newCategoryName,
            type,
        });

        if (result.success && result.data) {
            setCategoryId(result.data.id);
            setNewCategoryName("");
            setShowNewCategory(false);
        }
    };

    return (
        <>
            {/* Add Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Transaction
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Add Transaction</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Type Toggle */}
                            <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => { setType("expense"); setCategoryId(""); }}
                                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${type === "expense"
                                            ? "bg-red-500 text-white"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType("income"); setCategoryId(""); }}
                                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${type === "income"
                                            ? "bg-green-500 text-white"
                                            : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    Income
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="What was this for?"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Category
                                </label>
                                {!showNewCategory ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">Select category</option>
                                            {filteredCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon} {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="px-3 py-3 bg-zinc-800 border border-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="New category name"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            className="px-3 py-3 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(false)}
                                            className="px-3 py-3 bg-zinc-800 border border-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? "Adding..." : "Add Transaction"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
