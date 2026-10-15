"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDailyQuestions } from "../../hooks/use-daily-questions"
import { useStreak } from "@/modules/streak/hooks/use-streak"
import { useRewards } from "@/modules/rewards/hooks/use-rewards"
import { QuizSession } from "./quiz-session"
import type { Language } from "../../types/question"

interface QuizClientProps {
  language: Language
}

export function QuizClient({ language }: QuizClientProps) {
  const router = useRouter()
  const { questions, answeredCount, isFetching: isFetchingQuestions } = useDailyQuestions({ language })
  const { streak, isFetching: isFetchingStreak } = useStreak()
  const { rewards, isFetching: isFetchingRewards } = useRewards()

  const isLoading = isFetchingQuestions || isFetchingStreak || isFetchingRewards

  useEffect(() => {
    if (!isLoading && questions.length === 0) {
      router.replace("/")
    }
  }, [isLoading, questions.length, router])

  if (isLoading || questions.length === 0) {
    return (
      <div className="flex flex-col min-h-svh px-4 pt-4 space-y-4 animate-pulse">
        <div className="h-12 rounded-2xl bg-muted" />
        <div className="h-2 rounded-full bg-muted" />
        <div className="h-40 rounded-2xl bg-muted" />
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <QuizSession
      questions={questions}
      language={language}
      initialStreak={streak?.currentCount ?? 0}
      initialTokens={rewards?.totalTokens ?? 0}
      initialIndex={answeredCount}
    />
  )
}
