export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-32 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-zinc-900 rounded"></div>
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-32 bg-zinc-800 rounded-lg"></div>
                    <div className="h-10 w-32 bg-zinc-800 rounded-lg"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900 border border-white/10 rounded-xl h-24"></div>
                ))}
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-xl h-96"></div>
        </div>
    );
}
