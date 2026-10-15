"use client"

import { useRewards } from "../../hooks/use-rewards"
import type { BadgeType } from "../../types/reward"

const BADGE_CONFIG: Record<BadgeType, { icon: string; label: string; description: string }> = {
  first_perfect_day: {
    icon: "🏆",
    label: "Perfect Day",
    description: "5/5 correct in one session",
  },
  week_warrior: {
    icon: "⚔️",
    label: "Week Warrior",
    description: "7-day streak achieved",
  },
  iron_dev: {
    icon: "🔩",
    label: "Iron Dev",
    description: "30-day streak achieved",
  },
}

const ALL_BADGE_TYPES = Object.keys(BADGE_CONFIG) as BadgeType[]

export function BadgeCard() {
  const { rewards, isFetching } = useRewards()

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Badges
      </p>

      {isFetching ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {ALL_BADGE_TYPES.map((type) => {
            const earned = rewards?.badges.some((b) => b.type === type) ?? false
            const config = BADGE_CONFIG[type]

            return (
              <div
                key={type}
                className={`rounded-xl border p-3 transition-colors ${
                  earned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/40 bg-secondary/20 opacity-50"
                }`}
              >
                <div className="text-2xl mb-2">{earned ? config.icon : "🔒"}</div>
                <p className="text-xs font-semibold leading-snug">{config.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {config.description}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
