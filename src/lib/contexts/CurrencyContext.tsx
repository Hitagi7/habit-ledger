"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { updateUserSettings } from "@/lib/actions/settings";

type Currency = "USD" | "PHP" | "EUR" | "GBP" | "JPY";

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    setCurrency: (currency: Currency) => Promise<void>;
    formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_FORMATS: Record<Currency, { locale: string; currency: string; symbol: string }> = {
    USD: { locale: "en-US", currency: "USD", symbol: "$" },
    PHP: { locale: "en-PH", currency: "PHP", symbol: "₱" },
    EUR: { locale: "de-DE", currency: "EUR", symbol: "€" },
    GBP: { locale: "en-GB", currency: "GBP", symbol: "£" },
    JPY: { locale: "ja-JP", currency: "JPY", symbol: "¥" },
};

export function CurrencyProvider({
    children,
    initialCurrency = "USD",
}: {
    children: React.ReactNode;
    initialCurrency?: string;
}) {
    const [currency, setCurrencyState] = useState<Currency>(initialCurrency as Currency);

    const setCurrency = async (newCurrency: Currency) => {
        // Optimistic update
        setCurrencyState(newCurrency);
        try {
            await updateUserSettings(newCurrency);
        } catch (error) {
            console.error("Failed to update currency setting:", error);
            // Revert on error (could be handled better)
        }
    };

    const formatCurrency = (amount: number) => {
        const { locale, currency: currencyCode } = CURRENCY_FORMATS[currency];
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const symbol = CURRENCY_FORMATS[currency].symbol;

    return (
        <CurrencyContext.Provider value={{ currency, symbol, setCurrency, formatCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}
