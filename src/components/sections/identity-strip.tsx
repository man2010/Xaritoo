import { colors as C } from "@/lib/design-tokens";

export default function IdentityStrip() {
  return (
    <section
      style={{
        background: C.purplePrimary,
        padding: '36px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(18px, 3vw, 26px)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: C.white,
          marginBottom: 8,
        }}
      >
        Mentorship&nbsp;&nbsp;·&nbsp;&nbsp;Culture&nbsp;&nbsp;·&nbsp;&nbsp;Connection
      </p>
      <p
        style={{
          fontSize: 14,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.goldLight,
          fontWeight: 600,
        }}
      >
        No Seed Grows Alone.
      </p>
    </section>
  )
}

// ─── Section label component ──────────────────────────────────────────────────
