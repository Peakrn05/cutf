'use client'

import { useEffect } from 'react'
import { StatsBar } from '@/components/admin/StatsBar'
import { CurrentServing } from '@/components/admin/CurrentServing'
import { QueueList } from '@/components/admin/QueueList'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from '@/hooks/usePolling'

export default function AdminDashboardPage() {
  const {
    shop,
    summary,
    allTokens,
    isLoading,
    isProcessing,
    error,
    loadAll,
    callNext,
    completeServing,
    skipToken,
    toggleOpen,
    clearError,
  } = useQueueStore()

  useEffect(() => { loadAll() }, [loadAll])
  usePolling(loadAll, 5_000)

  if (isLoading || !shop || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  const waiting   = allTokens.filter(t => t.status === 'waiting')
  const completed = allTokens.filter(t => t.status === 'completed')
  const skipped   = allTokens.filter(t => t.status === 'skipped' || t.status === 'cancelled')
  const nextToken = waiting[0] ?? null

  return (
    <main className="p-5 md:p-7 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-ink-primary">{shop.name}</h1>
          <p className="text-xs text-ink-muted mt-0.5">Queue Management</p>
        </div>
        <Button
          variant={shop.isOpen ? 'secondary' : 'primary'}
          size="sm"
          loading={isProcessing}
          onClick={toggleOpen}
        >
          {shop.isOpen ? 'Close Shop' : 'Open Shop'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-950/50 border border-red-800/40 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-300 ml-4 text-xs"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      <StatsBar
        shop={shop}
        summary={summary}
        completedToday={completed.length}
      />

      <CurrentServing
        token={summary.currentServing}
        nextToken={nextToken}
        onComplete={completeServing}
        onCallNext={callNext}
        isProcessing={isProcessing}
      />

      <div className="flex flex-col gap-8 mt-2">
        <QueueList
          title="Waiting"
          tokens={waiting}
          showActions
          onSkip={skipToken}
          isProcessing={isProcessing}
        />

        <QueueList
          title="Completed Today"
          tokens={completed}
        />

        {skipped.length > 0 && (
          <QueueList
            title="Skipped / Cancelled"
            tokens={skipped}
          />
        )}
      </div>
    </main>
  )
}
