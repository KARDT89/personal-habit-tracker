# streak. — Personal Habit Tracker

A full-stack habit tracking app built with Next.js 16, demonstrating SSR, ISR, API Routes, Server Actions, authentication, and database integration with Drizzle ORM.

**Live**: [streak.tamalsarkar.dev](https://streak.tamalsarkar.dev) · **GitHub**: [KARDT89/personal-habit-tracker](https://github.com/KARDT89/personal-habit-tracker)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| Auth | Better Auth (email/password + GitHub OAuth) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Charts | Recharts |
| Fonts | Instrument Serif + Geist (next/font/google) |
| Theming | next-themes (light/dark mode) |
| Date utils | date-fns |
| Deployment | Vercel |

---

## Features

- Sign up / sign in with email & password or GitHub OAuth
- Create, edit, and archive habits (per-user, isolated data)
- Check off habits daily with a single click
- Streak tracking per habit displayed live on each card
- 7-day dot history row on every habit card
- 12-week bar chart (Recharts) on habit detail page
- Full completion calendar on habit detail page
- Stats page with per-habit breakdown and overall metrics
- Light and dark mode with system preference detection
- Auth-protected routes via Next.js middleware
- Fully typed with TypeScript throughout

---

## Project Structure

```
app/
├── layout.tsx                  # Root layout — ThemeProvider + fonts
├── page.tsx                    # Landing page (SSR — reads session)
├── (application)/
│   ├── layout.tsx              # App shell — sidebar + main area
│   ├── dashboard/
│   │   └── page.tsx            # Today's habits (SSR)
│   ├── habits/
│   │   ├── page.tsx            # All habits list (SSR)
│   │   └── [id]/
│   │       ├── page.tsx        # Single habit detail (SSR)
│   │       └── not-found.tsx   # 404 for missing habits
│   └── stats/
│       └── page.tsx            # Progress stats (ISR, 1hr cache)
├── (auth)/
│   ├── sign-in/page.tsx        # Email + GitHub sign-in
│   └── sign-up/page.tsx        # Email + GitHub sign-up
└── api/
    ├── auth/[...all]/route.ts  # Better Auth handler (GET + POST)
    ├── habits/[id]/route.ts    # GET, PUT, DELETE a single habit
    └── completions/
        ├── route.ts            # GET completions by habitId
        └── [id]/route.ts       # POST, DELETE a completion

components/
├── sidebar.tsx
├── sidebar-nav-item.tsx
├── theme-toggle.tsx
├── theme-provider.tsx
├── dashboard-header.tsx
├── stats-row.tsx
├── habit-card.tsx
├── habit-list-item.tsx
├── habit-detail-header.tsx
├── habit-calender.tsx          # 12-week completion calendar
├── habit-trend-chart.tsx       # Weekly bar chart (Recharts)
├── create-habit-dialog.tsx
├── edit-habit-dialog.tsx
├── stats-overview.tsx
└── habit-stat-card.tsx

lib/
├── auth.ts                     # Better Auth server config
├── auth-client.ts              # Better Auth browser client
├── streak.ts                   # Streak calculation + date utils
├── dashboard.ts                # Dashboard data fetching
├── habits.ts                   # Habit list data fetching
├── habit-detail.ts             # Single habit data fetching
└── stats.ts                    # Stats aggregation

db/
├── index.ts                    # Drizzle client (Neon serverless)
└── schema.ts                   # habits, completions, auth tables

middleware/
└── middleware.ts               # Auth-guard: redirect unauthenticated users
```

---

## Routes and Pages

| Route | Type | Description |
|---|---|---|
| `/` | SSR | Landing page — shows session-aware nav and CTA |
| `/sign-in` | Client | Email/password or GitHub sign-in |
| `/sign-up` | Client | Email/password or GitHub sign-up |
| `/dashboard` | SSR | Today's habits, streak stats, toggle completions |
| `/habits` | SSR | All habits list, create new habit |
| `/habits/[id]` | SSR | Single habit detail, edit, trend chart, calendar |
| `/stats` | ISR | Aggregated stats, per-habit breakdown |

The `/dashboard`, `/habits`, and `/stats` routes are protected by middleware and redirect unauthenticated users to `/sign-in`.

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/auth/[...all]` | Better Auth handler (sessions, OAuth callbacks) |
| GET | `/api/habits/[id]` | Fetch a single habit |
| PUT | `/api/habits/[id]` | Update a habit |
| DELETE | `/api/habits/[id]` | Archive a habit (soft delete) |
| GET | `/api/completions?habitId=` | Fetch completions for a habit |
| POST | `/api/completions/[id]` | Log a completion |
| DELETE | `/api/completions/[id]` | Remove a completion |

All app routes return a consistent response shape:
```json
{ "success": true, "data": {} }
{ "success": false, "error": "message" }
```

---

## Authentication

Auth is handled by **Better Auth** with two providers:

- **Email/password** — register and sign in with an email address
- **GitHub OAuth** — one-click sign-in via GitHub

Sessions are stored in the database (the `session` table). The middleware reads the session cookie on every protected request and redirects unauthenticated users to `/sign-in`. All habit and completion data is scoped to the authenticated user via the `userId` foreign key.

---

## Rendering Strategies

### SSR — Server-Side Rendering
**Pages**: `/`, `/dashboard`, `/habits`, `/habits/[id]`

These pages call `auth.api.getSession()` or query the database at request time. This guarantees the data is always fresh — today's completions, the current streak, and the active session state all change throughout the day.

### ISR — Incremental Static Regeneration
**Page**: `/stats`
```ts
export const revalidate = 3600; // regenerate every hour
```
Aggregated stats don't need to be real-time. Next.js serves a cached version instantly and regenerates it in the background every hour. Slight staleness is acceptable here; the faster response is the right trade-off.

---

## Database Schema

### habits
| Column | Type | Notes |
|---|---|---|
| id | text | UUID, primary key |
| name | text | required |
| description | text | nullable |
| color | text | hex color, default `#1D9E75` |
| frequency | text | `daily` or `weekly` |
| userId | text | NOT NULL, FK → user.id (cascade delete) |
| isArchived | boolean | soft delete flag |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |

### completions
| Column | Type | Notes |
|---|---|---|
| id | text | UUID, primary key |
| habitId | text | FK → habits.id (cascade delete) |
| date | text | `YYYY-MM-DD` string |
| createdAt | timestamp | auto |

### Auth tables (managed by Better Auth)
`user`, `session`, `account`, `verification` — standard Better Auth schema, stored in the same Neon database.

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/KARDT89/personal-habit-tracker
cd personal-habit-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

# 4. Run database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

`.env.local`:
```bash
# Neon PostgreSQL
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

# Better Auth — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (create at github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

`.env.example`:
```bash
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

---

## Concepts Demonstrated

| Concept | Implementation |
|---|---|
| Next.js App Router | Route groups `(application)` and `(auth)` for layout isolation |
| File-based routing | Every page maps to a folder in `/app` |
| Layouts | Root layout wraps everything; app layout adds sidebar |
| SSR | Dashboard, habits, and habit detail — DB query in async server component |
| ISR | Stats page — `export const revalidate = 3600` |
| API Routes | CRUD for habits and completions under `/api` |
| GET POST PUT DELETE | All four HTTP methods implemented |
| Server Actions | `use server` — habit create/update/delete, toggle completion |
| API vs Server Actions | API = REST endpoints callable externally; Actions = direct server calls from React |
| Authentication | Better Auth — email/password and GitHub OAuth, session in DB |
| Middleware | Route protection — redirect unauthenticated requests to sign-in |
| Database | Drizzle ORM + Neon serverless PostgreSQL |
| Typed responses | Every route returns `{ success, data/error }` |
| Error handling | try/catch in every API route and server action |
| Charts | Recharts bar chart for weekly trend data |
| Theming | next-themes — light/dark mode with system preference |
