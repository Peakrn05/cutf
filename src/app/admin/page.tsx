'use client'

import { useAdminQueue } from '@/hooks/useQueue'
import { Spinner } from '@/components/ui/Spinner'
import { StatsBar } from '@/components/admin/StatsBar'
import { CurrentServing } from '@/components/admin/CurrentServing'
import { QueueList } from '@/components/admin/QueueList'

export default function AdminQueuePage() {
  const store = useAdminQueue()

  if (store.isLoading || !store.summary || !store.shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  const completedTokens = store.allTokens.filter(t => t.status === 'completed')
  const waitingTokens = store.allTokens.filter(t => t.status === 'waiting')
  const nextToken = waitingTokens[0] || null

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary mb-1">Queue Management</h1>
        <p className="text-sm text-ink-muted">Real-time queue control</p>
      </div>

      <StatsBar shop={store.shop} summary={store.summary} completedToday={completedTokens.length} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CurrentServing
          token={store.summary.currentServing}
          nextToken={nextToken}
          onComplete={store.completeServing}
          onCallNext={store.callNext}
          isProcessing={store.isProcessing}
        />

        <div className="flex flex-col gap-6">
          <QueueList
            title="Waiting"
            tokens={waitingTokens}
            showActions
            onSkip={store.skipToken}
            isProcessing={store.isProcessing}
          />
        </div>
      </div>

      <div className="mt-6">
        <QueueList
          title="Completed Today"
          tokens={completedTokens.slice(0, 10)}
        />
      </div>

      {store.error && (
        <div className="mt-6 px-4 py-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-sm">
          {store.error}
        </div>
      )}
    </div>
  )
}
