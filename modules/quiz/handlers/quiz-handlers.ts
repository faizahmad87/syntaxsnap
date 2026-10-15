import { NextRequest, NextResponse } from "next/server"
import { eq, and, inArray } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { format, differenceInCalendarDays, parseISO, startOfISOWeek } from "date-fns"
import { db } from "@/db"
import {
  questions,
  dailySessions,
  answers,
  streaks,
  tokenLedger,
  badges,
} from "@/db/schema"
import type { Streak as DbStreak, Badge as DbBadge } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import {
  handleApiError,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  conflictResponse,
} from "@/lib/api-utils"
import { dailyQuestionsQuerySchema, submitAnswerSchema } from "../types/schemas"
import type { QuizQuestion, AnswerOption, AnswerResult } from "../types/question"
import type { ApiResponse } from "@/types/api-response"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type StreakUpdatePayload = {
  bonusTokens: number
  newBadgeTypes: Array<DbBadge["type"]>
  updates: Partial<DbStreak>
}

function computeStreakUpdate(
  streak: DbStreak,
  today: string,
): StreakUpdatePayload {
  const lastDate = streak.lastActivityDate

  if (lastDate === today) {
    return { bonusTokens: 0, newBadgeTypes: [], updates: {} }
  }

  let newCount: number
  if (lastDate === null) {
    newCount = 1
  } else {
    const daysDiff = differenceInCalendarDays(parseISO(today), parseISO(lastDate))
    newCount = daysDiff === 1 ? streak.currentCount + 1 : 1
  }

  const longestCount = Math.max(streak.longestCount, newCount)

  let bonusTokens = 0
  const newBadgeTypes: Array<DbBadge["type"]> = []

  if (newCount === 3) bonusTokens += 50
  if (newCount === 7) { bonusTokens += 100; newBadgeTypes.push("week_warrior") }
  if (newCount === 30) { bonusTokens += 200; newBadgeTypes.push("iron_dev") }

  const currentWeekStart = format(startOfISOWeek(parseISO(today)), "yyyy-MM-dd")
  const freezeReset =
    streak.weekStart !== currentWeekStart
      ? { freezesAvailable: 1, freezesUsedThisWeek: 0, weekStart: currentWeekStart }
      : {}

  return {
    bonusTokens,
    newBadgeTypes,
    updates: {
      currentCount: newCount,
      longestCount,
      lastActivityDate: today,
      updatedAt: new Date(),
      ...freezeReset,
    },
  }
}

// ---------------------------------------------------------------------------
// GET /api/questions?language=...
// ---------------------------------------------------------------------------

export async function handleGetDailyQuestions(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<{ questions: QuizQuestion[]; answeredCount: number }>>> {
  type R = NextResponse<ApiResponse<{ questions: QuizQuestion[]; answeredCount: number }>>
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as R

    const { searchParams } = new URL(req.url)
    const { language } = dailyQuestionsQuerySchema.parse({
      language: searchParams.get("language"),
    })

    const today = format(new Date(), "yyyy-MM-dd")

    const existingSession = await db.query.dailySessions.findFirst({
      where: (ds, { and: a, eq: e }) =>
        a(e(ds.userId, user.id), e(ds.date, today), e(ds.language, language)),
    })

    let questionIds: string[]

    if (existingSession?.completed) {
      return NextResponse.json({ status: 200, message: "ok", data: { questions: [], answeredCount: 0 } })
    }

    let answeredCount = 0

    if (existingSession) {
      questionIds = existingSession.questionIds
      const countResult = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(answers)
        .where(eq(answers.sessionId, existingSession.id))
      answeredCount = countResult[0]?.count ?? 0
    } else {
      const rows = await db.execute(
        sql`SELECT question_id FROM pick_daily_questions(${user.id}::uuid, ${language}::language_type, 5)`,
      )
      questionIds = (rows as unknown as Array<{ question_id: string }>).map(
        (r) => r.question_id,
      )

      if (questionIds.length === 0) {
        return notFoundResponse("No questions available for this language.") as R
      }

      await db.insert(dailySessions).values({
        userId: user.id,
        date: today,
        language,
        questionIds,
      })
    }

    const dbQuestions = await db
      .select()
      .from(questions)
      .where(inArray(questions.id, questionIds))

    // Map to client-safe shape — correctOptionId never leaves the server
    const questionMap = new Map(
      dbQuestions.map((q) => [
        q.id,
        {
          id: q.id,
          language: q.language,
          difficulty: q.difficulty,
          prompt: q.prompt,
          options: q.options as AnswerOption[],
        } satisfies QuizQuestion,
      ]),
    )

    // Preserve the order picked by pick_daily_questions
    const orderedQuestions = questionIds
      .map((id) => questionMap.get(id))
      .filter((q): q is QuizQuestion => q !== undefined)

    return NextResponse.json({ status: 200, message: "ok", data: { questions: orderedQuestions, answeredCount } })
  } catch (error) {
    return handleApiError(error) as R
  }
}

