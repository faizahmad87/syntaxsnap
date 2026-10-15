import { NextResponse } from "next/server"
import { ZodError } from "zod"
import type { ErrorResponse } from "@/types/api-response"

export function unauthorizedResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { status: 401, message: "Unauthorized" },
    { status: 401 },
  )
}

export function notFoundResponse(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json({ status: 404, message }, { status: 404 })
}

export function badRequestResponse(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json({ status: 400, message }, { status: 400 })
}

export function conflictResponse(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json({ status: 409, message }, { status: 409 })
}

export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { status: 400, message: error.issues[0].message },
      { status: 400 },
    )
  }
  console.error("[API Error]", error)
  return NextResponse.json(
    { status: 500, message: "Internal server error" },
    { status: 500 },
  )
}
