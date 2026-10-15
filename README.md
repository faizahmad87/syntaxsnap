Ref: KL-7Q4

# SyntaxSnap

A daily syntax practice app for developers who use AI coding tools and are losing syntax recall. Five multiple-choice questions per day, per language. Correct answers earn tokens. Streaks earn bonuses. Simple, fast, habit-forming.

**Live app:** _[add Vercel link here before submitting]_  
**Stack:** Next.js 16 · Supabase · Drizzle ORM · Tailwind CSS v4 · TypeScript

---

## The idea

AI coding assistants (Claude Code, Copilot) have made developers faster, but muscle memory for syntax is fading. Nobody has built a tool specifically for this gap. SyntaxSnap owns it: a Duolingo-style daily syntax refresher for working developers — not a 2-hour algorithm grind.

---

## What it does

- **Daily quiz** — 5 MCQ questions per language (JavaScript and Python). Questions rotate from a bank of 50 per language, preferring unseen questions from the last 14 days.
- **"Why" card** — after every answer, a one-line explanation appears whether you were right or wrong. This is the core learning moment.
- **Tokens** — +10 per correct answer, +20 daily completion bonus, +50/+100/+200 for 3/7/30-day streaks.
- **Streaks** — daily flame counter with 1 free freeze per week to prevent rage-quit abandonment.
- **Badges** — Perfect Day, Week Warrior (7-day streak), Iron Dev (30-day streak).
- **Leaderboard** — weekly (resets Monday) and all-time rankings by tokens earned.
- **PWA** — installable on Android home screen, works on slow mobile data, offline-capable during an active quiz session.

---

## Repo structure

```
syntaxsnap/
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Login page
│   ├── (protected)/        # Quiz, results, leaderboard, profile
│   └── api/                # answers, questions, streak, leaderboard, rewards
├── modules/                # Feature modules (quiz, streak, rewards, leaderboard)
│   └── [feature]/
│       ├── components/
│       │   ├── presentation/   # Pure UI components
│       │   └── widgets/        # Stateful orchestrators
│       ├── handlers/       # API route logic
│       ├── hooks/          # Client data-fetching hooks
│       ├── services/       # Typed API client calls
│       └── types/          # Zod schemas + inferred types
├── components/
│   ├── atoms/              # language-badge, difficulty-badge
│   ├── molecules/          # progress-bar, token-counter
│   ├── organisms/          # bottom-nav, session-header
│   └── ui/                 # shadcn/ui primitives
├── db/
│   ├── schema/             # Drizzle table definitions + RLS policies
│   └── seed.ts             # Seeds 100 questions (50 JS + 50 Python)
├── data/questions/         # javascript.json, python.json
├── supabase/migrations/    # SQL migrations (schema + custom functions)
└── docs/planning.md        # Full product planning doc
```

---

## Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- A [Supabase](https://supabase.com) project (free tier is enough)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/faizahmad87/syntaxsnap.git
cd syntaxsnap
pnpm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# Supabase — Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Pooled connection — Project Settings → Database → Connection pooling (port 6543)
DATABASE_URL=postgresql://postgres.your-ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require

# Direct connection — Project Settings → Database → Session mode (port 5432)
DIRECT_URL=postgresql://postgres.your-ref:password@aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require
```

### 3. Run database migrations

```bash
pnpm db:push
```

Creates all tables, enums, indexes, and RLS policies.

### 4. Run custom SQL migrations

`db:push` handles Drizzle-managed schema only. The sign-up trigger and daily question picker must be applied separately:

```bash
psql "$DIRECT_URL" -f supabase/migrations/0001_functions_and_triggers.sql
```

This installs:
- `handle_new_user()` — auto-creates a profile and streak row when a user signs up
- `pick_daily_questions()` — picks 5 questions per session, preferring unseen ones from the last 14 days

### 5. Seed the question bank

```bash
pnpm db:seed
```

Loads 100 questions (50 JavaScript + 50 Python).

### 6. Configure Supabase Auth

In Supabase dashboard → **Authentication → URL Configuration**, add to the redirect allow-list:

```
http://localhost:3000/**
```

### 7. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with a magic link — no password needed.

---

## Available scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:seed` | Seed the question bank |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |

---

## Deployment (Vercel)

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Add all five environment variables from `.env.local`
3. In Supabase → **Authentication → URL Configuration**, add your Vercel production domain to the redirect allow-list
4. Deploy

---

## AI tools used

[Claude Code](https://claude.ai/code) (Anthropic) was used as a coding assistant during implementation.

**Developer's work:**
- Product research and competitive landscape analysis
- Engagement mechanics research (streaks, variable rewards, loss aversion, Zeigarnik effect)
- Full planning doc — what to build, what to cut, and why
- All product and architecture decisions (module structure, DB schema design, reward logic, UX flow)
- Constant direction and feedback throughout implementation — reviewing every output, correcting deviations, and deciding how each feature should behave

**Claude Code's role:**
- Writing code as per the plan and specifications provided by the developer
- Implementing components, API routes, DB schema, Postgres functions, and the question bank
- Fixing bugs and build errors as directed

The thinking, planning, and judgment were the developer's. Claude Code handled typing speed.

---

## What was left out (V2 roadmap)

V1 is MCQ — recognising correct syntax. V2 is writing it. That is where real muscle memory is built.

- **Code writing challenges** — type a small function from scratch (e.g. "write a debounce function") with a syntax-aware checker. No algorithm puzzles — just syntax and structure.
- **Fill-in-the-blank** — complete a partially written snippet by typing the missing keyword or expression. Harder than MCQ, more memorable.
- Token redemption for real value (Kenpath's core angle)
- Per-language streaks tracked separately
- More languages (TypeScript, Go, Rust, SQL)
- Push notifications for daily reminders
- Friend challenges
