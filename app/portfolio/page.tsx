export default function Portfolio() {
  return (
    <main className="min-h-screen p-24 bg-[#2b2b2b] text-[#A259FF]">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#A259FF]">
          Portfolio
        </h1>
        <p className="text-xl text-white/80">
          Manage your domain portfolio and track your investments.
        </p>
      </div>
    </main>
  )
}

// Disable static generation for consistency
export const dynamic = 'force-dynamic'
