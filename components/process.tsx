'use client'

import { motion, useInView, useScroll, useSpring } from 'motion/react'
import { ArrowUpRight, Code, Compass, Rocket, Search, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { MagneticLink } from '@/components/motion/magnetic-link'
import { SectionHeading } from '@/components/section-heading'
import { EASE_OUT, TELEGRAM_URL } from '@/lib/site'
import { cn } from '@/lib/utils'

const STEPS: { index: string; title: string; text: string; icon: LucideIcon; detail: string }[] = [
  { index: '01', title: 'Знакомство', text: 'Разбираемся в вашем бизнесе и его задачах.', icon: Search, detail: 'Интервью · аудит процессов' },
  { index: '02', title: 'Стратегия', text: 'Проектируем подходящее решение для автоматизации.', icon: Compass, detail: 'Сценарии · архитектура' },
  { index: '03', title: 'Разработка', text: 'Создаём, тестируем и интегрируем вашу систему.', icon: Code, detail: 'Разработка · тесты · интеграции' },
  { index: '04', title: 'Запуск и поддержка', text: 'Запускаем решение и помогаем его улучшать.', icon: Rocket, detail: 'Запуск · развитие' },
]

export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 55%'] })
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="process" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="02 — Процесс"
            title="Как мы работаем."
            description="Понятный и прозрачный путь от первого сообщения до работающей системы — без догадок и сюрпризов."
          />
          <div className="mt-10">
            <MagneticLink href={TELEGRAM_URL} external variant="ghost">
              Начать со знакомства
              <ArrowUpRight className="size-4" />
            </MagneticLink>
          </div>
        </div>

        <ol ref={listRef} className="relative flex flex-col gap-4">
          <div aria-hidden="true" className="absolute bottom-8 left-[27px] top-8 w-px bg-white/10 md:left-[31px]">
            <motion.div className="h-full w-px origin-top bg-gradient-to-b from-signal to-white" style={{ scaleY: lineScale }} />
          </div>
          {STEPS.map((step) => (
            <ProcessStep key={step.index} step={step} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function ProcessStep({ step }: { step: (typeof STEPS)[number] }) {
  const ref = useRef<HTMLLIElement>(null)
  const active = useInView(ref, { margin: '-40% 0px -40% 0px' })
  const Icon = step.icon

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className={cn(
        'relative flex gap-5 rounded-3xl border p-4 transition-colors duration-500 md:gap-6 md:p-5',
        active ? 'border-white/15 bg-white/[0.04]' : 'border-transparent',
      )}
    >
      <span
        className={cn(
          'relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 md:size-16',
          active ? 'border-transparent bg-primary text-primary-foreground shadow-[0_0_40px_-8px_rgba(220,24,40,0.6)]' : 'border-white/10 bg-background text-muted-foreground',
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1 pt-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
            <span className="mr-3 font-mono text-sm text-signal">{step.index}</span>
            {step.title}
          </h3>
          <span className="font-mono text-[11px] text-muted-foreground">{step.detail}</span>
        </div>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{step.text}</p>
      </div>
    </motion.li>
  )
}
