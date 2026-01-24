import { createClient } from "@/lib/supabase/server";
import { getTransactionStats, getTransactions, getSavingsStats } from "@/lib/actions/transactions";
import { getHabitStats } from "@/lib/actions/habits";
import { getBudgetStats } from "@/lib/actions/budgets";
import DashboardAI from "@/components/features/ai/DashboardAI";
import HabitAI from "@/components/features/ai/HabitAI";
import SpendingChart from "@/components/features/analytics/SpendingChart";
import NetSavingsChart from "@/components/features/analytics/NetSavingsChart";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Data in parallel
    const [statsData, transactionsData, habitsData, budgetsData, savingsData] = await Promise.all([
        getTransactionStats(),
        getTransactions({
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
        }),
        getHabitStats(),
        getBudgetStats(),
        getSavingsStats(6) // Last 6 months
    ]);

    // Process Transaction Data
    const balance = statsData.data?.balance || 0;
    const transactionCount = statsData.data?.transactionCount || 0;
    const recentTransactions = transactionsData.data || [];
    const savingsTrend = savingsData.data || [];

    // Process Habit Data
    const activeHabits = habitsData.data?.totalHabits || 0;
    const habitsCompletedToday = habitsData.data?.completedToday || 0;

    // Process Budget Data
    const totalAllocated = budgetsData.data?.totalAllocated || 0;
    const totalSpent = budgetsData.data?.totalSpent || 0;
    const budgetProgress = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
    const overBudgetCount = budgetsData.data?.overBudget || 0;

    // Dynamic Colors
    let budgetTextColor = "text-emerald-400";
    let budgetBarColor = "bg-emerald-500";
    let budgetCardClasses = "bg-zinc-900 border-white/10 hover:border-emerald-500/20"; // Fallback

    if (budgetProgress < 80) budgetCardClasses = "bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/30";
    if (budgetProgress >= 80) {
        budgetTextColor = "text-amber-400";
        budgetBarColor = "bg-amber-500";
        budgetCardClasses = "bg-amber-900/10 border-amber-500/20 hover:border-amber-500/30";
    }
    if (budgetProgress >= 100) {
        budgetTextColor = "text-rose-500";
        budgetBarColor = "bg-rose-500";
        budgetCardClasses = "bg-rose-900/10 border-rose-500/20 hover:border-rose-500/30";
    }

    // Balance Card Styling
    const balanceCardClasses = balance >= 0
        ? "bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/30"
        : "bg-rose-900/10 border-rose-500/20 hover:border-rose-500/30";

    // Habits Card Styling (Always positive/active look)
    const habitsCardClasses = "bg-amber-900/10 border-amber-500/20 hover:border-amber-500/30";

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Welcome Section */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col justify-center bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/50">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-white/10 text-2xl font-bold text-zinc-500">
                                {user?.email?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Welcome back! 👋
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                You&apos;re signed in as <span className="text-white font-medium">{user?.user_metadata?.full_name || user?.email}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-base text-zinc-400 font-medium">
                            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 delay-100 animate-fade-in-up">
                <div className={`${balanceCardClasses} border rounded-xl p-6 transition-colors duration-300`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Total Balance</span>
                    </div>
                    <p className={`text-3xl font-bold ${balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance)}
                    </p>
                    <p className="text-sm text-zinc-500 mt-2">
                        {transactionCount} transactions this month
                    </p>
                </div>

                <div className={`${habitsCardClasses} border rounded-xl p-6 transition-colors duration-300`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Active Habits</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{activeHabits}</p>
                    <p className="text-sm text-zinc-500 mt-2">
                        <span className="text-amber-500 font-medium">{habitsCompletedToday}</span> completed today
                    </p>
                </div>

                <div className={`${budgetCardClasses} border rounded-xl p-6 transition-colors duration-300`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Budget Usage</span>
                    </div>

                    <div className="mt-1">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className={`text-3xl font-bold ${budgetTextColor}`}>{budgetProgress}%</span>
                            <span className="text-sm text-zinc-500">used</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${budgetBarColor}`}
                                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-sm mt-3">
                        {overBudgetCount > 0 ? (
                            <span className="text-rose-400 font-medium">{overBudgetCount} budgets exceeded</span>
                        ) : (
                            <span className={`${budgetTextColor} font-medium`}>All budgets on track</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 delay-200 animate-fade-in-up">
                {/* Spending Trends */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Daily Spending</h3>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">Last 30 Days</span>
                    </div>
                    <SpendingChart data={recentTransactions} />
                </div>

                {/* Net Savings Trend */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Net Savings</h3>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">Last 6 Months</span>
                    </div>
                    <NetSavingsChart data={savingsTrend} />
                </div>
            </div>

            {/* AI Financial Insights */}
            <div className="animate-fade-in-up delay-300">
                <DashboardAI />
            </div>

            {/* AI Habit Insights */}
            <div className="animate-fade-in-up delay-400">
                <HabitAI />
            </div>
        </div>
    );
}
