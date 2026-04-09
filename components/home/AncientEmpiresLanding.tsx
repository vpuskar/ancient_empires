'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Empire = {
  id: number;
  slug: string;
  name: string;
  nativeName: string;
  period: string;
  color: string;
  colorLight: string;
  gradient: string;
  description: string;
  stat: { label: string; value: string };
  rulers: number | string;
  places: string;
};

const EMPIRES: Empire[] = [
  {
    id: 1,
    slug: 'roman',
    name: 'Roman Empire',
    nativeName: 'Imperium Romanum',
    period: '509 BC – 476 AD',
    color: '#8B0000',
    colorLight: '#B22222',
    gradient: 'linear-gradient(135deg, #8B0000 0%, #4A0000 100%)',
    description:
      'From a city-state on the Tiber to the master of the Mediterranean. Law, roads, and legions that shaped Western civilisation for two millennia.',
    stat: { label: 'Peak extent', value: '5M km²' },
    rulers: 68,
    places: '7,600+',
  },
  {
    id: 2,
    slug: 'chinese',
    name: 'Chinese Empire',
    nativeName: '中華帝國',
    period: '221 BC – 1912 AD',
    color: '#FFD700', // Zlatno žuta (Gold)
    colorLight: '#FFEC8B', // Svjetlija, krem žuta (LightGoldenrod)
    gradient: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', // Od zlatne do tamne senf/brončane
    description:
      'The longest continuous civilisation in human history. Dynasties rose and fell, but the Mandate of Heaven endured for over two thousand years.',
    stat: { label: 'Dynasties', value: '13 major' },
    rulers: '~200',
    places: 'Coming soon',
  },
  {
    id: 3,
    slug: 'japanese',
    name: 'Japanese Empire',
    nativeName: '日本帝國',
    period: '660 BC – 1945 AD',
    color: '#BC002D',
    colorLight: '#E6003A',
    gradient: 'linear-gradient(135deg, #BC002D 0%, #6B0019 100%)',
    description:
      'An island civilisation of samurai, shoguns, and emperors. From the mythical founding by Jimmu to the Meiji transformation that stunned the world.',
    stat: { label: 'Imperial line', value: '126 emperors' },
    rulers: '~125',
    places: 'Coming soon',
  },
  {
    id: 4,
    slug: 'ottoman',
    name: 'Ottoman Empire',
    nativeName: 'دولت عليه عثمانیه',
    period: '1299 – 1922 AD',
    color: '#1A6B3A',
    colorLight: '#228B47',
    gradient: 'linear-gradient(135deg, #1A6B3A 0%, #0E3D20 100%)',
    description:
      'From a small Anatolian beylik to a superpower bridging three continents. Six centuries of sultans, conquest, and cultural splendour at the crossroads of civilisation.',
    stat: { label: 'Sultans', value: '36' },
    rulers: 36,
    places: 'Coming soon',
  },
];

const STATS = [
  { value: 68, label: 'Rulers', suffix: '' },
  { value: 7608, label: 'Historical places', suffix: '+' },
  { value: 101, label: 'Battles mapped', suffix: '' },
  { value: 4377, label: 'Quiz questions', suffix: '+' },
  { value: 98, label: 'Key events', suffix: '' },
];

