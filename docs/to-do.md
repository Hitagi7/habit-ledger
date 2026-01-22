# Personal Finance & Habit Insights - Development To-Do

This document tracks implementation progress based on [overview.md](./overview.md).

---

## Tech Stack Setup

- [x] Next.js project initialized (App Router)
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] Supabase client setup
- [x] Supabase Auth integration
- [ ] Google Gemini API integration
- [x] Environment variables configured (.env.local)

---

## Authentication & Security

- [x] Supabase Auth setup
- [x] User sign-in page
- [x] User sign-up page
- [ ] Password reset flow
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

- [ ] Create budget per category
- [ ] Set monthly/weekly limits
- [ ] Overspend alerts/notifications
- [ ] Budget progress visualization
- [ ] Edit/delete budgets

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
- [ ] Progress charts for habits
- [ ] Habit consistency graphs

---

## Analytics Dashboards

- [ ] Spending over time chart
- [ ] Category breakdown visualization
- [ ] Net savings trend graph
- [ ] Habit consistency graphs
- [ ] Dashboard widgets/cards

---

## AI Insights (Gemini Integration)

- [ ] Gemini API connection
- [ ] Weekly spending & habit summary generation
- [ ] Monthly summary generation
- [ ] Smart suggestions for budget adjustments
- [ ] Smart suggestions for habit improvements
- [ ] Insights display on dashboard

---

## Notifications & Reminders (Optional)

- [ ] Supabase Edge Functions setup
- [ ] Cron job for scheduled tasks
- [ ] Email notification system
- [ ] Reminder notifications for habits
- [ ] Weekly/monthly summary emails

---

## Deployment

- [ ] Vercel deployment configuration
- [x] Supabase production project setup
- [ ] Environment variables on Vercel
- [ ] Production build testing

---

## Future Enhancements

- [ ] Shared/family budgets
- [ ] Group habit challenges
- [ ] Mobile-friendly PWA
- [ ] TWA Android wrapper

---

## Legend

- `[x]` Completed
- `[/]` In Progress
- `[ ]` Not Started
