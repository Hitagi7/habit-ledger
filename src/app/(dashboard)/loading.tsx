export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 h-32" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-zinc-900 border border-white/10 rounded-xl" />
                ))}
            </div>

            {/* Main Content / Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-80 bg-zinc-900 border border-white/10 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
