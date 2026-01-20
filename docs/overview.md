# Personal Finance & Habit Insights App

Personal Finance & Habit Insights is a full‑stack web application built with Next.js, Supabase, and Google Gemini that helps users track money, habits, and progress in one place. Users can log expenses, budgets, and daily habits, then receive AI-powered summaries about their spending patterns, streaks, and areas for improvement.

## Core Goals

- Provide a simple, privacy‑focused dashboard for tracking transactions, budgets, and recurring bills.
- Help users build and maintain habits (e.g., workouts, study, practice) with streaks and completion stats.
- Turn raw data into natural-language insights and suggestions using Gemini.

## Key Features

- Transaction tracking with categories, tags, and filters (e.g., Food, Transport, Subscriptions).
- Budget creation per category with monthly/weekly limits and overspend alerts.
- Habit management (daily/weekly/custom) with streaks, completion rates, and progress charts.
- Analytics dashboards: spending over time, category breakdowns, net savings trend, and habit consistency graphs.
- AI Insights:
  - Weekly and monthly summaries written by Gemini (e.g., "You spent more on food this week and missed 2 workout habits.").
  - Smart suggestions for budget adjustments and habit tweaks.
- Optional scheduled emails or notifications for summaries and reminders using Supabase Edge Functions + cron.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS.
- **Backend & Data:** Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions).
- **AI:** Google Gemini API for insights, summarization, and recommendations.
- **Deployment:** Vercel for frontend + Supabase hosted backend.

## Project Structure

```
habit-ledger/
├── app/
│   ├── (auth)/                  # Auth route group (no layout nesting)
│   │   ├── layout.tsx           # Auth pages layout
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Signup page
│   ├── (dashboard)/             # Dashboard route group (protected)
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   └── dashboard/page.tsx   # Main dashboard
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   └── signout/route.ts     # Sign out API route
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server Supabase client (SSR)
│       └── middleware.ts        # Auth middleware helper
├── docs/
│   ├── overview.md              # This file
│   ├── to-do.md                 # Implementation checklist
│   └── branding.md              # Design system & branding guide
├── proxy.ts                     # Next.js middleware for auth
├── .env.local                   # Environment variables
└── package.json
```

## High-Level Architecture

- Next.js app with public marketing pages and an authenticated dashboard (finance + habits).
- Supabase Auth for user sign‑in and row‑level security to isolate each user's data.
- `proxy.ts` middleware handles session refresh and route protection.
- Normalized tables for `transactions`, `categories`, `budgets`, `habits`, and `habit_logs`.
- API routes / server actions to:
  - Ingest and categorize transactions and habit logs.
  - Aggregate statistics (spend per category, streaks, completion rates).
  - Call Gemini with structured summaries of a user's week/month.
- Optional cron jobs / scheduled triggers to generate and store weekly insight reports and email them to the user.

## Future Enhancements

- Shared or family budgets and group habit challenges.
- Mobile-friendly PWA or TWA Android wrapper for "app-like" experience.
