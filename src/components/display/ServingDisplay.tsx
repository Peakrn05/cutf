interface ServingDisplayProps {
  displayNumber: string | null
  serviceName?: string
}

export function ServingDisplay({ displayNumber, serviceName }: ServingDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6">
      <p className="text-sm font-semibold tracking-[0.35em] uppercase text-ink-muted">
        Now Serving
      </p>

      <div className="relative flex items-center justify-center">
        {displayNumber ? (
          <>
            <div className="absolute inset-0 rounded-3xl bg-gold/4 blur-3xl scale-150" />
            <span className="relative font-mono font-black text-[clamp(7rem,20vw,16rem)] tracking-display text-gold leading-none select-none">
              {displayNumber.split('').join(' ')}
            </span>
          </>
        ) : (
          <span className="font-mono font-black text-[clamp(7rem,20vw,16rem)] tracking-display text-ink-muted/30 leading-none select-none">
            - - -
          </span>
        )}
      </div>

      {serviceName && (
        <p className="text-base font-medium text-ink-secondary tracking-wide">
          {serviceName}
        </p>
      )}
    </div>
  )
}
