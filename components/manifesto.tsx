'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/motion/reveal'

const STATEMENT = 'Мы превращаем бизнес-процессы в автоматизированные системы.'
const AUDIENCE = [
  'Малый бизнес',
  'Средний бизнес',
  'Интернет-магазины',
  'Сервисные компании',
  'Предприниматели',
  'Отделы продаж',
  'Поддержка клиентов',
]

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = STATEMENT.split(' ')

  return (
    <section aria-labelledby="manifesto-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{'// Наша философия'}</p>
        </Reveal>
        <div ref={ref}>
          <h2 id="manifesto-title" className="mt-6 max-w-5xl text-balance text-[clamp(2.4rem,6.5vw,5.5rem)] font-semibold leading-[1] tracking-[-0.045em]">
            <span className="sr-only">{STATEMENT}</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <ScrollWord key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </ScrollWord>
              ))}
            </span>
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Reveal className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Мы не продаём шаблонные решения. Мы анализируем каждый бизнес, находим повторяющиеся процессы и создаём технологии, которые решают реальные задачи.
          </Reveal>
          <Reveal delay={0.1} className="text-pretty leading-relaxed text-muted-foreground md:pt-1">
            Меньше ручной работы, быстрые ответы клиентам и полная картина по каждой заявке — чтобы команда занималась тем, что действительно развивает бизнес.
          </Reveal>
        </div>
      </div>

      <div className="marquee-wrap relative mt-20 overflow-hidden border-y border-white/[0.06] py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <p className="sr-only">Для кого: {AUDIENCE.join(', ')}</p>
        <div className="marquee flex w-max gap-12" aria-hidden="true">
          {[...AUDIENCE, ...AUDIENCE].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-white/40">
              {item.replace(/ /g, '_')}
              <span className="size-1 rounded-full bg-signal/70" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const blur = useTransform(progress, range, [4, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)
  return (
    <motion.span style={{ opacity, filter }} className="inline-block pr-[0.25em]">
      {children}
    </motion.span>
  )
}
