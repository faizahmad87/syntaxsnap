import type { ApiResponse } from "@/types/api-response"
import type { Streak, StreakUpdateResult } from "./streak"

export type StreakResponse = ApiResponse<Streak>

export type StreakUpdateResponse = ApiResponse<StreakUpdateResult>
