import { NextResponse } from "next/server"
import { eq, inArray, sql } from "drizzle-orm"
import { format } from "date-fns"
import { db } from "@/db"
import { streaks, dailySessions, answers } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import { handleApiError, unauthorizedResponse } from "@/lib/api-utils"
import type { Language } from "@/modules/quiz/types/question"
import type { HomeData } from "../types/home"
import type { HomeDataResponse } from "../types/responses"

export async function handleGetHomeData(): Promise<NextResponse<HomeDataResponse>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<HomeDataResponse>

    const today = format(new Date(), "yyyy-MM-dd")

    const [streak, todaySessions] = await Promise.all([
      db.query.streaks.findFirst({ where: eq(streaks.userId, user.id) }),
      db.query.dailySessions.findMany({
        where: (ds, { and: a, eq: e }) => a(e(ds.userId, user.id), e(ds.date, today)),
      }),
    ])

    const completedLanguages = todaySessions
      .filter((s) => s.completed)
      .map((s) => s.language as Language)

    const incompleteSessions = todaySessions.filter((s) => !s.completed)

    const answerCounts =
      incompleteSessions.length > 0
        ? await db
            .select({
              sessionId: answers.sessionId,
              count: sql<number>`cast(count(*) as int)`,
            })
            .from(answers)
            .where(inArray(answers.sessionId, incompleteSessions.map((s) => s.id)))
            .groupBy(answers.sessionId)
        : []

    const answerCountMap = new Map(answerCounts.map((r) => [r.sessionId, r.count]))

    const sessionProgress = Object.fromEntries(
      incompleteSessions.map((s) => [
        s.language as Language,
        { answered: answerCountMap.get(s.id) ?? 0, total: s.questionIds.length },
      ]),
    ) as Partial<Record<Language, { answered: number; total: number }>>

    const homeData: HomeData = {
      currentStreak: streak?.currentCount ?? 0,
      longestStreak: streak?.longestCount ?? 0,
      isActiveToday: streak?.lastActivityDate === today,
      completedLanguages,
      sessionProgress,
    }

    return NextResponse.json({ status: 200, message: "ok", data: homeData })
  } catch (error) {
    return handleApiError(error) as NextResponse<HomeDataResponse>
  }
}
