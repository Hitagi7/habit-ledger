import { getBudgetStats } from "@/lib/actions/budgets";

export default async function BudgetStats() {
    const statsResult = await getBudgetStats();

    const stats = statsResult.data || {
        totalBudgets: 0,
        onTrack: 0,
        overBudget: 0,
        totalAllocated: 0,
        totalSpent: 0,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 delay-100 animate-fade-in-up">
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
    );
}
