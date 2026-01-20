"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Once button is pressed, call handleSignup
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Error handling for passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // Like creating a client in the server for the UNIQUE user
        const supabase = createClient();

        // Sign up the user, supabase will handle the session, we just coded to give the email and password
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-orange-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
                    <p className="text-zinc-400 mb-6">
                        We&apos;ve sent a confirmation link to <strong className="text-white">{email}</strong>.
                        Click the link to activate your account.
                    </p>
                    <Link
                        href="/login"
                        className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
                    <p className="text-zinc-400">Start tracking your finances and habits</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-zinc-300 mb-2"
                        >
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

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-zinc-300 mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-zinc-300 mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-zinc-400 text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
