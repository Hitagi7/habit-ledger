"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface SpendingChartProps {
    data: any[]; // Expecting transaction list
}

export default function SpendingChart({ data }: SpendingChartProps) {
    const { formatCurrency, symbol } = useCurrency();

    // Process data: Group by date (last 7-30 days)
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // 1. Sort by date ascending
        const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 2. Group by date
        const grouped: Record<string, number> = {};
        sorted.forEach(t => {
            if (t.type === "expense") {
                grouped[t.date] = (grouped[t.date] || 0) + Number(t.amount);
            }
        });

        // 3. Convert to array
        return Object.entries(grouped).map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            amount
        }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-zinc-500">
                No spending data available for chart
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${symbol}${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                        itemStyle={{ color: "#f97316" }}
                        formatter={(value: any) => [formatCurrency(Number(value || 0)), "Spent"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#f97316"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
