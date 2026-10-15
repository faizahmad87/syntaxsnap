"use client"

import { useState } from "react"
import { quizService } from "../services/quiz-service"
import type { AnswerResult } from "../types/question"
import type { SubmitAnswerInput } from "../types/schemas"

interface UseSubmitAnswerResult {
  submit: (data: SubmitAnswerInput) => Promise<AnswerResult | null>
  isSubmitting: boolean
  error: Error | null
}

export function useSubmitAnswer(): UseSubmitAnswerResult {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = async (data: SubmitAnswerInput): Promise<AnswerResult | null> => {
    try {
      setIsSubmitting(true)
      setError(null)
      const response = await quizService.submitAnswer(data)
      return response.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit answer"
      setError(new Error(message))
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, error }
}
