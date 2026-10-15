import type { NextRequest } from "next/server"
import { handleSubmitAnswer } from "@/modules/quiz/handlers/quiz-handlers"

export async function POST(req: NextRequest) {
  return handleSubmitAnswer(req)
}
