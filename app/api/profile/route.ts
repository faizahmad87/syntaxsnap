import { handleGetProfile } from "@/modules/profile/handlers/profile-handlers"

export async function GET() {
  return handleGetProfile()
}
