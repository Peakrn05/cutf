'use client'

import { useEffect } from 'react'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from './usePolling'
import * as service from '@/services/queue.service'
import type { QueueToken } from '@/types/queue'

// Hook for the customer home page — loads summary + polls
export function useQueueSummary(pollMs = 5_000) {
  const { summary, shop, isLoading, loadShop, loadSummary } = useQueueStore()

  useEffect(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  usePolling(loadSummary, pollMs)

  return { summary, shop, isLoading }
}

// Hook for the customer queue status page — fetches a single token by number + polls
export function useTokenStatus(tokenNumber: number, pollMs = 4_000) {
  const { summary, loadSummary } = useQueueStore()

  const getToken = async (): Promise<QueueToken | null> => {
    return service.fetchToken(tokenNumber)
  }

  usePolling(loadSummary, pollMs)

  return { getToken, summary }
}

// Hook for the display board — polls aggressively
export function useDisplayBoard(pollMs = 3_000) {
  const { summary, shop, loadSummary, loadShop } = useQueueStore()

  useEffect(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  usePolling(loadSummary, pollMs)

  return { summary, shop }
}

// Hook for admin — loads everything + polls
export function useAdminQueue(pollMs = 5_000) {
  const store = useQueueStore()

  useEffect(() => {
    store.loadAll()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  usePolling(store.loadAll, pollMs)

  return store
}
