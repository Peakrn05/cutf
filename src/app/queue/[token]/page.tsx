'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { TokenDisplay } from '@/components/queue/TokenDisplay'
import { QueuePosition } from '@/components/queue/QueuePosition'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from '@/hooks/usePolling'
import { formatTokenNumber } from '@/lib/utils'
import * as service from '@/services/queue.service'
import type { QueueToken } from '@/types/queue'

export default function QueueStatusPage() {
  const params = useParams()
  const router = useRouter()
  const tokenNumber = parseInt(String(params.token), 10)

  const { summary, loadSummary, cancelToken, isProcessing } = useQueueStore()

  const [token, setToken] = useState<QueueToken | null | 'not-found'>('not-found')
  const [isCancelling, setIsCancelling] = useState(false)

  const refreshToken = useCallback(async () => {
    const t = await service.fetchToken(tokenNumber)
    setToken(t)  // null = not found → renders <NotFound />, QueueToken = found
  }, [tokenNumber])

  useEffect(() => {
    if (isNaN(tokenNumber)) { setToken('not-found'); return }
    refreshToken()
    loadSummary()
  }, [tokenNumber, refreshToken, loadSummary])

  const refresh = useCallback(() => {
    refreshToken()
    loadSummary()
  }, [refreshToken, loadSummary])

  usePolling(refresh, 4_000)

  const handleCancel = async () => {
    if (!token || token === 'not-found') return
    const confirmed = window.confirm(
      `Cancel token ${formatTokenNumber(tokenNumber)}? This cannot be undone.`,
    )
    if (!confirmed) return
    setIsCancelling(true)
    await cancelToken((token as QueueToken).id)
    setIsCancelling(false)
    router.push('/')
  }

  if (isNaN(tokenNumber)) {
    return <NotFound />
  }

  if (token === 'not-found') {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  if (!token) {
    return <NotFound />
  }

  const isDone = token.status === 'completed' || token.status === 'cancelled' || token.status === 'skipped'

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-md">
        <div className="pt-6 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink-secondary transition-colors"
          >
            <span aria-hidden>&#8592;</span>
            Back to home
          </Link>
        </div>

        <div className="flex flex-col gap-6 mt-4 animate-fade-up">
          <TokenDisplay
            displayNumber={token.displayNumber}
            status={token.status}
            animate
          />

          {!isDone && summary && (
            <QueuePosition
              token={token}
              currentServing={summary.currentServing}
            />
          )}

          {isDone && <DoneCard status={token.status} />}

          {token.status === 'waiting' && (
            <div className="pt-2">
              <Button
                variant="destructive"
                size="sm"
                fullWidth
                loading={isCancelling || isProcessing}
                onClick={handleCancel}
              >
                Cancel My Token
              </Button>
            </div>
          )}

          <RefreshIndicator />
        </div>
      </div>
    </main>
  )
}

function DoneCard({ status }: { status: QueueToken['status'] }) {
  const messages: Partial<Record<QueueToken['status'], { title: string; body: string }>> = {
    completed:  { title: 'All done',     body: 'Thank you for visiting. See you next time.' },
    cancelled:  { title: 'Cancelled',    body: 'Your token has been cancelled.' },
    skipped:    { title: 'Skipped',      body: 'Your token was skipped. Please speak to a barber.' },
  }
  const msg = messages[status] ?? { title: 'Done', body: '' }

  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-base font-semibold text-ink-primary">{msg.title}</p>
      {msg.body && <p className="text-sm text-ink-secondary">{msg.body}</p>}
      <Link href="/" className="mt-3 text-sm text-gold hover:text-gold-light underline underline-offset-2">
        Take a new token
      </Link>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-4">
      <p className="text-base font-medium text-ink-secondary">Token not found</p>
      <Link href="/" className="text-sm text-gold hover:text-gold-light underline underline-offset-2">
        Back to home
      </Link>
    </div>
  )
}

function RefreshIndicator() {
  return (
    <p className="text-center text-xs text-ink-muted">
      Updates automatically every few seconds
    </p>
  )
}
