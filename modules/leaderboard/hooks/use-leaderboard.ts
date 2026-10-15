"use client"

import { useState, useEffect } from "react"
import { leaderboardService } from "../services/leaderboard-service"
import type { Leaderboard, LeaderboardPeriod } from "../types/leaderboard"

interface UseLeaderboardOptions {
  period?: LeaderboardPeriod
  limit?: number
}

interface UseLeaderboardResult {
  leaderboard: Leaderboard | null
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useLeaderboard({
  period = "weekly",
  limit = 20,
}: UseLeaderboardOptions = {}): UseLeaderboardResult {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLeaderboard = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await leaderboardService.getLeaderboard({ period, limit })
      setLeaderboard(response.data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch leaderboard"),
      )
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [period, limit])

  return { leaderboard, isFetching, error, refetch: fetchLeaderboard }
}
