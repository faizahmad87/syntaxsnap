import { handleGetUserRewards } from "@/modules/rewards/handlers/rewards-handlers"

export async function GET() {
  return handleGetUserRewards()
}
