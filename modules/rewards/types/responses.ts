import type { ApiResponse } from "@/types/api-response"
import type { UserRewards, Badge } from "./reward"

export type UserRewardsResponse = ApiResponse<UserRewards>

export type BadgeResponse = ApiResponse<Badge>
