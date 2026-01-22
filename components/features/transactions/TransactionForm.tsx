"use client";

import { useState } from "react";
import { createTransaction } from "@/lib/actions/transactions";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

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
    const [creatingCategory, setCreatingCategory] = useState(false);

    // Delete category state
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

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
        setCreatingCategory(true);

        const result = await createCategory({
            name: newCategoryName,
            type,
        });

        if (result.success && result.data) {
            setCategoryId(result.data.id);
            setNewCategoryName("");
            setShowNewCategory(false);
        }
        setCreatingCategory(false);
    };

    const handleDeleteCategory = async (id: string) => {
        setDeletingCategoryId(id);
        const result = await deleteCategory(id);

        if (result.success) {
            // Clear selection if deleted category was selected
            if (categoryId === id) {
                setCategoryId("");
            }
        }
        setDeletingCategoryId(null);
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
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg min-h-[520px] mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
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
                                    className={`flex-1 py-2 px-4 rounded-md font-medium hover:cursor-pointer transition-all ${type === "expense"
                                        ? "bg-red-500 text-white"
                                        : "text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setType("income"); setCategoryId(""); }}
                                    className={`flex-1 py-2 px-4 rounded-md font-medium hover:cursor-pointer transition-all ${type === "income"
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
                                        onKeyDown={(e) => {
                                            // Prevent e, E, +, - characters (scientific notation)
                                            if (["e", "E", "+", "-"].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
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

                                {/* Category List or Empty State */}
                                {filteredCategories.length === 0 && !showNewCategory ? (
                                    <div className="bg-zinc-800/50 border border-dashed border-white/20 rounded-lg p-4 text-center">
                                        <p className="text-zinc-400 text-sm mb-3">
                                            No {type} categories yet. Create one to get started!
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Category
                                        </button>
                                    </div>
                                ) : !showNewCategory ? (
                                    <div className="space-y-2">
                                        {/* Category Select with Delete */}
                                        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
                                            {filteredCategories.map((cat) => (
                                                <div
                                                    key={cat.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${categoryId === cat.id
                                                        ? "bg-orange-500/20 border border-orange-500/50"
                                                        : "bg-zinc-800 border border-transparent hover:border-white/10"
                                                        }`}
                                                    onClick={() => setCategoryId(cat.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white">{cat.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteCategory(cat.id);
                                                        }}
                                                        disabled={deletingCategoryId === cat.id}
                                                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                                                        title="Delete category"
                                                    >
                                                        {deletingCategoryId === cat.id ? (
                                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add New Category Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 rounded-lg text-zinc-400 hover:text-white hover:border-white/40 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Category
                                        </button>
                                    </div>
                                ) : (
                                    /* New Category Form */
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Category name"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            disabled={creatingCategory || !newCategoryName.trim()}
                                            className="px-3 py-3 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors enabled:hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {creatingCategory ? (
                                                <svg className="w-5 h-5 animate-spin " fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNewCategory(false);
                                                setNewCategoryName("");
                                            }}
                                            className="px-3 py-3 bg-zinc-800 border border-white/10 rounded-lg text-zinc-400 hover:cursor-pointer hover:text-white transition-colors"
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
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:cursor-pointer hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
