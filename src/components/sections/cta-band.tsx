"use client";

import { colors as C } from "@/lib/design-tokens";
import { applicationUrlFor } from "@/lib/application-links";

export default function CTABand() {
  return (
    <section
      id="join-as"
      style={{
        background: `linear-gradient(135deg, ${C.purpleDark} 0%, ${C.purplePrimary} 50%, ${C.greenGrowth}CC 100%)`,
        padding: '96px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 60% 40%, rgba(181,138,42,0.12) 0%, transparent 60%)`,
        }}
        aria-hidden
      />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.goldLight,
            marginBottom: 16,
          }}
        >
          Join Us
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(30px, 4vw, 52px)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: C.white,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          Be Part of the Garden.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', marginBottom: 40 }}>
          Every young person deserves a Gardener. Whether you mentor, volunteer, partner, or give —
          your involvement grows the whole community.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {[
            { label: 'Become a Mentor', role: 'mentor', primary: true },
            { label: 'Become a Mentee', role: 'mentee', primary: true },
            { label: 'Volunteer', role: 'volunteer', primary: false },
            { label: 'Community Partner', role: 'partner', primary: false },
            { label: 'Support Xaritoo', role: 'support', primary: false },
          ].map((btn) => (
            <a
              key={btn.label}
              href={applicationUrlFor(btn.role)}
              target={btn.role === 'mentor' || btn.role === 'mentee' ? '_blank' : undefined}
              rel={btn.role === 'mentor' || btn.role === 'mentee' ? 'noopener noreferrer' : undefined}
              style={{
                background: btn.primary ? C.goldPrimary : 'rgba(255,255,255,0.12)',
                color: btn.primary ? C.textDark : C.white,
                border: btn.primary ? 'none' : `1.5px solid rgba(255,255,255,0.3)`,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 600,
                padding: '12px 22px',
                borderRadius: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = btn.primary
                  ? '#C99A30'
                  : 'rgba(255,255,255,0.2)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = btn.primary
                  ? C.goldPrimary
                  : 'rgba(255,255,255,0.12)')
              }
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
