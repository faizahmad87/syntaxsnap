"use client"

import { useRouter } from "next/navigation"
import { Flame, Trophy, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Language } from "@/modules/quiz/types/question"

interface HomeClientProps {
  currentStreak: number
  longestStreak: number
  isActiveToday: boolean
  completedLanguages: Language[]
}

const LANGUAGES: Array<{ id: Language; label: string; icon: string; description: string }> = [
  {
    id: "javascript",
    label: "JavaScript",
    icon: "🟨",
    description: "Arrays, closures, async/await",
  },
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    description: "List comprehensions, decorators, typing",
  },
]

export function HomeClient({
  currentStreak,
  longestStreak,
  isActiveToday,
  completedLanguages,
}: HomeClientProps) {
  const router = useRouter()
  const allDone = LANGUAGES.every((l) => completedLanguages.includes(l.id))

  const handleStart = (language: Language) => {
    router.push(`/quiz?lang=${language}`)
  }

  return (
    <div className="flex flex-col min-h-svh px-4 pt-10 pb-nav">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold tracking-tight">SyntaxSnap</span>
          <span className="text-xl">⚡</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep your syntax sharp, one day at a time.
        </p>
      </div>

      {/* Streak Card */}
      <div
        className={cn(
          "rounded-2xl border p-5 mb-8 transition-colors",
          isActiveToday
            ? "border-warning/30 bg-warning/5"
            : "border-border/50 bg-card",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isActiveToday ? "bg-warning/15" : "bg-muted",
              )}
            >
              <Flame
                className={cn(
                  "w-6 h-6",
                  isActiveToday ? "text-warning" : "text-muted-foreground",
                )}
                fill={isActiveToday ? "currentColor" : "none"}
              />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {currentStreak}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  day streak
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isActiveToday ? "Today complete ✓" : "Practice to extend streak"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-muted-foreground">
              <Trophy className="w-3.5 h-3.5" />
              <span className="text-xs">Best</span>
            </div>
            <p className="text-lg font-semibold">{longestStreak}</p>
          </div>
        </div>
      </div>

      {/* Language picker or all-done state */}
      {allDone ? (
        <div className="rounded-2xl border border-border/50 bg-card p-6 mb-6 text-center">
          <p className="text-3xl mb-3">🎉</p>
          <p className="font-semibold">All done for today!</p>
          <p className="text-sm text-muted-foreground mt-1">
            You&apos;ve completed both languages. Come back tomorrow.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Choose language
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => {
              const done = completedLanguages.includes(lang.id)
              return (
                <button
                  key={lang.id}
                  onClick={() => !done && handleStart(lang.id)}
                  disabled={done}
                  className={cn(
                    "group relative rounded-2xl border p-5 text-left transition-all active:scale-[0.98]",
                    done
                      ? "border-success/30 bg-success/5 cursor-default opacity-70"
                      : "border-border/50 bg-card hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <div className="text-3xl mb-3">{lang.icon}</div>
                  <div className="font-semibold text-sm">{lang.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {lang.description}
                  </div>
                  <div className="absolute top-3 right-3">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-2xl border border-border/30 bg-card/50 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">HOW IT WORKS</p>
        <div className="space-y-2.5">
          {[
            { icon: "📝", text: "5 multiple-choice questions per language per day" },
            { icon: "⚡", text: "Earn tokens for correct answers and daily streaks" },
            { icon: "🏆", text: "Unlock badges and climb the leaderboard" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="text-base leading-5">{icon}</span>
              <span className="leading-5">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
