'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getErrorMessage } from '@/lib/utils'
import * as service from '@/services/queue.service'

export function TokenLookup() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const num = Number(value)
    if (!Number.isInteger(num) || num < 1 || num > 999) {
      setError('Enter a valid 3-digit token number.')
      return
    }

    setIsChecking(true)
    setError('')

    try {
      const token = await service.fetchToken(num)
      if (!token) {
        setError('Token not found. Check your number and try again.')
        return
      }
      router.push(`/queue/${num}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to look up token. Please try again.'))
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-center text-sm leading-6 text-ink-muted">
        Already have a token? Track your place in line and see when you're next on the chair.
      </p>
      <form onSubmit={handleCheck} className="grid gap-3 sm:grid-cols-[1fr_auto]" noValidate>
        <Input
          placeholder="Token # (e.g. 042)"
          value={value}
          onChange={e => {
            setValue(e.target.value.replace(/\D/g, '').slice(0, 3))
            setError('')
          }}
          inputMode="numeric"
          maxLength={3}
          className="flex-1 min-w-0"
          aria-label="Token number"
        />
        <Button
          type="submit"
          variant="secondary"
          size="md"
          loading={isChecking}
          disabled={!value.trim()}
          className="h-11"
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
