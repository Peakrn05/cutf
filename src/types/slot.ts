import type { ServiceId } from './queue'

export interface TimeSlot {
  time: string       // HH:MM 24h
  available: boolean
}

export interface AvailableSlots {
  date: string       // YYYY-MM-DD
  slots: TimeSlot[]
}

export interface SlotReservation {
  id: string
  date: string       // YYYY-MM-DD
  timeSlot: string   // HH:MM
  serviceId: ServiceId
  customerName: string
  customerPhone?: string
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}
