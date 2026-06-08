'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DateSelector } from '@/components/reservation/DateSelector'
import { TimeSlotGrid } from '@/components/reservation/TimeSlotGrid'
import { ServiceSelector } from '@/components/customer/ServiceSelector'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardSection, CardDivider } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { fetchAvailableSlots, reserveSlot } from '@/services/slot.service'
import { fetchShop } from '@/services/queue.service'
import type { TimeSlot, SlotReservation } from '@/types/slot'
import type { Shop, ServiceId } from '@/types/queue'

function tomorrowString(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function fmtDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function fmt12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`
}

export default function ReservePage() {
  const [shop, setShop] = useState<Shop | null>(null)
  const [selectedDate, setSelectedDate] = useState(tomorrowString())
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotError, setSlotError] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<SlotReservation | null>(null)

  // Load shop for service list
  useEffect(() => {
    fetchShop().then(setShop).catch(() => {})
  }, [])

  // Load slots whenever date changes
  const loadSlots = useCallback(async (date: string) => {
    setSlotsLoading(true)
    setSelectedTime(null)
    setSlotError(null)
    try {
      const data = await fetchAvailableSlots(date)
      setSlots(data.slots ?? [])
    } catch (e) {
      setSlots([])
      setSlotError(
        e instanceof Error
          ? `Unable to load available times: ${e.message}`
          : 'Unable to load available times. Please try again.',
      )
    } finally {
      setSlotsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTime || !selectedService || !customerName.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const reservation = await reserveSlot({
        date: selectedDate,
        timeSlot: selectedTime,
        serviceId: selectedService,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
      })
      setConfirmed(reservation)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reserve slot.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    const serviceName = shop?.services.find(s => s.id === confirmed.serviceId)?.name ?? confirmed.serviceId
    return (
      <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
        <div className="w-full max-w-md pt-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-950/50 border border-emerald-800/40 mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-xl font-bold text-ink-primary">Slot Reserved!</h1>
            <p className="text-sm text-ink-muted mt-1">See you then, {confirmed.customerName}.</p>
          </div>

          <Card variant="highlighted">
            <CardSection className="p-5 flex flex-col gap-3">
              <Row label="Date" value={fmtDate(confirmed.date)} />
              <Row label="Time" value={fmt12h(confirmed.timeSlot)} />
              <Row label="Service" value={serviceName} />
              {confirmed.customerPhone && (
                <Row label="Phone" value={confirmed.customerPhone} />
              )}
            </CardSection>
            <CardDivider />
            <CardSection className="p-4">
              <p className="text-xs text-ink-muted text-center">
                Reference ID: <span className="font-mono text-ink-secondary">{confirmed.id.slice(0, 8).toUpperCase()}</span>
              </p>
            </CardSection>
          </Card>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => {
                setConfirmed(null)
                setSelectedTime(null)
                setCustomerName('')
                setCustomerPhone('')
                setSelectedService(null)
              }}
            >
              Book another slot
            </Button>
            <Link href="/" className="block">
              <Button variant="ghost" size="md" fullWidth>Back to home</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <header className="pt-8 pb-5">
          <Link href="/" className="text-xs text-ink-muted hover:text-ink-secondary transition-colors">
            ← Back
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-primary">Book a Slot</h1>
          <p className="mt-1 text-sm text-ink-muted">Reserve a specific time so you don't have to wait.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">

            {/* Step 1 — Date */}
            <Card>
              <CardSection className="p-4 flex flex-col gap-3">
                <StepLabel n={1} text="Pick a date" />
                <DateSelector selectedDate={selectedDate} onChange={handleDateChange} />
              </CardSection>
            </Card>

            {/* Step 2 — Time */}
            <Card>
              <CardSection className="p-4 flex flex-col gap-3">
                <StepLabel n={2} text="Pick a time" />
                {slotsLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner size="sm" className="text-gold" />
                  </div>
                ) : slotError ? (
                  <div className="space-y-3 py-4 text-center">
                    <p className="text-sm text-red-300">{slotError}</p>
                    <button
                      type="button"
                      onClick={() => loadSlots(selectedDate)}
                      className="inline-flex items-center justify-center rounded-lg border border-gold/30 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/5 transition"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <TimeSlotGrid
                    slots={slots}
                    selected={selectedTime}
                    onSelect={setSelectedTime}
                  />
                )}
              </CardSection>
            </Card>

            {/* Step 3 — Details (only show after time picked) */}
            {selectedTime && shop && (
              <Card>
                <CardSection className="p-4 flex flex-col gap-4">
                  <StepLabel n={3} text="Your details" />

                  <ServiceSelector
                    services={shop.services}
                    selected={selectedService}
                    onSelect={setSelectedService}
                  />

                  <Input
                    label="Your name"
                    placeholder="Required"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    maxLength={40}
                    autoComplete="given-name"
                    required
                  />

                  <Input
                    label="Phone number"
                    placeholder="Optional"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    maxLength={20}
                    autoComplete="tel"
                    type="tel"
                  />

                  {error && (
                    <p className="text-sm text-red-400" role="alert">{error}</p>
                  )}

                  <div className="rounded-lg bg-bg-elevated border border-line px-3 py-2 text-xs text-ink-muted">
                    {fmtDate(selectedDate)} at {fmt12h(selectedTime)}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    disabled={!selectedService || !customerName.trim()}
                  >
                    Confirm Reservation
                  </Button>
                </CardSection>
              </Card>
            )}

          </div>
        </form>
      </div>
    </main>
  )
}

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold text-[11px] font-bold">
        {n}
      </span>
      <span className="text-sm font-semibold text-ink-primary">{text}</span>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink-primary font-medium">{value}</span>
    </div>
  )
}
