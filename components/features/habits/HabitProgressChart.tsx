"use client";

interface ProgressData {
    date: string;
    completed: boolean;
    dayOfWeek: number;
}

interface HabitProgressChartProps {
    data: ProgressData[];
    habitName: string;
}

export default function HabitProgressChart({ data, habitName }: HabitProgressChartProps) {
    // Calculate stats
    const completedCount = data.filter(d => d.completed).length;
    const completionRate = data.length > 0 ? Math.round((completedCount / data.length) * 100) : 0;

    // Get month labels
    const months: string[] = [];
    let currentMonth = "";
    data.forEach((d, i) => {
        const month = new Date(d.date).toLocaleDateString("en-US", { month: "short" });
        if (month !== currentMonth) {
            currentMonth = month;
            months.push(month);
        }
    });

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">{habitName} - Last 30 Days</h3>
                <span className="text-xs text-zinc-400">
                    {completedCount}/{data.length} days ({completionRate}%)
                </span>
            </div>

            {/* Progress bars */}
            <div className="flex gap-0.5">
                {data.map((day, index) => (
                    <div
                        key={day.date}
                        className="flex-1 group relative"
                    >
                        <div
                            className={`h-8 rounded-sm transition-all ${day.completed
                                ? "bg-green-500 hover:bg-green-400"
                                : "bg-zinc-800 hover:bg-zinc-700"
                                }`}
                            title={`${day.date}: ${day.completed ? "Completed" : "Missed"}`}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric"
                            })}
                            <br />
                            {day.completed ? "✓ Completed" : "✗ Missed"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                    <span>Missed</span>
                </div>
            </div>
        </div>
    );
}
