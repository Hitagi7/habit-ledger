import { getHabits, getHabitStats, getHabitConsistency } from "@/lib/actions/habits";
import { getCategories } from "@/lib/actions/categories";
import HabitCard from "@/components/features/habits/HabitCard";
import HabitForm from "@/components/features/habits/HabitForm";
import HabitConsistencyGraph from "@/components/features/habits/HabitConsistencyGraph";

export default async function HabitsPage() {
    const [habitsResult, statsResult, categoriesResult, consistencyResult] = await Promise.all([
        getHabits(),
        getHabitStats(),
        getCategories("habit"),
        getHabitConsistency(90),
    ]);

    const habits = habitsResult.data || [];
    const categories = categoriesResult.data || [];
    const stats = statsResult.data || {
        totalHabits: 0,
        completedToday: 0,
        longestStreak: 0,
        averageCompletion: 0
    };
    const consistencyData = consistencyResult.data || [];

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Total Habits</p>
                    <p className="text-xl font-bold text-white">{stats.totalHabits}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Completed Today</p>
                    <p className="text-xl font-bold text-green-500">
                        {stats.completedToday} / {stats.totalHabits}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Longest Streak</p>
                    <p className="text-xl font-bold text-orange-500">
                        {stats.longestStreak} {stats.longestStreak === 1 ? "day" : "days"}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Completion Rate</p>
                    <p className="text-xl font-bold text-white">{stats.averageCompletion}%</p>
                </div>
            </div>

            {/* Habit Consistency Graph */}
            {habits.length > 0 && (
                <HabitConsistencyGraph data={consistencyData} />
            )}

            {/* Habit List */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Your Habits</h2>
                </div>

                {habits.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No habits yet</h3>
                        <p className="text-zinc-400 text-sm">
                            Start building better habits by adding your first one!
                        </p>
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        {habits.map((habit) => (
                            <HabitCard key={habit.id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

