"use client";

import { useEffect, useState } from "react";
import { colors as C } from "@/lib/design-tokens";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const links = [
    { label: 'About', href: '/about' },
    { label: 'Programs', href: '/programs' },
    { label: 'Framework', href: '/framework' },
    { label: 'Impact', href: '/impact' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={scrolled ? 'site-header site-header--scrolled' : 'site-header'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? C.purpleDark : 'transparent',
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : 'none',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* Logo wordmark */}
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 22,
            color: C.white,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              width: 32,
              height: 32,
              borderRadius: 6,
              background: C.goldPrimary,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            X
          </span>
          XARITOO
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: pathname === l.href ? C.goldLight : 'rgba(255,255,255,0.82)',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: 6,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.goldLight)}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === l.href ? C.goldLight : 'rgba(255,255,255,0.82)')}
              aria-current={pathname === l.href ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}

          <a
            href="/get-involved?role=mentor#apply"
            style={{
              background: C.goldPrimary,
              color: C.textDark,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: 8,
              transition: 'background 0.2s',
              marginLeft: 8,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C99A30')}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.goldPrimary)}
          >
            Become a Mentor
          </a>
          <a
            href="/get-involved?role=mentee#apply"
            className="nav-secondary-cta"
            style={{
              color: C.white,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.28)',
              marginLeft: 2,
            }}
          >
            Become a Mentee
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-only"
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'none',
            flexDirection: 'column',
            gap: 5,
          }}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 24,
                height: 2,
                background: C.white,
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transform: open
                  ? i === 0
                    ? 'translateY(7px) rotate(45deg)'
                    : i === 2
                      ? 'translateY(-7px) rotate(-45deg)'
                      : 'none'
                  : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-label="Mobile navigation"
          className="mobile-navigation"
          style={{
            background: C.purpleDark,
            padding: '16px 24px 24px',
            borderTop: `1px solid rgba(255,255,255,0.1)`,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === l.href ? 'page' : undefined}
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.88)',
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: 500,
                padding: '12px 0',
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/get-involved?role=mentor#apply"
            onClick={() => setOpen(false)}
            style={{
              display: 'inline-block',
              marginTop: 16,
              background: C.goldPrimary,
              color: C.textDark,
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: 8,
            }}
          >
            Become a Mentor
          </a>
          <a
            href="/get-involved?role=mentee#apply"
            onClick={() => setOpen(false)}
            style={{ display: 'inline-block', marginTop: 16, marginLeft: 10, color: C.white, textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Become a Mentee
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 1120px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
