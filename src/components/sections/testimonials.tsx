import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "It made me get advice [from] other 1st generation kids who had experience.",
      name: 'Adji Ndiaye',
      role: 'Mentee (Seed)',
    },
    {
      quote: 'Met new people.',
      name: 'Binta Mbaye',
      role: 'Mentor (Gardener)',
    },
    {
      quote:
        "No seed grows alone. Congratulations to the entire Xaritoo family on this remarkable inaugural season.",
      name: 'Babacar Fall',
      role: 'Community Partner',
    },
  ]

  return (
    <section style={{ background: C.purpleLavender, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Voices from Our Community</SectionLabel>
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
            What Our Community Says
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              style={{
                background: C.white,
                borderRadius: 20,
                padding: '36px 30px',
                margin: 0,
                position: 'relative',
                border: `1px solid rgba(91,44,131,0.08)`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 64,
                  color: C.purpleLavender,
                  lineHeight: 0.6,
                  display: 'block',
                  marginBottom: 8,
                  userSelect: 'none',
                }}
                aria-hidden
              >
                "
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  color: C.textDark,
                  marginBottom: 24,
                }}
              >
                {t.quote}
              </p>
              <footer>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.textDark }}>{t.name}</div>
                <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{t.role}</div>
                {/* Internal annotation: ✓ Approved with consent */}
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 10,
                    fontSize: 11,
                    background: '#e8f5e9',
                    color: C.greenGrowth,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                  title="Internal annotation — not visible to site visitors"
                >
                  ✓ Approved with consent
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section:has([style*="Voices from Our Community"]) > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ─── Community Partners ───────────────────────────────────────────────────────
