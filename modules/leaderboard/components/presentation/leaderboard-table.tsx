"use client"

import { useState } from "react"
import { Flame, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { TokenCounter } from "@/components/molecules/token-counter"
import { useLeaderboard } from "../../hooks/use-leaderboard"
import type { LeaderboardEntry, LeaderboardPeriod } from "../../types/leaderboard"

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  weekly: "This week",
  all_time: "All time",
}

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" }

export function LeaderboardTable() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly")
  const { leaderboard, isFetching, refetch } = useLeaderboard({ period })

  return (
    <div className="flex flex-col min-h-svh px-4 pt-8 pb-nav">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Rankings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Top devs by tokens earned</p>
        </div>
        <button
          onClick={refetch}
          className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground transition-colors"
          aria-label="Refresh leaderboard"
        >
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* Period toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary border border-border mb-6">
        {(Object.keys(PERIOD_LABELS) as LeaderboardPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Your rank sticky */}
      {leaderboard?.currentUserEntry && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 mb-4">
          <p className="text-xs text-primary font-medium mb-2">Your rank</p>
          <EntryRow entry={leaderboard.currentUserEntry} isCurrentUser />
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {isFetching && !leaderboard
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : leaderboard?.entries.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  entry.rank <= 3
                    ? "border-warning/20 bg-warning/3"
                    : "border-border/50 bg-card/50",
                )}
              >
                <EntryRow entry={entry} />
              </div>
            ))}
      </div>

      {!isFetching && leaderboard?.entries.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-sm text-muted-foreground">No entries yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Complete a quiz to appear here.</p>
        </div>
      )}
    </div>
  )
}

function EntryRow({
  entry,
  isCurrentUser = false,
}: {
  entry: LeaderboardEntry
  isCurrentUser?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 text-center shrink-0">
        {RANK_MEDALS[entry.rank] ? (
          <span className="text-lg">{RANK_MEDALS[entry.rank]}</span>
        ) : (
          <span className={cn("text-sm font-bold tabular-nums", isCurrentUser ? "text-primary" : "text-muted-foreground")}>
            #{entry.rank}
          </span>
        )}
      </div>

      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold shrink-0">
        {(entry.displayName || "?")[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm truncate", isCurrentUser && "text-primary")}>
          {entry.displayName || "Anonymous"}
        </p>
        {entry.streakCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3 h-3 text-warning" />
            <span>{entry.streakCount}d streak</span>
          </div>
        )}
      </div>

      <TokenCounter amount={entry.tokens} size="sm" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-5 rounded bg-muted animate-pulse" />
        <div className="w-9 h-9 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="w-14 h-4 rounded bg-muted animate-pulse" />
      </div>
    </div>
  )
}
