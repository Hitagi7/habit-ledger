# Next.js App Router Folder Structure Guide

A comprehensive, reusable folder structure for Next.js 14+ projects using the App Router.

---

## Root Directory Structure

```
project-root/
├── src/                    # Source Code
│   ├── app/                # App Router - Routes & Pages
│   ├── components/         # React Components
│   ├── lib/                # Utilities, Configurations & Business Logic
│   └── middleware.ts       # Next.js Middleware (or proxy.ts)
├── public/                 # Static Assets
├── docs/                   # Project Documentation
├── .env.local              # Environment Variables (local)
├── .env.example            # Environment Variables Template
├── next.config.ts          # Next.js Configuration
├── tailwind.config.ts      # Tailwind Configuration
├── tsconfig.json           # TypeScript Configuration
└── package.json            # Dependencies & Scripts
```

---

## App Directory (`app/`)

The `app/` directory contains all routes, layouts, and pages.

```
app/
├── (auth)/                 # Route Group: Auth pages (no URL segment)
│   ├── layout.tsx          # Shared layout for auth pages
│   ├── login/
│   │   └── page.tsx        # /login
│   └── signup/
│       └── page.tsx        # /signup
│
├── (dashboard)/            # Route Group: Protected pages
│   ├── layout.tsx          # Dashboard layout with sidebar
│   └── dashboard/
│       ├── page.tsx        # /dashboard
│       ├── transactions/
│       │   └── page.tsx    # /dashboard/transactions
│       ├── habits/
│       │   └── page.tsx    # /dashboard/habits
│       └── settings/
│           └── page.tsx    # /dashboard/settings
│
├── api/                    # API Routes (if needed)
│   └── webhooks/
│       └── route.ts        # /api/webhooks
│
├── auth/                   # Auth-related API routes
│   ├── callback/
│   │   └── route.ts        # OAuth callback handler
│   └── signout/
│       └── route.ts        # Sign out handler
│
├── globals.css             # Global styles
├── layout.tsx              # Root layout
└── page.tsx                # Landing page (/)
```

### Route Groups `(folder-name)`
- Wrap folder names in parentheses to create logical groups
- Does NOT affect the URL structure
- Allows different layouts for different sections
- Example: `(auth)` and `(dashboard)` share different layouts

### Special Files
| File | Purpose |
|------|---------|
| `page.tsx` | Defines the UI for a route |
| `layout.tsx` | Shared UI wrapper for a segment and its children |
| `loading.tsx` | Loading UI shown while page content loads |
| `error.tsx` | Error boundary for graceful error handling |
| `not-found.tsx` | Custom 404 page |
| `route.ts` | API route handler |

---

## Components Directory (`components/`)

Organize components by purpose and feature.

```
components/
├── ui/                     # Generic, Reusable UI Components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Dropdown.tsx
│   └── index.ts            # Barrel export
│
├── layout/                 # Layout Components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── index.ts
│
├── features/               # Feature-Specific Components
│   ├── transactions/       # Transaction feature
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionCard.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── index.ts
│   │
│   ├── habits/             # Habits feature
│   │   ├── HabitForm.tsx
│   │   ├── HabitList.tsx
│   │   ├── HabitCard.tsx
│   │   ├── StreakDisplay.tsx
│   │   └── index.ts
│   │
│   ├── budgets/            # Budgets feature
│   │   ├── BudgetForm.tsx
│   │   ├── BudgetProgress.tsx
│   │   └── index.ts
│   │
│   └── analytics/          # Analytics/Charts feature
│       ├── SpendingChart.tsx
│       ├── CategoryBreakdown.tsx
│       └── index.ts
│
└── providers/              # Context Providers
    ├── ThemeProvider.tsx
    ├── AuthProvider.tsx
    └── index.ts
```

### Component Organization Rules

1. **`ui/`** - Generic, design-system components
   - No business logic
   - Highly reusable across projects
   - Examples: Button, Input, Modal, Card

2. **`layout/`** - Structural components
   - Define page structure
   - Examples: Sidebar, Header, Footer

3. **`features/`** - Feature-specific components
   - Contains business logic
   - Organized by domain/feature
   - Co-locate related components

4. **`providers/`** - React Context providers
   - Theme, Auth, State management wrappers

---

## Lib Directory (`lib/`)

