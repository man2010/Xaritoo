import SectionLabel from "@/components/ui/section-label";
import { colors as C, unsplashImage as img } from "@/lib/design-tokens";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      style={{ background: C.white, padding: '96px 24px' }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              right: 32,
              bottom: 32,
              background: C.purpleLavender,
              borderRadius: 20,
            }}
          />
          <Image
            src={img('1573497701240-345a300b8d36', 700, 500)}
            alt="Youth mentorship group gathering around a table"
            width={700}
            height={500}
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{
              position: 'relative',
              width: '100%',
              height: 420,
              objectFit: 'cover',
              borderRadius: 16,
              display: 'block',
            }}
          />
          {/* TODO: replace with approved consented Xaritoo photography */}
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              right: -20,
              background: C.purplePrimary,
              borderRadius: 14,
              padding: '16px 22px',
              color: C.white,
            }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700 }}>53</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Participants in 2026</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <SectionLabel>Who We Are</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            A Community Built Around Every Young Person's Potential
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.textBody, marginBottom: 16 }}>
            Xaritoo is a youth development initiative of Sen Path Community that empowers young
            people through mentorship, culture, and connection. We believe every young person has
            unique potential that flourishes when surrounded by caring mentors, supportive families,
            and a strong community.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.textBody, marginBottom: 16 }}>
            While Xaritoo welcomes youth from all backgrounds, we are especially committed to
            supporting first-generation American youth and children of immigrant families as they
            navigate school, identity, leadership, college, careers, and life in the United States.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.textBody, marginBottom: 32 }}>
            Through our unique Seed–Gardener–Garden model, we connect young people with dedicated
            mentors who provide guidance, encouragement, accountability, and meaningful relationships
            that help them grow into confident, responsible, and compassionate leaders.
          </p>

          {/* Vision callout */}
          <div
            style={{
              borderLeft: `4px solid ${C.goldPrimary}`,
              paddingLeft: 20,
              background: C.purpleLavender,
              padding: '16px 20px',
              borderRadius: '0 10px 10px 0',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 17,
                fontStyle: 'italic',
                lineHeight: 1.6,
                color: C.textDark,
                margin: 0,
              }}
            >
              "We envision a future where every young person has the support, opportunities, and
              confidence to reach their fullest potential — because{' '}
              <strong>No Seed Grows Alone.</strong>"
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #about > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Three Pillars ────────────────────────────────────────────────────────────
