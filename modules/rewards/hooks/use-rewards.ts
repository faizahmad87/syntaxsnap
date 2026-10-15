"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { UserRewards } from "../types/reward"
import type { UserRewardsResponse } from "../types/responses"

interface UseRewardsResult {
  rewards: UserRewards | null
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useRewards(): UseRewardsResult {
  const [rewards, setRewards] = useState<UserRewards | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRewards = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await apiClient<UserRewardsResponse>("/api/rewards")
      setRewards(response.data)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch rewards"),
      )
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  return { rewards, isFetching, error, refetch: fetchRewards }
}
