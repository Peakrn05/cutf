'use client'

import { useEffect, useCallback } from 'react'
import { TakeTokenForm } from '@/components/customer/TakeTokenForm'
import { ShopHeader } from '@/components/customer/ShopHeader'
import { TokenLookup } from '@/components/customer/TokenLookup'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from '@/hooks/usePolling'

export default function CustomerHomePage() {
  const { shop, summary, isLoading, hasInitialized, error, loadShop, loadSummary } = useQueueStore()

  useEffect(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  const retry = useCallback(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  usePolling(loadSummary, 6_000, hasInitialized && !error)

  // Still on first load — never completed yet
  if (!hasInitialized) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  // First load completed but failed (backend down / network error)
  if (!shop) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-full max-w-sm text-center flex flex-col gap-3">
          <p className="text-base font-semibold text-ink-primary">Cannot connect to server</p>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {error ?? 'The server is not responding.'}
          </p>
          <p className="text-xs text-ink-muted">
            Make sure the backend is running on{' '}
            <code className="font-mono text-gold">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
            </code>
          </p>
        </div>
        <Button
          onClick={retry}
          loading={isLoading}
          variant="secondary"
          size="md"
        >
          Try again
        </Button>
      </div>
    )
  }

  const queueSummary = summary ?? {
    waitingCount: 0,
    currentServing: null,
    upNext: [],
    estimatedWaitForNew: 0,
    averageServiceTime: shop.averageServiceTime,
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-md">
        <ShopHeader
          shop={shop}
          waitingCount={queueSummary.waitingCount}
          estimatedWait={queueSummary.estimatedWaitForNew}
        />

        <TakeTokenForm shop={shop} summary={queueSummary} />

        <TokenLookup />

        <footer className="mt-10 text-center text-xs text-ink-muted">
          <a
            href="/display"
            className="hover:text-ink-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Display board
          </a>
          <span className="mx-2 text-line">·</span>
          <a href="/admin" className="hover:text-ink-secondary transition-colors">
            Admin
          </a>
        </footer>
      </div>
    </main>
  )
}
