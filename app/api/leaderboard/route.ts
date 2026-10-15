import type { NextRequest } from "next/server"
import { handleGetLeaderboard } from "@/modules/leaderboard/handlers/leaderboard-handlers"

export async function GET(req: NextRequest) {
  return handleGetLeaderboard(req)
}
