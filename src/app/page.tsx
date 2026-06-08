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
      <div className="w-full max-w-5xl">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] xl:gap-12 py-10">
          <div className="rounded-[2rem] border border-line bg-bg-elevated/90 p-8 shadow-[0_40px_120px_rgba(20,20,20,0.08)] backdrop-blur-xl">
            <ShopHeader
              shop={shop}
              waitingCount={queueSummary.waitingCount}
              estimatedWait={queueSummary.estimatedWaitForNew}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-line/60 bg-bg-base/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Now serving</p>
                <p className="mt-3 text-2xl font-semibold text-ink-primary">
                  {queueSummary.currentServing ? queueSummary.currentServing.displayNumber : 'No active service'}
                </p>
              </div>
              <div className="rounded-3xl border border-line/60 bg-bg-base/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Est. wait</p>
                <p className="mt-3 text-2xl font-semibold text-ink-primary">
                  {queueSummary.estimatedWaitForNew} min
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-ink-muted">A refined experience for a calm, curated cut.</p>
              </div>
              <a
                href="/reserve"
                className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink-primary transition hover:border-line-focus hover:text-line-focus"
              >
                Reserve a time slot
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <CurrentQueueFrame summary={queueSummary} />

            <a
              href="/reserve"
              className="block rounded-3xl border border-line bg-bg-elevated/90 p-6 text-center transition hover:border-line-focus"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Planning ahead</p>
              <p className="mt-3 text-lg font-semibold text-ink-primary">Book the perfect time for your next visit.</p>
              <span className="mt-4 inline-flex items-center justify-center rounded-full bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">Reserve now</span>
            </a>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
          <div>
            <TakeTokenForm shop={shop} summary={queueSummary} />
          </div>

          <div className="rounded-[2rem] border border-line bg-bg-elevated/90 p-6 text-ink-primary">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Quick access</p>
                <h2 className="mt-2 text-lg font-semibold">Check your token</h2>
              </div>
              <span className="inline-flex rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">Fast</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-ink-muted">
              Already have a number? Track your place in line and see when you're next on the chair.
            </p>

            <div className="mt-6">
              <TokenLookup />
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-ink-muted sm:flex-row">
          <a
            href="/display"
            className="hover:text-ink-secondary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Display board
          </a>
          <span className="mx-2 hidden text-line sm:inline">·</span>
          <a href="/admin" className="hover:text-ink-secondary transition-colors">
            Admin
          </a>
        </footer>
      </div>
    </main>
  )
}
