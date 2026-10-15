import { apiClient } from "@/lib/api-client"
import type { LeaderboardResponse } from "../types/responses"
import type { LeaderboardQuery } from "../types/schemas"

export const leaderboardService = {
  async getLeaderboard(query: LeaderboardQuery): Promise<LeaderboardResponse> {
    const params = new URLSearchParams({
      period: query.period,
      limit: String(query.limit),
    })
    return apiClient<LeaderboardResponse>(`/api/leaderboard?${params}`)
  },
}
