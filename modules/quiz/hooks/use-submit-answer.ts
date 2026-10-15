"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { AnswerResult } from "../types/question"
import type { AnswerResponse } from "../types/responses"
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
      const response = await apiClient<AnswerResponse>("/api/answers", {
        method: "POST",
        body: JSON.stringify(data),
      })
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
