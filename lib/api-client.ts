import type { ErrorResponse } from "@/types/api-response"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse
    throw new ApiError(response.status, error.message, error.errors)
  }

  return response.json() as Promise<T>
}
