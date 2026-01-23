"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

interface Category {
    id: string;
    name: string;
    type: string;
}

interface TransactionFiltersProps {
    categories: Category[];
}

export default function TransactionFilters({ categories }: TransactionFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isExpanded, setIsExpanded] = useState(false);

    // Get current values from URL
    const currentType = searchParams.get("type") || "all";
    const currentCategory = searchParams.get("category") || "all";
    const currentStart = searchParams.get("start") || "";
    const currentEnd = searchParams.get("end") || "";

    // Filter categories based on selected type
    const filteredCategories = currentType === "all"
        ? categories.filter(c => c.type === "income" || c.type === "expense")
        : categories.filter(c => c.type === currentType);

    // Check if any filters are active
    const hasActiveFilters = currentType !== "all" || currentCategory !== "all" || currentStart || currentEnd;

    // Update URL when filters change - auto applies
    const updateFilters = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== "all" && value !== "") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // If type changed and category doesn't match new type, remove category
        if (updates.type && updates.type !== "all" && currentCategory !== "all") {
            const selectedCat = categories.find(c => c.id === currentCategory);
            if (selectedCat && selectedCat.type !== updates.type) {
                params.delete("category");
            }
        }

        const queryString = params.toString();
        router.push(`/dashboard/transactions${queryString ? `?${queryString}` : ""}`);
    }, [router, searchParams, currentCategory, categories]);

    // Clear all filters
    const clearFilters = () => {
        router.push("/dashboard/transactions");
    };

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
            {/* Header - Toggleable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:cursor-pointer hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Filters</span>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                            Active
                        </span>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Filter Content */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5">Type</label>
                            <select
                                value={currentType}
                                onChange={(e) => updateFilters({ type: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5">Category</label>
                            <select
                                value={currentCategory}
                                onChange={(e) => updateFilters({ category: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {filteredCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5">From</label>
                            <input
                                type="date"
                                value={currentStart}
                                onChange={(e) => updateFilters({ start: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-xs text-zinc-400 mb-1.5">To</label>
                            <input
                                type="date"
                                value={currentEnd}
                                onChange={(e) => updateFilters({ end: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <span className="text-xs text-zinc-500">Active:</span>
                            {currentType !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                    {currentType === "income" ? "Income" : "Expense"}
                                    <button
                                        onClick={() => updateFilters({ type: "all" })}
                                        className="hover:text-white hover:cursor-pointer ml-0.5"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {currentCategory !== "all" && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                    {categories.find(c => c.id === currentCategory)?.name || "Category"}
                                    <button
                                        onClick={() => updateFilters({ category: "all" })}
                                        className="hover:text-white hover:cursor-pointer ml-0.5"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {currentStart && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                    From: {currentStart}
                                    <button
                                        onClick={() => updateFilters({ start: "" })}
                                        className="hover:text-white hover:cursor-pointer ml-0.5"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {currentEnd && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                    To: {currentEnd}
                                    <button
                                        onClick={() => updateFilters({ end: "" })}
                                        className="hover:text-white hover:cursor-pointer ml-0.5"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-xs text-zinc-400 hover:text-orange-400 hover:cursor-pointer transition-colors ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
