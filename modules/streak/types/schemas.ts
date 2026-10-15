import { z } from "zod"

export const useStreakFreezeSchema = z.object({
  userId: z.string().uuid(),
})

export type UseStreakFreezeInput = z.infer<typeof useStreakFreezeSchema>
