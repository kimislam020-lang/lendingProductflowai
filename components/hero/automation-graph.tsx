'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BellRing, Database, MessageCircle, Send, ShoppingBag, Workflow, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EASE_OUT } from '@/lib/site'

type GraphNode = {
  id: string
  label: string
  meta: string
  icon: LucideIcon
  x: number
  y: number
  side: 'in' | 'out'
}

const CORE = { x: 500, y: 190 }

const NODES: GraphNode[] = [
  { id: 'telegram', label: 'Telegram', meta: 'новая запись', icon: Send, x: 130, y: 88, side: 'in' },
  { id: 'whatsapp', label: 'WhatsApp', meta: 'новая заявка', icon: MessageCircle, x: 130, y: 292, side: 'in' },
  { id: 'crm', label: 'CRM', meta: 'контакт сохранён', icon: Database, x: 870, y: 70, side: 'out' },
  { id: 'orders', label: 'Заказы', meta: 'статус обновлён', icon: ShoppingBag, x: 890, y: 190, side: 'out' },
  { id: 'team', label: 'Команда', meta: 'менеджер уведомлён', icon: BellRing, x: 870, y: 310, side: 'out' },
]

const EVENTS = [
  'Запись подтверждена → Календарь',
  'Заявка квалифицирована → CRM',
  'Заказ #2481 → Склад',
  'Оплата получена → Чек отправлен',
  'Ответ на вопрос → мгновенно',
]

function pathFor(node: GraphNode) {
  const midX = (node.x + CORE.x) / 2
  return node.side === 'in'
    ? `M${node.x},${node.y} C${midX},${node.y} ${midX},${CORE.y} ${CORE.x},${CORE.y}`
    : `M${CORE.x},${CORE.y} C${midX},${CORE.y} ${midX},${node.y} ${node.x},${node.y}`
}

export function AutomationGraph() {
  const reduce = useReducedMotion()
  const [eventIndex, setEventIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setEventIndex((i) => (i + 1) % EVENTS.length), 2400)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <div className="relative mx-auto aspect-[1000/380] w-full max-w-5xl" role="img" aria-label="Схема: сообщения из Telegram и WhatsApp поступают в Productflow, который автоматически обновляет CRM, заказы и уведомляет команду.">
      <svg viewBox="0 0 1000 380" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id="flow-line" x1="0" x2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="50%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {NODES.map((node, i) => {
          const d = pathFor(node)
          return (
            <g key={node.id}>
              <motion.path
                d={d}
                fill="none"
                stroke="url(#flow-line)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, delay: 0.9 + i * 0.12, ease: EASE_OUT }}
              />
              <path d={d} fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1" className="flow-dash" />
              {!reduce && (
                <circle r="3" fill="var(--signal)">
                  <animateMotion dur={`${2.6 + i * 0.35}s`} begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          )
        })}
      </svg>

      {NODES.map((node, i) => {
        const Icon = node.icon
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x / 10}%`, top: `${(node.y / 380) * 100}%` }}
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1.1 + i * 0.1, ease: EASE_OUT }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass flex items-center gap-2.5 rounded-2xl py-2 pl-2 pr-3.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)]"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-white/[0.07]">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium">{node.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{node.meta}</span>
              </span>
            </motion.div>
          </motion.div>
        )
      })}

      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: `${(CORE.y / 380) * 100}%` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: EASE_OUT }}
      >
        <div className="border-animated glass relative flex w-64 flex-col gap-3 rounded-3xl p-4 shadow-[0_20px_80px_-20px_rgba(220,24,40,0.35)]">
          <div className="flex items-center gap-3">
            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Workflow className="size-5" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-signal ring-2 ring-background" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Ядро Productflow</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal">работает</span>
            </span>
          </div>
          <div className="h-8 overflow-hidden rounded-xl bg-black/40 px-3 font-mono text-[11px] text-muted-foreground">
            <AnimatePresence mode="wait">
              <motion.p
                key={eventIndex}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="flex h-8 items-center whitespace-nowrap"
              >
                <span className="mr-2 text-signal">{'>'}</span>
                {EVENTS[eventIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function AutomationStrip() {
  const reduce = useReducedMotion()
  const steps = [
    { label: 'Сообщение', icon: MessageCircle },
    { label: 'Автоматизация', icon: Workflow },
    { label: 'CRM', icon: Database },
  ]
  return (
    <div className="glass mx-auto flex w-full max-w-sm items-center justify-between rounded-3xl p-3" role="img" aria-label="Сообщение клиента автоматически обрабатывается и сохраняется в CRM.">
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span className={i === 1 ? 'flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground' : 'flex size-11 items-center justify-center rounded-2xl bg-white/[0.07]'}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="relative mx-2 mb-5 h-px flex-1 overflow-hidden bg-white/15">
                {!reduce && (
                  <motion.span
                    className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-signal to-transparent"
                    animate={{ x: ['-24px', '120px'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear', delay: i * 0.8 }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