// ---------------------------------------------------------------------------
// POST /api/answers
// ---------------------------------------------------------------------------

export async function handleSubmitAnswer(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<AnswerResult | null>>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<ApiResponse<AnswerResult | null>>

    const json = await req.json()
    const { questionId, selectedOptionId, language } = submitAnswerSchema.parse(json)

    const today = format(new Date(), "yyyy-MM-dd")

    const session = await db.query.dailySessions.findFirst({
      where: (ds, { and: a, eq: e }) =>
        a(e(ds.userId, user.id), e(ds.date, today), e(ds.language, language)),
    })

    if (!session) {
      return notFoundResponse("No active session for today. Start a quiz first.") as NextResponse<ApiResponse<AnswerResult | null>>
    }

    if (!session.questionIds.includes(questionId)) {
      return badRequestResponse("Question is not part of today's session.") as NextResponse<ApiResponse<AnswerResult | null>>
    }

    const existingAnswer = await db.query.answers.findFirst({
      where: (a, { and: an, eq: e }) =>
        an(e(a.sessionId, session.id), e(a.questionId, questionId)),
    })

    if (existingAnswer) {
      return conflictResponse("Question already answered.") as NextResponse<ApiResponse<AnswerResult | null>>
    }

    const question = await db.query.questions.findFirst({
      where: (q, { eq: e }) => e(q.id, questionId),
    })

    if (!question) {
      return notFoundResponse("Question not found.") as NextResponse<ApiResponse<AnswerResult | null>>
    }

    const isCorrect = selectedOptionId === question.correctOptionId

    const priorAnswers = await db.query.answers.findMany({
      where: (a, { eq: e }) => e(a.sessionId, session.id),
    })
    const isFirstAnswer = priorAnswers.length === 0
    const isLastQuestion = priorAnswers.length + 1 === session.questionIds.length
    const isAllCorrect =
      isLastQuestion &&
      isCorrect &&
      priorAnswers.every((a) => a.isCorrect)

    let totalTokensEarned = isCorrect ? 10 : 0
    if (isLastQuestion) totalTokensEarned += 20

    await db.transaction(async (tx) => {
      await tx.insert(answers).values({
        userId: user.id,
        sessionId: session.id,
        questionId,
        selectedOptionId,
        isCorrect,
      })

      if (isCorrect) {
        await tx.insert(tokenLedger).values({
          userId: user.id,
          amount: 10,
          reason: "correct_answer",
          sessionId: session.id,
        })
      }

      // Mark streak on the first answer of the session
      if (isFirstAnswer) {
        const currentStreak = await tx.query.streaks.findFirst({
          where: (s, { eq: e }) => e(s.userId, user.id),
        })

        if (currentStreak) {
          const { bonusTokens, newBadgeTypes, updates } = computeStreakUpdate(
            currentStreak,
            today,
          )

          if (Object.keys(updates).length > 0) {
            await tx
              .update(streaks)
              .set(updates)
              .where(eq(streaks.userId, user.id))
          }

          if (bonusTokens > 0) {
            totalTokensEarned += bonusTokens
            await tx.insert(tokenLedger).values({
              userId: user.id,
              amount: bonusTokens,
              reason: "streak_bonus",
              sessionId: session.id,
            })
          }

          for (const badgeType of newBadgeTypes) {
            await tx
              .insert(badges)
              .values({ userId: user.id, type: badgeType })
              .onConflictDoNothing()
          }
        }
      }

      if (isLastQuestion) {
        await tx
          .update(dailySessions)
          .set({ completed: true, completedAt: new Date() })
          .where(eq(dailySessions.id, session.id))

        await tx.insert(tokenLedger).values({
          userId: user.id,
          amount: 20,
          reason: "daily_completion_bonus",
          sessionId: session.id,
        })

        if (isAllCorrect) {
          await tx
            .insert(badges)
            .values({ userId: user.id, type: "first_perfect_day" })
            .onConflictDoNothing()
        }
      }
    })

    const result: AnswerResult = {
      questionId,
      selectedOptionId,
      isCorrect,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      tokensEarned: totalTokensEarned,
    }

    return NextResponse.json({ status: 200, message: "ok", data: result })
  } catch (error) {
    return handleApiError(error) as NextResponse<ApiResponse<AnswerResult | null>>
  }
}
