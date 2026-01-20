import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
            {/* Header */}
            <header className="mt-6 ml-7">
                <Link
                    href="/"
                    className="text-[var(--color-text-muted)] hover:text-white transition-colors text-sm"
                >
                    ← Back to home
                </Link>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center px-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-sm text-zinc-500">
                <p className="text-sm text-foreground/50">
                    © 2026 <a href="https://github.com/Hitagi7" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white transition-colors">Hitagi7</a>. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
