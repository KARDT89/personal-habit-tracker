# streak. — Personal Habit Tracker

A full-stack habit tracking app built with Next.js 16, demonstrating core
concepts including SSR, SSG, ISR, API Routes, Server Actions, and database
integration with Drizzle ORM.

---

## Live Demo

- **Deployed URL**: https://your-deployment-url.vercel.app
- **GitHub**: https://github.com/your-username/personal-habit-tracker

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Fonts | Syne + DM Sans (next/font/google) |
| Theming | next-themes (light/dark mode) |
| Date utils | date-fns |
| Deployment | Vercel |

---

## Features

- Create, edit, and archive habits
- Check off habits daily with a single click
- Streak tracking per habit (current streak displayed live)
- 7-day dot history row on every habit card
- 12-week completion calendar on habit detail page
- Stats page with per-habit breakdown and overall metrics
- Light and dark mode with system preference detection
- Fully typed with TypeScript throughout

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — sidebar + theme provider
│   ├── page.tsx                # Landing page (SSG)
│   ├── dashboard/
│   │   └── page.tsx            # Today's habits (SSR)
│   ├── habits/
│   │   ├── page.tsx            # All habits list (SSR)
│   │   └── [id]/
│   │       ├── page.tsx        # Single habit detail (SSR)
│   │       └── not-found.tsx   # 404 for missing habits
│   ├── stats/
│   │   └── page.tsx            # Progress stats (ISR)
│   └── api/
│       ├── habits/
│       │   ├── route.ts        # GET all, POST new
│       │   └── [id]/route.ts   # GET one, PUT, DELETE
│       └── completions/
│           ├── route.ts        # GET completions
│           └── [id]/route.ts   # POST, DELETE completion
├── actions/
│   ├── habit-actions.ts        # createHabit, updateHabit, deleteHabit
│   └── completion-actions.ts   # toggleCompletion
├── components/
│   ├── sidebar.tsx
│   ├── sidebar-nav-item.tsx
│   ├── theme-toggle.tsx
│   ├── theme-provider.tsx
│   ├── dashboard-header.tsx
│   ├── stats-row.tsx
│   ├── habit-card.tsx
│   ├── habit-list-item.tsx
│   ├── habit-detail-header.tsx
│   ├── habit-calendar.tsx
│   ├── create-habit-dialog.tsx
│   ├── edit-habit-dialog.tsx
│   ├── stats-overview.tsx
│   └── habit-stat-card.tsx
├── db/
│   ├── index.ts                # Drizzle client (Neon serverless)
│   └── schema.ts               # habits + completions tables
├── lib/
│   ├── streak.ts               # Streak calculation + date utilities
│   ├── dashboard.ts            # Dashboard data fetching
│   ├── habit-detail.ts         # Single habit data fetching
│   └── stats.ts                # Stats aggregation
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Routes and Pages

| Route | Type | Description |
|---|---|---|
| `/` | SSG | Landing page — static, no data |
| `/dashboard` | SSR | Today's habits, streak stats, toggle completions |
| `/habits` | SSR | All habits list, create new habit |
| `/habits/[id]` | SSR | Single habit detail, edit, 12-week calendar |
| `/stats` | ISR | Aggregated stats, per-habit breakdown |

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | Fetch all active habits |
| POST | `/api/habits` | Create a new habit |
| GET | `/api/habits/[id]` | Fetch a single habit |
| PUT | `/api/habits/[id]` | Update a habit |
| DELETE | `/api/habits/[id]` | Archive a habit (soft delete) |
| GET | `/api/completions?habitId=` | Fetch completions for a habit |
| POST | `/api/completions/[id]` | Log a completion |
| DELETE | `/api/completions/[id]` | Remove a completion |

All API routes return a consistent response shape:
```json
{ "success": true, "data": {} }
{ "success": false, "error": "message" }
```

---

## Server Actions

| Action | File | Description |
|---|---|---|
| `createHabit` | `actions/habit-actions.ts` | Creates a new habit from form data |
| `updateHabit` | `actions/habit-actions.ts` | Updates habit name, description, color, frequency |
| `deleteHabit` | `actions/habit-actions.ts` | Archives a habit (soft delete) |
| `toggleCompletion` | `actions/completion-actions.ts` | Checks or unchecks a habit for a given date |

