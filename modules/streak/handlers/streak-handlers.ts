import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { format, startOfISOWeek, parseISO } from "date-fns"
import { db } from "@/db"
import { streaks, tokenLedger } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import {
  handleApiError,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
} from "@/lib/api-utils"
import type { Streak } from "../types/streak"
import type { StreakResponse } from "../types/responses"

function toStreakResponse(row: typeof streaks.$inferSelect): Streak {
  return {
    id: row.id,
    userId: row.userId,
    currentCount: row.currentCount,
    longestCount: row.longestCount,
    lastActivityDate: row.lastActivityDate,
    freezesAvailable: row.freezesAvailable,
    freezesUsedThisWeek: row.freezesUsedThisWeek,
    updatedAt: row.updatedAt.toISOString(),
  }
}

// ---------------------------------------------------------------------------
// GET /api/streak
// ---------------------------------------------------------------------------

export async function handleGetStreak(): Promise<NextResponse<StreakResponse>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<StreakResponse>

    const row = await db.query.streaks.findFirst({
      where: (s, { eq: e }) => e(s.userId, user.id),
    })

    if (!row) return notFoundResponse("Streak not found.") as NextResponse<StreakResponse>

    return NextResponse.json({
      status: 200,
      message: "ok",
      data: toStreakResponse(row),
    })
  } catch (error) {
    return handleApiError(error) as NextResponse<StreakResponse>
  }
}

// ---------------------------------------------------------------------------
// POST /api/streak/freeze
// Uses the weekly free freeze to protect a streak.
// ---------------------------------------------------------------------------

export async function handleUseStreakFreeze(): Promise<NextResponse<StreakResponse>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<StreakResponse>

    const row = await db.query.streaks.findFirst({
      where: (s, { eq: e }) => e(s.userId, user.id),
    })

    if (!row) return notFoundResponse("Streak not found.") as NextResponse<StreakResponse>

    if (row.freezesAvailable <= 0) {
      return badRequestResponse("No streak freezes available this week.") as NextResponse<StreakResponse>
    }

    const today = format(new Date(), "yyyy-MM-dd")
    const currentWeekStart = format(
      startOfISOWeek(parseISO(today)),
      "yyyy-MM-dd",
    )

    const isNewWeek = row.weekStart !== currentWeekStart
    const newFreezesAvailable = isNewWeek ? 0 : row.freezesAvailable - 1
    const newFreezesUsed = isNewWeek ? 1 : row.freezesUsedThisWeek + 1

    const [updated] = await db
      .update(streaks)
      .set({
        freezesAvailable: newFreezesAvailable,
        freezesUsedThisWeek: newFreezesUsed,
        weekStart: currentWeekStart,
        lastActivityDate: today,
        updatedAt: new Date(),
      })
      .where(eq(streaks.userId, user.id))
      .returning()

    await db.insert(tokenLedger).values({
      userId: user.id,
      amount: -50,
      reason: "freeze_purchase",
    })

    return NextResponse.json({
      status: 200,
      message: "Streak freeze applied.",
      data: toStreakResponse(updated),
    })
  } catch (error) {
    return handleApiError(error) as NextResponse<StreakResponse>
  }
}
