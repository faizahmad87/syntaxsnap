export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface ErrorResponse {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export interface DeleteResponse {
  status: number
  message: string
}
