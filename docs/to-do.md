# Personal Finance & Habit Insights - Development To-Do

This document tracks implementation progress based on [overview.md](./overview.md).

---

## Tech Stack Setup

- [x] Next.js project initialized (App Router)
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] Supabase client setup
- [x] Supabase Auth integration
- [x] Google Gemini API integration
- [x] Environment variables configured (.env.local)

---

## Authentication & Security

- [x] Supabase Auth setup
- [x] User sign-in page
- [x] User sign-up page
- [x] Password reset flow
- [x] Protected routes (authenticated dashboard)
- [x] Row-level security (RLS) policies for user data isolation

---

## Database Schema

- [x] `users` table (Supabase Auth handles this)
- [x] `categories` table
- [x] `transactions` table
- [x] `budgets` table
- [x] `habits` table
- [x] `habit_logs` table
- [x] Database migrations setup

---

## Frontend - Pages & Layout

### Public Pages
- [x] Landing/marketing page
- [x] Login page
- [x] Sign-up page

### Authenticated Dashboard
- [x] Dashboard layout with navigation
- [x] Finance overview page (placeholder)
- [x] Habits overview page
- [x] Settings page (Currency, Password)

---

## Transaction Tracking (Finance)

- [x] Add transaction form
- [x] Transaction list view
- [x] Transaction categories management
- [x] Tags support for transactions
- [x] Transaction filters (by type, category, date range)
- [x] Edit/delete transactions
- [x] Category breakdown view (with expense/income tabs)

---

## Budget Management

- [x] Create budget per category
- [x] Set monthly/weekly limits
- [x] Overspend alerts/notifications (visual indicator on budget cards)
- [x] Budget progress visualization
- [x] Edit/delete budgets

### Savings Management
- [x] Create savings goal
- [x] Track progress towards goal
- [x] Add/remove funds from savings
- [x] Budget/Savings page integration

---

## Habit Tracking

- [x] Create habit (daily/weekly frequency)
- [x] Habit list view
- [x] Habit categories support
- [x] Log habit completion (toggle with optimistic UI)
- [x] Streak tracking
- [x] Completion rate calculation
- [x] Stats cards (Total, Completed Today, Streak, Rate)
- [x] Edit/delete habits (with confirmation modal)
- [x] Progress charts for habits
- [x] Habit consistency graphs

---

## Analytics Dashboards

- [x] Spending over time chart
- [x] Category breakdown visualization
- [x] Net savings trend graph
- [x] Dashboard widgets/cards

---

## AI Insights (Gemini Integration)

- [x] Gemini API connection
- [x] Weekly spending & habit summary generation
- [x] Monthly summary generation
- [x] Smart suggestions for budget adjustments
- [x] Smart suggestions for habit improvements
- [x] Insights display on dashboard

---

## Deployment

- [ ] Vercel deployment configuration
- [x] Supabase production project setup
- [ ] Environment variables on Vercel
- [x] Production build testing

---

## Future Enhancements

- [ ] Shared/family budgets
- [ ] Group habit challenges
- [x] Mobile-friendly PWA (Manifest & Meta setup)
- [ ] TWA Android wrapper

---

## Legend

- `[x]` Completed
- `[/]` In Progress
- `[ ]` Not Started
