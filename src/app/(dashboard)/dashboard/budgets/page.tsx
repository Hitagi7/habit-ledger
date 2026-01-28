import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import BudgetForm from "@/components/features/budgets/BudgetForm";
import BudgetStats from "./components/BudgetStats";
import BudgetList from "./components/BudgetList";
import { Suspense } from "react";

export default async function BudgetsPage() {
    // Categories are needed for the Add form immediately
    const categoriesResult = await getCategories("expense");
    const categories = categoriesResult.data || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Budgets</h1>
                    <p className="text-zinc-400 mt-1">Set spending limits and track your progress</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/budgets/savings"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Savings Goals
                    </Link>
                    <BudgetForm categories={categories} />
                </div>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-zinc-900 border border-white/10 rounded-xl h-24" />
                    ))}
                </div>
            }>
                <BudgetStats />
            </Suspense>

            {/* Budget List */}
            <Suspense fallback={<div className="bg-zinc-900/50 border border-white/10 rounded-xl h-96 animate-pulse" />}>
                <BudgetList />
            </Suspense>
        </div>
    );
}
