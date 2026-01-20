# Personal Finance & Habit Insights - Development To-Do

This document tracks implementation progress based on [overview.md](./overview.md).

---

## Tech Stack Setup

- [x] Next.js project initialized (App Router)
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [ ] Supabase client setup
- [ ] Supabase Auth integration
- [ ] Google Gemini API integration
- [ ] Environment variables configured (.env.local)

---

## Authentication & Security

- [ ] Supabase Auth setup
- [ ] User sign-in page
- [ ] User sign-up page
- [ ] Password reset flow
- [ ] Protected routes (authenticated dashboard)
- [ ] Row-level security (RLS) policies for user data isolation

---

## Database Schema

- [ ] `users` table (Supabase Auth handles this)
- [ ] `categories` table
- [ ] `transactions` table
- [ ] `budgets` table
- [ ] `habits` table
- [ ] `habit_logs` table
- [ ] Database migrations setup

---

## Frontend - Pages & Layout

### Public Pages
- [x] Landing/marketing page
- [ ] Login page
- [ ] Sign-up page

### Authenticated Dashboard
- [ ] Dashboard layout with navigation
- [ ] Finance overview page
- [ ] Habits overview page

---

## Transaction Tracking (Finance)

- [ ] Add transaction form
- [ ] Transaction list view
- [ ] Transaction categories management
- [ ] Tags support for transactions
- [ ] Transaction filters (by category, date, tags)
- [ ] Edit/delete transactions
- [ ] Category breakdown view

---

## Budget Management

- [ ] Create budget per category
- [ ] Set monthly/weekly limits
- [ ] Overspend alerts/notifications
- [ ] Budget progress visualization
- [ ] Edit/delete budgets

---

## Habit Tracking

- [ ] Create habit (daily/weekly/custom frequency)
- [ ] Habit list view
- [ ] Log habit completion
- [ ] Streak tracking
- [ ] Completion rate calculation
- [ ] Progress charts for habits
- [ ] Habit consistency graphs
- [ ] Edit/delete habits

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
- [ ] Supabase production project setup
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
