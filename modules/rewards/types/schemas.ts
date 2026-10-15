import { z } from "zod"

export const awardTokensSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  reason: z.string().min(1),
})

export type AwardTokensInput = z.infer<typeof awardTokensSchema>
