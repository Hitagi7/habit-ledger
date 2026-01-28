import { getSavings } from "@/lib/actions/savings";
import SavingForm from "@/components/features/savings/SavingForm";
import SavingCard from "@/components/features/savings/SavingCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SavingsPage() {
    const { data: savings } = await getSavings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/budgets" className="text-zinc-400 hover:text-white transition-colors">
                            Budgets
                        </Link>
                        <span className="text-zinc-600">/</span>
                        <h1 className="text-2xl font-bold text-white">Savings</h1>
                    </div>
                    <p className="text-zinc-400">Track your saving goals and progress</p>
                </div>
                <SavingForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
                {savings?.map((saving, index) => (
                    <SavingCard key={saving.id} saving={saving} index={index} />
                ))}
                {(!savings || savings.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-zinc-900/50 border border-white/5 rounded-xl border-dashed">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            💰
                        </div>
                        <h3 className="text-white font-medium mb-1">No savings goals yet</h3>
                        <p className="text-zinc-500">Create a goal to start saving for something special!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
