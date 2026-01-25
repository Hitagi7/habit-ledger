import { getTransactionStats } from "@/lib/actions/transactions";

export default async function TransactionStats() {
    const statsResult = await getTransactionStats();
    const stats = statsResult.data || { income: 0, expenses: 0, balance: 0, transactionCount: 0 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Total Balance</p>
                <p className={`text-xl font-bold ${stats.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.balance)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Total Income</p>
                <p className="text-xl font-bold text-emerald-400">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.income)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Total Expenses</p>
                <p className="text-xl font-bold text-rose-400">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.expenses)}
                </p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                <p className="text-sm text-zinc-400 mb-1">Total Transactions</p>
                <p className="text-xl font-bold text-white">{stats.transactionCount}</p>
            </div>
        </div>
    );
}
