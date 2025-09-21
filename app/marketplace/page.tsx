import { DomainBrowser } from '@/components/marketplace/domain-browser'

export default function Marketplace() {
  return (
    <main className="h-[calc(90vh-120px)] bg-[#2b2b2b] text-[#A259FF]">
      <DomainBrowser />
    </main>
  )
}

// Disable static generation for interactive components
export const dynamic = 'force-dynamic'
