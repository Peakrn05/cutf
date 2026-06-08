'use client'

import { cn } from '@/lib/utils'

interface DateSelectorProps {
  selectedDate: string
  onChange: (date: string) => void
}

function buildDays(): { value: string; label: string; sub: string }[] {
  const days = []
  const now = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + i)
    const value = d.toISOString().slice(0, 10)
    const label = i === 1
      ? 'Tomorrow'
      : d.toLocaleDateString('en-US', { weekday: 'short' })
    const sub = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    days.push({ value, label, sub })
  }
  return days
}

export function DateSelector({ selectedDate, onChange }: DateSelectorProps) {
  const days = buildDays()

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {days.map(d => (
        <button
          key={d.value}
          type="button"
          onClick={() => onChange(d.value)}
          className={cn(
            'flex-none flex flex-col items-center px-4 py-2.5 rounded-xl border text-center transition-colors duration-150',
            selectedDate === d.value
              ? 'border-gold/60 bg-gold/10 text-gold'
              : 'border-line bg-bg-elevated text-ink-secondary hover:border-line-focus hover:text-ink-primary',
          )}
        >
          <span className="text-xs font-semibold uppercase tracking-wide">{d.label}</span>
          <span className="text-[11px] mt-0.5 opacity-70">{d.sub}</span>
        </button>
      ))}
    </div>
  )
}
