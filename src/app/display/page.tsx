'use client'

import { useEffect, useState } from 'react'
import { ServingDisplay } from '@/components/display/ServingDisplay'
import { NextUpDisplay } from '@/components/display/NextUpDisplay'
import { useQueueStore } from '@/store/queue.store'
import { usePolling } from '@/hooks/usePolling'
import { formatClock, formatDay } from '@/lib/utils'

export default function DisplayBoardPage() {
  const { shop, summary, loadShop, loadSummary } = useQueueStore()
  const [clock, setClock] = useState('')
  const [day, setDay] = useState('')

  useEffect(() => {
    loadShop()
    loadSummary()
  }, [loadShop, loadSummary])

  usePolling(loadSummary, 3_000)

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(formatClock(now))
      setDay(formatDay(now))
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [])

  const serving = summary?.currentServing ?? null
  const servingServiceName = serving
    ? serving.serviceId.replace('-', ' + ').replace(/\b\w/g, c => c.toUpperCase())
    : undefined

  return (
    <div className="display-root flex flex-col h-screen select-none overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-[#1a1a1a]">
        <div>
          <h1 className="text-xl font-bold tracking-[0.15em] uppercase text-[#F0F0F0]">
            {shop?.name ?? 'LOADING...'}
          </h1>
          {shop?.tagline && (
            <p className="text-xs text-[#4A4A4A] mt-0.5 tracking-wider">{shop.tagline}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold text-[#F0F0F0] tabular-nums tracking-wider">
            {clock}
          </p>
          <p className="text-xs text-[#4A4A4A] mt-0.5 tracking-wider">{day}</p>
        </div>
      </div>

      {/* Main serving number */}
      <ServingDisplay
        displayNumber={serving?.displayNumber ?? null}
        serviceName={servingServiceName}
      />

      {/* Divider */}
      <div className="mx-10 h-px bg-[#1a1a1a]" />

      {/* Next up */}
      <div className="py-8 flex flex-col items-center">
        {summary?.upNext && summary.upNext.length > 0 && (
          <NextUpDisplay tokens={summary.upNext} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#1a1a1a] px-10 py-4 flex items-center justify-between text-xs text-[#4A4A4A] tracking-wide">
        <span>
          {summary?.waitingCount ?? 0} customer{(summary?.waitingCount ?? 0) !== 1 ? 's' : ''} waiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Live
        </span>
        <span>
          Avg. service time: {summary?.averageServiceTime ?? shop?.averageServiceTime ?? '—'} min
        </span>
      </div>
    </div>
  )
}
