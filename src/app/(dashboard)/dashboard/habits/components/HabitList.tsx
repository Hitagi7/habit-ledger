import { getHabits } from "@/lib/actions/habits";
import HabitCard from "@/components/features/habits/HabitCard";

export default async function HabitList() {
    const habitsResult = await getHabits();
    const habits = habitsResult.data || [];

    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl delay-300 animate-fade-in-up">
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
    );
}
