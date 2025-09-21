import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero'
import { Newsletter } from '@/components/home/newsletter'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#2b2b2b] text-[#A259FF]">
      <HeroSection/>
      <Newsletter/>
      <Footer/>
    </main>
  )
}
