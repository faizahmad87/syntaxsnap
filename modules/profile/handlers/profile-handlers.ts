import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import { handleApiError, unauthorizedResponse } from "@/lib/api-utils"
import type { ProfileData } from "../types/profile"
import type { ProfileResponse } from "../types/responses"

export async function handleGetProfile(): Promise<NextResponse<ProfileResponse>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<ProfileResponse>

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    })

    const data: ProfileData = {
      displayName: profile?.displayName ?? user.email?.split("@")[0] ?? "Developer",
      email: user.email ?? "",
      avatarUrl: profile?.avatarUrl ?? null,
    }

    return NextResponse.json({ status: 200, message: "ok", data })
  } catch (error) {
    return handleApiError(error) as NextResponse<ProfileResponse>
  }
}
