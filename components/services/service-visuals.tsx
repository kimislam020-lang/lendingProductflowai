'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Bot, Check, CheckCheck, Database, Filter, Send, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EASE_OUT } from '@/lib/site'
import { cn } from '@/lib/utils'

function useLoopStep(steps: number, interval: number) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-10% 0px' })
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? steps - 1 : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % (steps + 1)), interval)
    return () => window.clearInterval(id)
  }, [inView, reduce, steps, interval])

  return { ref, step }
}

const TELEGRAM_CHAT = [
  { from: 'user', text: 'Здравствуйте! Можно записаться на стрижку на завтра?' },
  { from: 'bot', text: 'Конечно. Свободно: 11:00, 14:30, 17:00' },
  { from: 'user', text: 'На 14:30, пожалуйста' },
  { from: 'bot', text: 'Вы записаны на 14:30. Напомним заранее.' },
] as const

export function TelegramVisual() {
  const { ref, step } = useLoopStep(TELEGRAM_CHAT.length, 1400)
  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-white/10">
          <Bot className="size-3.5" aria-hidden="true" />
        </span>
        <span className="text-xs font-medium">Ассистент записи</span>
        <span className="ml-auto font-mono text-[10px] text-signal">онлайн</span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 pt-3">
        <AnimatePresence initial={false}>
          {TELEGRAM_CHAT.slice(0, step).map((msg) => (
            <motion.div
              key={msg.text}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-[12px] leading-snug',
                msg.from === 'user' ? 'self-end rounded-br-md bg-white text-black' : 'self-start rounded-bl-md bg-white/[0.08]',
              )}
            >
              {msg.text}
              {msg.from === 'bot' && msg.text.startsWith('Вы записаны') && (
                <Check className="ml-1 inline size-3 text-signal" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

const WA_LEADS = [
  { name: 'Анна К.', request: 'Сколько стоит доставка в Алматы?' },
  { name: 'Даниил Р.', request: 'Есть размер M в наличии?' },
  { name: 'Сара М.', request: 'Хочу сделать оптовый заказ' },
] as const

const WA_STATUSES = ['Получено', 'Отвечено', 'В CRM'] as const

export function WhatsAppVisual() {
  const { ref, step } = useLoopStep(WA_LEADS.length * 2, 900)
  return (
    <div ref={ref} className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between pb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Входящие</span>
        <span className="font-mono text-[10px] text-muted-foreground">авто-распределение</span>
      </div>
      {WA_LEADS.map((lead, i) => {
        const statusIndex = Math.max(0, Math.min(2, step - i * 2))
        const done = statusIndex === 2
        return (
          <div key={lead.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium">
              {lead.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium">{lead.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{lead.request}</p>
            </div>
            <motion.span
              key={statusIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px]',
                done ? 'bg-signal/15 text-signal' : 'bg-white/[0.06] text-muted-foreground',
              )}
            >
              {done ? <CheckCheck className="size-3" aria-hidden="true" /> : <Check className="size-3" aria-hidden="true" />}
              {WA_STATUSES[statusIndex]}
            </motion.span>
          </div>
        )
      })}
    </div>
  )
}

const PIPELINE = [
  { label: 'Триггер', icon: Zap },
  { label: 'Фильтр', icon: Filter },
  { label: 'Уведомить', icon: Send },
  { label: 'Сохранить', icon: Database },
] as const

export function AutomationVisual() {
  const { ref, step } = useLoopStep(PIPELINE.length, 700)
  const bars = [32, 54, 40, 72, 58, 88, 64, 96, 78, 100, 84, 92]
  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-4">
      <div className="flex items-center">
        {PIPELINE.map((node, i) => {
          const Icon = node.icon
          const active = step > i
          return (
            <div key={node.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.span
                  animate={{
                    backgroundColor: active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.06)',
                    color: active ? '#000' : '#fff',
                    scale: step === i + 1 ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.35 }}
                  className="flex size-9 items-center justify-center rounded-xl"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </motion.span>
                <span className="font-mono text-[10px] text-muted-foreground">{node.label}</span>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="mx-1.5 mb-5 h-px flex-1 bg-white/10">
                  <motion.div
                    className="h-px origin-left bg-signal"
                    animate={{ scaleX: step > i + 1 ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex h-20 items-end gap-1.5" aria-hidden="true">
        {bars.map((value, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm bg-[radial-gradient(circle,rgba(255,255,255,0.7)_1px,transparent_1.5px)] bg-[length:5px_5px]"
            initial={{ height: '8%' }}
            whileInView={{ height: `${value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.05, ease: EASE_OUT }}
          />
        ))}
      </div>
    </div>
  )
}
