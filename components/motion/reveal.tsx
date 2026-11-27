'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT } from '@/lib/site'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

type SplitWordsProps = {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  immediate?: boolean
}

export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: SplitWordsProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const animateProps = immediate
    ? { animate: 'shown' as const }
    : { whileInView: 'shown' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <motion.span
      className={cn('inline', className)}
      initial={reduce ? false : 'hidden'}
      {...animateProps}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', rotate: 4, opacity: 0 },
              shown: { y: '0%', rotate: 0, opacity: 1 },
            }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <span className={wordClassName}>{word}</span>
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
