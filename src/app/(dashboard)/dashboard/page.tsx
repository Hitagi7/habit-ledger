import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome back! 👋
                </h2>
                <p className="text-zinc-400">
                    You&apos;re signed in as <span className="text-white font-medium">{user?.email}</span>
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Total Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">$0.00</p>
                    <p className="text-sm text-zinc-500 mt-1">No transactions yet</p>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Active Habits</span>
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-sm text-zinc-500 mt-1">No habits created</p>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-zinc-400">Budget Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-white">0%</p>
                    <p className="text-sm text-zinc-500 mt-1">No budgets set</p>
                </div>
            </div>

            {/* Getting Started */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                            <span className="text-orange-500 font-bold">1</span>
                        </div>
                        <h4 className="font-medium text-white mb-1">Add a transaction</h4>
                        <p className="text-sm text-zinc-500">Log your first expense or income</p>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                            <span className="text-orange-500 font-bold">2</span>
                        </div>
                        <h4 className="font-medium text-white mb-1">Create a habit</h4>
                        <p className="text-sm text-zinc-500">Start building daily routines</p>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                            <span className="text-orange-500 font-bold">3</span>
                        </div>
                        <h4 className="font-medium text-white mb-1">Set a budget</h4>
                        <p className="text-sm text-zinc-500">Control your spending limits</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
