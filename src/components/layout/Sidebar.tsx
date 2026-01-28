"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        href: "/dashboard/transactions",
        label: "Transactions",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        href: "/dashboard/habits",
        label: "Habits",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
        ),
    },
    {
        href: "/dashboard/budgets",
        label: "Budgets/Savings",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        href: "/dashboard/settings",
        label: "Settings",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
];

export default function Sidebar({ user }: { user?: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } }) {
    const pathname = usePathname();

    // Check if a nav item is active
    // For "/dashboard", only match exactly
    // For other routes, check if pathname starts with the href
    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
    const avatarUrl = user?.user_metadata?.avatar_url;
    const initial = (user?.email?.[0] || "U").toUpperCase();

    return (
        <aside className="w-64 border-r border-white/10 p-4 hidden md:flex flex-col h-screen sticky top-0 animate-slide-in-left">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 mb-8">
                <img src="/logo.png" alt="Habit Ledger" className="w-8 h-8 object-contain" />
                <span className="font-semibold text-lg text-white">Habit Ledger</span>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.href)
                            ? "bg-orange-500/20 text-orange-500 font-medium"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Profile (Bottom) */}
            {user && (
                <div className="mt-auto pt-4 border-t border-white/10">
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-2 mb-3 hover:bg-white/5 p-2 rounded-lg transition-colors group"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover bg-zinc-800" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-medium group-hover:bg-zinc-700 transition-colors">
                                {initial}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-orange-400 transition-colors">{displayName}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                        </button>
                    </form>
                </div>
            )}
        </aside>
    );
}
