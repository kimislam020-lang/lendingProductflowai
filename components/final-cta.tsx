'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Send } from 'lucide-react'
import { useRef } from 'react'
import { MagneticLink } from '@/components/motion/magnetic-link'
import { Reveal, SplitWords } from '@/components/motion/reveal'
import { TELEGRAM_HANDLE, TELEGRAM_URL } from '@/lib/site'

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const arcY = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])

  return (
    <section id="contact" ref={ref} className="scroll-mt-24 px-4 py-16 md:px-6 md:py-24">
      <motion.div
        style={{ scale }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-card/40 px-6 py-20 text-center md:py-32"
      >
        <motion.div
          aria-hidden="true"
          style={{ y: arcY }}
          className="pointer-events-none absolute left-1/2 top-[55%] aspect-square w-[220%] -translate-x-1/2 rounded-[50%] border-t border-white/70 shadow-[0_-30px_120px_-20px_rgba(220,24,40,0.45),inset_0_40px_100px_-50px_rgba(255,255,255,0.45)] md:w-[140%]"
        />
        <div aria-hidden="true" className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">{'// Начнём'}</p>
          </Reveal>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.6rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
            <SplitWords text="Давайте автоматизируем ваш бизнес." />
          </h2>
          <Reveal delay={0.2} className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Расскажите нам о своём бизнесе — мы поможем определить, что можно автоматизировать.
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-5">
            <MagneticLink href={TELEGRAM_URL} external size="lg" strength={0.45}>
              Начать диалог
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </MagneticLink>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Send className="size-4" aria-hidden="true" />
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                {TELEGRAM_HANDLE}
              </span>
            </a>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
