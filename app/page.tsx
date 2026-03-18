import Link from 'next/link'
import { EMPIRE_CONFIGS, EmpireConfig } from '@/lib/empires/config'

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`
}

function EmpireCard({ empire }: { empire: EmpireConfig }) {
  return (
    <Link
      href={`/${empire.slug}`}
      className="block border border-zinc-800 rounded-lg p-6 hover:border-zinc-600 transition-colors bg-zinc-900"
      style={{ borderLeftColor: empire.color, borderLeftWidth: '4px' }}
    >
      <h2 className="text-xl font-semibold text-white mb-2">{empire.name}</h2>
      <p className="text-zinc-400 text-sm">
        {formatYear(empire.start)} – {formatYear(empire.end)}
      </p>
    </Link>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Ancient Empires</h1>
        <p className="text-zinc-500 text-center mb-10">Explore the great empires of history</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EMPIRE_CONFIGS.map((empire) => (
            <EmpireCard key={empire.id} empire={empire} />
          ))}
        </div>
      </div>
    </main>
  )
}
