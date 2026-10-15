"use client"

import { Flame, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStreak } from "../../hooks/use-streak"

export function StreakBadge() {
  const { streak, isFetching } = useStreak()

  if (isFetching) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="h-3 w-16 rounded bg-muted animate-pulse" />
        <div className="h-12 w-24 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-2 w-full rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (!streak) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Streak
      </p>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              streak.currentCount > 0 ? "bg-warning/15" : "bg-muted",
            )}
          >
            <Flame
              className={cn(
                "w-6 h-6",
                streak.currentCount > 0 ? "text-warning" : "text-muted-foreground",
              )}
              fill={streak.currentCount > 0 ? "currentColor" : "none"}
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{streak.currentCount}</span>
              <span className="text-muted-foreground text-sm">days</span>
            </div>
            <p className="text-xs text-muted-foreground">current streak</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 justify-end text-muted-foreground mb-0.5">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-xs">Best</span>
          </div>
          <span className="text-xl font-bold">{streak.longestCount}</span>
        </div>
      </div>

      {/* 7-day activity dots */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Last 7 days</p>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                i < Math.min(streak.currentCount, 7) ? "bg-warning" : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
