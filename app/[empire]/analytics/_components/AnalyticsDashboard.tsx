'use client';

import { Cinzel, Cormorant_Garamond } from 'next/font/google';
import { motion } from 'framer-motion';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import type { EmpireConfig } from '@/lib/empires/config';
import type { AnalyticsSummary } from '@/lib/types/analytics';
import { ActivityByCentury } from './ActivityByCentury';
import { BattleOutcomesChart } from './BattleOutcomesChart';
import { ChartCard } from './ChartCard';
import { DynastyChart } from './DynastyChart';
import { EventsCategoryChart } from './EventsCategoryChart';
import { PlacesTreemap } from './PlacesTreemap';
import { TerritorialExtent } from './TerritorialExtent';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
});

const CHART_SECTIONS = [
  {
    number: 'I',
    title: 'Dynastic Structure',
    subtitle: 'Ruling houses and continuity across the imperial record.',
  },
  {
    number: 'II',
    title: 'Event Categories',
    subtitle: 'Recorded category patterns across the historical archive.',
  },
  {
    number: 'III',
    title: 'Battle Outcomes',
    subtitle: 'Victory, defeat, and uncertainty across recorded campaigns.',
  },
  {
    number: 'IV',
    title: 'Century Activity',
    subtitle: 'Combined event and battle intensity across the centuries.',
  },
  {
    number: 'V',
    title: 'Territorial Extent',
    subtitle: 'Imperial land area across documented expansion snapshots.',
  },
  {
    number: 'VI',
    title: 'Place Typology',
    subtitle: 'Distribution of cities, forts, ports, temples, and roads.',
  },
] as const;

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

interface AnalyticsDashboardProps {
  empire: EmpireConfig;
  data: AnalyticsSummary;
}

export function AnalyticsDashboard({ empire, data }: AnalyticsDashboardProps) {
  const statPills = [
    { label: 'Rulers', value: data.totals.rulers },
    { label: 'Places', value: data.totals.places },
    { label: 'Battles', value: data.totals.battles },
    { label: 'Events', value: data.totals.events },
    { label: 'Provinces', value: data.totals.provinces },
  ];

  return (
    <main
      className="min-h-screen px-4 py-10 text-[#F0ECE2] sm:px-6 lg:px-8"
      style={{
        background:
          'linear-gradient(180deg, #120C08 0%, #1A1210 48%, #0D0A07 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-[28px] border border-white/6 bg-black/10 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#9A8B70]">
            {empire.nativeName}
          </p>
          <h1
            className={`${cinzel.className} mt-4 text-5xl leading-none sm:text-6xl`}
            style={{
              background:
                'linear-gradient(135deg, #F8E7BF 0%, #D4AF37 45%, #8A6A16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Analytics
          </h1>
          <p
            className={`${cormorant.className} mt-4 text-xl sm:text-2xl`}
            style={{ color: '#B6A17C' }}
          >
            Historical intelligence across the {empire.name} ·{' '}
            {formatYear(empire.startYear)} – {formatYear(empire.endYear)}
          </p>
        </header>

        <section className="mb-10 flex flex-wrap gap-4">
          {statPills.map((pill) => (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: statPills.indexOf(pill) * 0.05,
              }}
              className="min-w-[150px] flex-1 rounded-full px-5 py-4"
              style={{
                background: 'rgba(19, 14, 12, 0.86)',
                border: `1px solid ${empire.color}55`,
                boxShadow: `inset 0 1px 0 ${empire.color}15`,
              }}
            >
              <p
                className="text-3xl font-semibold"
                style={{ color: '#D4AF37' }}
              >
                {formatNumber(pill.value)}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#8C8379]">
                {pill.label}
              </p>
            </motion.div>
          ))}
        </section>

        <EmpireSectionNav empire={empire} />

        <section
          className="grid gap-6"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          }}
        >
          {CHART_SECTIONS.map((section, index) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ChartCard
                number={section.number}
                title={section.title}
                subtitle={section.subtitle}
                accentColor={empire.color}
              >
                {section.number === 'I' ? (
                  <DynastyChart
                    data={data.dynastyByCounts}
                    primaryColor={empire.color}
                  />
                ) : section.number === 'II' ? (
                  <EventsCategoryChart
                    data={data.eventsByCategory}
                    primaryColor={empire.color}
                  />
                ) : section.number === 'III' ? (
                  <BattleOutcomesChart
                    data={data.battleOutcomes}
                    primaryColor={empire.color}
                  />
                ) : section.number === 'IV' ? (
                  <ActivityByCentury
                    data={data.centuryActivity}
                    primaryColor={empire.color}
                  />
                ) : section.number === 'V' ? (
                  <TerritorialExtent
                    data={data.territorialExtent}
                    primaryColor={empire.color}
                  />
                ) : (
                  <PlacesTreemap
                    data={data.placesByType}
                    primaryColor={empire.color}
                  />
                )}
              </ChartCard>
            </motion.div>
          ))}
        </section>

        <footer
          className="mt-12 border-t pt-8 text-center"
          style={{ borderColor: 'rgba(184,134,11,0.1)' }}
        >
          <p
            className={cinzel.className}
            style={{
              color: '#6B5B47',
              fontSize: '12px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Ancient Empires · {empire.name} Analytics
          </p>
        </footer>
      </div>
    </main>
  );
}
