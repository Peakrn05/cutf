export type ServiceId =
  | 'haircut'
  | 'beard'
  | 'haircut-beard'
  | 'kids'
  | 'styling'

export interface Service {
  id: ServiceId
  name: string
  duration: number   // minutes
  price: number      // USD
}

export type TokenStatus =
  | 'waiting'
  | 'called'
  | 'serving'
  | 'completed'
  | 'cancelled'
  | 'skipped'

export interface QueueToken {
  id: string
  number: number
  displayNumber: string   // zero-padded e.g. "043"
  serviceId: ServiceId
  customerName?: string
  status: TokenStatus
  position: number        // 0 = serving, 1 = next, 2+ = waiting
  estimatedWait: number   // minutes until served
  createdAt: string       // ISO string
  calledAt?: string
  servingStartedAt?: string
  completedAt?: string
}

export interface Shop {
  id: string
  name: string
  tagline: string
  isOpen: boolean
  services: Service[]
  averageServiceTime: number  // minutes
  nextTokenNumber: number     // increments each token taken today
  dailyCount: number          // total tokens issued today
}

export interface QueueSummary {
  waitingCount: number
  currentServing: QueueToken | null
  upNext: QueueToken[]   // next 3 after current
  estimatedWaitForNew: number
  averageServiceTime: number
}
