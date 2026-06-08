// Queue service — all data operations.
// Calls the NestJS backend API.

import type {
  QueueToken,
  Shop,
  QueueSummary,
  ServiceId,
} from '@/types/queue'
import { apiFetch } from '@/lib/api'
import type {
  ApiResponse,
  TakeTokenRequest,
  UpdateShopRequest,
} from '@/types/api'

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchShop(): Promise<Shop> {
  const res = await apiFetch<ApiResponse<Shop>>('/api/shop')
  return res.data
}

export async function updateShop(patch: UpdateShopRequest): Promise<Shop> {
  const res = await apiFetch<ApiResponse<Shop>>('/api/shop', 'PATCH', patch)
  return res.data
}

export async function fetchQueueSummary(): Promise<QueueSummary> {
  const res = await apiFetch<ApiResponse<QueueSummary>>('/api/queue/summary')
  return res.data
}

export async function fetchAllTokens(): Promise<QueueToken[]> {
  const res = await apiFetch<ApiResponse<QueueToken[]>>('/api/queue/tokens')
  return res.data
}

export async function fetchToken(tokenNumber: number): Promise<QueueToken | null> {
  const res = await apiFetch<ApiResponse<QueueToken | null>>(
    `/api/queue/tokens/${tokenNumber}`,
  )
  return res.data
}

export async function takeToken(
  serviceId: ServiceId,
  customerName?: string,
): Promise<QueueToken> {
  const body: TakeTokenRequest = { serviceId, customerName }
  const res = await apiFetch<ApiResponse<QueueToken>>('/api/queue/tokens', 'POST', body)
  return res.data
}

export async function cancelToken(tokenId: string): Promise<void> {
  await apiFetch(`/api/queue/tokens/${tokenId}/cancel`, 'PATCH')
}

export async function callNext(): Promise<QueueToken | null> {
  const res = await apiFetch<ApiResponse<{ called: QueueToken | null; stillWaiting: number }>>(
    '/api/queue/call-next',
    'POST',
  )
  return res.data.called
}

export async function completeServing(): Promise<void> {
  await apiFetch('/api/queue/complete', 'POST')
}

export async function skipToken(tokenId: string): Promise<void> {
  await apiFetch(`/api/queue/tokens/${tokenId}/skip`, 'PATCH')
}

export async function markNoShow(tokenId: string): Promise<void> {
  await skipToken(tokenId)
}
