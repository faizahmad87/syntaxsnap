import type { ApiResponse } from "@/types/api-response"
import type { QuizQuestion, AnswerResult } from "./question"

export type QuestionsData = {
  questions: QuizQuestion[]
  answeredCount: number
}

export type QuestionsResponse = ApiResponse<QuestionsData>

export type AnswerResponse = ApiResponse<AnswerResult>
