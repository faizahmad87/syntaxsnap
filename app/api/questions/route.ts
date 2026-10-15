import type { NextRequest } from "next/server"
import { handleGetDailyQuestions } from "@/modules/quiz/handlers/quiz-handlers"

export async function GET(req: NextRequest) {
  return handleGetDailyQuestions(req)
}
