"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Team() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const mentorGallery = [
    { src: "/images/mentor-gallery-01.jpeg", alt: "Xaritoo mentors gathered at a community event" },
    { src: "/images/xaritoo-culture.jpeg", alt: "Xaritoo cultural activity and community display" },
    { src: "/images/mentor-gallery-03.jpeg", alt: "Xaritoo mentors and mentees together during a program activity" },
    { src: "/images/mentor-gallery-04.jpeg", alt: "A Xaritoo mentor with mentees at a cultural event" },
    { src: "/images/mentor-gallery-05.jpeg", alt: "A Xaritoo mentor supporting three mentees" },
    { src: "/images/mentor-gallery-06.jpeg", alt: "Xaritoo mentors and mentees celebrating together" },
    { src: "/images/mentor-gallery-07.jpeg", alt: "A Xaritoo mentor and mentees building connections" },
    { src: "/images/mentor-gallery-08.jpeg", alt: "A Xaritoo mentor with mentees during a community gathering" },
    { src: "/images/mentor-gallery-09.jpeg", alt: "Xaritoo mentors and mentees sharing a joyful moment" },
  ]

  const members = [
    {
      name: 'Mame Diaw',
      role: 'Executive Director',
      email: 'mamediaw@xaritoo.org',
      bio: "Leading Xaritoo's mission to empower young people through mentorship, culture, and connection as a program of Sen Path Community.",
      initials: 'MD',
      image: '/images/team-mame-diaw.jpeg',
      color: C.purplePrimary,
    },
    {
      name: 'El Hadji Dioum',
      role: 'Program Coordinator',
      email: '',
      bio: "Coordinating Xaritoo's programs and ensuring every Seed, Gardener, and Garden has the support they need throughout each season.",
      initials: 'ED',
      image: '/images/team-el-hadji-dioum.jpeg',
      color: C.greenGrowth,
    },
    {
      name: 'Mahamadou Ndiaye',
      role: 'Safety & Safeguarding Supervisor',
      email: '',
      bio: "Ensuring the safety, well-being, and protection of all program participants across Xaritoo's mentorship and club activities.",
      initials: 'MN',
      image: '/images/team-mahamadou-ndiaye.jpeg',
      color: C.goldPrimary,
    },
  ]

  const moveGallery = (direction: 1 | -1) => {
    const gallery = galleryRef.current
    if (!gallery) return
    const card = gallery.querySelector<HTMLElement>(".mentor-gallery__item")
    gallery.scrollBy({ left: direction * ((card?.offsetWidth ?? 280) + 14), behavior: "smooth" })
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(() => {
      const gallery = galleryRef.current
      if (!gallery || gallery.matches(":hover") || gallery.matches(":focus-within")) return
      const reachedEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 12
      gallery.scrollTo({ left: reachedEnd ? 0 : gallery.scrollLeft + gallery.clientWidth * 0.72, behavior: "smooth" })
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section style={{ background: C.white, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>Our Team</SectionLabel>
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
            The People Behind Xaritoo
          </h2>
        </div>

        <figure style={{ maxWidth: 650, margin: '0 auto 48px', padding: 9, background: C.white, borderRadius: 22, border: '1px solid rgba(91,44,131,0.1)', boxShadow: '0 22px 55px rgba(50,25,77,0.1)' }}>
          <div className="mentor-group-photo" style={{ width: '100%', height: 440, overflow: 'hidden', borderRadius: 15, background: C.purpleLavender }}>
            <Image src="/images/xaritoo-mentors.jpeg" alt="A group of Xaritoo mentors together" width={768} height={1024} sizes="(max-width: 700px) 92vw, 650px" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 36%' }} />
          </div>
          <figcaption style={{ padding: '12px 8px 4px', color: C.textMuted, fontSize: 12, textAlign: 'center' }}>Xaritoo mentors building community and connection.</figcaption>
        </figure>

        <div className="mentor-gallery-heading">
          <SectionLabel>Mentors in Action</SectionLabel>
          <h3>Guiding, Connecting, and Growing Together</h3>
          <p>Real moments of mentorship, cultural exchange, and community connection across Xaritoo programs.</p>
        </div>

        <div className="mentor-carousel">
          <button className="mentor-carousel__control mentor-carousel__control--previous" type="button" onClick={() => moveGallery(-1)} aria-label="Previous mentor photos">‹</button>
          <div className="mentor-gallery" ref={galleryRef} aria-label="Xaritoo mentors photo carousel" tabIndex={0}>
            {mentorGallery.map((photo) => (
              <figure className="mentor-gallery__item" key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={768}
                  height={1024}
                  sizes="(max-width: 600px) 82vw, (max-width: 900px) 42vw, 320px"
                  className="mentor-gallery__image"
                />
              </figure>
            ))}
          </div>
          <button className="mentor-carousel__control mentor-carousel__control--next" type="button" onClick={() => moveGallery(1)} aria-label="Next mentor photos">›</button>
        </div>

        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {members.map((m) => (
            <div
              key={m.name}
              style={{
                background: C.bgSoft,
                borderRadius: 20,
                padding: '36px 28px',
                border: `1px solid rgba(91,44,131,0.08)`,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,44,131,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {m.image ? (
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${m.color}`,
                    boxShadow: `0 8px 24px rgba(50,25,77,0.16)`,
                    marginBottom: 20,
                    background: C.purpleLavender,
                    position: "relative",
                  }}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={240}
                    height={240}
                    sizes="90px"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: m.color,
                    color: C.white,
                    fontFamily: 'var(--font-serif)',
                    fontSize: 22,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    letterSpacing: '0.02em',
                  }}
                >
                  {m.initials}
                </div>
              )}
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: C.textDark, marginBottom: 4 }}>
                {m.name}
              </h3>
              <p style={{ fontSize: 13, fontWeight: 600, color: m.color, marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {m.role}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: C.textBody, marginBottom: m.email ? 16 : 0 }}>
                {m.bio}
              </p>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  style={{ fontSize: 14, color: C.purplePrimary, textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  <Icon name="mail" size={14} /> {m.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .mentor-gallery-heading {
          max-width: 680px;
          margin: 0 auto 30px;
          text-align: center;
        }
        .mentor-gallery-heading h3 {
          margin: 0 0 10px;
          color: ${C.textDark};
          font-family: var(--font-serif);
          font-size: clamp(24px, 3vw, 36px);
          line-height: 1.2;
        }
        .mentor-gallery-heading p {
          margin: 0;
          color: ${C.textBody};
          font-size: 15px;
          line-height: 1.7;
        }
        .mentor-carousel {
          position: relative;
          gap: 14px;
          margin-bottom: 64px;
        }
        .mentor-gallery {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding: 8px 4px 18px;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .mentor-gallery::-webkit-scrollbar { display: none; }
        .mentor-gallery__item {
          position: relative;
          flex: 0 0 clamp(230px, 27vw, 320px);
          height: 300px;
          overflow: hidden;
          margin: 0;
          scroll-snap-align: start;
          border: 1px solid rgba(91,44,131,0.1);
          border-radius: 18px;
          background: ${C.purpleLavender};
          box-shadow: 0 12px 34px rgba(50,25,77,0.09);
        }
        .mentor-carousel__control {
          position: absolute;
          z-index: 2;
          top: 50%;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(91,44,131,.14);
          border-radius: 50%;
          background: rgba(255,255,255,.94);
          box-shadow: 0 8px 24px rgba(50,25,77,.16);
          color: ${C.purplePrimary};
          cursor: pointer;
          font-size: 31px;
          line-height: 1;
          transform: translateY(-65%);
          transition: transform .2s, background .2s;
        }
        .mentor-carousel__control:hover { background: ${C.purpleLavender}; transform: translateY(-65%) scale(1.07); }
        .mentor-carousel__control--previous { left: -18px; }
        .mentor-carousel__control--next { right: -18px; }
        .mentor-gallery__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
        }
        .mentor-gallery__item:hover .mentor-gallery__image {
          transform: scale(1.045);
        }
        @media (max-width: 900px) {
          .team-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .mentor-group-photo { height: 360px !important; }
          .mentor-gallery {
            gap: 10px;
            padding-inline: 2px;
          }
          .mentor-carousel { margin-bottom: 48px; }
          .mentor-gallery__item { flex-basis: 78vw; height: 290px; }
          .mentor-carousel__control { width: 40px; height: 40px; }
          .mentor-carousel__control--previous { left: -10px; }
          .mentor-carousel__control--next { right: -10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mentor-gallery__image { transition: none; }
        }
      `}</style>
    </section>
  )
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────
