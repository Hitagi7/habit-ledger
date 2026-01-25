import { getTransactions, getSavingsStats } from "@/lib/actions/transactions";
import SpendingChart from "@/components/features/analytics/SpendingChart";
import NetSavingsChart from "@/components/features/analytics/NetSavingsChart";

export default async function DashboardCharts() {
    // Fetch Data in parallel
    const [transactionsData, savingsData] = await Promise.all([
        getTransactions({
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
        }),
        getSavingsStats(6) // Last 6 months
    ]);

    const recentTransactions = transactionsData.data || [];
    const savingsTrend = savingsData.data || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
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
    );
}
