export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-48 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-4 w-64 bg-zinc-900 rounded"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 h-32"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-xl h-96"></div>
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl h-96"></div>
            </div>
        </div>
    );
}
