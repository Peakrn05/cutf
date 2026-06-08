import type { AvailableSlots, SlotReservation } from '@/types/slot'
import type { ServiceId } from '@/types/queue'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types/api'

export async function fetchAvailableSlots(date: string): Promise<AvailableSlots> {
  const res = await apiFetch<ApiResponse<AvailableSlots>>(
    `/api/slots/available?date=${encodeURIComponent(date)}`,
  )
  return res?.data ?? { date, slots: [] }
}

export async function reserveSlot(payload: {
  date: string
  timeSlot: string
  serviceId: ServiceId
  customerName: string
  customerPhone?: string
}): Promise<SlotReservation> {
  const res = await apiFetch<ApiResponse<SlotReservation>>('/api/slots/reserve', 'POST', payload)
  return res.data
}

export async function fetchReservation(id: string): Promise<SlotReservation> {
  const res = await apiFetch<ApiResponse<SlotReservation>>(`/api/slots/${id}`)
  return res.data
}

export async function cancelReservation(id: string): Promise<void> {
  await apiFetch(`/api/slots/${id}/cancel`, 'PATCH')
}
