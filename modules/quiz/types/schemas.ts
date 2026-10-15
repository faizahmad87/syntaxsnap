import { z } from "zod"

export const languageSchema = z.enum(["javascript", "python"])

export type LanguageInput = z.infer<typeof languageSchema>

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionId: z.string().min(1),
  language: languageSchema,
})

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>

export const dailyQuestionsQuerySchema = z.object({
  language: languageSchema,
})

export type DailyQuestionsQuery = z.infer<typeof dailyQuestionsQuerySchema>
