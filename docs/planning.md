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

## Design Direction

### Visual Style

Dark, developer-coded aesthetic. Dark background (#0a0a0a → #111) with a bright accent. Not childish (this isn't Duolingo for kids), not corporate (this isn't LeetCode). Think VS Code meets a mobile game. Developers will feel at home immediately.

### Color System

| Token | Value | Use |
|---|---|---|
| Background | zinc-950 / zinc-900 | Page bg / section bg |
| Cards | zinc-900 / zinc-800 | Card surfaces |
| Accent | violet-500 | Primary CTA, active states |
| Correct | emerald-500 | Correct answer feedback |
| Wrong | rose-500 | Wrong answer feedback |
| Streak/fire | amber-500 | Streak flame indicator |
| Tokens | yellow-400 | Token count display |

### Mobile-First Rules (non-negotiable)

| Rule | Reason |
|---|---|
| Min tap target 48×48px | Android/iOS HIG guideline |
| viewport-fit=cover + env(safe-area-inset-bottom) | PWA on iPhone notch/home indicator |
| All primary actions pinned to the bottom | Thumb reach zone |
| Max content width max-w-md (448px) centred on tablet/desktop | Feels native on phone, clean on larger screens |
| No hover-only states | Touch devices have no hover |

### Quiz Page Layout

```
┌──────────────────────┐
│ ←   🔥 12   💰 340   │  top bar
│ ████████░░░░  Q3/5   │  progress bar
│                      │
│  javascript · medium │  language + difficulty badge
│                      │
│  What does           │
│  `typeof null`       │  question — large, readable
│  return?             │
│                      │
│ ┌──────────────────┐ │
│ │ A  "null"        │ │  answer cards — full width
│ ├──────────────────┤ │  min 64px tall
│ │ B  "undefined"   │ │
│ ├──────────────────┤ │
│ │ C  "object"      │ │
│ ├──────────────────┤ │
│ │ D  "boolean"     │ │
│ └──────────────────┘ │
│                      │
│ [ Check Answer ]     │  pinned CTA — disabled until selection
│ ▓▓▓▓safe area▓▓▓▓▓  │
└──────────────────────┘
```

After answering — feedback slides up from bottom (Duolingo pattern):
```
│ ✓ Correct! +10 🪙    │  green or red panel slides up
│ typeof null === ...  │  explanation — concise
│ [ Next →           ] │
```

### Results Page Layout

```
│ 🎉 Day Complete!     │
│ 4 / 5 correct        │
│ +70 tokens earned    │  (correct + bonus + streak)
│ 🔥 7-day streak!     │
│ [badge unlock anim]  │
│ [ Leaderboard ]      │
│ [ Come back tmrw ]   │
```

### UI Libraries

- **shadcn/ui** — Button, Card, Badge, Progress, Avatar, Separator (Tailwind v4 compatible)
- **No animation library** — CSS transitions + Tailwind animate- utilities only (keeps bundle small for slow mobile data)

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
│   │   │   └── page.tsx                 ← validates lang param, renders QuizClient
│   │   ├── results/
│   │   │   └── page.tsx                 ← validates search params, renders ResultsClient
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx                   ← handles auth for all protected routes
│   ├── api/
│   │   ├── home/
│   │   │   └── route.ts
│   │   ├── questions/
│   │   │   └── route.ts                 ← GET today's questions + answeredCount
│   │   ├── answers/
│   │   │   └── route.ts                 ← POST answer, returns result
│   │   ├── streak/
│   │   │   └── route.ts
│   │   ├── profile/
│   │   │   └── route.ts
│   │   └── leaderboard/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx                         ← auth guard only, renders HomeClient
│
├── modules/
│   ├── home/
│   │   ├── components/
│   │   │   └── home-client.tsx          ← language picker with 3 card states
│   │   ├── handlers/
│   │   │   └── home-handlers.ts
│   │   ├── hooks/
│   │   │   └── use-home-data.ts
│   │   ├── types/
│   │   │   ├── home.ts
│   │   │   └── responses.ts
│   │   └── index.ts
│   │
│   ├── quiz/
│   │   ├── components/
│   │   │   ├── presentation/
│   │   │   │   ├── question-card.tsx
│   │   │   │   ├── answer-option.tsx
│   │   │   │   └── why-card.tsx
│   │   │   └── widgets/
│   │   │       ├── quiz-client.tsx      ← fetches data via hooks, renders QuizSession
│   │   │       ├── quiz-session.tsx
│   │   │       └── results-client.tsx
│   │   ├── handlers/
│   │   │   └── quiz-handlers.ts
│   │   ├── hooks/
│   │   │   ├── use-daily-questions.ts
│   │   │   └── use-submit-answer.ts
│   │   ├── types/
│   │   │   ├── question.ts
│   │   │   ├── schemas.ts
│   │   │   └── responses.ts
│   │   └── index.ts
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   └── profile-client.tsx
│   │   ├── handlers/
│   │   │   └── profile-handlers.ts
│   │   ├── hooks/
│   │   │   └── use-profile.ts
│   │   ├── types/
│   │   │   ├── profile.ts
│   │   │   └── responses.ts
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
│   │   ├── types/
│   │   │   ├── streak.ts
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
│   │   ├── types/
│   │   │   ├── reward.ts
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
│       ├── types/
│       │   ├── leaderboard.ts
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
│   ├── supabase.ts
│   ├── api-client.ts                    ← typed fetch wrapper
│   ├── date-utils.ts
│   └── utils.ts
│
├── public/
│   └── languages/                       ← language logo PNGs
│       ├── javascript.png
│       └── python.png
│
└── README.md
```

## Coding Conventions (non-negotiable)

| Rule | Detail |
|---|---|
| Package manager | `pnpm` only |
| TypeScript | strict mode, `no any`, no untyped variables |
| Validation | Zod schemas first, infer types with `z.infer<>` |
| API responses | Wrap in `ApiResponse<T>` generic |
| Hook signatures | Typed `interface UseXOptions` + `interface UseXResult` |
| File names | `kebab-case` always |
| Component exports | `PascalCase` named exports |
| Hooks | prefix `use-`, call `apiClient` directly — no service layer |
| Handlers | suffix `-handlers`, pure functions returning `Promise<NextResponse>` |
| Pages | Thin shells only — validate params + render one client component. No DB calls, no API calls |
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
- **No service layer** — services were thin `apiClient` wrappers with zero logic. Removed entirely. Hooks call `apiClient` directly. Stack is: page → client component → hook → `apiClient` → API route → handler.
- **Pages are thin shells** — all protected pages only validate params and render one client component. No DB calls, no API calls in pages. Auth is handled centrally by `(protected)/layout.tsx`.
- **Home page never auto-redirects** — original plan redirected to quiz if an incomplete session existed. Removed: home always renders, showing card status (not started / in progress with X/5 count / completed). User always chooses which language to start.
- **Streak marked on first answer, not session completion** — changed from marking streak after all 5 questions to marking it on the first answer of the day. Ensures streak is safe even if user closes the app mid-session.
- **Quiz resumes at correct question on refresh** — `/api/questions` now returns `answeredCount` alongside questions. `QuizSession` initialises `currentIndex` from this value instead of always starting at 0.
- **Answer can be changed before checking** — before submitting, all options stay `idle` (clickable). Clicking the selected option again deselects it. Lock-out only applies after "Check Answer" is tapped.
- **Language logos instead of emojis** — real PNG logos served from `public/languages/` used in `LanguageBadge` and home language cards.
