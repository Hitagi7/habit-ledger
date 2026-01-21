import { getTransactions, getTransactionStats } from "@/lib/actions/transactions";
import { getCategories, seedDefaultCategories } from "@/lib/actions/categories";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/transactions/TransactionForm";

export default async function TransactionsPage() {
    // Seed default categories for new users
    await seedDefaultCategories();

    const [transactionsResult, categoriesResult, statsResult] = await Promise.all([
        getTransactions(),
        getCategories(),
        getTransactionStats(),
    ]);

    const transactions = transactionsResult.data || [];
    const categories = categoriesResult.data || [];
    const stats = statsResult.data || { income: 0, expenses: 0, balance: 0, transactionCount: 0 };

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Income (This Month)</p>
                    <p className="text-xl font-bold text-green-500">
                        ${stats.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Expenses (This Month)</p>
                    <p className="text-xl font-bold text-red-500">
                        ${stats.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Balance</p>
                    <p className={`text-xl font-bold ${stats.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${stats.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
                    <p className="text-sm text-zinc-400 mb-1">Transactions</p>
                    <p className="text-xl font-bold text-white">{stats.transactionCount}</p>
                </div>
            </div>

            {/* Transaction List */}
            <TransactionList transactions={transactions} categories={categories} />
        </div>
    );
}
