'use client'

import { useDisplayBoard } from '@/hooks/useQueue'
import { ServingDisplay } from '@/components/display/ServingDisplay'
import { NextUpDisplay } from '@/components/display/NextUpDisplay'
import { Spinner } from '@/components/ui/Spinner'

export default function DisplayBoardPage() {
  const { summary, shop } = useDisplayBoard()

  if (!summary || !shop) {
    return (
      <div className="display-root flex items-center justify-center">
        <Spinner size="lg" className="text-gold" />
      </div>
    )
  }

  const currentServing = summary.currentServing
  const serviceName = currentServing
    ? shop.services.find(s => s.id === currentServing.serviceId)?.name
    : undefined

  return (
    <div className="display-root flex flex-col items-center justify-center gap-8 px-4 py-8">
      <header className="text-center mb-4">
        <h1 className="text-lg font-semibold tracking-widest uppercase text-ink-secondary">
          {shop.name}
        </h1>
      </header>

      <ServingDisplay
        displayNumber={currentServing?.displayNumber ?? null}
        serviceName={serviceName}
      />

      <NextUpDisplay tokens={summary.upNext} />

      <footer className="text-center text-xs text-ink-muted tracking-wider">
        {summary.waitingCount > 0 && (
          <>
            {summary.waitingCount} {summary.waitingCount === 1 ? 'customer' : 'customers'} waiting
          </>
        )}
        {summary.waitingCount === 0 && !currentServing && (
          <>No one waiting</>
        )}
      </footer>
    </div>
  )
}
