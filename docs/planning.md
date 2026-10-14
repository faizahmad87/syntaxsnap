# SyntaxSnap — Product Planning Doc

> A daily syntax refresher for developers who think in code but whose fingers have gone rusty from AI-assisted coding.

---

## The Problem

AI coding tools (Claude Code, Copilot, Codex) have made developers faster, but at a cost: muscle memory for syntax is fading. These developers still have strong logic and architecture instincts — they just can't always remember how to write a Promise, a decorator, or a deepcopy without reaching for autocomplete.

**Nobody has built a tool specifically for this.** LeetCode targets algorithm prep. Coddy targets beginners. There is a clear gap: a Duolingo-style daily syntax refresher for working developers.

---

## Target User

- Mid-to-senior developers who use AI coding assistants daily
- Know how to think through problems, but lose syntax recall over time
- Want to stay sharp in 5 minutes a day, not 2 hours
- Kenpath context: modest Android phones, mobile data, ESL readers, real earnings matter

---

## Core Idea

A **daily 5-question MCQ quiz** focused on syntax (not algorithms). User picks their language(s) on day 1. Every day at reset, they get 5 fresh questions. Correct answers earn tokens. Streaks earn bonus tokens. Simple, fast, habit-forming.

---

## Competitive Landscape

| Platform | Focus | Gap vs. SyntaxSnap |
|---|---|---|
| LeetCode | Algorithms, interview prep | Too hard, time-consuming, no syntax focus |
| HackerRank | Broad challenges | Overwhelming, not daily-habit-focused |
| Coddy | Learn-to-code from scratch | Not for experienced devs |
| Exercism | Deep practice with mentorship | Too slow, no quick daily loop |
| CodeWars | Kata/algorithms | Same issue as LeetCode |

**SyntaxSnap owns the gap:** experienced devs who need a 5-min daily syntax ping, not a 2-hour algorithm grind.

---

## Engagement Mechanics

### Why These Work (Research-backed)

1. **Streaks (Loss Aversion)** — Duolingo calls their streak counter "the most important lever in driving DAUs." A 30-day streak is a psychological asset users won't risk losing. Key: add **Streak Freeze** (1 free skip/week) to prevent rage-quit abandonment.

2. **Variable Reward (Dopamine Loop)** — Randomize bonus tokens occasionally ("2x tokens today!"). Unpredictability increases dopamine more than predictable rewards.

3. **Tiny Session Design** — 5 questions max per day. Lowering the barrier to "I finished today" is more important than depth. People finish, feel good, come back. Overwhelm kills retention.

4. **Visible Progress (Zeigarnik Effect)** — Unfinished progress bars pull users back. A language mastery %, a level bar, a badge progress counter.

5. **Weekly Leaderboard** — Weekly resets beat all-time boards. You can always climb a weekly board; all-time feels impossible.

6. **"Why" Card After Every Answer** — One sentence explaining the syntax, even on correct answers. This is what Duolingo does that LeetCode doesn't — you feel like you learned something in 5 seconds. This is the single biggest differentiator.

### Reward Structure

| Action | Tokens |
|---|---|
| Correct answer | +10 |
| Full 5/5 day complete | +20 bonus |
| 3-day streak | +50 |
| 7-day streak | +100 + "Week Warrior" badge |
| 30-day streak | +200 + "Iron Dev" badge |
| Streak Freeze used | 0 (1 free/week, else costs tokens) |

---

## V1 Scope (Quiz Only — Right Call)

### Features to Build

- [ ] Language picker on onboarding (JS, Python to start)
- [ ] 5 MCQ questions per day per language
- [ ] Tokens per correct answer
- [ ] Daily bonus for full 5/5 completion
- [ ] Streak counter with visual flame/indicator
- [ ] Streak Freeze (1 free/week)
- [ ] 2–3 badges (7-day streak, 30-day streak, first perfect day)
- [ ] "Why" explanation card after every answer
- [ ] Simple weekly leaderboard (optional but recommended)
- [ ] Question bank: ~50 questions per language (enough for 10 non-repeat days)

### UI Flow Per Question

```
Language picker (day 1 only)
  ↓
Daily quiz screen: Question + 4 options (A/B/C/D)
  ↓
Tap answer → Instant feedback (✓ green / ✗ red)
  ↓
"Why" card: 1-line syntax explanation
  ↓
Next question
  ↓ (after 5 questions)
End screen: today's score, tokens earned, streak count, any badges unlocked
```

### Out of Scope for V1

- Code writing / fill-in-the-blank
- Typing challenges / timed challenges
- Token redemption / real money
- Friend challenges
- More than 2 languages

---

## V2 Roadmap