### API Routes vs Server Actions — the distinction

**API Routes** (`/app/api/...`) are HTTP endpoints. They can be called
by anyone with a `fetch` request — a mobile app, an external service,
or a client component. They are the right choice for CRUD operations
that need to be accessible as a standard REST API.

**Server Actions** (`/actions/...`) are server-side functions called
directly from React components — no `fetch`, no endpoint, no HTTP
overhead. They are the right choice for form submissions and direct
UI interactions where you just want to run server code and revalidate
the page. In this project, habit creation via the dialog form and the
daily toggle button are the clearest use cases — the user clicks
something, server code runs, the page updates.

---

## Rendering Strategies

### SSG — Static Site Generation
**Page**: `/`  
Next.js renders this page once at build time. No data fetching means
no reason to re-render on every request. Fast, cacheable, perfect for
a landing page.

### SSR — Server Side Rendering
**Pages**: `/dashboard`, `/habits`, `/habits/[id]`  
These pages fetch from the database at request time. The dashboard
shows today's completions which change throughout the day. The habit
detail page shows live streak data. SSR ensures the data is always
fresh when the user loads the page.

### ISR — Incremental Static Regeneration
**Page**: `/stats`  
```ts
export const revalidate = 3600; // revalidate every hour
```
Stats are aggregated data that don't need to update in real time.
Next.js serves a cached version instantly and regenerates in the
background every hour. This is faster than SSR for a page where
slight staleness is acceptable.

---

## Database Setup

This project uses **Neon** — a serverless PostgreSQL provider.

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. Add it to `.env.local` as `DATABASE_URL`
4. Run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Schema

**habits**
| Column | Type | Notes |
|---|---|---|
| id | text | cuid, primary key |
| name | text | required |
| description | text | nullable |
| color | text | hex color, default green |
| frequency | text | daily or weekly |
| userId | text | nullable, auth-ready |
| isArchived | boolean | soft delete flag |
| createdAt | timestamp | auto |
| updatedAt | timestamp | auto |

**completions**
| Column | Type | Notes |
|---|---|---|
| id | text | cuid, primary key |
| habitId | text | foreign key → habits.id |
| date | text | YYYY-MM-DD string |
| createdAt | timestamp | auto |

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/your-username/personal-habit-tracker
cd personal-habit-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your DATABASE_URL

# 4. Run database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file at the root:

```bash
DATABASE_URL="postgresql://..."
```

Also create `.env.example` for the repo:

```bash
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
```

---

## Concepts Covered from Class

| Concept | Implementation |
|---|---|
| Next.js project setup | App Router, TypeScript, Tailwind |
| File based routing | Every page maps to a folder in `/app` |
| Layouts | `app/layout.tsx` wraps all pages with sidebar |
| Multiple pages | `/`, `/dashboard`, `/habits`, `/habits/[id]`, `/stats` |
| SSR | Dashboard and habits pages — db call in async server component |
| SSG | Landing page — no data fetching, rendered at build time |
| ISR | Stats page — `export const revalidate = 3600` |
| API Routes | Full CRUD for habits and completions under `/api` |
| GET POST PUT DELETE | All four HTTP methods implemented |
| Database connection | Drizzle ORM + Neon serverless PostgreSQL |
| Structured API responses | Every route returns `{ success, data/error }` |
| Error handling | try/catch in every API route and server action |
| Server Actions | `use server` in `actions/` folder |
| Server Action use case | Form submissions, toggle button |
| API vs Server Actions | API = REST endpoints, Actions = direct server calls from UI |

---

## Assumptions and Limitations

- Single user mode — no authentication implemented. The schema
  includes a `userId` column that is nullable, making it straightforward
  to add BetterAuth or NextAuth later without a schema change.
- Soft delete only — habits are archived, not permanently deleted,
  to preserve completion history.
- Weekly habits are tracked but streak logic is optimized for daily
  habits. Weekly streak calculation can be added as an extension.
- The stats page has a 1-hour cache — this is intentional (ISR) and
  not a bug.

Also create .env.example at the root:
bash# Neon PostgreSQL connection string
# Get this from your Neon dashboard at https://neon.tech
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"