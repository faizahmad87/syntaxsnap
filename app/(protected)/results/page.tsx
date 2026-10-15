import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, Zap, Flame } from "lucide-react"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/db"
import { streaks, badges } from "@/db/schema"
import { LanguageBadge } from "@/components/atoms/language-badge"
import type { BadgeType } from "@/modules/rewards/types/reward"
import type { Language } from "@/modules/quiz/types/question"

const querySchema = z.object({
  lang: z.enum(["javascript", "python"]),
  tokens: z.coerce.number().int().min(0),
  correct: z.coerce.number().int().min(0),
  total: z.coerce.number().int().min(1),
})

interface ResultsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const BADGE_CONFIG: Record<BadgeType, { icon: string; label: string }> = {
  first_perfect_day: { icon: "🏆", label: "Perfect Day" },
  week_warrior: { icon: "⚔️", label: "Week Warrior" },
  iron_dev: { icon: "🔩", label: "Iron Dev" },
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  const params = await searchParams
  const parsed = querySchema.safeParse(params)
  if (!parsed.success) notFound()

  const { lang, tokens, correct, total } = parsed.data
  const accuracy = Math.round((correct / total) * 100)
  const isPerfect = correct === total

  // Fetch updated streak + earned badges after this session
  const [streak, earnedBadges] = await Promise.all([
    db.query.streaks.findFirst({ where: eq(streaks.userId, user.id) }),
    db.query.badges.findMany({ where: eq(badges.userId, user.id) }),
  ])

  const streakCount = streak?.currentCount ?? 0
  const earnedBadgeTypes = new Set(earnedBadges.map((b) => b.type))

  const MESSAGES: Record<number, string> = {
    100: "Flawless. You've still got it.",
    80: "Solid session. Nearly perfect!",
    60: "Good run. Keep practicing.",
    0: "Tough one. You'll get it next time.",
  }
  const messageKey = isPerfect ? 100 : accuracy >= 80 ? 80 : accuracy >= 60 ? 60 : 0

  return (
    <div className="flex flex-col min-h-svh px-4 pt-10 pb-4">
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl animate-in zoom-in-75 duration-500">
            {isPerfect ? "🏆" : accuracy >= 60 ? "✅" : "💪"}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Day Complete!</h1>
        <p className="text-muted-foreground text-sm">{MESSAGES[messageKey]}</p>
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard
          icon={<Trophy className="w-5 h-5 text-warning" />}
          value={`${correct}/${total}`}
          label="Correct"
          highlight={isPerfect}
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-primary" />}
          value={`+${tokens}`}
          label="Tokens"
          highlight={tokens > 20}
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-warning" fill="currentColor" />}
          value={`${streakCount}d`}
          label="Streak"
          highlight={streakCount >= 3}
        />
      </div>

      {/* Streak milestone row */}
      {streakCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3 mb-4 animate-in slide-in-from-bottom-2 duration-500">
          <Flame className="w-5 h-5 text-warning shrink-0" fill="currentColor" />
          <p className="text-sm font-medium">
            <span className="text-warning">{streakCount}-day streak</span>
            <span className="text-muted-foreground ml-1">— keep it going!</span>
          </p>
        </div>
      )}

      {/* Language practiced */}
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/30 bg-card/50 py-3 mb-4">
        <LanguageBadge language={lang as Language} />
        <span className="text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">{correct}/{total} correct</span>
      </div>

      {/* Badge unlock section */}
      {earnedBadges.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Badges earned
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BADGE_CONFIG) as BadgeType[])
              .filter((type) => earnedBadgeTypes.has(type))
              .map((type, i) => (
                <div
                  key={type}
                  className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 animate-in zoom-in-75 fade-in-0 duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-lg">{BADGE_CONFIG[type].icon}</span>
                  <span className="text-xs font-semibold">{BADGE_CONFIG[type].label}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CTAs — pinned to bottom */}
      <div className="mt-auto space-y-3">
        <Link
          href="/leaderboard"
          className={cn(buttonVariants({ variant: "default" }), "w-full h-12 font-medium")}
        >
          <Trophy className="w-4 h-4 mr-2" />
          View leaderboard
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full h-12 text-muted-foreground")}
        >
          Come back tomorrow 👋
        </Link>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  highlight?: boolean
}

function StatCard({ icon, value, label, highlight }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 text-center transition-colors",
        highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-lg font-bold leading-none">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
