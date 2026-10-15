"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { ProfileData } from "../types/profile"
import type { ProfileResponse } from "../types/responses"

interface UseProfileResult {
  profile: ProfileData | null
  isFetching: boolean
  error: Error | null
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true)
        setError(null)
        const response = await apiClient<ProfileResponse>("/api/profile")
        setProfile(response.data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load profile"))
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [])

  return { profile, isFetching, error }
}
