import { handleGetStreak } from "@/modules/streak/handlers/streak-handlers"

export async function GET() {
  return handleGetStreak()
}
