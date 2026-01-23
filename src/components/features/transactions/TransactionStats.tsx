"use client";

import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface TransactionStatsProps {
    income: number;
    expenses: number;
    balance: number;
    transactionCount: number;
}

export default function TransactionStats({ income, expenses, balance, transactionCount }: TransactionStatsProps) {
    const { formatCurrency } = useCurrency();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Income (This Month)</p>
                <p className="text-xl font-bold text-green-500">
                    {formatCurrency(income)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Expenses (This Month)</p>
                <p className="text-xl font-bold text-red-500">
                    {formatCurrency(expenses)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Balance</p>
                <p className={`text-xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(balance)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Transactions</p>
                <p className="text-xl font-bold text-white">{transactionCount}</p>
            </div>
        </div>
    );
}
