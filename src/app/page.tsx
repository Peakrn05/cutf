'use client'

import { useEffect, useCallback } from 'react'
import { TakeTokenForm } from '@/components/customer/TakeTokenForm'
import { ShopHeader } from '@/components/customer/ShopHeader'
import { CurrentQueueFrame } from '@/components/customer/CurrentQueueFrame'
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
    isQueueFull: false,
    openTime: shop.openTime ?? '09:00',
    closeTime: shop.closeTime ?? '18:00',
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-md">
        <ShopHeader
          shop={shop}
          waitingCount={queueSummary.waitingCount}
          estimatedWait={queueSummary.estimatedWaitForNew}
        />

        <CurrentQueueFrame summary={queueSummary} />

        <TakeTokenForm shop={shop} summary={queueSummary} />

        <TokenLookup />

        {/* Book a slot banner */}
        <a
          href="/reserve"
          className="mt-4 flex items-center justify-between w-full rounded-xl border border-line bg-bg-elevated px-4 py-3 hover:border-line-focus transition-colors group"
        >
          <div>
            <p className="text-sm font-semibold text-ink-primary">Book a time slot</p>
            <p className="text-xs text-ink-muted mt-0.5">Reserve your spot for tomorrow or later</p>
          </div>
          <span className="text-ink-muted group-hover:text-ink-secondary text-lg">→</span>
        </a>

        <footer className="mt-8 text-center text-xs text-ink-muted">
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
