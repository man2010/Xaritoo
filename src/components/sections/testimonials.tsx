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
    <section className="testimonials-section" style={{ background: C.purpleLavender, padding: '96px 24px' }}>
      <div className="testimonials-container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="testimonials-heading" style={{ textAlign: 'center', marginBottom: 56 }}>
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
          className="testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 24,
          }}
        >
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="testimonial-card"
              style={{
                background: C.white,
                borderRadius: 20,
                padding: '36px 30px',
                margin: 0,
                position: 'relative',
                border: `1px solid rgba(91,44,131,0.08)`,
                minWidth: 0,
                maxWidth: '100%',
                boxSizing: 'border-box',
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
        .testimonials-section {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .testimonials-container,
        .testimonials-grid,
        .testimonial-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        .testimonial-card p,
        .testimonial-card footer,
        .testimonial-card div {
          max-width: 100%;
          overflow-wrap: anywhere;
        }
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .testimonials-section { padding: 68px 16px !important; }
          .testimonials-heading { margin-bottom: 36px !important; }
          .testimonials-grid { gap: 16px !important; }
          .testimonial-card { padding: 28px 22px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Community Partners ───────────────────────────────────────────────────────
