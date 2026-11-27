import type { ReactNode } from 'react'
import { Reveal, SplitWords } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-5', align === 'center' && 'items-center text-center', className)}>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{`// ${eyebrow}`}</p>
      </Reveal>
      <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
        <SplitWords text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15} className="max-w-xl text-pretty leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  )
}
