import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import { getUserSettings } from "@/lib/actions/settings";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const settings = await getUserSettings();

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* Reusable Sidebar Component */}
            <Sidebar />

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
                    <CurrencyProvider initialCurrency={settings.currency}>
                        {children}
                    </CurrencyProvider>
                </main>
            </div>
        </div>
    );
}
