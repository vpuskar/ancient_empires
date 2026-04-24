import Image from 'next/image';
import Link from 'next/link';
import { JsonLd } from '@/lib/seo/json-ld-script';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo/jsonld';

type Empire = {
  id: number;
  slug: string;
  name: string;
  nativeName: string;
  nativeNameDirection?: 'ltr' | 'rtl';
  period: string;
  description: string;
  statLabel: string;
  statValue: string;
  href?: string;
  accent: string;
  accentSoft: string;
  border: string;
  surface: string;
};

const empires: Empire[] = [
  {
    id: 1,
    slug: 'roman',
    name: 'Roman Empire',
    nativeName: 'Imperium Romanum',
    period: '509 BC - 476 AD',
    description:
      'Follow the rise of Rome from republic to empire through mapped frontiers, rulers, battles, and pivotal turning points.',
    statLabel: 'Peak extent',
    statValue: '5M km2',
    href: '/roman',
    accent: '#f0c96d',
    accentSoft: '#ffe1a6',
    border: 'rgba(240, 201, 109, 0.28)',
    surface:
      'linear-gradient(180deg, rgba(139, 0, 0, 0.34) 0%, rgba(20, 12, 11, 0.96) 72%)',
  },
  {
    id: 2,
    slug: 'chinese',
    name: 'Chinese Empire',
    nativeName: '中华帝国',
    period: '221 BC - 1912 AD',
    description:
      "Survey dynastic change, imperial expansion, and the continuity of one of the world's longest historical traditions.",
    statLabel: 'Dynasties',
    statValue: '13 major',
    href: '/chinese',
    accent: '#f8df82',
    accentSoft: '#fff0b3',
    border: 'rgba(248, 223, 130, 0.24)',
    surface:
      'linear-gradient(180deg, rgba(123, 83, 0, 0.30) 0%, rgba(22, 17, 9, 0.96) 72%)',
  },
  {
    id: 3,
    slug: 'japanese',
    name: 'Japanese Empire',
    nativeName: '日本帝国',
    period: '660 BC - 1945 AD',
    description:
      'Trace the imperial line, the age of shoguns, and the transformations that reshaped Japan across centuries.',
    statLabel: 'Imperial line',
    statValue: '126 emperors',
    accent: '#ff8a99',
    accentSoft: '#ffc0c8',
    border: 'rgba(255, 138, 153, 0.24)',
    surface:
      'linear-gradient(180deg, rgba(120, 0, 37, 0.32) 0%, rgba(21, 12, 14, 0.96) 72%)',
  },
  {
    id: 4,
    slug: 'ottoman',
    name: 'Ottoman Empire',
    nativeName: 'الدولة العثمانية',
    nativeNameDirection: 'rtl',
    period: '1299 - 1922 AD',
    description:
      'Explore a transcontinental empire shaped by sultans, trade routes, military reform, and layered cultural exchange.',
    statLabel: 'Sultans',
    statValue: '36',
    href: '/ottoman',
    accent: '#7fd7a7',
    accentSoft: '#b9f1ce',
    border: 'rgba(127, 215, 167, 0.24)',
    surface:
      'linear-gradient(180deg, rgba(13, 87, 47, 0.30) 0%, rgba(11, 18, 13, 0.96) 72%)',
  },
];

const stats = [
  { label: 'Rulers profiled', value: '206' },
  { label: 'Historical places', value: '7,738' },
  { label: 'Battles mapped', value: '213' },
  { label: 'Quiz questions', value: '20,000' },
  { label: 'Key events', value: '327' },
];

