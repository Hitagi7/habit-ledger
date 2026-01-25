import { getCategories } from "@/lib/actions/categories";
import TransactionForm from "@/components/features/transactions/TransactionForm";
import TransactionFilters from "@/components/features/transactions/TransactionFilters";
import TransactionStats from "./components/TransactionStats";
import TransactionList from "./components/TransactionList";
import TransactionBreakdown from "./components/TransactionBreakdown";
import { Suspense } from "react";

interface PageProps {
    searchParams: Promise<{
        type?: string;
        category?: string;
        start?: string;
        end?: string;
    }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const categoriesResult = await getCategories();
    const categories = categoriesResult.data || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Transactions</h1>
                    <p className="text-zinc-400 mt-1">Track your income and expenses</p>
                </div>
                <TransactionForm categories={categories} />
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/10 rounded-xl h-24" />
                ))}
            </div>}>
                <TransactionStats />
            </Suspense>

            {/* Filters */}
            <div className="delay-200 animate-fade-in-up">
                <TransactionFilters categories={categories} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction List - takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <Suspense fallback={<div className="bg-zinc-900 border border-white/10 rounded-xl h-96 animate-pulse" />}>
                        <TransactionList searchParams={params} />
                    </Suspense>
                </div>

                {/* Category Breakdown - Sidebar */}
                <div className="lg:col-span-1">
                    <Suspense fallback={<div className="bg-zinc-900 border border-white/10 rounded-xl h-64 animate-pulse" />}>
                        <TransactionBreakdown />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
