"use client"

import { useState, useEffect } from "react"
import { streakService } from "../services/streak-service"
import type { Streak } from "../types/streak"

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
      const response = await streakService.getStreak()
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
      const response = await streakService.useFreeze()
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
