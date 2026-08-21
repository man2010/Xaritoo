"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

export default function CommunityPartners() {
  return (
    <section style={{ background: C.greenLight, padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel>Community Partners</SectionLabel>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 700,
            color: C.textDark,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Growing Together with Our Partners
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: C.textBody, maxWidth: 600, margin: '0 auto 48px' }}>
          Xaritoo believes lasting impact is created through collaboration. We are grateful for the
          organizations and community leaders who have partnered with us to invest in young people.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
          {[
            {
              icon: 'handshake',
              image: '/images/partner-sac.jpeg',
              imageAlt: 'Senegalese Association of Chicago logo',
              name: 'Senegalese Association of Chicago',
              detail: 'SAC — Community Partner',
            },
            {
              icon: 'tree',
              name: 'Sen Path Community',
              detail: 'Founding Organization & Partner',
            },
          ].map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: C.white,
                border: `1px solid rgba(79,125,85,0.2)`,
                borderRadius: 16,
                padding: '20px 28px',
                minWidth: 260,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,125,85,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {p.image ? (
                <div style={{ width: 72, height: 72, overflow: 'hidden', borderRadius: 14, background: C.white, border: '1px solid rgba(79,125,85,0.18)', flexShrink: 0 }}>
                  <Image src={p.image} alt={p.imageAlt} width={1024} height={1024} sizes="72px" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 14, background: C.purplePrimary, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={p.icon} size={28} />
                </div>
              )}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.textDark, lineHeight: 1.3 }}>{p.name}</div>
                {p.detail && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3, maxWidth: 230, lineHeight: 1.4 }}>{p.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Our Team ─────────────────────────────────────────────────────────────────
