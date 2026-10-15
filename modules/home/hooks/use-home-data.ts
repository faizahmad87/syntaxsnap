"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { HomeData } from "../types/home"
import type { HomeDataResponse } from "../types/responses"

interface UseHomeDataResult {
  data: HomeData | null
  isFetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useHomeData(): UseHomeDataResult {
  const [data, setData] = useState<HomeData | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsFetching(true)
      setError(null)
      const response = await apiClient<HomeDataResponse>("/api/home")
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load home data"))
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isFetching, error, refetch: fetchData }
}
