import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Productflow.ai — ваш технологический партнёр в автоматизации бизнеса',
  description:
    'Productflow.ai разрабатывает Telegram-ботов, WhatsApp-ботов для бизнеса и индивидуальные решения для автоматизации бизнес-процессов малого и среднего бизнеса.',
  generator: 'v0.app',
  keywords: [
    'Telegram-боты',
    'WhatsApp-боты для бизнеса',
    'автоматизация бизнеса',
    'обработка заявок',
    'автоматизация коммуникаций с клиентами',
  ],
  openGraph: {
    title: 'Productflow.ai — Ваш бизнес. Автоматизирован.',
    description:
      'Индивидуальные решения на базе Telegram и WhatsApp, которые автоматизируют коммуникации, упрощают процессы и помогают бизнесу расти.',
    type: 'website',
    locale: 'ru_RU',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
