import { NextResponse } from "next/server"
import { eq, sum } from "drizzle-orm"
import { db } from "@/db"
import { tokenLedger, badges } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import { handleApiError, unauthorizedResponse } from "@/lib/api-utils"
import type { UserRewards, Badge } from "../types/reward"
import type { UserRewardsResponse } from "../types/responses"

// ---------------------------------------------------------------------------
// GET /api/rewards
// ---------------------------------------------------------------------------

export async function handleGetUserRewards(): Promise<
  NextResponse<UserRewardsResponse>
> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<UserRewardsResponse>

    const [totalsRow, badgeRows] = await Promise.all([
      db
        .select({ total: sum(tokenLedger.amount) })
        .from(tokenLedger)
        .where(eq(tokenLedger.userId, user.id))
        .then((rows) => rows[0]),
      db.query.badges.findMany({
        where: (b, { eq: e }) => e(b.userId, user.id),
      }),
    ])

    const VALID_BADGE_TYPES: ReadonlySet<Badge["type"]> = new Set([
      "first_perfect_day",
      "week_warrior",
      "iron_dev",
    ])
    const userBadges: Badge[] = badgeRows
      .filter((b): b is typeof b & { type: Badge["type"] } =>
        VALID_BADGE_TYPES.has(b.type as Badge["type"]),
      )
      .map((b) => ({
        id: b.id,
        userId: b.userId,
        type: b.type,
        earnedAt: b.earnedAt.toISOString(),
      }))

    const rewards: UserRewards = {
      userId: user.id,
      totalTokens: Number(totalsRow?.total ?? 0),
      badges: userBadges,
    }

    return NextResponse.json({ status: 200, message: "ok", data: rewards })
  } catch (error) {
    return handleApiError(error) as NextResponse<UserRewardsResponse>
  }
}
