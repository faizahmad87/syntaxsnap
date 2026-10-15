"use client"

import { useState, useEffect } from "react"
import { quizService } from "../services/quiz-service"
import type { QuizQuestion } from "../types/question"
import type { LanguageInput } from "../types/schemas"

interface UseDailyQuestionsOptions {
  language: LanguageInput
  shouldFetch?: boolean
}

interface UseDailyQuestionsResult {
  questions: QuizQuestion[]
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useDailyQuestions({
  language,
  shouldFetch = true,
}: UseDailyQuestionsOptions): UseDailyQuestionsResult {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isFetching, setIsFetching] = useState(shouldFetch)
  const [error, setError] = useState<Error | null>(null)

  const fetchQuestions = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await quizService.getDailyQuestions(language)
      setQuestions(response.data)
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

  return { questions, isFetching, error, refetch: fetchQuestions }
}
