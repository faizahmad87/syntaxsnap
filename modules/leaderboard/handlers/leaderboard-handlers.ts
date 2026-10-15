import { NextRequest, NextResponse } from "next/server"
import { eq, desc, sum, gte } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { format, startOfISOWeek } from "date-fns"
import { db } from "@/db"
import { tokenLedger, profiles, streaks } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import { handleApiError, unauthorizedResponse } from "@/lib/api-utils"
import { leaderboardQuerySchema } from "../types/schemas"
import type { Leaderboard, LeaderboardEntry } from "../types/leaderboard"
import type { LeaderboardResponse } from "../types/responses"

// ---------------------------------------------------------------------------
// GET /api/leaderboard?period=weekly&limit=20
// ---------------------------------------------------------------------------

export async function handleGetLeaderboard(
  req: NextRequest,
): Promise<NextResponse<LeaderboardResponse>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<LeaderboardResponse>

    const { searchParams } = new URL(req.url)
    const query = leaderboardQuerySchema.parse({
      period: searchParams.get("period") ?? "weekly",
      limit: Number(searchParams.get("limit") ?? 20),
    })

    const weekStart = format(startOfISOWeek(new Date()), "yyyy-MM-dd")
    const periodFilter =
      query.period === "weekly"
        ? gte(tokenLedger.createdAt, new Date(weekStart))
        : sql`true`

    const rows = await db
      .select({
        userId: tokenLedger.userId,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        tokens: sum(tokenLedger.amount),
        streakCount: streaks.currentCount,
      })
      .from(tokenLedger)
      .innerJoin(profiles, eq(tokenLedger.userId, profiles.id))
      .innerJoin(streaks, eq(tokenLedger.userId, streaks.userId))
      .where(periodFilter)
      .groupBy(
        tokenLedger.userId,
        profiles.displayName,
        profiles.avatarUrl,
        streaks.currentCount,
      )
      .orderBy(desc(sum(tokenLedger.amount)))
      .limit(query.limit)

    const entries: LeaderboardEntry[] = rows.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      tokens: Number(row.tokens ?? 0),
      streakCount: row.streakCount,
    }))

    const currentUserEntry =
      entries.find((e) => e.userId === user.id) ?? null

    const leaderboard: Leaderboard = {
      period: query.period,
      entries,
      currentUserEntry,
    }

    return NextResponse.json({ status: 200, message: "ok", data: leaderboard })
  } catch (error) {
    return handleApiError(error) as NextResponse<LeaderboardResponse>
  }
}
