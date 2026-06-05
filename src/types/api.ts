import type { QueueToken, QueueSummary, Shop, ServiceId } from './queue'

// Generic API response envelope — every backend response wraps in this shape
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code: string
  status: number
}

// --- Request types ---

export interface TakeTokenRequest {
  serviceId: ServiceId
  customerName?: string
}

export interface UpdateShopRequest {
  name?: string
  tagline?: string
  isOpen?: boolean
  averageServiceTime?: number
}

// --- Response types ---

export type TakeTokenResponse = ApiResponse<{
  token: QueueToken
}>

export type GetQueueSummaryResponse = ApiResponse<QueueSummary>

export type GetTokenResponse = ApiResponse<QueueToken>

export type GetShopResponse = ApiResponse<Shop>

export type CallNextResponse = ApiResponse<{
  called: QueueToken
  stillWaiting: number
}>

export type CompleteServingResponse = ApiResponse<{
  completed: QueueToken
  next: QueueToken | null
}>
