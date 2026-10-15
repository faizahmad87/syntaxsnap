import { apiClient } from "@/lib/api-client"
import type { QuestionsResponse, AnswerResponse } from "../types/responses"
import type { SubmitAnswerInput, LanguageInput } from "../types/schemas"

export const quizService = {
  async getDailyQuestions(language: LanguageInput): Promise<QuestionsResponse> {
    return apiClient<QuestionsResponse>(
      `/api/questions?language=${language}`,
    )
  },

  async submitAnswer(data: SubmitAnswerInput): Promise<AnswerResponse> {
    return apiClient<AnswerResponse>("/api/answers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}
