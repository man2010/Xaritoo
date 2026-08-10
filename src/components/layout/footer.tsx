"use client";

import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import { applicationUrlFor } from "@/lib/application-links";
import { socialLinks } from "@/lib/social-links";

export default function Footer() {
  return (
    <footer style={{ background: C.purpleDark, padding: '64px 24px 32px', color: C.white }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            marginBottom: 48,
            paddingBottom: 48,
            borderBottom: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: 20,
                color: C.white,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  width: 28,
                  height: 28,
                  borderRadius: 5,
                  background: C.goldPrimary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                X
              </span>
              XARITOO
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                marginBottom: 16,
              }}
            >
              Mentorship • Culture • Connection
              <br />
              No Seed Grows Alone.
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
              Xaritoo is a youth development initiative of Sen Path Community, dedicated to helping
              young people grow through mentorship, education, leadership, and community.
            </p>
            <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              EN / FR / ZH
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.goldLight,
                marginBottom: 16,
              }}
            >
              Explore
            </h4>
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Our Programs', href: '/programs' },
              { label: 'Our Impact', href: '/impact' },
              { label: 'Get Involved', href: '/get-involved' },
              { label: 'Contact', href: '/contact' },
            ].map(
              (link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    fontSize: 14,
                    marginBottom: 10,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          {/* Get Involved */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.goldLight,
                marginBottom: 16,
              }}
            >
              Get Involved
            </h4>
            {[
              { label: 'Become a Mentor', role: 'mentor' },
              { label: 'Become a Mentee', role: 'mentee' },
              { label: 'Volunteer', role: 'volunteer' },
              { label: 'Become a Community Partner', role: 'partner' },
              { label: 'Support Xaritoo', role: 'support' },
            ].map(
              (item) => (
                <a
                  key={item.role}
                  href={applicationUrlFor(item.role)}
                  target={item.role === 'mentor' || item.role === 'mentee' ? '_blank' : undefined}
                  rel={item.role === 'mentor' || item.role === 'mentee' ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    fontSize: 14,
                    marginBottom: 10,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {item.label}
                </a>
              ),
            )}
          </div>

          {/* Connect */}
          <div>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.goldLight,
                marginBottom: 16,
              }}
            >
              Connect
            </h4>
            {[
              { icon: 'instagram', label: 'Instagram @xaritoomentorship', href: socialLinks.instagram },
              { icon: 'facebook', label: 'Facebook Xaritoo Mentorship', href: socialLinks.facebook },
              { icon: 'music', label: 'TikTok @xaritoomentorship', href: socialLinks.tiktok },
              { icon: 'message', label: 'WhatsApp Channel', href: socialLinks.whatsapp },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('https://') ? '_blank' : undefined}
                rel={c.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 10,
                  textDecoration: 'none',
                }}
              >
                <Icon name={c.icon} size={14} style={{ color: C.goldLight, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                  {c.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Sen Path Community. Xaritoo is a youth development initiative of Sen Path
            Community. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Photo & Media Policy', 'Terms of Use'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────
