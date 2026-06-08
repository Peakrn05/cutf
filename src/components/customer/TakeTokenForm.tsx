'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceSelector } from './ServiceSelector'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardSection } from '@/components/ui/Card'
import { formatTokenNumber } from '@/lib/utils'
import { useQueueStore } from '@/store/queue.store'
import type { ServiceId, Shop, QueueSummary } from '@/types/queue'

interface TakeTokenFormProps {
  shop: Shop
  summary: QueueSummary
}

type FormState = 'idle' | 'success'

export function TakeTokenForm({ shop, summary }: TakeTokenFormProps) {
  const router = useRouter()
  const { takeToken, isProcessing, error, clearError } = useQueueStore()

  const [selectedService, setSelectedService] = useState<ServiceId | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [newTokenNumber, setNewTokenNumber] = useState<number | null>(null)

  const handleSelect = useCallback(
    (id: ServiceId) => {
      setSelectedService(id)
      if (error) clearError()
    },
    [error, clearError],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !shop.isOpen || summary.isQueueFull) return

    const token = await takeToken(selectedService, customerName || undefined)
    setNewTokenNumber(token.number)
    setFormState('success')

    setTimeout(() => {
      router.push(`/queue/${token.number}`)
    }, 1800)
  }

  if (formState === 'success' && newTokenNumber !== null) {
    return <TokenIssuedCard number={newTokenNumber} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardSection className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-ink-primary">Take a Number</h2>
            <p className="text-sm text-ink-muted">
              Your token keeps your place — no need to wait in line.
            </p>
          </div>

          {!shop.isOpen && (
            <div className="rounded-lg bg-bg-elevated border border-line px-4 py-3 text-sm text-ink-secondary">
              The shop is currently closed. Please check back during business hours.
            </div>
          )}

          {shop.isOpen && summary.isQueueFull && (
            <div className="rounded-lg bg-amber-950/40 border border-amber-800/40 px-4 py-3 text-sm text-amber-400">
              Queue is full — we cannot accept more customers before closing at{' '}
              <span className="font-semibold">{formatClose(summary.closeTime)}</span>.
              Please come back tomorrow.
            </div>
          )}

          {shop.isOpen && !summary.isQueueFull && (
            <>
              <ServiceSelector
                services={shop.services}
                selected={selectedService}
                onSelect={handleSelect}
              />

              <Input
                label="Your name"
                placeholder="Optional"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                maxLength={40}
                autoComplete="given-name"
              />

              {error && (
                <p className="text-sm text-red-400" role="alert">{error}</p>
              )}

              <div className="pt-1">
                {summary.waitingCount > 0 && (
                  <p className="mb-3 text-center text-xs text-ink-muted">
                    {summary.waitingCount} {summary.waitingCount === 1 ? 'person' : 'people'} ahead
                    &nbsp;·&nbsp; ~{summary.estimatedWaitForNew} min estimated wait
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isProcessing}
                  disabled={!selectedService}
                >
                  Get My Number
                </Button>
              </div>
            </>
          )}
        </CardSection>
      </Card>
    </form>
  )
}

function formatClose(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`
}

function TokenIssuedCard({ number }: { number: number }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 animate-fade-up">
      <p className="text-sm font-medium text-ink-secondary uppercase tracking-widest">
        Your Token
      </p>
      <div className="flex items-center justify-center w-36 h-36 rounded-2xl border border-gold/40 bg-gold/5 animate-number-enter">
        <span className="font-mono text-5xl font-bold text-gold tracking-token">
          {formatTokenNumber(number)}
        </span>
      </div>
      <p className="text-sm text-ink-muted">Taking you to your queue status...</p>
    </div>
  )
}
