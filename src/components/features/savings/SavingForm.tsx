"use client";

import { useState, useTransition } from "react";
import { createSaving } from "@/lib/actions/savings";

export default function SavingForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name") as string,
            targetAmount: Number(formData.get("targetAmount")),
            targetDate: formData.get("targetDate") as string,
            description: formData.get("description") as string,
        };

        startTransition(async () => {
            const result = await createSaving(data);
            if (!result.error) {
                setIsOpen(false);
                (e.target as HTMLFormElement).reset();
            } else {
                alert("Failed to create saving goal: " + result.error);
            }
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Goal
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">New Savings Goal</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-zinc-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Goal Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full bg-zinc-800 border border-white/5 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="e.g., New Laptop"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Target Amount
                        </label>
                        <input
                            type="number"
                            name="targetAmount"
                            required
                            min="1"
                            className="w-full bg-zinc-800 border border-white/5 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Target Date (Optional)
                        </label>
                        <input
                            type="date"
                            name="targetDate"
                            className="w-full bg-zinc-800 border border-white/5 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            className="w-full bg-zinc-800 border border-white/5 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none h-24"
                            placeholder="What are you saving for?"
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isPending ? "Creating..." : "Create Goal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
