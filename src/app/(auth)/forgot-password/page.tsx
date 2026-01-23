"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the password reset link.");
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-zinc-400">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                            {message}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-zinc-400 hover:text-white text-sm transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
