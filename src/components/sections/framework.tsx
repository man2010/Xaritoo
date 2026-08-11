"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

export default function Framework() {
  const cards = [
    {
      icon: 'seed',
      image: '/images/xaritoo-mentee-model.jpeg',
      imageAlt: 'Xaritoo mentee emblem — I am a Seed, I am growing',
      role: 'Seed',
      who: 'Mentees',
      color: '#4F7D55',
      accentColor: '#A9D5AE',
      bgColor: 'rgba(79,125,85,0.12)',
      text: 'Seeds are the young people at the heart of Xaritoo — each with unique gifts, questions, and potential waiting to be cultivated with the right support, guidance, and community.',
    },
    {
      icon: 'sprout',
      image: '/images/xaritoo-mentor-model.jpeg',
      imageAlt: 'Xaritoo mentor emblem — I am a Gardener, I help Seeds grow',
      role: 'Gardener',
      who: 'Mentors',
      color: C.goldPrimary,
      accentColor: C.goldLight,
      bgColor: 'rgba(181,138,42,0.12)',
      text: 'Gardeners are dedicated mentors who walk alongside youth — providing encouragement, accountability, wisdom, and the care needed for each Seed to take root and flourish.',
    },
    {
      icon: 'tree',
      image: '/images/xaritoo-supervisor-model.jpeg',
      imageAlt: 'Xaritoo supervisor emblem — I am the Garden, I create the environment where growth happens',
      role: 'Garden',
      who: 'Supervisors & Community',
      color: C.purplePrimary,
      accentColor: '#D9B9F0',
      bgColor: 'rgba(91,44,131,0.15)',
      text: 'Gardens are the supervisors, families, and community partners who create the conditions for growth — building the environment where Seeds and Gardeners can thrive together.',
    },
  ]

  return (
    <section
      id="framework"
      style={{
        background: C.purpleDark,
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(91,44,131,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(79,125,85,0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel dark>Our Model</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.white,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            The Seed–Gardener–Garden Framework
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>
            A unique model connecting young people with mentors and community in a living ecosystem of growth.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.12)`,
                borderRadius: 20,
                padding: '36px 28px',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
            >
              {c.image ? (
                <div style={{ width: 160, height: 160, margin: '0 auto 24px', overflow: 'hidden', borderRadius: '50%', border: `3px solid ${c.accentColor}`, boxShadow: `0 12px 30px ${c.color}35` }}>
                  <Image src={c.image} alt={c.imageAlt} width={1254} height={1254} sizes="160px" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    background: c.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    marginBottom: 20,
                    border: `1px solid ${c.color}40`,
                    color: c.accentColor,
                  }}
                >
                  <Icon name={c.icon} size={32} />
                </div>
              )}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: c.accentColor,
                  marginBottom: 6,
                }}
              >
                {c.who}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.white,
                  marginBottom: 14,
                }}
              >
                {c.role}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #framework > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Impact ───────────────────────────────────────────────────────────────────
