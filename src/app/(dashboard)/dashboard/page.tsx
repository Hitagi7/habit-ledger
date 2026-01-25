import { createClient } from "@/lib/supabase/server";
import DashboardAI from "@/components/features/ai/DashboardAI";
import HabitAI from "@/components/features/ai/HabitAI";
import DashboardStats from "./components/DashboardStats";
import DashboardCharts from "./components/DashboardCharts";
import { Suspense } from "react";

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-zinc-900 border border-white/10 rounded-xl" />
            ))}
        </div>
    );
}

function ChartsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="h-80 bg-zinc-900 border border-white/10 rounded-2xl" />
            ))}
        </div>
    );
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Welcome Section */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 flex flex-col justify-center bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/50">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-white/10 text-2xl font-bold text-zinc-500">
                                {user?.email?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Welcome back! 👋
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                You&apos;re signed in as <span className="text-white font-medium">{user?.user_metadata?.full_name || user?.email}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-base text-zinc-400 font-medium">
                            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats />
            </Suspense>

            {/* Analytics Charts Section */}
            <Suspense fallback={<ChartsSkeleton />}>
                <DashboardCharts />
            </Suspense>

            {/* AI Financial Insights */}
            <div className="animate-fade-in-up delay-300">
                <DashboardAI />
            </div>

            {/* AI Habit Insights */}
            <div className="animate-fade-in-up delay-400">
                <HabitAI />
            </div>
        </div>
    );
}