export function generateMetadata() {
  return buildMetadata({
    title: 'Ancient Empires - Interactive History Platform',
    description:
      "Explore four of history's greatest civilisations through interactive maps, timelines, quizzes, and storytelling.",
    path: '/',
    rawTitle: true,
  });
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebSiteJsonLd()} />

      <main
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, rgba(125, 25, 10, 0.18), transparent 28%), linear-gradient(180deg, #0c0b09 0%, #14110d 55%, #0c0b09 100%)',
          color: '#f0ece2',
        }}
      >
        <header
          style={{
            borderBottom: '1px solid rgba(240, 236, 226, 0.08)',
          }}
        >
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(240, 236, 226, 0.76)',
                  margin: 0,
                }}
              >
                Ancient Empires
              </p>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: '14px',
                  color: 'rgba(240, 236, 226, 0.88)',
                }}
              >
                Interactive history platform
              </p>
            </div>

            <nav aria-label="Primary">
              <ul
                style={{
                  display: 'flex',
                  gap: '16px',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  flexWrap: 'wrap',
                }}
              >
                <li>
                  <a
                    href="#empires"
                    style={{
                      color: '#f7e7b0',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Explore empires
                  </a>
                </li>
                <li>
                  <a
                    href="#highlights"
                    style={{
                      color: 'rgba(240, 236, 226, 0.92)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Platform highlights
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <section
          aria-labelledby="home-hero-title"
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
              padding: '64px 24px 48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              alignItems: 'center',
              gap: '36px',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 18px',
                  color: '#f7d991',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                Maps, timelines, rulers, and places
              </p>
              <h1
                id="home-hero-title"
                style={{
                  margin: '0 0 18px',
                  fontFamily: 'var(--font-playfair), serif',
                  fontSize: 'clamp(3rem, 8vw, 5.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '0.03em',
                  color: '#fff7dd',
                }}
              >
                Ancient Empires
              </h1>
              <p
                style={{
                  maxWidth: '40rem',
                  margin: '0 0 28px',
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'rgba(240, 236, 226, 0.92)',
                }}
              >
                Explore four of history&apos;s most influential empires through
                interactive maps, curated timelines, ruler encyclopaedias, and
                place-based storytelling designed for fast discovery.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <a
                  href="#empires"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '48px',
                    padding: '0 24px',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(135deg, #f2cf73 0%, #c69b3e 100%)',
                    color: '#1a1307',
                    textDecoration: 'none',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    boxShadow: '0 10px 28px rgba(198, 155, 62, 0.18)',
                  }}
                >
                  Begin the journey
                </a>
                <a
                  href="#highlights"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '48px',
                    padding: '0 24px',
                    borderRadius: '999px',
                    border: '1px solid rgba(240, 236, 226, 0.22)',
                    background: 'rgba(240, 236, 226, 0.02)',
                    color: '#f0ece2',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  See what is included
                </a>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                justifySelf: 'center',
                width: '100%',
                maxWidth: '520px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '-18px',
                  borderRadius: '28px',
                  background:
                    'radial-gradient(circle at top, rgba(232, 197, 71, 0.28), transparent 60%)',
                  filter: 'blur(30px)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(240, 236, 226, 0.12)',
                  background:
                    'linear-gradient(180deg, rgba(240, 236, 226, 0.06), rgba(240, 236, 226, 0.02))',
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
                }}
              >
                <Image
                  src="/og-fallback.png"
                  alt="Ancient Empires title artwork"
                  width={1200}
                  height={630}
                  priority
                  sizes="(min-width: 1024px) 520px, (min-width: 768px) 46vw, 92vw"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="highlights"
          aria-labelledby="highlights-title"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0 24px 28px',
          }}
        >
          <h2
            id="highlights-title"
            style={{
              margin: '0 0 18px',
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '2rem',
              color: '#fff2cc',
            }}
          >
            Platform highlights
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  borderRadius: '18px',
                  padding: '18px',
                  border: '1px solid rgba(240, 236, 226, 0.1)',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 6px',
                    fontFamily: 'var(--font-playfair), serif',
                    fontSize: '1.9rem',
                    color: '#f3d37e',
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    color: 'rgba(240, 236, 226, 0.9)',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="empires"
          aria-labelledby="empires-title"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '32px 24px 72px',
          }}
        >
          <h2
            id="empires-title"
            style={{
              margin: '0 0 22px',
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '2rem',
              color: '#fff2cc',
            }}
          >
            Choose an empire
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '18px',
            }}
          >
            {empires.map((empire) => {
              const cardContent = (
                <>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '999px',
                      background: `linear-gradient(90deg, ${empire.accentSoft}, ${empire.accent})`,
                      marginBottom: '22px',
                    }}
                  />
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: empire.accentSoft,
                    }}
                  >
                    {empire.period}
                  </p>
                  <h3
                    style={{
                      margin: '0 0 6px',
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: '1.7rem',
                      lineHeight: 1.2,
                      color: '#fff7e8',
                    }}
                  >
                    {empire.name}
                  </h3>
                  <p
                    dir={empire.nativeNameDirection ?? 'ltr'}
                    style={{
                      margin: '0 0 14px',
                      fontSize: '0.97rem',
                      lineHeight: 1.5,
                      color: 'rgba(240, 236, 226, 0.88)',
                      fontFamily:
                        empire.nativeNameDirection === 'rtl'
                          ? 'var(--font-noto-sans-arabic), var(--font-dm-sans), sans-serif'
                          : 'inherit',
                    }}
                  >
                    {empire.nativeName}
                  </p>
                  <p
                    style={{
                      margin: '0 0 20px',
                      fontSize: '0.98rem',
                      lineHeight: 1.7,
                      color: 'rgba(240, 236, 226, 0.92)',
                      flexGrow: 1,
                    }}
                  >
                    {empire.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      borderTop: '1px solid rgba(240, 236, 226, 0.1)',
                      paddingTop: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: '0 0 4px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'rgba(240, 236, 226, 0.82)',
                        }}
                      >
                        {empire.statLabel}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-playfair), serif',
                          fontSize: '1.25rem',
                          color: empire.accentSoft,
                        }}
                      >
                        {empire.statValue}
                      </p>
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        color: empire.accentSoft,
                      }}
                    >
                      {empire.href ? 'Explore' : 'Coming soon'}
                    </span>
                  </div>
                </>
              );

              const cardStyle = {
                display: 'flex',
                flexDirection: 'column' as const,
                minHeight: '100%',
                borderRadius: '22px',
                padding: '24px',
                border: `1px solid ${empire.border}`,
                background: empire.surface,
                boxShadow: '0 18px 44px rgba(0, 0, 0, 0.28)',
                textDecoration: 'none',
                color: 'inherit',
              };

              return empire.href ? (
                <Link
                  key={empire.id}
                  href={empire.href}
                  aria-label={`Explore the ${empire.name}`}
                  style={cardStyle}
                >
                  {cardContent}
                </Link>
              ) : (
                <article
                  key={empire.id}
                  style={cardStyle}
                  aria-label={empire.name}
                >
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
