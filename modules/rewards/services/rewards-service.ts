import { apiClient } from "@/lib/api-client"
import type { UserRewardsResponse } from "../types/responses"

export const rewardsService = {
  async getUserRewards(): Promise<UserRewardsResponse> {
    return apiClient<UserRewardsResponse>("/api/rewards")
  },
}
