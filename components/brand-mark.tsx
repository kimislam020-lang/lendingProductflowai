import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('size-7', className)} aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" />
      <path d="M8 21c4 0 5-10 9-10s4 6 7 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="21" r="2.25" fill="var(--signal)" />
      <circle cx="24" cy="17" r="2.25" fill="white" />
    </svg>
  )
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark />
      <span className="text-[15px] font-semibold tracking-tight">
        Productflow<span className="text-muted-foreground">.ai</span>
      </span>
    </span>
  )
}
