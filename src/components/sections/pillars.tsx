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
      image: "/images/mentor-gallery-02.jpeg",
      imageAlt: "A Xaritoo cultural activity featuring art, food, and community traditions",
      imagePosition: "center",
      rotated: true,
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
    <section style={{ background: C.purpleLavender, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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

        <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
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
                  className={pillar.rotated ? "pillar-photo__image pillar-photo__image--rotated" : "pillar-photo__image"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pillar.imagePosition }}
                />
              </div>

              <div style={{ padding: "30px 32px 36px" }}>
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
        .pillar-photo__image {
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
        }
        .pillar-photo__image--rotated {
          transform: rotate(90deg) scale(1.38);
        }
        .pillar-card:hover .pillar-photo__image:not(.pillar-photo__image--rotated) {
          transform: scale(1.045);
        }
        .pillar-card:hover .pillar-photo__image--rotated {
          transform: rotate(90deg) scale(1.43);
        }
        @media (max-width: 900px) {
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillar-photo { height: 300px !important; }
        }
        @media (max-width: 600px) {
          .pillar-photo { height: 240px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pillar-photo__image { transition: none; }
        }
      `}</style>
    </section>
  )
}
