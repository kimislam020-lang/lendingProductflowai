'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MagneticLinkProps = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  external?: boolean
  className?: string
  strength?: number
}

export function MagneticLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  external = false,
  className,
  strength = 0.35,
}: MagneticLinkProps) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  function handleMove(event: PointerEvent<HTMLAnchorElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4',
        size === 'md' ? 'h-11 px-6 text-sm' : 'h-14 px-8 text-base',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-10px_rgba(255,255,255,0.45)] hover:bg-white'
          : 'border-animated glass text-foreground hover:bg-white/10',
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.a>
  )
}
