"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Streak } from "../types/streak"
import type { StreakResponse } from "../types/responses"

interface UseStreakResult {
  streak: Streak | null
  isFetching: boolean
  isUsingFreeze: boolean
  error: Error | null
  useFreeze: () => Promise<void>
  refetch: () => Promise<void>
}

export function useStreak(): UseStreakResult {
  const [streak, setStreak] = useState<Streak | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [isUsingFreeze, setIsUsingFreeze] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchStreak = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await apiClient<StreakResponse>("/api/streak")
      setStreak(response.data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch streak"),
      )
    } finally {
      setIsFetching(false)
    }
  }

  const useFreeze = async () => {
    try {
      setIsUsingFreeze(true)
      setError(null)
      const response = await apiClient<StreakResponse>("/api/streak/freeze", { method: "POST" })
      setStreak(response.data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to use streak freeze"),
      )
    } finally {
      setIsUsingFreeze(false)
    }
  }

  useEffect(() => {
    fetchStreak()
  }, [])

  return {
    streak,
    isFetching,
    isUsingFreeze,
    error,
    useFreeze,
    refetch: fetchStreak,
  }
}
