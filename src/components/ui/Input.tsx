import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-md bg-bg-surface border px-3.5 text-sm text-ink-primary placeholder:text-ink-muted',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-line-focus/30 focus:border-line-focus',
            error
              ? 'border-red-700 focus:ring-red-700/30 focus:border-red-600'
              : 'border-line hover:border-line-focus',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={`${inputId}-helper`} className="text-xs text-ink-muted">
            {helper}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
