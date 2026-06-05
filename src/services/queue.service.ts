// Queue service — all data operations live here.
// Currently implemented with in-memory mock data.
// To connect a real backend: replace each function body with `apiFetch(...)` calls.
// The function signatures and return types must not change.

import type {
  QueueToken,
  Shop,
  QueueSummary,
  ServiceId,
} from '@/types/queue'
import { formatTokenNumber, minutesSince } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock seed data
// ---------------------------------------------------------------------------

const MOCK_SHOP: Shop = {
  id: 'shop_001',
  name: 'APEX CUTS',
  tagline: 'Precision cuts, no waiting around.',
  isOpen: true,
  averageServiceTime: 25,
  nextTokenNumber: 49,
  dailyCount: 48,
  services: [
    { id: 'haircut',       name: 'Haircut',           duration: 25, price: 25 },
    { id: 'beard',         name: 'Beard Trim',        duration: 15, price: 15 },
    { id: 'haircut-beard', name: 'Haircut + Beard',   duration: 35, price: 35 },
    { id: 'kids',          name: 'Kids Cut',          duration: 20, price: 18 },
    { id: 'styling',       name: 'Style & Finish',    duration: 20, price: 22 },
  ],
}

const now = Date.now()
const m = (minutes: number) => new Date(now - minutes * 60_000).toISOString()

const MOCK_TOKENS: QueueToken[] = [
  // --- completed history (today) ---
  { id: 'tk_035', number: 35, displayNumber: '035', serviceId: 'haircut',       status: 'completed', position: -1, estimatedWait: 0, createdAt: m(195), completedAt: m(165) },
  { id: 'tk_036', number: 36, displayNumber: '036', serviceId: 'beard',         status: 'completed', position: -1, estimatedWait: 0, createdAt: m(170), completedAt: m(148) },
  { id: 'tk_037', number: 37, displayNumber: '037', serviceId: 'haircut-beard', status: 'completed', position: -1, estimatedWait: 0, createdAt: m(150), completedAt: m(112) },
  { id: 'tk_038', number: 38, displayNumber: '038', serviceId: 'kids',          status: 'completed', position: -1, estimatedWait: 0, createdAt: m(120), completedAt: m(96)  },
  { id: 'tk_039', number: 39, displayNumber: '039', serviceId: 'haircut',       status: 'completed', position: -1, estimatedWait: 0, createdAt: m(100), completedAt: m(73)  },
  { id: 'tk_040', number: 40, displayNumber: '040', serviceId: 'styling',       customerName: 'Daniel', status: 'completed', position: -1, estimatedWait: 0, createdAt: m(80), completedAt: m(55)  },
  { id: 'tk_041', number: 41, displayNumber: '041', serviceId: 'beard',         status: 'completed', position: -1, estimatedWait: 0, createdAt: m(60), completedAt: m(42)  },
  { id: 'tk_042', number: 42, displayNumber: '042', serviceId: 'haircut',       customerName: 'James', status: 'completed', position: -1, estimatedWait: 0, createdAt: m(45), completedAt: m(18)  },

  // --- currently serving ---
  {
    id: 'tk_043',
    number: 43,
    displayNumber: '043',
    serviceId: 'haircut',
    customerName: 'Marcus',
    status: 'serving',
    position: 0,
    estimatedWait: 0,
    createdAt: m(32),
    calledAt: m(10),
    servingStartedAt: m(9),
  },

  // --- waiting ---
  { id: 'tk_044', number: 44, displayNumber: '044', serviceId: 'beard',         status: 'waiting', position: 1, estimatedWait: 17,  createdAt: m(28) },
  { id: 'tk_045', number: 45, displayNumber: '045', serviceId: 'haircut-beard', customerName: 'Leo', status: 'waiting', position: 2, estimatedWait: 32, createdAt: m(22) },
  { id: 'tk_046', number: 46, displayNumber: '046', serviceId: 'kids',          status: 'waiting', position: 3, estimatedWait: 57,  createdAt: m(15) },
  { id: 'tk_047', number: 47, displayNumber: '047', serviceId: 'haircut',       customerName: 'Chris', status: 'waiting', position: 4, estimatedWait: 77, createdAt: m(10) },
  { id: 'tk_048', number: 48, displayNumber: '048', serviceId: 'styling',       status: 'waiting', position: 5, estimatedWait: 97,  createdAt: m(5)  },
]

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------

let shopState: Shop = { ...MOCK_SHOP }
let tokensState: QueueToken[] = [...MOCK_TOKENS]

function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function recalcPositions(): void {
  const serving = tokensState.find(t => t.status === 'serving')
  const remaining = serving
    ? Math.max(0, shopState.averageServiceTime - minutesSince(serving.servingStartedAt ?? serving.calledAt ?? serving.createdAt))
    : 0

  let pos = 1
  tokensState = tokensState.map(t => {
    if (t.status !== 'waiting') return t
    const wait = remaining + (pos - 1) * shopState.averageServiceTime
    const updated = { ...t, position: pos, estimatedWait: Math.round(wait) }
    pos++
    return updated
  })
}

