"use client";

import { logHabit, unlogHabit, deleteHabit } from "@/lib/actions/habits";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Habit {
    id: string;
    name: string;
    description: string | null;
    frequency: string;
    completedToday: boolean;
}

interface HabitCardProps {
    habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
    const router = useRouter();

    // Local state for optimistic UI updates
    const [isCompleted, setIsCompleted] = useState(habit.completedToday);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggle = async () => {
        setLoading(true);

        // Optimistic update
        const newState = !isCompleted;
        setIsCompleted(newState);

        try {
            if (habit.completedToday) {
                await unlogHabit(habit.id);
            } else {
                await logHabit(habit.id);
            }
            router.refresh();
        } catch {
            // Revert on error
            setIsCompleted(!newState);
        }

        setLoading(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        await deleteHabit(habit.id);
        setDeleting(false);
        setShowDeleteModal(false);
        router.refresh();
    };

    return (
        <>
            <div className={`bg-zinc-900 border rounded-xl p-4 transition-all ${isCompleted
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-white/10"
                }`}>
                <div className="flex items-start justify-between gap-4">
                    {/* Habit Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`font-semibold ${isCompleted ? "text-green-400" : "text-white"}`}>
                                {habit.name}
                            </h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                                {habit.frequency}
                            </span>
                            {isCompleted && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                    ✓ Done
                                </span>
                            )}
                        </div>
                        {habit.description && (
                            <p className="text-sm text-zinc-400 mt-1">{habit.description}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Toggle Button */}
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:cursor-pointer ${isCompleted
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                } disabled:opacity-50`}
                        >
                            {loading ? (
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

                        {/* Delete Button */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:cursor-pointer transition-colors"
                            title="Delete habit"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">Delete Habit?</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">&quot;{habit.name}&quot;</span>? This action cannot be undone.
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
                                    className="flex-1 py-2.5 px-4 bg-red-500 text-white font-medium rounded-lg hover:cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
