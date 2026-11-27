'use client'

import { animate, motion, useMotionValue, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, MessageCircle, Send, Workflow, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { AutomationVisual, TelegramVisual, WhatsAppVisual } from '@/components/services/service-visuals'
import { EASE_OUT } from '@/lib/site'
import { cn } from '@/lib/utils'

type Service = {
  index: string
  title: string
  description: string
  tags: string[]
  icon: LucideIcon
  visual: ReactNode
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Telegram-боты',
    description: 'Автоматизируйте общение с клиентами, заказы, записи и внутренние процессы.',
    tags: ['Заказы', 'Записи', 'Оплаты', 'Внутренние задачи'],
    icon: Send,
    visual: <TelegramVisual />,
  },
  {
    index: '02',
    title: 'Автоматизация WhatsApp',
    description: 'Общайтесь с клиентами, обрабатывайте заявки и автоматизируйте переписку.',
    tags: ['Business API', 'Сбор заявок', 'Автоответы', 'Рассылки'],
    icon: MessageCircle,
    visual: <WhatsAppVisual />,
  },
  {
    index: '03',
    title: 'Автоматизация бизнеса',
    description: 'Избавьтесь от рутины и объедините бизнес-процессы в единую систему.',
    tags: ['Синхронизация CRM', 'Уведомления', 'Отчёты', 'Интеграции'],
    icon: Workflow,
    visual: <AutomationVisual />,
  },
]

export function Services() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [snaps, setSnaps] = useState<number[]>([0])
  const [maxScroll, setMaxScroll] = useState(0)
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  const goTo = useCallback(
    (next: number, positions = snaps) => {
      const clamped = Math.max(0, Math.min(positions.length - 1, next))
      indexRef.current = clamped
      setIndex(clamped)
      animate(x, -positions[clamped], { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 })
    },
    [snaps, x],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const measure = () => {
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth)
      const positions: number[] = []
      for (const child of Array.from(track.children) as HTMLElement[]) {
        const pos = Math.min(child.offsetLeft, max)
        if (positions.length === 0 || pos - positions[positions.length - 1] > 8) positions.push(pos)
      }
      setMaxScroll(max)
      setSnaps(positions)
      const current = Math.min(indexRef.current, positions.length - 1)
      indexRef.current = current
      setIndex(current)
      x.set(-positions[current])
    }

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(track)
    measure()
    return () => observer.disconnect()
  }, [x])

  function handleDragEnd(_: unknown, info: PanInfo) {
    const projected = -(x.get() + info.velocity.x * 0.25)
    let nearest = 0
    snaps.forEach((pos, i) => {
      if (Math.abs(pos - projected) < Math.abs(snaps[nearest] - projected)) nearest = i
    })
    if (nearest === index && Math.abs(info.offset.x) > 60) {
      nearest = info.offset.x < 0 ? index + 1 : index - 1
    }
    goTo(nearest)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1)
    }
  }

  const canSlide = snaps.length > 1

  return (
    <section id="services" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="01 — Решения"
            title="Автоматизация под ваш бизнес."
            description="Каждое решение мы проектируем с нуля под то, как на самом деле работает ваша компания — от первого сообщения клиента до итогового отчёта."
          />
          {canSlide && (
            <div className="flex items-center gap-2">
              <CarouselButton label="Предыдущее решение" disabled={index === 0} onClick={() => goTo(index - 1)}>
                <ArrowLeft className="size-4" />
              </CarouselButton>
              <CarouselButton label="Следующее решение" disabled={index === snaps.length - 1} onClick={() => goTo(index + 1)}>
                <ArrowRight className="size-4" />
              </CarouselButton>
            </div>
          )}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mx-auto mt-14 max-w-6xl overflow-hidden px-5 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Наши решения. Используйте стрелки влево и вправо для навигации."
        onKeyDown={handleKeyDown}
      >
        <motion.div
          ref={trackRef}
          className={cn('flex gap-4 md:gap-5', canSlide && 'cursor-grab active:cursor-grabbing')}
          style={{ x, touchAction: 'pan-y' }}
          drag={canSlide ? 'x' : false}
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.14}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} order={i} active={i === index || !canSlide} />
          ))}
        </motion.div>
      </div>

      {canSlide && (
        <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2" role="tablist" aria-label="Выбор решения">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Перейти к слайду ${i + 1}`}
                onClick={() => goTo(i)}
                className="group flex h-6 items-center"
              >
                <motion.span
                  className="block h-1 rounded-full"
                  animate={{ width: i === index ? 36 : 10, backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.22)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
            <span className="text-foreground">{String(index + 1).padStart(2, '0')}</span> / {String(snaps.length).padStart(2, '0')}
          </p>
        </div>
      )}
    </section>
  )
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="glass inline-flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30"
    >
      {children}
    </motion.button>
  )
}

function ServiceCard({ service, order, active }: { service: Service; order: number; active: boolean }) {
  const Icon = service.icon

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay: order * 0.12, ease: EASE_OUT }}
      onPointerMove={handlePointerMove}
      className={cn(
        'group relative flex w-[84vw] shrink-0 select-none flex-col overflow-hidden rounded-[28px] border border-white/10 bg-card/60 p-5 transition-[border-color,opacity] duration-500 hover:border-white/20 sm:w-[420px] md:p-6 lg:w-[460px]',
        !active && 'opacity-60',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), rgba(220,24,40,0.09), transparent 45%)' }}
      />
      <div className="relative h-64 overflow-hidden rounded-[20px] border border-white/5 bg-black/50 p-4 transition-transform duration-700 ease-out group-hover:scale-[1.015]">
        {service.visual}
      </div>
      <div className="relative mt-6 flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-muted-foreground">{service.index}</span>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{service.title}</h3>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-white group-hover:text-black">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-3 text-pretty leading-relaxed text-muted-foreground">{service.description}</p>
      <ul className="relative mt-6 flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            {tag}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}
