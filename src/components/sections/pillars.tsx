"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";

export default function Pillars() {
  const pillars = [
    {
      icon: 'handshake',
      title: 'Mentorship',
      text: 'One-on-one relationships with trained mentors who provide guidance, accountability, and encouragement — helping young people build confidence and develop leadership skills.',
    },
    {
      icon: 'globe',
      title: 'Culture',
      text: 'Celebrating cultural identity as a source of strength. We help youth embrace their heritage while navigating American life, honoring who they are and where they come from.',
    },
    {
      icon: 'link',
      title: 'Connection',
      text: 'Building lasting friendships, family engagement, and community ties that create a network of belonging — because lasting growth happens in relationship with others.',
    },
  ]

  return (
    <section style={{ background: C.purpleLavender, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Our Approach</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              letterSpacing: '-0.02em',
            }}
          >
            Three Pillars of Growth
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 20,
                padding: '40px 32px',
                borderBottom: `4px solid ${C.purplePrimary}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(91,44,131,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Icon name={p.icon} size={40} style={{ color: C.purplePrimary, marginBottom: 20 }} />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 26,
                  fontWeight: 700,
                  color: C.textDark,
                  marginBottom: 12,
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: C.textBody }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section:has(h2:contains("Three Pillars")) > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ─── Club join form (used inside Programs expanded panel) ────────────────────
