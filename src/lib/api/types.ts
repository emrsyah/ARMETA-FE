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

// Pagination types
export interface PaginationInfo {
  currentPage: number
  limit: number
  totalData: number
  totalPage: number
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  status: boolean
  message: string
  pagination?: PaginationInfo
  data: T[]
}

