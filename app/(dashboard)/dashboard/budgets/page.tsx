import { getBudgets, getBudgetStats } from "@/lib/actions/budgets";
import { getCategories } from "@/lib/actions/categories";
import BudgetForm from "@/components/features/budgets/BudgetForm";
import BudgetCard from "@/components/features/budgets/BudgetCard";

export default async function BudgetsPage() {
    const [budgetsResult, statsResult, categoriesResult] = await Promise.all([
        getBudgets(),
        getBudgetStats(),
        getCategories("expense"),
    ]);

    const budgets = budgetsResult.data || [];
    const categories = categoriesResult.data || [];
    const stats = statsResult.data || {
        totalBudgets: 0,
        onTrack: 0,
        overBudget: 0,
        totalAllocated: 0,
        totalSpent: 0,
    };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Total Budgets</p>
                    <p className="text-xl font-bold text-white">{stats.totalBudgets}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">On Track</p>
                    <p className="text-xl font-bold text-green-500">{stats.onTrack}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Over Budget</p>
                    <p className="text-xl font-bold text-red-500">{stats.overBudget}</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Total Spent</p>
                    <p className="text-xl font-bold text-white">
                        ${stats.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        <span className="text-zinc-500 text-sm font-normal ml-1">
                            / ${stats.totalAllocated.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                    </p>
                </div>
            </div>

            {/* Budget List */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Your Budgets</h2>
                </div>

                {budgets.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">No budgets yet</h3>
                        <p className="text-zinc-400 text-sm">
                            Start managing your spending by creating your first budget!
                        </p>
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {budgets.map((budget) => (
                            <BudgetCard
                                key={budget.id}
                                budget={budget}
                                categories={categories}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
