'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

type TimelineEvent = {
  id: number;
  year: number;
  title: string;
  category: 'political' | 'military' | 'cultural';
  desc: string;
  ruler: string | null;
};

type Category = {
  label: string;
  color: string;
  glow: string;
  bg: string;
};

/* ================================================================
   DATA
   ================================================================ */
const EVENTS: TimelineEvent[] = [
  {
    id: 1,
    year: -753,
    title: 'Founding of Rome',
    category: 'political',
    desc: 'Romulus founds the city of Rome on the Palatine Hill, establishing the monarchy that would last two and a half centuries. The date, April 21st, would be celebrated as the birthday of the Eternal City.',
    ruler: 'Romulus',
  },
  {
    id: 2,
    year: -509,
    title: 'Birth of the Republic',
    category: 'political',
    desc: 'The expulsion of Tarquinius Superbus ends the Roman monarchy. Two consuls are elected for the first time, inaugurating the Republic and the principle that no single man should hold absolute power.',
    ruler: null,
  },
  {
    id: 3,
    year: -390,
    title: 'Gauls sack Rome',
    category: 'military',
    desc: 'A Celtic army under Brennus defeats the Romans at the Battle of the Allia and occupies most of the city. The humiliation drives Rome to rebuild its walls and reform its army.',
    ruler: null,
  },
  {
    id: 4,
    year: -312,
    title: 'Via Appia begun',
    category: 'cultural',
    desc: 'Censor Appius Claudius Caecus begins construction of the first great Roman road — the Queen of Roads — connecting Rome to Capua and eventually to Brindisi.',
    ruler: null,
  },
  {
    id: 5,
    year: -264,
    title: 'First Punic War begins',
    category: 'military',
    desc: 'Rome and Carthage clash over Sicily, beginning a struggle for Mediterranean supremacy that will span three wars and more than a century.',
    ruler: null,
  },
  {
    id: 6,
    year: -216,
    title: 'Battle of Cannae',
    category: 'military',
    desc: "Hannibal's double envelopment destroys eight Roman legions — perhaps 50,000 men — in a single afternoon. The worst military defeat in Roman history, yet Rome refuses to surrender.",
    ruler: null,
  },
  {
    id: 7,
    year: -146,
    title: 'Destruction of Carthage',
    category: 'military',
    desc: 'Roman legions raze Carthage to the ground after a three-year siege. The city is burned, its people enslaved, and the western Mediterranean becomes a Roman lake.',
    ruler: null,
  },
  {
    id: 8,
    year: -73,
    title: 'Spartacus revolt',
    category: 'military',
    desc: 'The gladiator Spartacus leads a massive slave rebellion that terrifies Rome for two years. Crassus finally crushes the revolt; 6,000 crucified along the Appian Way.',
    ruler: null,
  },
  {
    id: 9,
    year: -49,
    title: 'Caesar crosses the Rubicon',
    category: 'political',
    desc: "Julius Caesar leads his legion across the small river marking the boundary of his province, igniting civil war. 'Alea iacta est' — the die is cast. The Republic will never recover.",
    ruler: 'Julius Caesar',
  },
  {
    id: 10,
    year: -44,
    title: 'Assassination of Caesar',
    category: 'political',
    desc: 'On the Ides of March, a conspiracy of senators stabs Julius Caesar to death in the Theatre of Pompey. The act meant to save the Republic instead seals its fate.',
    ruler: 'Julius Caesar',
  },
  {
    id: 11,
    year: -31,
    title: 'Battle of Actium',
    category: 'military',
    desc: "Octavian's fleet crushes the combined forces of Mark Antony and Cleopatra in a decisive naval engagement off the coast of Greece, ending the last civil war of the Republic.",
    ruler: 'Augustus',
  },
  {
    id: 12,
    year: -27,
    title: 'Augustus becomes Emperor',
    category: 'political',
    desc: 'The Senate grants Octavian the title Augustus and extraordinary powers. The Republic transforms into the Principate — an empire disguised in republican clothing. The Pax Romana begins.',
    ruler: 'Augustus',
  },
  {
    id: 13,
    year: -19,
    title: 'Aeneid completed',
    category: 'cultural',
    desc: "Virgil dies, leaving instructions to burn his unfinished masterpiece. Augustus overrides the request. The Aeneid becomes Rome's national epic, linking the city's origins to the fall of Troy.",
    ruler: 'Augustus',
  },
  {
    id: 14,
    year: 9,
    title: 'Battle of Teutoburg Forest',
    category: 'military',
    desc: "Three Roman legions under Varus are annihilated by Germanic tribes led by Arminius. Augustus reportedly cried: 'Quintilius Varus, give me back my legions!' Rome never conquers Germany.",
    ruler: 'Augustus',
  },
  {
    id: 15,
    year: 43,
    title: 'Invasion of Britain',
    category: 'military',
    desc: 'Emperor Claudius sends four legions across the Channel, beginning the Roman conquest of Britain that will last four centuries.',
    ruler: 'Claudius',
  },
  {
    id: 16,
    year: 64,
    title: 'Great Fire of Rome',
    category: 'cultural',
    desc: 'A devastating fire burns for six days, destroying much of the city. Nero builds his lavish Domus Aurea on the cleared land. Christians are scapegoated and persecuted.',
    ruler: 'Nero',
  },
  {
    id: 17,
    year: 79,
    title: 'Eruption of Vesuvius',
    category: 'cultural',
    desc: 'Mount Vesuvius buries Pompeii and Herculaneum in volcanic ash, killing thousands but preserving the most complete snapshot of Roman daily life ever discovered.',
    ruler: 'Titus',
  },
  {
    id: 18,
    year: 80,
    title: 'Colosseum opens',
    category: 'cultural',
    desc: 'The Flavian Amphitheatre opens with 100 days of games. Capable of holding 50,000 spectators, it remains the largest amphitheatre ever built.',
    ruler: 'Titus',
  },
  {
    id: 19,
    year: 117,
    title: 'Empire at maximum extent',
    category: 'political',
    desc: 'Under Trajan, the Roman Empire reaches its greatest territorial extent — from Britain to Mesopotamia, over five million square kilometres of territory.',
    ruler: 'Trajan',
  },
  {
    id: 20,
    year: 122,
    title: "Hadrian's Wall begun",
    category: 'military',
    desc: "Emperor Hadrian orders a wall spanning the width of northern Britain — 120 kilometres of stone, turrets, and forts marking the Empire's most famous frontier.",
    ruler: 'Hadrian',
  },
  {
    id: 21,
    year: 180,
    title: 'Death of Marcus Aurelius',
    category: 'political',
    desc: "The philosopher-emperor dies at Vindobona. His Meditations endure as one of history's greatest works of Stoic philosophy. The Pax Romana ends.",
    ruler: 'Marcus Aurelius',
  },
  {
    id: 22,
    year: 212,
    title: 'Edict of Caracalla',
    category: 'political',
    desc: 'Emperor Caracalla extends Roman citizenship to all free inhabitants of the Empire — a revolutionary act that erases the distinction between conqueror and conquered.',
    ruler: 'Caracalla',
  },
  {
    id: 23,
    year: 284,
    title: 'Diocletian reforms the Empire',
    category: 'political',
    desc: 'Diocletian rises from military obscurity to save the Empire from crisis. He establishes the Tetrarchy, dividing power among four rulers.',
    ruler: 'Diocletian',
  },
  {
    id: 24,
    year: 312,
    title: 'Battle of the Milvian Bridge',
    category: 'military',
    desc: "Constantine defeats Maxentius at the gates of Rome. Legend holds he saw a cross of light: 'In hoc signo vinces.' Christianity's fate is sealed.",
    ruler: 'Constantine I',
  },
  {
    id: 25,
    year: 330,
    title: 'Constantinople founded',
    category: 'cultural',
    desc: 'Constantine inaugurates his new capital on the site of ancient Byzantium. Commanding the Bosporus, Constantinople will outlast Rome by a thousand years.',
    ruler: 'Constantine I',
  },
  {
    id: 26,
    year: 380,
    title: 'Christianity becomes state religion',
    category: 'political',
    desc: 'Theodosius I issues the Edict of Thessalonica, making Nicene Christianity the official state religion. Pagan temples begin to close across the Empire.',
    ruler: 'Theodosius I',
  },
  {
    id: 27,
    year: 410,
    title: 'Visigoths sack Rome',
    category: 'military',
    desc: "Alaric's Visigoths enter the Eternal City — the first foreign army to do so in eight hundred years. Saint Jerome weeps: 'If Rome can perish, what is safe?'",
    ruler: null,
  },
  {
    id: 28,
    year: 451,
    title: 'Battle of the Catalaunian Plains',
    category: 'military',
    desc: "A Roman-Visigothic coalition under Aetius halts Attila the Hun's invasion of Gaul — one of the last great victories fought under a Roman standard.",
    ruler: null,
  },
  {
    id: 29,
    year: 476,
    title: 'Fall of the Western Empire',
    category: 'political',
    desc: "Odoacer deposes Romulus Augustulus — a teenager bearing the names of Rome's founder and first emperor. No one fights to restore the throne. The West is finished.",
    ruler: 'Romulus Augustulus',
  },
];

