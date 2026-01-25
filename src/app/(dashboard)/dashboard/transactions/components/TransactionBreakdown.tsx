import { getCategoryBreakdown } from "@/lib/actions/transactions";
import CategoryBreakdownClient from "@/components/features/transactions/CategoryBreakdown";

export default async function TransactionBreakdown() {
    const [expenseBreakdownResult, incomeBreakdownResult] = await Promise.all([
        getCategoryBreakdown("expense"),
        getCategoryBreakdown("income"),
    ]);

    const expenseBreakdown = expenseBreakdownResult.data;
    const incomeBreakdown = incomeBreakdownResult.data;

    return (
        <div className="animate-fade-in-up">
            <CategoryBreakdownClient
                expenseData={expenseBreakdown}
                incomeData={incomeBreakdown}
            />
        </div>
    );
}
