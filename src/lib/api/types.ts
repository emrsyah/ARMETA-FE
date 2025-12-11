// Shared API Response Types

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface ApiSuccessResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  status: false
  message: string
}

// Pagination types (if needed in future)
export interface PaginatedResponse<T> {
  status: boolean
  message: string
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

