import { handleGetHomeData } from "@/modules/home/handlers/home-handlers"

export async function GET() {
  return handleGetHomeData()
}
