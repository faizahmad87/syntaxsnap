"use client"

import { StreakBadge } from "@/modules/streak/components/presentation/streak-badge"
import { StreakFreezeButton } from "@/modules/streak/components/presentation/streak-freeze-button"
import { TokenDisplay } from "@/modules/rewards/components/presentation/token-display"
import { BadgeCard } from "@/modules/rewards/components/presentation/badge-card"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"
import { useProfile } from "../hooks/use-profile"

export function ProfileClient() {
  const { profile, isFetching } = useProfile()

  return (
    <div className="flex flex-col min-h-svh px-4 pt-8 pb-nav">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            {isFetching ? (
              <span className="w-5 h-5 rounded bg-primary/20 animate-pulse block" />
            ) : (
              (profile?.displayName[0] ?? "D").toUpperCase()
            )}
          </div>
          <div>
            {isFetching ? (
              <>
                <div className="h-4 w-28 rounded bg-muted animate-pulse mb-1" />
                <div className="h-3 w-36 rounded bg-muted animate-pulse" />
              </>
            ) : (
              <>
                <h1 className="font-bold">{profile?.displayName}</h1>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </>
            )}
          </div>
        </div>
        <SignOutButton />
      </div>

      <div className="space-y-4">
        <StreakBadge />
        <StreakFreezeButton />
        <TokenDisplay />
        <BadgeCard />
      </div>
    </div>
  )
}
