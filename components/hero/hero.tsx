'use client'

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRef, type PointerEvent } from 'react'
import { AutomationGraph, AutomationStrip } from '@/components/hero/automation-graph'
import { MagneticLink } from '@/components/motion/magnetic-link'
import { SplitWords } from '@/components/motion/reveal'
import { EASE_OUT, TELEGRAM_URL } from '@/lib/site'

const DottedGlobe = dynamic(() => import('@/components/hero/dotted-globe'), { ssr: false })

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const terrainY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const terrainScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(30)
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${smoothX}% ${smoothY}%, rgba(220,24,40,0.08), transparent 60%)`
  const graphX = useTransform(smoothX, [0, 100], [14, -14])
  const graphY = useTransform(smoothY, [0, 100], [8, -8])

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-36"
    >
      <div aria-hidden="true" className="grid-lines absolute inset-0 -z-20 [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]" />
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block" style={{ background: spotlight }} />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 w-[min(1300px,170vw)] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_50%,transparent_85%)] md:top-[44%]"
        style={{ y: terrainY, scale: terrainScale }}
      >
        <DottedGlobe />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-28 hidden justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 lg:flex">
        <div className="flex flex-col gap-1">
          <span>pf.sys / 2026</span>
          <span>каналы: tg · wa</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span>flow.status — активен</span>
          <span>узлов 06 / синхр.</span>
        </div>
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center">
        <motion.a
          href="#services"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
          className="glass group mb-8 inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          Ваш технологический партнёр в автоматизации бизнеса
        </motion.a>

        <h1 className="text-balance text-[clamp(2.4rem,8.6vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
          <SplitWords text="Ваш бизнес." immediate delay={0.35} stagger={0.08} />
          <br />
          <SplitWords text="Автоматизирован." immediate delay={0.6} wordClassName="shimmer-text bg-clip-text text-transparent inline-block pr-[0.04em]" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE_OUT }}
          className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Индивидуальные решения на базе Telegram и WhatsApp, которые автоматизируют коммуникации, упрощают процессы и помогают вашему бизнесу расти.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <MagneticLink href={TELEGRAM_URL} external size="lg">
            Обсудить проект
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </MagneticLink>
          <MagneticLink href="#services" variant="ghost" size="lg">
            Наши решения
            <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </MagneticLink>
        </motion.div>

        <motion.div style={{ x: graphX, y: graphY }} className="mt-14 hidden w-full md:block">
          <AutomationGraph />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE_OUT }}
          className="mt-14 w-full md:hidden"
        >
          <AutomationStrip />
        </motion.div>
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}
