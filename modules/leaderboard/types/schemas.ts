import { z } from "zod"

export const leaderboardQuerySchema = z.object({
  period: z.enum(["weekly", "all_time"]).default("weekly"),
  limit: z.number().int().min(1).max(100).default(20),
})

export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>
