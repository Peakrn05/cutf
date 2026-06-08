'use client'

import type { QueueSummary } from '@/types/queue'

interface CurrentQueueFrameProps {
  summary: QueueSummary
}

export function CurrentQueueFrame({ summary }: CurrentQueueFrameProps) {
  const serving = summary.currentServing

  return (
    <div className="mb-5 rounded-2xl border border-line bg-bg-elevated overflow-hidden">
      <div className="px-4 py-2.5 border-b border-line flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Now Serving
        </span>
        {summary.waitingCount > 0 && (
          <span className="text-xs text-ink-secondary">
            {summary.waitingCount} {summary.waitingCount === 1 ? 'person' : 'people'} in queue
          </span>
        )}
      </div>

      <div className="flex flex-col items-center justify-center py-7 gap-2">
        {serving ? (
          <>
            <span className="font-mono text-6xl font-bold text-gold tracking-widest animate-number-enter">
              {serving.displayNumber}
            </span>
            {serving.customerName && (
              <span className="text-sm text-ink-secondary">{serving.customerName}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-ink-muted">No active service</span>
        )}
      </div>
    </div>
  )
}
