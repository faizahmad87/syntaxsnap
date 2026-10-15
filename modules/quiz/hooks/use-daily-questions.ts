"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { QuizQuestion } from "../types/question"
import type { QuestionsResponse } from "../types/responses"
import type { LanguageInput } from "../types/schemas"

interface UseDailyQuestionsOptions {
  language: LanguageInput
  shouldFetch?: boolean
}

interface UseDailyQuestionsResult {
  questions: QuizQuestion[]
  answeredCount: number
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDailyQuestions({
  language,
  shouldFetch = true,
}: UseDailyQuestionsOptions): UseDailyQuestionsResult {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answeredCount, setAnsweredCount] = useState(0)
  const [isFetching, setIsFetching] = useState(shouldFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetchQuestions = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await apiClient<QuestionsResponse>(`/api/questions?language=${language}`)
      setQuestions(response.data.questions)
      setAnsweredCount(response.data.answeredCount)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch questions"),
      )
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      fetchQuestions()
    }
  }, [language, shouldFetch])

  return { questions, answeredCount, isFetching, error, refetch: fetchQuestions }
}
