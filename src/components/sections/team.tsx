"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";

export default function Team() {
  const members = [
    {
      name: 'Mame Diaw',
      role: 'Executive Director',
      email: 'mamediaw@xaritoo.org',
      bio: "Leading Xaritoo's mission to empower young people through mentorship, culture, and connection as a program of Sen Path Community.",
      initials: 'MD',
      color: C.purplePrimary,
    },
    {
      name: 'El Hadji Dioum',
      role: 'Program Coordinator',
      email: '',
      bio: "Coordinating Xaritoo's programs and ensuring every Seed, Gardener, and Garden has the support they need throughout each season.",
      initials: 'ED',
      color: C.greenGrowth,
    },
    {
      name: 'Mahamadou Ndiaye',
      role: 'Safety & Safeguarding Supervisor',
      email: '',
      bio: "Ensuring the safety, well-being, and protection of all program participants across Xaritoo's mentorship and club activities.",
      initials: 'MN',
      color: C.goldPrimary,
    },
  ]

  return (
    <section style={{ background: C.white, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Our Team</SectionLabel>
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
            The People Behind Xaritoo
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {members.map((m) => (
            <div
              key={m.name}
              style={{
                background: C.bgSoft,
                borderRadius: 20,
                padding: '36px 28px',
                border: `1px solid rgba(91,44,131,0.08)`,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,44,131,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: m.color,
                  color: C.white,
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  letterSpacing: '0.02em',
                }}
              >
                {m.initials}
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: C.textDark, marginBottom: 4 }}>
                {m.name}
              </h3>
              <p style={{ fontSize: 13, fontWeight: 600, color: m.color, marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {m.role}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: C.textBody, marginBottom: m.email ? 16 : 0 }}>
                {m.bio}
              </p>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  style={{ fontSize: 14, color: C.purplePrimary, textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  <Icon name="mail" size={14} /> {m.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section:has(h2) > div > div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────
