'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import * as service from '@/services/queue.service'

export function TokenLookup() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(value, 10)
    if (!num || num < 1 || num > 999) {
      setError('Enter a valid 3-digit token number.')
      return
    }

    setIsChecking(true)
    setError('')

    const token = await service.fetchToken(num)

    if (!token) {
      setIsChecking(false)
      setError('Token not found. Check your number and try again.')
      return
    }

    router.push(`/queue/${num}`)
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-sm text-ink-muted">Already have a token?</p>
      <form onSubmit={handleCheck} className="flex gap-2" noValidate>
        <Input
          placeholder="Token # (e.g. 042)"
          value={value}
          onChange={e => {
            setValue(e.target.value.replace(/\D/g, '').slice(0, 3))
            setError('')
          }}
          inputMode="numeric"
          maxLength={3}
          className="flex-1"
          aria-label="Token number"
        />
        <Button
          type="submit"
          variant="secondary"
          loading={isChecking}
          disabled={!value}
          className="shrink-0"
        >
          Check
        </Button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}
