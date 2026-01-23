"use client";

import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const { currency, setCurrency } = useCurrency();
    const [currencyLoading, setCurrencyLoading] = useState(false);

    // Password change state
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value as any;
        setCurrencyLoading(true);
        await setCurrency(newCurrency);
        setCurrencyLoading(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: "error", text: "Password must be at least 6 characters" });
            return;
        }

        setPasswordLoading(true);
        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setPasswordMessage({ type: "error", text: error.message });
        } else {
            setPasswordMessage({ type: "success", text: "Password updated successfully" });
            setNewPassword("");
            setConfirmPassword("");
        }
        setPasswordLoading(false);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-zinc-400 mt-1">Manage your account preferences</p>
            </div>

            {/* Currency Settings */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Currency Preference</h2>
                <div className="max-w-xs">
                    <label htmlFor="currency" className="block text-sm font-medium text-zinc-300 mb-2">
                        Display Currency
                    </label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={handleCurrencyChange}
                        disabled={currencyLoading}
                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                        <option value="USD">USD ($) - United States Dollar</option>
                        <option value="PHP">PHP (₱) - Philippine Peso</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="JPY">JPY (¥) - Japanese Yen</option>
                    </select>
                    <p className="mt-2 text-sm text-zinc-500">
                        This will update how monetary values are displayed across the dashboard.
                    </p>
                </div>
            </div>

            {/* Security Settings - Change Password */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Security</h2>
                <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-4">
                    {passwordMessage && (
                        <div className={`p-3 rounded-lg text-sm border ${passwordMessage.type === "success"
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={passwordLoading || !newPassword || !confirmPassword}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>

                    <p className="text-sm text-zinc-500 mt-2">
                        You will remain logged in after changing your password.
                    </p>
                </form>
            </div>


        </div>
    );
}
