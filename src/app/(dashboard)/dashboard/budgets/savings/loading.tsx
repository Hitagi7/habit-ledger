export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-32 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-zinc-900 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-zinc-800 rounded-lg"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-xl h-48"></div>
                ))}
            </div>
        </div>
    );
}
