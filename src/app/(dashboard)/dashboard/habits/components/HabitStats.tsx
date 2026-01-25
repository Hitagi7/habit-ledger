import { getHabitStats } from "@/lib/actions/habits";

export default async function HabitStats() {
    const statsResult = await getHabitStats();

    const stats = statsResult.data || {
        totalHabits: 0,
        completedToday: 0,
        longestStreak: 0,
        averageCompletion: 0
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 delay-100 animate-fade-in-up">
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
    );
}
