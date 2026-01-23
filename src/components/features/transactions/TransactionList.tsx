"use client";

import { useState } from "react";
import { deleteTransaction } from "@/lib/actions/transactions";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface Category {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    type: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    date: string;
    tags: string[] | null;
    categories: Category | null;
}

interface TransactionListProps {
    transactions: Transaction[];
    categories: Category[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const { formatCurrency } = useCurrency();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transaction?")) return;

        setDeletingId(id);
        await deleteTransaction(id);
        setDeletingId(null);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
                <p className="text-zinc-400">Add your first transaction to start tracking your finances.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Recent Transactions</h3>
            </div>

            <div className="divide-y divide-white/5">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            {/* Category Icon */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                style={{
                                    backgroundColor: transaction.categories?.color
                                        ? `${transaction.categories.color}20`
                                        : "rgb(39 39 42)",
                                }}
                            >
                                {transaction.categories?.icon || (transaction.type === "income" ? "💰" : "💸")}
                            </div>

                            {/* Details */}
                            <div>
                                <p className="font-medium text-white">
                                    {transaction.description || transaction.categories?.name || "Transaction"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <span>{formatDate(transaction.date)}</span>
                                    {transaction.categories && (
                                        <>
                                            <span>•</span>
                                            <span>{transaction.categories.name}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex items-center gap-4">
                            <span
                                className={`font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(Number(transaction.amount))}
                            </span>

                            <button
                                onClick={() => handleDelete(transaction.id)}
                                disabled={deletingId === transaction.id}
                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
