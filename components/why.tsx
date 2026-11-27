'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { Fingerprint, Handshake, Layers, Sparkles, Target, type LucideIcon } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { EASE_OUT } from '@/lib/site'
import { cn } from '@/lib/utils'

export function Why() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const glowY = useTransform(scrollYProgress, [0, 1], ['-20%', '30%'])

  return (
    <section id="why" ref={sectionRef} className="relative scroll-mt-24 overflow-hidden py-24 md:py-36">
      <motion.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(220,24,40,0.08),transparent)]"
      />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="03 — Почему Productflow"
          title="Партнёр, а не магазин шаблонов."
          description="Мы сочетаем инженерную экспертизу с практическим пониманием того, как на самом деле работает малый и средний бизнес."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <BentoCard className="md:col-span-4" order={0} icon={Fingerprint} title="Индивидуальный подход" text="Мы начинаем с ваших процессов, клиентов и целей — и проектируем автоматизацию, которая подходит именно вам.">
            <AuditChart />
          </BentoCard>
          <BentoCard className="md:col-span-2" order={1} icon={Layers} title="Разработка с нуля" text="Пишем код под ваш бизнес. Никаких жёстких конструкторов и ограничений на интеграции.">
            <CodeSnippet />
          </BentoCard>
          <BentoCard className="md:col-span-2" order={2} icon={Target} title="Практичные решения" text="Каждая функция экономит время, привлекает клиентов или снижает количество ошибок.">
            <Checklist />
          </BentoCard>
          <BentoCard className="md:col-span-2" order={3} icon={Sparkles} title="Современные технологии" text="Надёжный масштабируемый стек и официальные API мессенджеров.">
            <TechTags />
          </BentoCard>
          <BentoCard className="md:col-span-2" order={4} icon={Handshake} title="Долгосрочное партнёрство" text="После запуска мы остаёмся рядом — поддерживаем, улучшаем и масштабируем систему.">
            <Timeline />
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

function BentoCard({
  className,
  order,
  icon: Icon,
  title,
  text,
  children,
}: {
  className?: string
  order: number
  icon: LucideIcon
  title: string
  text: string
  children: ReactNode
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay: (order % 3) * 0.1, ease: EASE_OUT }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative flex flex-col justify-between gap-8 overflow-hidden rounded-[28px] border border-white/10 bg-card/50 p-6 transition-colors duration-500 hover:border-white/20 md:p-7',
        className,
      )}
    >
      <div className="relative">{children}</div>
      <div className="relative">
        <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/[0.06] transition-colors duration-500 group-hover:bg-white group-hover:text-black">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </motion.article>
  )
}

function AuditChart() {
  const columns = Array.from({ length: 36 }, (_, i) => {
    const v = 0.35 + 0.45 * Math.exp(-((i - 20) ** 2) / 40) + 0.15 * Math.abs(Math.sin(i * 1.7))
    return Math.min(1, v)
  })
  return (
    <div aria-hidden="true">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>аудит процессов</span>
        <span className="text-signal">найдена рутина</span>
      </div>
      <div className="flex h-32 items-end gap-[3px] border-b border-white/10">
        {columns.map((value, i) => (
          <motion.div
            key={i}
            className={cn(
              'flex-1 bg-[length:4px_4px]',
              i > 16 && i < 25
                ? 'bg-[radial-gradient(circle,var(--signal)_1px,transparent_1.4px)]'
                : 'bg-[radial-gradient(circle,rgba(255,255,255,0.55)_1px,transparent_1.4px)]',
            )}
            initial={{ height: 0 }}
            whileInView={{ height: `${value * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.02, ease: EASE_OUT }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-white/30">
        <span>пн</span>
        <span>вт</span>
        <span>ср</span>
        <span>чт</span>
        <span>пт</span>
      </div>
    </div>
  )
}

function CodeSnippet() {
  const lines = [
    { t: 'on', c: "message('order')" },
    { t: '→', c: 'validate(customer)' },
    { t: '→', c: 'crm.create(lead)' },
    { t: '→', c: "notify('manager')" },
  ]
  return (
    <div aria-hidden="true" className="rounded-2xl border border-white/5 bg-black/50 p-4 font-mono text-[12px]">
      {lines.map((line, i) => (
        <motion.p
          key={line.c}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          className="leading-6"
        >
          <span className="mr-2 text-signal">{line.t}</span>
          <span className="text-white/70">{line.c}</span>
        </motion.p>
      ))}
    </div>
  )
}

function Checklist() {
  const items = ['Меньше ручных шагов', 'Быстрые ответы', 'Ни одной потерянной заявки']
  return (
    <ul aria-hidden="true" className="flex flex-col gap-2">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
          className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2 text-sm"
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-signal/20">
            <span className="size-1.5 rounded-full bg-signal" />
          </span>
          {item}
        </motion.li>
      ))}
    </ul>
  )
}

function TechTags() {
  const tags = ['Telegram Bot API', 'WhatsApp Business API', 'Webhooks', 'CRM APIs', 'Платежи', 'AI-ассистенты']
  return (
    <ul aria-hidden="true" className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <motion.li
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-signal/50 hover:text-foreground"
        >
          {tag}
        </motion.li>
      ))}
    </ul>
  )
}

function Timeline() {
  const points = ['Запуск', 'Поддержка', 'Улучшение', 'Рост']
  return (
    <div aria-hidden="true" className="pt-2">
      <div className="relative h-px bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 h-px origin-left bg-gradient-to-r from-signal to-white"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3, ease: EASE_OUT }}
          style={{ width: '100%' }}
        />
        <div className="absolute inset-x-0 -top-1 flex justify-between">
          {points.map((p) => (
            <span key={p} className="size-2 rounded-full bg-white ring-4 ring-card" />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {points.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
    </div>
  )
}
