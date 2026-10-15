import { apiClient } from "@/lib/api-client"
import type { StreakResponse } from "../types/responses"

export const streakService = {
  async getStreak(): Promise<StreakResponse> {
    return apiClient<StreakResponse>("/api/streak")
  },

  async useFreeze(): Promise<StreakResponse> {
    return apiClient<StreakResponse>("/api/streak/freeze", {
      method: "POST",
    })
  },
}
