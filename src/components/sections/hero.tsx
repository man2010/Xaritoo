"use client";

import { colors as C, unsplashImage as img } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: C.purpleDark,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image with dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${img('1517486808906-6ca8b3f04846', 1600, 1000)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.22,
        }}
        aria-hidden
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${C.purpleDark} 40%, ${C.purplePrimary}88 100%)`,
        }}
        aria-hidden
      />

      {/* Decorative gold accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '30%',
          width: 4,
          height: '40%',
          background: C.goldPrimary,
          borderRadius: '0 2px 2px 0',
        }}
        aria-hidden
      />

      <div
        style={{
          position: 'relative',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '120px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left: text content */}
        <div>
          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span
              style={{
                display: 'inline-block',
                width: 32,
                height: 2,
                background: C.goldPrimary,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: C.goldLight,
              }}
            >
              A Program of Sen Path Community
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 62px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: C.white,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            Every Seed Deserves the Opportunity{' '}
            <em style={{ fontStyle: 'italic', color: C.goldLight }}>to Grow.</em>
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.78)',
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            Helping young people grow through mentorship, culture, and connection.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <a
              href="/get-involved?role=mentor#apply"
              style={{
                background: C.goldPrimary,
                color: C.textDark,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                padding: '14px 28px',
                borderRadius: 10,
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C99A30'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.goldPrimary
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Become a Mentor
            </a>
            <a
              href="/get-involved?role=mentee#apply"
              style={{
                background: 'rgba(226,200,120,0.12)',
                color: C.goldLight,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 700,
                padding: '14px 24px',
                borderRadius: 10,
                border: `1.5px solid rgba(226,200,120,0.45)`,
                display: 'inline-block',
              }}
            >
              Become a Mentee
            </a>
            <a
              href="/get-involved?role=support#apply"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: C.white,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 600,
                padding: '14px 28px',
                borderRadius: 10,
                border: `1.5px solid rgba(255,255,255,0.28)`,
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            >
              Support Xaritoo
            </a>
            <a
              href="#about"
              style={{
                color: C.goldLight,
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 500,
                marginLeft: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'gap 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
              onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
            >
              Learn More About Xaritoo →
            </a>
          </div>
        </div>

        {/* Right: floating stat card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `1px solid rgba(255,255,255,0.14)`,
              borderRadius: 20,
              padding: '32px',
              backdropFilter: 'blur(12px)',
              maxWidth: 320,
              width: '100%',
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.goldLight,
                marginBottom: 24,
              }}
            >
              2026 Inaugural Summer Pilot
            </p>
            {[
              { icon: 'seed', num: '31', label: 'Youth — Seeds' },
              { icon: 'sprout', num: '15', label: 'Mentors — Gardeners' },
              { icon: 'tree', num: '7', label: 'Supervisors — Gardens' },
              { icon: 'users', num: '53', label: 'Total Participants' },
            ].map((s) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                }}
              >
                <Icon name={s.icon} size={23} style={{ color: C.goldLight, flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.white,
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #home > div:last-of-type > div {
            grid-template-columns: 1fr !important;
          }
          #home > div:last-of-type > div > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}

// ─── Identity Strip ───────────────────────────────────────────────────────────
