"use client";

import { useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface NetSavingsChartProps {
    data: {
        month: string;
        income: number;
        expenses: number;
        savings: number;
    }[];
}

export default function NetSavingsChart({ data }: NetSavingsChartProps) {
    const { formatCurrency, symbol } = useCurrency();

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-zinc-500">
                No data available for savings trend
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="month"
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
                        formatter={(value: any) => formatCurrency(Number(value || 0))}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />

                    {/* Income Bar (Stacked Group) */}
                    <Bar dataKey="income" name="Income" fill="#10b981" barSize={20} radius={[4, 4, 0, 0]} fillOpacity={0.8} />

                    {/* Expense Bar */}
                    <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" barSize={20} radius={[4, 4, 0, 0]} fillOpacity={0.8} />

                    {/* Savings Line */}
                    <Line
                        type="monotone"
                        dataKey="savings"
                        name="Net Savings"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#18181b", stroke: "#f59e0b", strokeWidth: 2 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
