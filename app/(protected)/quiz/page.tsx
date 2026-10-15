import { notFound, redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/db"
import { questions, dailySessions, streaks, tokenLedger } from "@/db/schema"
import { eq, and, inArray, sql as drizzleSql } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { format } from "date-fns"
import { z } from "zod"
import { QuizSession } from "@/modules/quiz/components/widgets/quiz-session"
import type { QuizQuestion, AnswerOption, Language } from "@/modules/quiz/types/question"

const querySchema = z.object({
  lang: z.enum(["javascript", "python"]),
})

interface QuizPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = await searchParams
  const parsed = querySchema.safeParse({ lang: params.lang })
  if (!parsed.success) notFound()

  const language = parsed.data.lang
  const user = await getAuthenticatedUser()
  if (!user) notFound()

  const today = format(new Date(), "yyyy-MM-dd")

  // Fetch questions, streak, and token balance in parallel
  const [existingSession, streak, tokenResult] = await Promise.all([
    db.query.dailySessions.findFirst({
      where: (ds, { and: a, eq: e }) =>
        a(e(ds.userId, user.id), e(ds.date, today), e(ds.language, language)),
    }),
    db.query.streaks.findFirst({
      where: eq(streaks.userId, user.id),
    }),
    db
      .select({ total: drizzleSql<number>`coalesce(sum(${tokenLedger.amount}), 0)` })
      .from(tokenLedger)
      .where(eq(tokenLedger.userId, user.id)),
  ])

  if (existingSession?.completed) redirect("/")

  let questionIds: string[]

  if (existingSession) {
    questionIds = existingSession.questionIds
  } else {
    const rows = await db.execute(
      sql`SELECT question_id FROM pick_daily_questions(${user.id}::uuid, ${language}::language_type, 5)`,
    )
    questionIds = (rows as unknown as Array<{ question_id: string }>).map(
      (r) => r.question_id,
    )

    if (questionIds.length === 0) notFound()

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

  const questionMap = new Map(
    dbQuestions.map((q) => [
      q.id,
      {
        id: q.id,
        language: q.language as Language,
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: q.options as AnswerOption[],
      } satisfies QuizQuestion,
    ]),
  )

  const orderedQuestions = questionIds
    .map((id) => questionMap.get(id))
    .filter((q): q is QuizQuestion => q !== undefined)

  const totalTokens = Number(tokenResult[0]?.total ?? 0)
  const currentStreak = streak?.currentCount ?? 0

  return (
    <QuizSession
      questions={orderedQuestions}
      language={language}
      initialStreak={currentStreak}
      initialTokens={totalTokens}
    />
  )
}
