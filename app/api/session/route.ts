import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { format } from "date-fns"
import { db } from "@/db"
import { dailySessions, answers, tokenLedger } from "@/db/schema"
import { getAuthenticatedUser } from "@/lib/auth"
import { unauthorizedResponse, badRequestResponse } from "@/lib/api-utils"
import { dailyQuestionsQuerySchema } from "@/modules/quiz/types/schemas"
import type { ApiResponse } from "@/types/api-response"

// DELETE /api/session?language=python
// Abandons an incomplete session — deletes the session row, its answers, and token entries.
// No-op if the session is already completed.
export async function DELETE(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse() as NextResponse<ApiResponse<null>>

    const raw = new URL(req.url).searchParams.get("language")
    const parsed = dailyQuestionsQuerySchema.safeParse({ language: raw })
    if (!parsed.success) return badRequestResponse("invalid language") as NextResponse<ApiResponse<null>>
    const { language } = parsed.data

    const today = format(new Date(), "yyyy-MM-dd")

    const session = await db.query.dailySessions.findFirst({
      where: (ds, { and: a, eq: e }) =>
        a(e(ds.userId, user.id), e(ds.date, today), e(ds.language, language)),
    })

    if (!session || session.completed) {
      return NextResponse.json({ status: 200, message: "ok", data: null })
    }

    await db.transaction(async (tx) => {
      await tx.delete(tokenLedger).where(
        and(eq(tokenLedger.sessionId, session.id), eq(tokenLedger.userId, user.id)),
      )
      await tx.delete(answers).where(
        and(eq(answers.sessionId, session.id), eq(answers.userId, user.id)),
      )
      await tx.delete(dailySessions).where(
        and(eq(dailySessions.id, session.id), eq(dailySessions.userId, user.id)),
      )
    })

    return NextResponse.json({ status: 200, message: "ok", data: null })
  } catch (error) {
    console.error("DELETE /api/session error:", error)
    return NextResponse.json({ status: 500, message: "Internal server error", data: null }, { status: 500 })
  }
}
