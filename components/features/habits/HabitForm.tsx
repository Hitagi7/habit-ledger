"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHabit } from "@/lib/actions/habits";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

interface Category {
    id: string;
    name: string;
    type: string;
}

interface HabitFormProps {
    categories: Category[];
}

export default function HabitForm({ categories }: HabitFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
    const [categoryId, setCategoryId] = useState("");

    // New category form
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    // Local categories for optimistic updates
    const [localCategories, setLocalCategories] = useState<Category[]>(categories);

    // Delete category state
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await createHabit({
            name,
            description: description || undefined,
            frequency,
            categoryId: categoryId || undefined,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Reset form
            setName("");
            setDescription("");
            setFrequency("daily");
            setCategoryId("");
            setIsOpen(false);
            setLoading(false);
            router.refresh();
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setCreatingCategory(true);
        setCategoryError(null);

        const result = await createCategory({
            name: newCategoryName,
            type: "habit",
        });

        if (result.error) {
            setCategoryError(result.error);
        } else if (result.success && result.data) {
            // Add to local categories for instant update
            const newCat = {
                id: result.data.id,
                name: result.data.name,
                type: "habit",
            };
            setLocalCategories([...localCategories, newCat]);
            setCategoryId(result.data.id);
            setNewCategoryName("");
            setShowNewCategory(false);
            router.refresh();
        }
        setCreatingCategory(false);
    };

    const handleDeleteCategory = async (id: string) => {
        setDeletingCategoryId(id);
        const result = await deleteCategory(id);

        if (result.success) {
            // Remove from local categories
            setLocalCategories(localCategories.filter(c => c.id !== id));
            if (categoryId === id) {
                setCategoryId("");
            }
            router.refresh();
        }
        setDeletingCategoryId(null);
    };

    // Sync local categories when prop changes
    if (categories.length !== localCategories.length && !isOpen) {
        setLocalCategories(categories);
    }

    return (
        <>
            {/* Add Button */}
            <button
                onClick={() => {
                    setLocalCategories(categories);
                    setIsOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Habit
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
                            <h2 className="text-xl font-bold text-white">Add Habit</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white hover:cursor-pointer transition-colors"
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

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="e.g., Drink 8 glasses of water"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Description (optional)
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Why is this habit important?"
                                />
                            </div>

                            {/* Frequency Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Frequency
                                </label>
                                <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setFrequency("daily")}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium hover:cursor-pointer transition-all ${frequency === "daily"
                                            ? "bg-orange-500 text-white"
                                            : "text-zinc-400 hover:text-white"
                                            }`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFrequency("weekly")}
                                        className={`flex-1 py-2 px-4 rounded-md font-medium hover:cursor-pointer transition-all ${frequency === "weekly"
                                            ? "bg-orange-500 text-white"
                                            : "text-zinc-400 hover:text-white"
                                            }`}
                                    >
                                        Weekly
                                    </button>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Category (optional)
                                </label>

                                {categoryError && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-red-400 text-sm mb-2">
                                        {categoryError}
                                    </div>
                                )}

                                {localCategories.length === 0 && !showNewCategory ? (
                                    <div className="bg-zinc-800/50 border border-dashed border-white/20 rounded-lg p-4 text-center">
                                        <p className="text-zinc-400 text-sm mb-3">
                                            No habit categories yet. Create one to organize your habits!
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:cursor-pointer hover:bg-orange-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Category
                                        </button>
                                    </div>
                                ) : !showNewCategory ? (
                                    <div className="space-y-2">
                                        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
                                            {localCategories.map((cat) => (
                                                <div
                                                    key={cat.id}
                                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${categoryId === cat.id
                                                        ? "bg-orange-500/20 border border-orange-500/50"
                                                        : "bg-zinc-800 border border-transparent hover:border-white/10"
                                                        }`}
                                                    onClick={() => setCategoryId(categoryId === cat.id ? "" : cat.id)}
                                                >
                                                    <span className="text-white">{cat.name}</span>
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

                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-white/20 rounded-lg text-zinc-400 hover:cursor-pointer hover:text-white hover:border-white/40 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New Category
                                        </button>
                                    </div>
                                ) : (
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
                                            className="px-3 py-3 bg-orange-500 rounded-lg text-white hover:cursor-pointer hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {creatingCategory ? (
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNewCategory(false);
                                                setNewCategoryName("");
                                                setCategoryError(null);
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:cursor-pointer hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? "Adding..." : "Add Habit"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