Houses utilities, configurations, and server-side logic.

```
lib/
├── supabase/               # Supabase Configuration
│   ├── client.ts           # Browser client
│   ├── server.ts           # Server client (SSR)
│   └── middleware.ts       # Auth middleware helper
│
├── actions/                # Server Actions
│   ├── transactions.ts     # Transaction CRUD operations
│   ├── categories.ts       # Category CRUD operations
│   ├── habits.ts           # Habit CRUD operations
│   ├── budgets.ts          # Budget CRUD operations
│   └── auth.ts             # Auth-related actions
│
├── utils/                  # Utility Functions
│   ├── formatters.ts       # Date, currency formatters
│   ├── validators.ts       # Input validation
│   ├── helpers.ts          # Misc helper functions
│   └── cn.ts               # Classname merger (tailwind-merge)
│
├── types/                  # TypeScript Types
│   ├── database.ts         # Database schema types
│   ├── api.ts              # API response types
│   └── index.ts            # Barrel export
│
├── hooks/                  # Custom React Hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── index.ts
│
├── constants/              # App Constants
│   ├── routes.ts           # Route paths
│   ├── config.ts           # App configuration
│   └── index.ts
│
└── services/               # External Service Integrations
    ├── gemini.ts           # Google Gemini API
    ├── stripe.ts           # Stripe payments
    └── email.ts            # Email service
```

### Server Actions (`lib/actions/`)
- Use `"use server"` directive
- Handle database operations
- Return typed responses
- Handle errors gracefully

### Utility Functions (`lib/utils/`)
- Pure functions
- No side effects
- Well-typed

---

## Types Directory (`lib/types/` or `types/`)

```
types/
├── database.ts             # Supabase generated types
├── api.ts                  # API request/response types
├── forms.ts                # Form data types
├── ui.ts                   # UI component prop types
└── index.ts                # Barrel export
```

---

## Public Directory (`public/`)

Static assets served at root URL.

```
public/
├── images/
│   ├── logo.svg
│   ├── hero.png
│   └── icons/
│       └── favicon.ico
├── fonts/
│   └── custom-font.woff2
└── manifest.json           # PWA manifest
```

---

## Documentation (`docs/`)

```
docs/
├── overview.md             # Project overview & architecture
├── to-do.md                # Development checklist
├── branding.md             # Design system & brand guidelines
├── folder-structure.md     # This file
├── api.md                  # API documentation
└── deployment.md           # Deployment guide
```

---

## Best Practices

### 1. Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TransactionForm.tsx` |
| Utilities | camelCase | `formatCurrency.ts` |
| Constants | SCREAMING_SNAKE | `API_BASE_URL` |
| Route folders | kebab-case | `user-settings/` |
| Route groups | (parentheses) | `(dashboard)/` |

### 2. Import Aliases
Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { Transaction } from "@/lib/types";
```

### 3. Barrel Exports
Create `index.ts` files for clean imports:
```typescript
// components/ui/index.ts
export { Button } from "./Button";
export { Input } from "./Input";
export { Modal } from "./Modal";
```

### 4. Colocation
Keep related files close together:
- Feature components in `components/features/[feature]/`
- Server actions grouped by domain in `lib/actions/`
- Types relevant to features in the same directory

### 5. Server vs Client Components
- Default to **Server Components** (no directive needed)
- Add `"use client"` only when needed:
  - Using hooks (useState, useEffect)
  - Browser APIs
  - Event handlers (onClick, onChange)

---

## Quick Reference

```
✅ DO:
- Use route groups for layouts
- Organize components by feature
- Keep server actions in lib/actions/
- Use barrel exports for clean imports
- Colocate related files

❌ DON'T:
- Mix client and server logic
- Create deeply nested folder structures
- Put business logic in UI components
- Use "utils" as a catch-all dumping ground
```

---

## Template for New Features

When adding a new feature (e.g., "notifications"):

1. **Create route**: `app/(dashboard)/dashboard/notifications/page.tsx`
2. **Create components**: `components/features/notifications/`
3. **Create server actions**: `lib/actions/notifications.ts`
4. **Add types**: `lib/types/notifications.ts` or extend `database.ts`
5. **Update sidebar**: Add link in `components/layout/Sidebar.tsx`

---

*Last Updated: January 2026*
