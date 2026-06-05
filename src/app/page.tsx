'use client'

import { useEffect } from 'react'
import { TakeTokenForm } from '@/components/customer/TakeTokenForm'
import { ShopHeader } from '@/components/customer/ShopHeader'
import { TokenLookup } from '@/components/customer/TokenLookup'
import { Spinner } from '@/components/ui/Spinner'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from '@/hooks/usePolling'

export default function CustomerHomePage() {
  const { shop, summary, isLoading, loadShop, loadSummary } = useQueueStore()

  useEffect(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  usePolling(loadSummary, 6_000)

  if (isLoading || !shop || !summary) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-md">
        <ShopHeader
          shop={shop}
          waitingCount={summary.waitingCount}
          estimatedWait={summary.estimatedWaitForNew}
        />

        <TakeTokenForm shop={shop} summary={summary} />

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
