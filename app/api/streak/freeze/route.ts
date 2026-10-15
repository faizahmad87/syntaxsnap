import { handleUseStreakFreeze } from "@/modules/streak/handlers/streak-handlers"

export async function POST() {
  return handleUseStreakFreeze()
}
