"use client";

import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

export default function Pillars() {
  const pillars = [
    {
      icon: "handshake",
      image: "/images/xaritoo-mentor-mentee.jpeg",
      imageAlt: "A Xaritoo mentor and mentee celebrating their connection",
      imagePosition: "center 30%",
      title: "Mentorship",
      text: "One-on-one relationships with trained mentors who provide guidance, accountability, and encouragement — helping young people build confidence and develop leadership skills.",
    },
    {
      icon: "globe",
      image: "/images/xaritoo-culture.jpeg",
      imageAlt: "A Xaritoo cultural activity featuring art, food, and community traditions",
      imagePosition: "center",
      title: "Culture",
      text: "Celebrating cultural identity as a source of strength. We help youth embrace their heritage while navigating American life, honoring who they are and where they come from.",
    },
    {
      icon: "link",
      image: "/images/mentor-gallery-03.jpeg",
      imageAlt: "Xaritoo mentors and mentees building community together",
      imagePosition: "center 32%",
      title: "Connection",
      text: "Building lasting friendships, family engagement, and community ties that create a network of belonging — because lasting growth happens in relationship with others.",
    },
  ]

  return (
    <section className="pillars-section" style={{ background: C.purpleLavender, padding: "96px 24px" }}>
      <div className="pillars-container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="pillars-heading" style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>Our Approach</SectionLabel>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              letterSpacing: "-0.02em",
            }}
          >
            Three Pillars of Growth
          </h2>
        </div>

        <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 24 }}>
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="pillar-card"
              style={{
                background: C.white,
                borderRadius: 20,
                overflow: "hidden",
                borderBottom: `4px solid ${C.purplePrimary}`,
                transition: "transform 0.2s, box-shadow 0.2s",
                minWidth: 0,
                width: "100%",
                boxSizing: "border-box",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-4px)"
                event.currentTarget.style.boxShadow = "0 12px 40px rgba(91,44,131,0.12)"
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)"
                event.currentTarget.style.boxShadow = "none"
              }}
            >
              <div className="pillar-photo" style={{ width: "100%", height: 245, overflow: "hidden", background: C.purpleLavender }}>
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  width={768}
                  height={1024}
                  sizes="(max-width: 900px) 92vw, 33vw"
                  className="pillar-photo__image"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pillar.imagePosition }}
                />
              </div>

              <div className="pillar-content" style={{ padding: "30px 32px 36px", minWidth: 0 }}>
                <Icon name={pillar.icon} size={40} style={{ color: C.purplePrimary, marginBottom: 20 }} />
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, color: C.textDark, marginBottom: 12 }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: C.textBody }}>{pillar.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .pillars-section,
        .pillars-container,
        .pillars-grid,
        .pillar-card,
        .pillar-photo,
        .pillar-content {
          box-sizing: border-box;
          max-width: 100%;
          min-width: 0;
        }
        .pillars-section {
          width: 100%;
          overflow: hidden;
        }
        .pillars-container,
        .pillars-grid {
          width: 100%;
        }
        .pillar-card {
          contain: layout paint;
        }
        .pillar-photo__image {
          display: block;
          max-width: 100%;
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
        }
        .pillar-card:hover .pillar-photo__image {
          transform: scale(1.045);
        }
        @media (max-width: 900px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillar-photo { height: 300px !important; }
        }
        @media (max-width: 600px) {
          .pillars-section { padding: 68px 16px !important; }
          .pillars-heading { margin-bottom: 36px !important; }
          .pillars-grid { gap: 18px !important; }
          .pillar-photo { height: 240px !important; }
          .pillar-content { padding: 26px 22px 30px !important; }
          .pillar-content p { overflow-wrap: anywhere; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pillar-photo__image { transition: none; }
        }
      `}</style>
    </section>
  )
}
