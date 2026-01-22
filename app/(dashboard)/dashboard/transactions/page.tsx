import { getTransactions, getTransactionStats, getCategoryBreakdown } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import TransactionList from "@/components/features/transactions/TransactionList";
import TransactionForm from "@/components/features/transactions/TransactionForm";
import TransactionFilters from "@/components/features/transactions/TransactionFilters";
import CategoryBreakdown from "@/components/features/transactions/CategoryBreakdown";
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
    // Await the searchParams promise
    const params = await searchParams;

    // Build filters from search params
    const filters = {
        type: params.type as "income" | "expense" | undefined,
        categoryId: params.category,
        startDate: params.start,
        endDate: params.end,
    };

    const [transactionsResult, categoriesResult, statsResult, expenseBreakdownResult, incomeBreakdownResult] = await Promise.all([
        getTransactions(filters),
        getCategories(),
        getTransactionStats(),
        getCategoryBreakdown("expense"),
        getCategoryBreakdown("income"),
    ]);

    const transactions = transactionsResult.data || [];
    const categories = categoriesResult.data || [];
    const stats = statsResult.data || { income: 0, expenses: 0, balance: 0, transactionCount: 0 };
    const expenseBreakdown = expenseBreakdownResult.data;
    const incomeBreakdown = incomeBreakdownResult.data;

    // Check if any filters are active
    const hasFilters = params.type || params.category || params.start || params.end;

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

            {/* Filters */}
            <Suspense fallback={<div className="h-24 bg-zinc-900 rounded-xl animate-pulse" />}>
                <TransactionFilters categories={categories} />
            </Suspense>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction List - takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <TransactionList
                        transactions={transactions}
                        categories={categories}
                    />
                    {hasFilters && transactions.length === 0 && (
                        <div className="mt-4 text-center text-zinc-400 text-sm">
                            No transactions match your filters
                        </div>
                    )}
                </div>

                {/* Category Breakdown - Sidebar */}
                <div className="lg:col-span-1">
                    <CategoryBreakdown
                        expenseData={expenseBreakdown}
                        incomeData={incomeBreakdown}
                    />
                </div>
            </div>
        </div>
    );
}
