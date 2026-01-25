import { getCategories } from "@/lib/actions/categories";
import HabitForm from "@/components/features/habits/HabitForm";
import HabitStats from "./components/HabitStats";
import HabitList from "./components/HabitList";
import HabitConsistency from "./components/HabitConsistency";
import { Suspense } from "react";

export default async function HabitsPage() {
    const categoriesResult = await getCategories("habit");
    const categories = categoriesResult.data || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Habits</h1>
                    <p className="text-zinc-400 mt-1">Build consistent habits and track your progress</p>
                </div>
                <HabitForm categories={categories} />
            </div>

            {/* Stats Cards */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-zinc-900 border border-white/10 rounded-xl h-24" />
                    ))}
                </div>
            }>
                <HabitStats />
            </Suspense>

            {/* Habit Consistency Graph */}
            <Suspense fallback={<div className="h-64 bg-zinc-900 border border-white/10 rounded-xl animate-pulse" />}>
                <HabitConsistency />
            </Suspense>

            {/* Habit List */}
            <Suspense fallback={<div className="bg-zinc-900/50 border border-white/10 rounded-xl h-96 animate-pulse" />}>
                <HabitList />
            </Suspense>
        </div>
    );
}

