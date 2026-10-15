import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { StreakBadge } from "@/modules/streak/components/presentation/streak-badge"
import { StreakFreezeButton } from "@/modules/streak/components/presentation/streak-freeze-button"
import { TokenDisplay } from "@/modules/rewards/components/presentation/token-display"
import { BadgeCard } from "@/modules/rewards/components/presentation/badge-card"
import { SignOutButton } from "@/modules/auth/components/sign-out-button"

export default async function ProfilePage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  })

  const displayName =
    profile?.displayName ?? user.email?.split("@")[0] ?? "Developer"

  return (
    <div className="flex flex-col min-h-svh px-4 pt-8 pb-nav">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary">
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold">{displayName}</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
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