function getTextureOverlay(slug: string) {
  const base = {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
  };
  switch (slug) {
    case 'roman':
      return (
        <svg
          style={{ ...base, opacity: 0.08 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="marble"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="#8B0000" />
              <path
                d="M0,0 Q5,5 10,0 T20,0"
                stroke="#B22222"
                strokeWidth="0.5"
                fill="none"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#marble)" />
        </svg>
      );
    case 'chinese':
      return (
        <svg
          style={{ ...base, opacity: 0.06 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="ink"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="15" cy="15" r="2" fill="#DE2910" opacity="0.6" />
              <circle cx="5" cy="5" r="1" fill="#DE2910" opacity="0.3" />
              <circle cx="25" cy="25" r="1.5" fill="#DE2910" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#ink)" />
        </svg>
      );
    case 'japanese':
      return (
        <svg
          style={{ ...base, opacity: 0.07 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="waves"
              x="0"
              y="0"
              width="20"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,10 Q5,5 10,10 T20,10"
                stroke="#BC002D"
                strokeWidth="0.5"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M0,25 Q5,20 10,25 T20,25"
                stroke="#BC002D"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#waves)" />
        </svg>
      );
    case 'ottoman':
      return (
        <svg
          style={{ ...base, opacity: 0.05 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="geometric"
              x="0"
              y="0"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="5"
                y="5"
                width="15"
                height="15"
                fill="none"
                stroke="#1A6B3A"
                strokeWidth="0.5"
                opacity="0.6"
              />
              <circle
                cx="12.5"
                cy="12.5"
                r="3"
                fill="none"
                stroke="#228B47"
                strokeWidth="0.3"
                opacity="0.4"
              />
              <line
                x1="0"
                y1="12.5"
                x2="25"
                y2="12.5"
                stroke="#1A6B3A"
                strokeWidth="0.3"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#geometric)" />
        </svg>
      );
    default:
      return null;
  }
}

function EmpireCard({
  empire,
  index,
  isVisible,
  onNavigate,
}: {
  empire: Empire;
  index: number;
  isVisible: boolean;
  onNavigate: (slug: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isRoman = empire.id === 1;
  const delay = index * 0.15;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isRoman && onNavigate(empire.slug)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: isRoman ? 'pointer' : 'default',
        opacity: isVisible ? 1 : 0,
        transform:
          hovered && isVisible
            ? 'scale(1.02)'
            : isVisible
              ? 'scale(1)'
              : 'scale(0.95)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.3s ease`,
        border: `1px solid ${hovered ? empire.color + '99' : 'rgba(255,255,255,0.08)'}`,
        background: hovered
          ? `linear-gradient(180deg, ${empire.color}20 0%, transparent 60%)`
          : 'rgba(255,255,255,0.02)',
        minHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered
          ? `0 20px 60px ${empire.color}30, inset 0 0 60px ${empire.color}15`
          : '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      {getTextureOverlay(empire.slug)}

      <div
        style={{
          height: '3px',
          background: empire.gradient,
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.4s ease',
          boxShadow: hovered ? `0 0 20px ${empire.color}` : 'none',
        }}
      />

      <div
        style={{
          padding: '28px 24px 24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: empire.colorLight,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            marginBottom: '12px',
          }}
        >
          {empire.period}
        </div>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            fontWeight: 600,
            color: '#F0ECE2',
            margin: '0 0 4px',
            lineHeight: 1.2,
          }}
        >
          {empire.name}
        </h3>

        <div
          style={{
            fontFamily:
              empire.slug === 'ottoman'
                ? "'Noto Sans Arabic', 'DM Sans', sans-serif"
                : "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'rgba(240,236,226,0.4)',
            marginBottom: '16px',
            direction: empire.slug === 'ottoman' ? 'rtl' : 'ltr',
          }}
        >
          {empire.nativeName}
        </div>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            lineHeight: 1.65,
            color: 'rgba(240,236,226,0.6)',
            margin: '0 0 auto',
            paddingBottom: '20px',
          }}
        >
          {empire.description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '16px',
            marginTop: '4px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(240,236,226,0.35)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {empire.stat.label}
            </div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: empire.colorLight,
                fontFamily: "'Playfair Display', serif",
                marginTop: '2px',
              }}
            >
              {empire.stat.value}
            </div>
          </div>

          {isRoman ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: empire.colorLight,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                opacity: hovered ? 1 : 0.7,
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'all 0.3s ease',
              }}
            >
              Explore
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(240,236,226,0.3)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({
  end,
  duration = 2000,
  isVisible,
  suffix = '',
}: {
  end: number;
  duration?: number;
  isVisible: boolean;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);
  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

export default function AncientEmpiresLanding() {
  const router = useRouter();
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [btnHover, setBtnHover] = useState(false);
  const cardsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === cardsRef.current) setCardsVisible(true);
            if (entry.target === statsRef.current) setStatsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (cardsRef.current) observer.observe(cardsRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.02;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.02;
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0C0B09',
        color: '#F0ECE2',
        fontFamily: "'DM Sans', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=Noto+Sans+Arabic:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Papyrus texture */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.02,
        }}
      >
        <defs>
          <pattern
            id="papyrus"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="#0C0B09" />
            <circle cx="20" cy="30" r="1.5" fill="#C9A84C" opacity="0.4" />
            <circle cx="70" cy="60" r="1" fill="#C9A84C" opacity="0.3" />
            <circle cx="50" cy="20" r="0.8" fill="#C9A84C" opacity="0.25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#papyrus)" />
      </svg>

      {/* Ambient gradients */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(139,0,0,0.12) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(26,107,58,0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 40%, rgba(201,168,76,0.08) 0%, transparent 30%), radial-gradient(circle at 80% 60%, rgba(139,0,0,0.06) 0%, transparent 35%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(12,11,9,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Noise */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.03,
        }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            seed="1"
          />
        </filter>
        <rect width="100%" height="100%" fill="#ffffff" filter="url(#noise)" />
      </svg>

      {/* Hero */}
      <header
        ref={headerRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.8s ease',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(240,236,226,0.35)',
              marginBottom: '48px',
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'rgba(240,236,226,0.2)',
              }}
            />
            Interactive History Platform
            <div
              style={{
                width: '24px',
                height: '1px',
                background: 'rgba(240,236,226,0.2)',
              }}
            />
          </div>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(52px, 9vw, 100px)',
            fontWeight: 300,
            lineHeight: 0.9,
            margin: '0 0 20px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible
              ? `translateY(0) translateX(${parallax.x}px) translateY(${parallax.y * 0.5}px)`
              : 'translateY(30px)',
            transition: 'opacity 1s ease 0.15s, transform 0.15s ease-out',
            letterSpacing: '0.12em',
            fontVariant: 'small-caps',
          }}
        >
          <span
            style={{
              color: '#F0ECE2',
              display: 'block',
              letterSpacing: '0.15em',
              fontWeight: 300,
            }}
          >
            ANCIENT
          </span>
          <br />
          <span
            style={{
              background:
                'linear-gradient(135deg, #F4D03F 0%, #E8C547 15%, #D4AF37 30%, #C9A84C 50%, #B8983A 70%, #E8C547 85%, #F4D03F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '0.08em',
              display: 'block',
            }}
          >
            EMPIRES
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(240,236,226,0.60)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            fontWeight: 300,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease 0.35s',
            letterSpacing: '0.01em',
          }}
        >
          Explore four of history&apos;s greatest civilisations through
          interactive maps, animated timelines, and immersive storytelling.
        </p>

        {/* CTA */}
        <div
          onClick={() =>
            cardsRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            borderRadius: '100px',
            border: '2px solid transparent',
            background: btnHover
              ? 'linear-gradient(#1a1915, #1a1915) padding-box, linear-gradient(135deg, #E8C547, #C9A84C) border-box'
              : 'linear-gradient(#0C0B09, #0C0B09) padding-box, linear-gradient(135deg, #E8C547, #C9A84C) border-box',
            color: '#E8C547',
            fontFamily: "'Playfair Display', serif",
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease 0.45s',
            boxShadow: btnHover
              ? '0 0 30px rgba(232, 197, 71, 0.4), inset 0 0 20px rgba(232, 197, 71, 0.1)'
              : 'none',
          }}
        >
          Begin the Journey
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            marginTop: '48px',
            opacity: heroVisible ? 0.3 : 0,
            transition: 'opacity 1.5s ease 0.8s',
          }}
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            style={{ opacity: 0.5 }}
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="26"
              rx="9"
              stroke="#F0ECE2"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="8" r="2" fill="#F0ECE2">
              <animate
                attributeName="cy"
                values="8;18;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </header>

      {/* Divider */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '80px auto 0',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: '1px',
            width: '80px',
            background:
              'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            opacity: cardsVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      </div>

      {/* Cards */}
      <section
        ref={cardsRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '60px 24px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '36px',
            opacity: cardsVisible ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '1px',
              background: 'rgba(201,168,76,0.4)',
            }}
          />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.6)',
              fontWeight: 500,
            }}
          >
            Choose your civilisation
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {EMPIRES.map((empire, i) => (
            <EmpireCard
              key={empire.id}
              empire={empire}
              index={i}
              isVisible={cardsVisible}
              onNavigate={(slug) => router.push(`/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef}
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '48px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
            textAlign: 'center',
            opacity: statsVisible ? 1 : 0,
            transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '32px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #C9A84C, #A88B3D)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '4px',
                }}
              >
                <AnimatedCounter
                  end={stat.value}
                  isVisible={statsVisible}
                  suffix={stat.suffix}
                />
              </div>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,236,226,0.35)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(240,236,226,0.25)',
            fontWeight: 300,
            lineHeight: 1.6,
          }}
        >
          Ancient Empires — Interactive History Platform
          <br />
          Built with open data from Pleiades, Wikidata, and DARE Atlas
        </p>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(201,168,76,0.3); color: #F0ECE2; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0C0B09; }
        ::-webkit-scrollbar-thumb { background: rgba(240,236,226,0.15); border-radius: 3px; }
      `}</style>
    </div>
  );
}
