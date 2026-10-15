"use client"

import { useRewards } from "../../hooks/use-rewards"

export function TokenDisplay() {
  const { rewards, isFetching } = useRewards()

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Token balance
      </p>

      {isFetching ? (
        <div className="h-10 w-28 rounded bg-muted animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-4xl font-bold text-tokens">
            {(rewards?.totalTokens ?? 0).toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm">tokens</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        Earned from correct answers, daily completions, and streaks.
      </p>
    </div>
  )
}
