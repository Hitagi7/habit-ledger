import { getCategories } from "@/lib/actions/categories";
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
                <BudgetForm categories={categories} />
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