1. **Fill-in-the-blank syntax** — type the missing keyword (harder, more memorable)
2. **Code completion** — write a short function from scratch with a timer
3. **Per-language streaks** — separate JS streak from Python streak
4. **Token redemption** — real value (Kenpath's angle)
5. **Friend challenges** — "Beat my streak this week"
6. **More languages** — TypeScript, Go, Rust, SQL

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js (React) | Fast, SSG, PWA-able |
| Styling | Tailwind CSS | Rapid, consistent, mobile-first |
| Backend | Next.js API routes | Simple, co-located |
| Database | Supabase (Postgres) | Free tier, auth included |
| Auth | Supabase Auth | Magic link / Google, low friction |
| Hosting | Vercel | Free tier, global CDN |
| Questions | JSON in Supabase DB | Easy to seed and expand |

**PWA over native app** — installable on Android home screen, no Play Store needed, works on slow mobile data, no heavy bundle.

### Performance Targets (for Kenpath's audience)

- < 100KB initial JS bundle
- Questions preloaded per session (no per-question API calls)
- Offline-capable for the active quiz session
- Works on 3G / slow mobile data

---

## Project Structure

Mirrors the toflow-ai/web-app module architecture exactly.

```
syntaxsnap/
├── docs/
│   └── planning.md
│
├── app/                                  ← Next.js 15 App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (protected)/
│   │   ├── quiz/
│   │   │   └── page.tsx                 ← daily quiz session
│   │   ├── results/
│   │   │   └── page.tsx                 ← end-of-session summary
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── questions/
│   │   │   └── route.ts                 ← GET today's questions
│   │   ├── answers/
│   │   │   └── route.ts                 ← POST answer, returns result
│   │   ├── streak/
│   │   │   └── route.ts                 ← GET/POST streak state
│   │   └── leaderboard/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx                         ← onboarding / language picker
│
├── modules/
│   ├── quiz/
│   │   ├── components/
│   │   │   ├── presentation/
│   │   │   │   ├── question-card.tsx
│   │   │   │   ├── answer-option.tsx
│   │   │   │   └── why-card.tsx
│   │   │   └── widgets/
│   │   │       └── quiz-session.tsx
│   │   ├── handlers/
│   │   │   └── quiz-handlers.ts
│   │   ├── hooks/
│   │   │   ├── use-daily-questions.ts
│   │   │   └── use-submit-answer.ts
│   │   ├── services/
│   │   │   └── quiz-service.ts
│   │   ├── types/
│   │   │   ├── question.ts              ← Question, AnswerOption, QuizSession types
│   │   │   ├── schemas.ts               ← Zod schemas + inferred input types
│   │   │   └── responses.ts             ← QuestionsResponse, AnswerResponse
│   │   └── index.ts
│   │
│   ├── streak/
│   │   ├── components/
│   │   │   └── presentation/
│   │   │       ├── streak-badge.tsx
│   │   │       └── streak-freeze-button.tsx
│   │   ├── handlers/
│   │   │   └── streak-handlers.ts
│   │   ├── hooks/
│   │   │   └── use-streak.ts
│   │   ├── services/
│   │   │   └── streak-service.ts
│   │   ├── types/
│   │   │   ├── streak.ts                ← Streak, StreakFreeze types
│   │   │   ├── schemas.ts
│   │   │   └── responses.ts
│   │   └── index.ts
│   │
│   ├── rewards/
│   │   ├── components/
│   │   │   └── presentation/
│   │   │       ├── token-display.tsx
│   │   │       └── badge-card.tsx
│   │   ├── handlers/
│   │   │   └── rewards-handlers.ts
│   │   ├── hooks/
│   │   │   └── use-rewards.ts
│   │   ├── services/
│   │   │   └── rewards-service.ts
│   │   ├── types/
│   │   │   ├── reward.ts                ← Token, Badge, BadgeType types
│   │   │   ├── schemas.ts
│   │   │   └── responses.ts
│   │   └── index.ts
│   │
│   └── leaderboard/
│       ├── components/
│       │   └── presentation/
│       │       └── leaderboard-table.tsx
│       ├── handlers/
│       │   └── leaderboard-handlers.ts
│       ├── hooks/
│       │   └── use-leaderboard.ts
│       ├── services/
│       │   └── leaderboard-service.ts
│       ├── types/
│       │   ├── leaderboard.ts           ← LeaderboardEntry, LeaderboardPeriod
│       │   ├── schemas.ts
│       │   └── responses.ts
│       └── index.ts
│
├── components/
│   ├── atoms/                           ← buttons, inputs, badges
│   ├── molecules/                       ← progress-bar, token-counter
│   ├── organisms/                       ← nav, session-header
│   └── ui/                             ← shadcn/ui primitives
│
├── types/
│   ├── api-response.ts                  ← ApiResponse<T>, ErrorResponse
│   └── index.ts
│
├── lib/
│   ├── supabase.ts                      ← Supabase client (server + client)
│   ├── api-client.ts                    ← typed fetch wrapper
│   ├── date-utils.ts                    ← daily reset, UTC helpers
│   └── utils.ts                         ← cn(), misc helpers
│
├── data/
│   └── questions/
│       ├── javascript.json
│       └── python.json
│
├── public/
├── .env.local
├── .prettierrc
├── .eslintrc.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── package.json
└── README.md
```

## Coding Conventions (non-negotiable)

Mirrors toflow-ai/web-app exactly:

| Rule | Detail |
|---|---|
| Package manager | `pnpm` only |
| TypeScript | strict mode, `no any`, no untyped variables |
| Validation | Zod schemas first, infer types with `z.infer<>` |
| API responses | Wrap in `ApiResponse<T>` generic |
| Hook signatures | Typed `interface UseXOptions` + `interface UseXResult` |
| File names | `kebab-case` always |
| Component exports | `PascalCase` named exports |
| Hooks | prefix `use-` |
| Services | suffix `-service`, exported as const object |
| Handlers | suffix `-handlers`, pure functions returning `Promise<NextResponse>` |
| Path alias | `@/*` maps to project root |
| Prettier | no semis, 2-space indent, trailing commas, LF |

---

## AI Tools Usage (for Kenpath explainer)

- Product research and competitive analysis: Claude Code
- Engagement mechanics research: Claude Code (web search)
- Planning doc: Claude Code
- Implementation: Claude Code (with review at each step)

---

## Notes / Decisions Log

- **Quiz-first (not code-writing)** — faster to build, easier to use on mobile, still solves the core problem. Code-writing in V2.
- **Supabase over Prisma+PlanetScale** — free tier auth + DB in one, less setup friction for a 4–6 hour build.
- **PWA over React Native** — no app store lag, works on low-end Android immediately, shareable via link.
- **50 questions per language to start** — enough for 10 days without repeat. Expand with community contributions in V2.
