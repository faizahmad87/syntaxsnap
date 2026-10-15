import type { ApiResponse } from "@/types/api-response"
import type { QuizQuestion, AnswerResult } from "./question"

export type QuestionsResponse = ApiResponse<QuizQuestion[]>

export type AnswerResponse = ApiResponse<AnswerResult>