const CATEGORIES: Record<string, Category> = {
  political: {
    label: 'Political',
    color: '#C9A84C',
    glow: 'rgba(201,168,76,0.15)',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(26,15,46,0.35) 0%, rgba(12,11,9,0) 70%)',
  },
  military: {
    label: 'Military',
    color: '#A03030',
    glow: 'rgba(160,48,48,0.15)',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(43,0,0,0.4) 0%, rgba(12,11,9,0) 70%)',
  },
  cultural: {
    label: 'Cultural',
    color: '#7A8B6F',
    glow: 'rgba(122,139,111,0.12)',
    bg: 'radial-gradient(ellipse at 50% 50%, rgba(28,25,20,0.4) 0%, rgba(12,11,9,0) 70%)',
  },
};

const ERAS = [
  { start: -753, end: -509, label: 'Kingdom' },
  { start: -509, end: -27, label: 'Republic' },
  { start: -27, end: 284, label: 'Principate' },
  { start: 284, end: 476, label: 'Dominate' },
];

/* ================================================================
   HELPERS
   ================================================================ */
const SCALE = 0.72;
const PAD = 120;
const AXIS_Y = 55;
const toX = (year: number) => (year + 800) * SCALE + PAD;
const TOTAL_W = toX(520);
const fmtYear = (y: number) => (y < 0 ? `${Math.abs(y)} BC` : `${y} AD`);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function HorizontalTimeline() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [journeyIdx, setJourneyIdx] = useState(-1);
  const [cardPhase, setCardPhase] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, sl: 0, moved: false });
  const rafRef = useRef<number | null>(null);
  const journeyRef = useRef({ playing: false, idx: -1 });

  const filtered =
    filter === 'all' ? EVENTS : EVENTS.filter((e) => e.category === filter);
  const activeEvent = EVENTS.find((e) => e.id === active);
  const activeCat = activeEvent ? CATEGORIES[activeEvent.category] : null;

  useEffect(() => {
    setTimeout(() => setReady(true), 150);
  }, []);

  /* Center on load */
  useEffect(() => {
    if (scrollRef.current) {
      const cx = toX(-27);
      scrollRef.current.scrollLeft = cx - scrollRef.current.clientWidth / 2;
    }
  }, []);

  /* ---- SMOOTH FLY-TO ---- */
  const flyTo = useCallback((year: number, dur = 1200) => {
    return new Promise<void>((resolve) => {
      const el = scrollRef.current;
      if (!el) {
        resolve();
        return;
      }
      const target = toX(year) - el.clientWidth / 2;
      const start = el.scrollLeft;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.scrollLeft = lerp(start, target, easeInOutCubic(p));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else resolve();
      };
      rafRef.current = requestAnimationFrame(step);
    });
  }, []);

  /* ---- JOURNEY AUTOPLAY ---- */
  const startJourney = useCallback(async () => {
    setShowIntro(false);
    setPlaying(true);
    journeyRef.current.playing = true;

    for (let i = 0; i < filtered.length; i++) {
      if (!journeyRef.current.playing) break;
      journeyRef.current.idx = i;
      setJourneyIdx(i);
      setCardPhase(0);
      setActive(filtered[i].id);

      await flyTo(filtered[i].year, i === 0 ? 1800 : 1400);
      if (!journeyRef.current.playing) break;

      /* Staggered card reveal */
      setCardPhase(1);
      await new Promise((r) => setTimeout(r, 250));
      if (!journeyRef.current.playing) break;
      setCardPhase(2);
      await new Promise((r) => setTimeout(r, 250));
      if (!journeyRef.current.playing) break;
      setCardPhase(3);

      /* Dwell time — longer for first/last, shorter in middle */
      const dwell = i === 0 || i === filtered.length - 1 ? 4000 : 2800;
      await new Promise((r) => setTimeout(r, dwell));
    }
    journeyRef.current.playing = false;
    setPlaying(false);
    setJourneyIdx(-1);
  }, [filtered, flyTo]);

  const stopJourney = useCallback(() => {
    journeyRef.current.playing = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPlaying(false);
  }, []);

  /* ---- DRAG TO SCROLL (interrupts autoplay) ---- */
  const onDown = useCallback(
    (e: React.PointerEvent) => {
      if (playing) stopJourney();
      const el = scrollRef.current;
      if (!el) return;
      drag.current = {
        active: true,
        x: e.clientX,
        sl: el.scrollLeft,
        moved: false,
      };
      el.style.cursor = 'grabbing';
      el.setPointerCapture(e.pointerId);
    },
    [playing, stopJourney]
  );

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active || !scrollRef.current) return;
    scrollRef.current.scrollLeft =
      drag.current.sl - (e.clientX - drag.current.x);
  }, []);

  const onUp = useCallback(() => {
    drag.current.active = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  }, []);

  /* ---- SELECT EVENT (manual click) ---- */
  const selectEvent = useCallback(
    (ev: TimelineEvent) => {
      if (playing) stopJourney();
      setActive(ev.id);
      setCardPhase(0);
      flyTo(ev.year, 800).then(() => {
        setCardPhase(1);
        setTimeout(() => setCardPhase(2), 200);
        setTimeout(() => setCardPhase(3), 400);
      });
    },
    [playing, stopJourney, flyTo]
  );

  /* ---- PARALLAX YEAR INDICATOR ---- */
  const [parallaxYear, setParallaxYear] = useState('');
  const [parallaxX, setParallaxX] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handle = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const year = Math.round((center - PAD) / SCALE - 800);
      setParallaxYear(fmtYear(Math.max(-753, Math.min(476, year))));
      setParallaxX(-el.scrollLeft * 0.5);
    };
    el.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => el.removeEventListener('scroll', handle);
  }, []);

  return (
    <ErrorBoundary moduleName="Timeline">
      <div
        style={{
          height: '100vh',
          background: '#0C0B09',
          color: '#F0ECE2',
          fontFamily: "'DM Sans', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ===== ATMOSPHERE — category-reactive ===== */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background 1.2s ease',
          background:
            activeCat?.bg ||
            'radial-gradient(ellipse at 50% 50%, rgba(20,18,14,0.3) 0%, rgba(12,11,9,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />
      {/* Noise */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.02,
        }}
      >
        <filter id="n">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            seed="9"
          />
        </filter>
        <rect width="100%" height="100%" fill="#fff" filter="url(#n)" />
      </svg>

      {/* ===== PARALLAX YEAR — deep background ===== */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          zIndex: 0,
          pointerEvents: 'none',
          transform: `translateY(-50%) translateX(${parallaxX}px)`,
          left: '10%',
          right: '-30%',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(120px, 22vw, 260px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'rgba(240,236,226,0.025)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          letterSpacing: '0.04em',
          transition: 'transform 0.05s linear',
          userSelect: 'none',
        }}
      >
        {parallaxYear}
      </div>

      {/* ===== HEADER ===== */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '24px 32px 0',
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'all 0.8s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.4)',
                fontWeight: 500,
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '1px',
                  background: 'rgba(201,168,76,0.25)',
                }}
              />
              Imperium Romanum
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(24px, 3.5vw, 34px)',
                fontWeight: 600,
                margin: '0 0 3px',
                background:
                  'linear-gradient(135deg, #E8C547, #C9A84C, #A8893A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.03em',
                textWrap: 'balance',
              }}
            >
              Timeline of Events
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(240,236,226,0.4)',
                margin: 0,
              }}
            >
              {filtered.length} events &middot; 753 BC – 476 AD
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Journey button */}
            <button
              onClick={playing ? stopJourney : startJourney}
              style={{
                padding: '9px 20px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                border: '1px solid',
                borderColor: playing
                  ? 'rgba(160,48,48,0.4)'
                  : 'rgba(201,168,76,0.3)',
                background: playing
                  ? 'rgba(160,48,48,0.12)'
                  : 'rgba(201,168,76,0.08)',
                color: playing
                  ? 'rgba(240,236,226,0.85)'
                  : 'rgba(201,168,76,0.85)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                lineHeight: 1,
              }}
            >
              {playing ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="4"
                      height="10"
                      rx="1"
                      fill="currentColor"
                    />
                    <rect
                      x="7"
                      y="1"
                      width="4"
                      height="10"
                      rx="1"
                      fill="currentColor"
                    />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 1L10.5 6L2.5 11V1Z" fill="currentColor" />
                  </svg>
                  Begin Journey
                </>
              )}
            </button>

            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'rgba(240,236,226,0.06)',
                margin: '0 4px',
              }}
            />

            {/* Category filters */}
            {[
              {
                key: 'all',
                label: 'All',
                color: undefined as string | undefined,
              },
              ...Object.entries(CATEGORIES).map(([k, v]) => ({
                key: k,
                label: v.label,
                color: v.color as string | undefined,
              })),
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  if (playing) stopJourney();
                  setFilter(f.key);
                  setActive(null);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: 'pointer',
                  lineHeight: 1,
                  border: `1px solid ${filter === f.key ? 'rgba(201,168,76,0.25)' : 'rgba(240,236,226,0.07)'}`,
                  background:
                    filter === f.key ? 'rgba(201,168,76,0.06)' : 'transparent',
                  color:
                    filter === f.key
                      ? 'rgba(240,236,226,0.8)'
                      : 'rgba(240,236,226,0.35)',
                  transition: 'all 0.25s ease',
                }}
              >
                {f.color && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: f.color,
                      marginRight: '5px',
                      opacity: filter === f.key ? 0.9 : 0.35,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== INTRO OVERLAY ===== */}
      {showIntro && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(ellipse at center, rgba(12,11,9,0.85) 0%, rgba(12,11,9,0.97) 100%)',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '480px',
              padding: '0 24px',
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 6vw, 52px)',
                fontWeight: 300,
                letterSpacing: '0.06em',
                marginBottom: '12px',
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  display: 'block',
                  color: 'rgba(240,236,226,0.6)',
                  fontWeight: 300,
                }}
              >
                A Thousand Years
              </span>
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #F4D03F, #C9A84C, #A8893A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  fontStyle: 'italic',
                }}
              >
                of Rome
              </span>
            </div>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(240,236,226,0.4)',
                lineHeight: 1.65,
                marginBottom: '32px',
              }}
            >
              From the mythical founding to the fall of the last emperor — an
              interactive journey through {EVENTS.length} pivotal moments.
            </p>
            <button
              onClick={startJourney}
              style={{
                padding: '14px 36px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: '2px solid transparent',
                background:
                  'linear-gradient(#0C0B09, #0C0B09) padding-box, linear-gradient(135deg, #E8C547, #C9A84C) border-box',
                color: '#E8C547',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 1L12 7L3 13V1Z" fill="#E8C547" />
              </svg>
              Begin the Journey
            </button>
            <div style={{ marginTop: '20px' }}>
              <span
                onClick={() => setShowIntro(false)}
                style={{
                  fontSize: '12px',
                  color: 'rgba(240,236,226,0.25)',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(240,236,226,0.08)',
                  paddingBottom: '2px',
                }}
              >
                or explore manually
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== TIMELINE SCROLL AREA ===== */}
      <div
        ref={scrollRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={() => {
          if (!drag.current.moved) {
            setActive(null);
            setCardPhase(0);
          }
        }}
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          position: 'relative',
          zIndex: 10,
          cursor: 'grab',
          opacity: ready && !showIntro ? 1 : showIntro ? 0.15 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <div style={{ width: TOTAL_W, height: '100%', position: 'relative' }}>
          {/* SVG Timeline */}
          <svg
            width={TOTAL_W}
            height="100%"
            viewBox={`0 0 ${TOTAL_W} 120`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              display: 'block',
              minHeight: '200px',
              position: 'relative',
            }}
          >
            {/* Era bands */}
            {ERAS.map((era, i) => {
              const x1 = toX(era.start),
                x2 = toX(era.end);
              return (
                <g key={era.label}>
                  <rect
                    x={x1}
                    y={0}
                    width={x2 - x1}
                    height={120}
                    fill={
                      i % 2 === 0 ? 'rgba(240,236,226,0.015)' : 'transparent'
                    }
                  />
                  <text
                    x={(x1 + x2) / 2}
                    y={16}
                    textAnchor="middle"
                    fill="rgba(240,236,226,0.08)"
                    fontSize="10"
                    fontFamily="'DM Sans',sans-serif"
                    fontWeight="500"
                    letterSpacing="2"
                  >
                    {era.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Axis */}
            <line
              x1={toX(-753)}
              y1={AXIS_Y}
              x2={toX(476)}
              y2={AXIS_Y}
              stroke="rgba(240,236,226,0.06)"
              strokeWidth="1"
            />

            {/* Century ticks */}
            {Array.from({ length: 14 }, (_, i) => (i - 7) * 100)
              .filter((y) => y >= -753 && y <= 476)
              .map((year) => (
                <g key={year}>
                  <line
                    x1={toX(year)}
                    y1={AXIS_Y - 4}
                    x2={toX(year)}
                    y2={AXIS_Y + 4}
                    stroke="rgba(240,236,226,0.08)"
                    strokeWidth="1"
                  />
                  <text
                    x={toX(year)}
                    y={AXIS_Y - 10}
                    textAnchor="middle"
                    fill="rgba(240,236,226,0.1)"
                    fontSize="9"
                    fontFamily="'DM Sans',sans-serif"
                  >
                    {fmtYear(year)}
                  </text>
                </g>
              ))}

            {/* Year Zero line */}
            <line
              x1={toX(0)}
              y1={22}
              x2={toX(0)}
              y2={105}
              stroke="rgba(201,168,76,0.08)"
              strokeWidth="1"
              strokeDasharray="4 3"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="28"
                to="0"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>

            {/* Event markers */}
            {filtered.map((ev) => {
              const x = toX(ev.year);
              const cat = CATEGORIES[ev.category];
              const isActive = active === ev.id;
              const isFaded = active !== null && !isActive;

              return (
                <g
                  key={ev.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectEvent(ev);
                  }}
                  style={{
                    cursor: 'pointer',
                    transition: 'opacity 0.5s ease, filter 0.5s ease',
                    opacity: isFaded ? 0.2 : 1,
                    filter: isFaded ? 'blur(1.5px)' : 'none',
                  }}
                >
                  {/* Pulse halo */}
                  {isActive && (
                    <>
                      <circle
                        cx={x}
                        cy={AXIS_Y}
                        r={20}
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="1"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="r"
                          values="12;24;12"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.35;0;0.35"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={x}
                        cy={AXIS_Y}
                        r={14}
                        fill={cat.color}
                        opacity="0.08"
                      />
                    </>
                  )}

                  {/* Stem */}
                  <line
                    x1={x}
                    y1={AXIS_Y - 16}
                    x2={x}
                    y2={AXIS_Y}
                    stroke={isActive ? cat.color : 'rgba(240,236,226,0.1)'}
                    strokeWidth={isActive ? 1.5 : 0.7}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Dot */}
                  <circle
                    cx={x}
                    cy={AXIS_Y}
                    r={isActive ? 6 : 4}
                    fill={isActive ? cat.color : 'rgba(240,236,226,0.1)'}
                    stroke={cat.color}
                    strokeWidth={isActive ? 2 : 0.8}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Year — above stem */}
                  <text
                    x={x}
                    y={AXIS_Y - 22}
                    textAnchor="middle"
                    fill={
                      isActive
                        ? 'rgba(240,236,226,0.65)'
                        : 'rgba(240,236,226,0.0)'
                    }
                    fontSize="10"
                    fontFamily="'DM Sans',sans-serif"
                    fontWeight="500"
                    style={{ transition: 'fill 0.3s ease' }}
                  >
                    {fmtYear(ev.year)}
                  </text>

                  {/* Title — below axis */}
                  {isActive && (
                    <foreignObject
                      x={x - 90}
                      y={AXIS_Y + 12}
                      width={180}
                      height={40}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'rgba(240,236,226,0.85)',
                          fontFamily: "'DM Sans',sans-serif",
                          lineHeight: 1.3,
                        }}
                      >
                        {ev.title}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ===== FLOATING CODEX CARD ===== */}
      {activeEvent && !showIntro && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(16px, 4vh, 32px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(580px, calc(100% - 32px))',
            zIndex: 25,
            borderRadius: '18px',
            background: 'rgba(18,16,12,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${activeCat?.color || 'rgba(240,236,226,0.1)'}22`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 60px ${activeCat?.glow || 'transparent'}, inset 0 1px 0 rgba(255,255,255,0.04)`,
            overflow: 'hidden',
            animation: 'codexIn 0.5s cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: '2px',
              background: `linear-gradient(90deg, transparent 5%, ${activeCat?.color || '#C9A84C'} 50%, transparent 95%)`,
              opacity: 0.5,
            }}
          />

          <div style={{ padding: '24px 28px 28px', position: 'relative' }}>
            {/* Close */}
            <div
              onClick={() => {
                setActive(null);
                setCardPhase(0);
              }}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'rgba(240,236,226,0.3)',
                border: '1px solid rgba(240,236,226,0.06)',
                background: 'rgba(240,236,226,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              &times;
            </div>

            {/* Phase 1: Year + Category (fade in first) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px',
                opacity: cardPhase >= 1 ? 1 : 0,
                transform: cardPhase >= 1 ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s ease',
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '26px',
                  fontWeight: 600,
                  color: activeCat?.color || '#C9A84C',
                  opacity: 0.75,
                }}
              >
                {fmtYear(activeEvent.year)}
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: `${activeCat?.color || '#C9A84C'}12`,
                  border: `1px solid ${activeCat?.color || '#C9A84C'}30`,
                  fontSize: '10px',
                  color: activeCat?.color || '#C9A84C',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {activeCat?.label}
              </span>
              {activeEvent.ruler && (
                <span
                  style={{
                    fontSize: '13px',
                    color: 'rgba(240,236,226,0.35)',
                    fontStyle: 'italic',
                  }}
                >
                  {activeEvent.ruler}
                </span>
              )}
            </div>

            {/* Phase 2: Title */}
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(20px, 3.5vw, 26px)',
                fontWeight: 600,
                color: 'rgba(240,236,226,0.92)',
                margin: '0 0 12px',
                lineHeight: 1.2,
                textWrap: 'balance',
                opacity: cardPhase >= 2 ? 1 : 0,
                transform: cardPhase >= 2 ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.5s ease 0.05s',
              }}
            >
              {activeEvent.title}
            </h3>

            {/* Phase 2: Divider */}
            <div
              style={{
                width: '45px',
                height: '1px',
                marginBottom: '14px',
                background: `linear-gradient(90deg, ${activeCat?.color || '#C9A84C'}, transparent)`,
                opacity: cardPhase >= 2 ? 0.35 : 0,
                transition: 'opacity 0.5s ease 0.1s',
              }}
            />

            {/* Phase 3: Description */}
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'rgba(240,236,226,0.6)',
                margin: 0,
                maxWidth: '520px',
                opacity: cardPhase >= 3 ? 1 : 0,
                transform: cardPhase >= 3 ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 0.6s ease 0.05s',
              }}
            >
              {activeEvent.desc}
            </p>
          </div>
        </div>
      )}

      {/* ===== EDGE FADES ===== */}
      {!showIntro && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '80px',
              zIndex: 12,
              pointerEvents: 'none',
              background:
                'linear-gradient(90deg, rgba(12,11,9,0.9), transparent)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '80px',
              zIndex: 12,
              pointerEvents: 'none',
              background:
                'linear-gradient(270deg, rgba(12,11,9,0.9), transparent)',
            }}
          />
        </>
      )}

      {/* ===== JOURNEY PROGRESS ===== */}
      {playing && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            zIndex: 26,
            background: 'rgba(240,236,226,0.03)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((journeyIdx + 1) / filtered.length) * 100}%`,
              background: 'linear-gradient(90deg, #8B0000, #C9A84C)',
              transition: 'width 1.2s ease',
              opacity: 0.6,
            }}
          />
        </div>
      )}

        <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
        ::selection { background: rgba(201,168,76,0.3); color: #F0ECE2 }
        button { font-family: inherit }
        div::-webkit-scrollbar { height: 0; width: 0 }
        div { scrollbar-width: none }
        @keyframes codexIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.97) }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1) }
        }
        @media (max-width: 640px) {
          header { padding: 16px 16px 0 !important }
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
}
