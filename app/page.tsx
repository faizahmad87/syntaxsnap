export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/auth"
import { db } from "@/db"
import { streaks, dailySessions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { format } from "date-fns"
import { HomeClient } from "@/modules/home/components/home-client"
import type { Language } from "@/modules/quiz/types/question"

export default async function HomePage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/login")

  const today = format(new Date(), "yyyy-MM-dd")

  const [streak, todaySessions, lastSession] = await Promise.all([
    db.query.streaks.findFirst({ where: eq(streaks.userId, user.id) }),
    db.query.dailySessions.findMany({
      where: (ds, { and: a, eq: e }) => a(e(ds.userId, user.id), e(ds.date, today)),
    }),
    db.query.dailySessions.findFirst({
      where: eq(dailySessions.userId, user.id),
      orderBy: (ds, { desc: d }) => [d(ds.startedAt)],
    }),
  ])

  // Resume any in-progress session from today
  const incompleteSession = todaySessions.find((s) => !s.completed)
  if (incompleteSession) redirect(`/quiz?lang=${incompleteSession.language}`)

  const completedLanguages = todaySessions
    .filter((s) => s.completed)
    .map((s) => s.language as Language)

  // Auto-start last practiced language if not yet done today
  const defaultLanguage = lastSession?.language as Language | undefined
  if (defaultLanguage && !completedLanguages.includes(defaultLanguage)) {
    redirect(`/quiz?lang=${defaultLanguage}`)
  }

  const isActiveToday = streak?.lastActivityDate === today

  return (
    <HomeClient
      currentStreak={streak?.currentCount ?? 0}
      longestStreak={streak?.longestCount ?? 0}
      isActiveToday={isActiveToday}
      completedLanguages={completedLanguages}
    />
  )
}
