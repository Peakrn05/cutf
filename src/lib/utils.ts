import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TokenStatus } from '@/types/queue'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatTokenNumber(num: number): string {
  return num.toString().padStart(3, '0')
}

export function formatWait(minutes: number): string {
  if (minutes <= 0) return 'Now'
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`
}

export function formatDuration(minutes: number): string {
  return `${minutes} min`
}

export function formatPrice(usd: number): string {
  return `$${usd}`
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function minutesSince(isoString: string): number {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / 60_000)
}

export function statusLabel(status: TokenStatus): string {
  const map: Record<TokenStatus, string> = {
    waiting: 'Waiting',
    called: 'Called',
    serving: 'In Service',
    completed: 'Completed',
    cancelled: 'Cancelled',
    skipped: 'Skipped',
  }
  return map[status]
}

export function statusColor(status: TokenStatus): string {
  const map: Record<TokenStatus, string> = {
    waiting: 'text-ink-secondary',
    called: 'text-amber-500',
    serving: 'text-emerald-500',
    completed: 'text-ink-muted',
    cancelled: 'text-red-700',
    skipped: 'text-ink-muted',
  }
  return map[status]
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return fallback
}

export function formatServiceLabel(serviceId: string): string {
  return serviceId
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' + ')
}
