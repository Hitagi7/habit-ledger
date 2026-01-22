"use client";

interface ConsistencyData {
    date: string;
    completed: number;
    total: number;
    percentage: number;
    dayOfWeek: number;
    week: number;
}

interface HabitConsistencyGraphProps {
    data: ConsistencyData[];
}

// GitHub-style color scale based on percentage
const getColorClass = (percentage: number, total: number) => {
    if (total === 0) return "bg-zinc-800"; // No habits existed yet - still visible
    if (percentage === 0) return "bg-zinc-700"; // Had habits but none completed
    if (percentage <= 25) return "bg-green-900";
    if (percentage <= 50) return "bg-green-700";
    if (percentage <= 75) return "bg-green-500";
    return "bg-green-400";
};

export default function HabitConsistencyGraph({ data }: HabitConsistencyGraphProps) {
    // Create a map for quick lookup of data by date
    const dataMap = new Map(data.map(d => [d.date, d]));

    // Generate all 90 days worth of squares, organized by weeks
    const weeks: (ConsistencyData | null)[][] = [];
    const today = new Date();

    // Start from 90 days ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89);

    // Pad the first week if it doesn't start on Sunday
    let currentWeek: (ConsistencyData | null)[] = [];
    const startDayOfWeek = startDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null);
    }

    // Generate all 90 days
    for (let i = 0; i < 90; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        const dayOfWeek = date.getDay();

        // Start new week on Sunday (if not the first iteration)
        if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        // Get data for this date or create empty entry
        const dayData = dataMap.get(dateStr) || {
            date: dateStr,
            completed: 0,
            total: 0,
            percentage: 0,
            dayOfWeek,
            week: 0,
        };

        currentWeek.push(dayData);
    }

    // Push the last week
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Calculate stats
    const totalDaysWithHabits = data.filter(d => d.total > 0);
    const perfectDays = totalDaysWithHabits.filter(d => d.percentage === 100).length;
    const averageCompletion = totalDaysWithHabits.length > 0
        ? Math.round(totalDaysWithHabits.reduce((sum, d) => sum + d.percentage, 0) / totalDaysWithHabits.length)
        : 0;

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get month labels for the graph
    const getMonthLabels = () => {
        const labels: { month: string; weekIndex: number }[] = [];
        let lastMonth = "";

        weeks.forEach((week, weekIndex) => {
            const firstValidDay = week.find(d => d !== null);
            if (firstValidDay) {
                const date = new Date(firstValidDay.date);
                const month = date.toLocaleDateString("en-US", { month: "short" });
                if (month !== lastMonth) {
                    labels.push({ month, weekIndex });
                    lastMonth = month;
                }
            }
        });

        return labels;
    };

    const monthLabels = getMonthLabels();

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Habit Consistency</h3>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span>{perfectDays} perfect days</span>
                    <span>{averageCompletion}% avg</span>
                </div>
            </div>

            {/* Graph container */}
            <div className="overflow-x-auto">
                {/* Month labels */}
                <div className="flex mb-1 ml-8">
                    {monthLabels.map((label, i) => (
                        <div
                            key={`${label.month}-${i}`}
                            className="text-[10px] text-zinc-500"
                            style={{
                                marginLeft: i === 0 ? `${label.weekIndex * 14}px` :
                                    `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0) - 1) * 14}px`,
                            }}
                        >
                            {label.month}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    {/* Day labels (rows) */}
                    <div className="flex flex-col gap-[3px] pr-2 shrink-0">
                        {dayLabels.map((day, i) => (
                            <div
                                key={day}
                                className="h-[11px] text-[10px] text-zinc-500 flex items-center justify-end w-6"
                            >
                                {i % 2 === 1 ? day : ""}
                            </div>
                        ))}
                    </div>

                    {/* Weeks grid (columns) */}
                    <div className="flex gap-[3px]">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                    const day = week[dayIndex];

                                    if (!day) {
                                        // Empty cell (before habit tracking started)
                                        return (
                                            <div
                                                key={`empty-${dayIndex}`}
                                                className="w-[11px] h-[11px] rounded-sm bg-transparent"
                                            />
                                        );
                                    }

                                    return (
                                        <div
                                            key={day.date}
                                            className={`w-[11px] h-[11px] rounded-sm ${getColorClass(day.percentage, day.total)} 
                                                cursor-pointer transition-all hover:ring-2 hover:ring-white/40 hover:ring-offset-1 hover:ring-offset-zinc-900`}
                                            title={`${new Date(day.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}\n${day.completed}/${day.total} habits (${day.percentage}%)`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <span className="text-xs text-zinc-500">Last 90 days</span>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span>Less</span>
                    <div className="w-[11px] h-[11px] rounded-sm bg-zinc-800" title="0%" />
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-900/80" title="1-25%" />
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-700" title="26-50%" />
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-500" title="51-75%" />
                    <div className="w-[11px] h-[11px] rounded-sm bg-green-400" title="76-100%" />
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
