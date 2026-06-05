'use client'

import { create } from 'zustand'
import type { QueueToken, Shop, QueueSummary, ServiceId } from '@/types/queue'
import * as service from '@/services/queue.service'

interface QueueStore {
  // ---- state ----
  shop: Shop | null
  summary: QueueSummary | null
  allTokens: QueueToken[]
  isLoading: boolean
  isProcessing: boolean
  error: string | null

  // ---- shared reads ----
  loadShop: () => Promise<void>
  loadSummary: () => Promise<void>
  loadAll: () => Promise<void>

  // ---- customer ----
  takeToken: (serviceId: ServiceId, customerName?: string) => Promise<QueueToken>
  cancelToken: (tokenId: string) => Promise<void>

  // ---- admin ----
  callNext: () => Promise<void>
  completeServing: () => Promise<void>
  skipToken: (tokenId: string) => Promise<void>
  toggleOpen: () => Promise<void>
  clearError: () => void
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  shop: null,
  summary: null,
  allTokens: [],
  isLoading: false,
  isProcessing: false,
  error: null,

  loadShop: async () => {
    try {
      const shop = await service.fetchShop()
      set({ shop })
    } catch {
      set({ error: 'Failed to load shop.' })
    }
  },

  loadSummary: async () => {
    try {
      const summary = await service.fetchQueueSummary()
      set({ summary })
    } catch {
      set({ error: 'Failed to load queue status.' })
    }
  },

  loadAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const [shop, summary, allTokens] = await Promise.all([
        service.fetchShop(),
        service.fetchQueueSummary(),
        service.fetchAllTokens(),
      ])
      set({ shop, summary, allTokens, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to load data.' })
    }
  },

  takeToken: async (serviceId, customerName) => {
    set({ isProcessing: true, error: null })
    try {
      const token = await service.takeToken(serviceId, customerName)
      await get().loadSummary()
      set({ isProcessing: false })
      return token
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to take token.'
      set({ isProcessing: false, error: msg })
      throw e
    }
  },

  cancelToken: async tokenId => {
    set({ isProcessing: true })
    try {
      await service.cancelToken(tokenId)
      await get().loadSummary()
      set({ isProcessing: false })
    } catch {
      set({ isProcessing: false, error: 'Failed to cancel token.' })
    }
  },

  callNext: async () => {
    set({ isProcessing: true })
    try {
      await service.callNext()
      await get().loadAll()
      set({ isProcessing: false })
    } catch {
      set({ isProcessing: false, error: 'Failed to call next.' })
    }
  },

  completeServing: async () => {
    set({ isProcessing: true })
    try {
      await service.completeServing()
      await get().loadAll()
      set({ isProcessing: false })
    } catch {
      set({ isProcessing: false, error: 'Failed to complete serving.' })
    }
  },

  skipToken: async tokenId => {
    set({ isProcessing: true })
    try {
      await service.skipToken(tokenId)
      await get().loadAll()
      set({ isProcessing: false })
    } catch {
      set({ isProcessing: false, error: 'Failed to skip token.' })
    }
  },

  toggleOpen: async () => {
    const current = get().shop
    if (!current) return
    set({ isProcessing: true })
    try {
      const updated = await service.updateShop({ isOpen: !current.isOpen })
      set({ shop: updated, isProcessing: false })
    } catch {
      set({ isProcessing: false, error: 'Failed to update shop status.' })
    }
  },

  clearError: () => set({ error: null }),
}))
