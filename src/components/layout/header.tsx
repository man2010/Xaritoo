"use client";

import { useEffect, useState } from "react";
import { colors as C } from "@/lib/design-tokens";
import { usePathname } from "next/navigation";
import { MENTEE_APPLICATION_URL, MENTOR_APPLICATION_URL } from "@/lib/application-links";
import Image from "next/image";

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
    { label: 'Impact', href: '/impact' },
    { label: 'Framework', href: '/framework' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'News', href: '/news-gallery' },
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
        background: C.purpleDark,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: scrolled ? '0 10px 30px rgba(24,10,38,0.2)' : '0 5px 22px rgba(24,10,38,0.12)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        className="site-header__inner"
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
          <Image src="/images/xaritoo-logo.jpeg" alt="" width={1100} height={1100} priority sizes="44px" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10 }} />
          XARITOO
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                // Handle anchor links from different pages
                if (l.href.startsWith('#') && pathname !== '/') {
                  e.preventDefault()
                  window.location.href = `/${l.href}`
                }
              }}
              style={{
                color: l.href === '/news-gallery' && pathname === '/news-gallery' ? C.goldLight : 'rgba(255,255,255,0.82)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '6px 8px',
                borderRadius: 6,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.goldLight)}
              onMouseLeave={(e) => (e.currentTarget.style.color = l.href === '/news-gallery' && pathname === '/news-gallery' ? C.goldLight : 'rgba(255,255,255,0.82)')}
              aria-current={l.href === '/news-gallery' && pathname === '/news-gallery' ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}

          <a
            href={MENTOR_APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: C.goldPrimary,
              color: C.textDark,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 650,
              padding: '7px 12px',
              borderRadius: 8,
              transition: 'background 0.2s',
              marginLeft: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C99A30')}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.goldPrimary)}
          >
            Become a Mentor
          </a>
          <a
            href={MENTEE_APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-secondary-cta"
            style={{
              color: C.white,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 650,
              padding: '7px 11px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.28)',
              marginLeft: 2,
            }}
          >
            Become a Mentee
          </a>
          <a href="/account" className="nav-account-cta">Sign up / Sign in</a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-only mobile-menu-toggle"
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
              onClick={(e) => {
                setOpen(false)
                // Handle anchor links from different pages
                if (l.href.startsWith('#') && pathname !== '/') {
                  e.preventDefault()
                  window.location.href = `/${l.href}`
                }
              }}
              style={{
                display: 'block',
                color: l.href === '/news-gallery' && pathname === '/news-gallery' ? C.goldLight : 'rgba(255,255,255,0.88)',
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
            href={MENTOR_APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mobile-nav-cta mobile-nav-cta--mentor"
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
            href={MENTEE_APPLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mobile-nav-cta mobile-nav-cta--mentee"
            style={{ display: 'inline-block', marginTop: 16, marginLeft: 10, color: C.white, textDecoration: 'none', fontSize: 15, fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Become a Mentee
          </a>
          <a href="/account" onClick={() => setOpen(false)} className="nav-account-cta nav-account-cta--mobile">Sign up / Sign in</a>
        </div>
      )}

      <style>{`
        @media (max-width: 1120px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      .nav-account-cta { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; margin-left: 8px; padding: 0 16px; border: 1px solid rgba(255,255,255,.28); border-radius: 9px; color: #fff; background: rgba(255,255,255,.09); font-size: 14px; font-weight: 700; text-decoration: none; white-space: nowrap; transition: background .2s, transform .2s; }
      .nav-account-cta:hover { background: rgba(255,255,255,.17); transform: translateY(-1px); }
      .nav-account-cta--mobile { margin: 18px 0 0; width: 100%; box-sizing: border-box; }
      .mobile-navigation .mobile-nav-cta { display: flex !important; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; margin: 12px 0 0 !important; padding: 11px 14px !important; font-size: 14px !important; white-space: normal; text-align: center; }
      `}</style>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
