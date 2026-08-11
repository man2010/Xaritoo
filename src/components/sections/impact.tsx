"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

export default function Impact() {
  const stats = [
    { icon: 'seed', num: '31', label: 'Youth (Seeds)', caption: 'enrolled in the program' },
    { icon: 'sprout', num: '15', label: 'Mentors (Gardeners)', caption: 'trained & dedicated' },
    { icon: 'tree', num: '7', label: 'Supervisors (Gardens)', caption: 'guiding the ecosystem' },
    { icon: 'users', num: '53', label: 'Total Participants', caption: 'growing together' },
  ]

  return (
    <section id="impact" style={{ background: C.bgSoft, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Our Impact</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Impact That Goes Beyond Numbers
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: C.textBody, maxWidth: 640, margin: '0 auto' }}>
            Every mentorship relationship helps young people build confidence, strengthen leadership
            skills, explore careers, develop meaningful friendships, and create positive lifelong
            connections.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            marginBottom: 56,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.white,
                borderRadius: 18,
                padding: '32px 24px',
                textAlign: 'center',
                border: `1px solid rgba(91,44,131,0.08)`,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,44,131,0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon name={s.icon} size={36} style={{ color: C.purplePrimary, margin: '0 auto 12px' }} />
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 52,
                  fontWeight: 700,
                  color: C.purplePrimary,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: C.textDark,
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.caption}</div>
            </div>
          ))}
        </div>

        <figure style={{ maxWidth: 560, margin: '0 auto 34px', padding: 10, background: C.white, borderRadius: 22, boxShadow: '0 22px 55px rgba(50,25,77,0.12)', border: '1px solid rgba(91,44,131,0.08)' }}>
          <Image
            src="/images/xaritoo-impact.jpeg"
            alt="Xaritoo Summer Pilot program materials prepared for participants"
            width={768}
            height={1024}
            sizes="(max-width: 640px) 92vw, 560px"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 14 }}
          />
          <figcaption style={{ padding: '13px 10px 5px', color: C.textMuted, fontSize: 12, lineHeight: 1.5, textAlign: 'center' }}>
            Resources prepared for participants in the Xaritoo Summer Pilot.
          </figcaption>
        </figure>

        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: C.textMuted,
          }}
        >
          2026 Inaugural Summer Pilot — Data reflects Xaritoo's first program cycle
        </p>

        {/* Impact list */}
        <div
          style={{
            marginTop: 56,
            background: C.purpleLavender,
            borderRadius: 20,
            padding: '40px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {[
            'Build confidence',
            'Strengthen leadership skills',
            'Explore careers and higher education',
            'Develop meaningful friendships',
            'Strengthen cultural identity',
            'Create positive lifelong connections',
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < 4 ? `1px solid rgba(91,44,131,0.1)` : 'none',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: C.greenGrowth,
                  color: C.white,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                }}
              >
                <Icon name="check" size={13} strokeWidth={3} />
              </span>
              <span style={{ fontSize: 16, color: C.textBody }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #impact > div > div:first-of-type + div { grid-template-columns: repeat(2, 1fr) !important; }
          #impact .impact-list { grid-template-columns: 1fr !important; padding: 24px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
