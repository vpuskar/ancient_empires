import { notFound } from 'next/navigation'
import { getEmpireBySlug } from '@/lib/empires/config'

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`
}

export default async function EmpirePage({
  params,
}: {
  params: Promise<{ empire: string }>
}) {
  const { empire: slug } = await params
  const empire = getEmpireBySlug(slug)

  if (!empire) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div
        className="border-l-4 pl-6 py-2"
        style={{ borderColor: empire.color }}
      >
        <h1 className="text-4xl font-bold mb-2">{empire.name}</h1>
        <p className="text-zinc-400 text-lg">
          {formatYear(empire.start)} - {formatYear(empire.end)}
        </p>
      </div>
    </main>
  )
}
