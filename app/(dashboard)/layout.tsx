import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-4 hidden md:block">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">HL</span>
                    </div>
                    <span className="font-semibold text-lg text-white">Habit Ledger</span>
                </Link>

                <nav className="space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/transactions"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Transactions
                    </Link>
                    <Link
                        href="/dashboard/habits"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        Habits
                    </Link>
                    <Link
                        href="/dashboard/budgets"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Budgets
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-white">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-400">{user.email}</span>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
