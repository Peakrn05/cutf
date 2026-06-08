import type { AvailableSlots, SlotReservation } from '@/types/slot'
import type { ServiceId } from '@/types/queue'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function fetchAvailableSlots(date: string): Promise<AvailableSlots> {
  const res = await apiFetch<ApiResponse<AvailableSlots>>(
    `${API_URL}/api/slots/available?date=${date}`,
  )
  return res.data
}

export async function reserveSlot(payload: {
  date: string
  timeSlot: string
  serviceId: ServiceId
  customerName: string
  customerPhone?: string
}): Promise<SlotReservation> {
  const res = await apiFetch<ApiResponse<SlotReservation>>(
    `${API_URL}/api/slots/reserve`,
    'POST',
    payload,
  )
  return res.data
}

export async function fetchReservation(id: string): Promise<SlotReservation> {
  const res = await apiFetch<ApiResponse<SlotReservation>>(
    `${API_URL}/api/slots/${id}`,
  )
  return res.data
}

export async function cancelReservation(id: string): Promise<void> {
  await apiFetch(`${API_URL}/api/slots/${id}/cancel`, 'PATCH')
}