// ---------------------------------------------------------------------------
// Public API (matches what the real backend will expose)
// ---------------------------------------------------------------------------

export async function fetchShop(): Promise<Shop> {
  await delay(120)
  return { ...shopState }
}

export async function updateShop(patch: Partial<Shop>): Promise<Shop> {
  await delay(200)
  shopState = { ...shopState, ...patch }
  return { ...shopState }
}

export async function fetchQueueSummary(): Promise<QueueSummary> {
  await delay(100)
  recalcPositions()

  const serving = tokensState.find(t => t.status === 'serving') ?? null
  const waiting = tokensState.filter(t => t.status === 'waiting')
  const upNext = waiting.slice(0, 3)
  const waitForNew = serving
    ? Math.max(0, shopState.averageServiceTime - minutesSince(serving.servingStartedAt ?? serving.calledAt ?? serving.createdAt)) + waiting.length * shopState.averageServiceTime
    : waiting.length * shopState.averageServiceTime

  return {
    waitingCount: waiting.length,
    currentServing: serving,
    upNext,
    estimatedWaitForNew: Math.round(waitForNew),
    averageServiceTime: shopState.averageServiceTime,
  }
}

export async function fetchAllTokens(): Promise<QueueToken[]> {
  await delay(120)
  recalcPositions()
  return [...tokensState]
}

export async function fetchToken(tokenNumber: number): Promise<QueueToken | null> {
  await delay(100)
  recalcPositions()
  return tokensState.find(t => t.number === tokenNumber) ?? null
}

export async function takeToken(
  serviceId: ServiceId,
  customerName?: string,
): Promise<QueueToken> {
  await delay(350)

  if (!shopState.isOpen) throw new Error('The shop is currently closed.')

  const number = shopState.nextTokenNumber
  const waiting = tokensState.filter(t => t.status === 'waiting')
  const serving = tokensState.find(t => t.status === 'serving')

  const remaining = serving
    ? Math.max(0, shopState.averageServiceTime - minutesSince(serving.servingStartedAt ?? serving.calledAt ?? serving.createdAt))
    : 0

  const estimatedWait = Math.round(remaining + waiting.length * shopState.averageServiceTime)

  const token: QueueToken = {
    id: `tk_${number}`,
    number,
    displayNumber: formatTokenNumber(number),
    serviceId,
    customerName: customerName?.trim() || undefined,
    status: 'waiting',
    position: waiting.length + 1,
    estimatedWait,
    createdAt: new Date().toISOString(),
  }

  tokensState = [...tokensState, token]
  shopState = {
    ...shopState,
    nextTokenNumber: number + 1,
    dailyCount: shopState.dailyCount + 1,
  }

  return token
}

export async function cancelToken(tokenId: string): Promise<void> {
  await delay(200)
  tokensState = tokensState.map(t =>
    t.id === tokenId && t.status === 'waiting'
      ? { ...t, status: 'cancelled' as const }
      : t,
  )
  recalcPositions()
}

export async function callNext(): Promise<QueueToken | null> {
  await delay(250)

  const alreadyServing = tokensState.find(t => t.status === 'serving')
  if (alreadyServing) return null

  const next = tokensState.find(t => t.status === 'waiting')
  if (!next) return null

  const ts = new Date().toISOString()
  tokensState = tokensState.map(t =>
    t.id === next.id
      ? { ...t, status: 'serving' as const, calledAt: ts, servingStartedAt: ts, position: 0 }
      : t,
  )
  recalcPositions()
  return { ...next, status: 'serving', calledAt: ts, servingStartedAt: ts, position: 0 }
}

export async function completeServing(): Promise<void> {
  await delay(250)
  const serving = tokensState.find(t => t.status === 'serving')
  if (!serving) return

  const ts = new Date().toISOString()

  // Mark current as completed
  tokensState = tokensState.map(t =>
    t.id === serving.id
      ? { ...t, status: 'completed' as const, completedAt: ts }
      : t,
  )
  recalcPositions()

  // Automatically pull next waiting customer into service
  const next = tokensState.find(t => t.status === 'waiting')
  if (next) {
    tokensState = tokensState.map(t =>
      t.id === next.id
        ? { ...t, status: 'serving' as const, calledAt: ts, servingStartedAt: ts, position: 0 }
        : t,
    )
    recalcPositions()
  }
}

export async function skipToken(tokenId: string): Promise<void> {
  await delay(200)
  tokensState = tokensState.map(t =>
    t.id === tokenId && t.status === 'waiting'
      ? { ...t, status: 'skipped' as const }
      : t,
  )
  recalcPositions()
}

export async function markNoShow(tokenId: string): Promise<void> {
  await delay(200)
  tokensState = tokensState.map(t =>
    t.id === tokenId
      ? { ...t, status: 'skipped' as const }
      : t,
  )
  recalcPositions()
}
