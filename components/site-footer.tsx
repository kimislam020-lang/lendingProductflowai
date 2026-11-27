import { BrandLogo } from '@/components/brand-mark'
import { NAV_ITEMS, TELEGRAM_HANDLE, TELEGRAM_URL } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <BrandLogo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Ваш технологический партнёр в автоматизации бизнеса. Telegram-боты, автоматизация WhatsApp и связанные бизнес-системы.
          </p>
        </div>
        <nav aria-label="Навигация в подвале" className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
          <p className="col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">Навигация</p>
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="text-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">Контакты</p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-lg font-medium tracking-tight transition-colors hover:text-signal"
          >
            Telegram {TELEGRAM_HANDLE}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 border-t border-white/[0.06] px-5 py-6 font-mono text-[11px] text-white/35 sm:flex-row">
        <p>© {new Date().getFullYear()} Productflow.ai</p>
        <a href="#top" className="transition-colors hover:text-foreground">
          Наверх ↑
        </a>
      </div>
    </footer>
  )
}
