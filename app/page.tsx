import { FinalCta } from '@/components/final-cta'
import { Hero } from '@/components/hero/hero'
import { Manifesto } from '@/components/manifesto'
import { Process } from '@/components/process'
import { Services } from '@/components/services/services'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Why } from '@/components/why'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        <Hero />
        <Services />
        <Manifesto />
        <Process />
        <Why />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
