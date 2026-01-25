import { getTransactions } from "@/lib/actions/transactions";
import { getCategories } from "@/lib/actions/categories";
import TransactionListClient from "@/components/features/transactions/TransactionList";

interface Props {
    searchParams: {
        type?: string;
        category?: string;
        start?: string;
        end?: string;
    }
}

export default async function TransactionList({ searchParams }: Props) {
    const filters = {
        type: searchParams.type as "income" | "expense" | undefined,
        categoryId: searchParams.category,
        startDate: searchParams.start,
        endDate: searchParams.end,
    };

    // Parallel fetch for transactions and categories
    const [transactionsResult, categoriesResult] = await Promise.all([
        getTransactions(filters),
        getCategories(),
    ]);

    const transactions = transactionsResult.data || [];
    const categories = categoriesResult.data || [];
    const hasFilters = searchParams.type || searchParams.category || searchParams.start || searchParams.end;

    return (
        <div>
            <TransactionListClient
                transactions={transactions}
                categories={categories}
            />
            {hasFilters && transactions.length === 0 && (
                <div className="mt-4 text-center text-zinc-400 text-sm">
                    No transactions match your filters
                </div>
            )}
        </div>
    );
}
