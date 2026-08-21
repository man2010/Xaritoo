"use client";

import { useEffect, useState } from "react";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import { MENTEE_APPLICATION_URL, MENTOR_APPLICATION_URL } from "@/lib/application-links";

type Stage = {
  id: number;
  badge: string;
  name: string;
  role: string;
  subtitle: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
  color: string;
  accent: string;
  bgLight: string;
};

const STAGES: Stage[] = [
  {
    id: 1,
    badge: "Stage 01",
    name: "The Seed",
    role: "Youth & Mentees",
    subtitle: "Untapped Potential & Inherent Gifts",
    description:
      "Every young person arrives with unique curiosity, talents, and dreams. In this first stage, Seeds find a welcoming space where their cultural identity and personal voice are recognized and valued.",
    highlights: ["Welcoming & safe community space", "Cultural identity & self-worth", "Recognizing unique potential"],
    ctaLabel: "Enroll as a Mentee",
    ctaHref: MENTEE_APPLICATION_URL,
    ctaExternal: true,
    color: "#4F7D55",
    accent: "#86efac",
    bgLight: "rgba(79,125,85,0.15)",
  },
  {
    id: 2,
    badge: "Stage 02",
    name: "The Gardener",
    role: "Dedicated Mentors",
    subtitle: "Caring Guidance & Active Listening",
    description:
      "Dedicated volunteer mentors walk alongside each youth. Through consistent weekly check-ins, encouragement, and accountability, Gardeners provide the essential care needed for deep roots to take hold.",
    highlights: ["Consistent 1-on-1 mentorship", "Emotional encouragement & listening", "Positive habits & accountability"],
    ctaLabel: "Become a Mentor",
    ctaHref: MENTOR_APPLICATION_URL,
    ctaExternal: true,
    color: C.goldPrimary,
    accent: C.goldLight,
    bgLight: "rgba(181,138,42,0.15)",
  },
  {
    id: 3,
    badge: "Stage 03",
    name: "The Blossom",
    role: "Academic & Personal Growth",
    subtitle: "Confidence, Mastery & Higher Horizons",
    description:
      "With ongoing support from the Xaritoo Club, students gain academic confidence in STEM, writing, and test prep, while exploring college scholarships and future career pathways.",
    highlights: ["Math, Science & SAT/ACT tutoring", "College planning & scholarships", "Emerging leadership & self-confidence"],
    ctaLabel: "Register for Xaritoo Club",
    ctaHref: "/programs#programs",
    ctaExternal: false,
    color: "#7c3aed",
    accent: "#c084fc",
    bgLight: "rgba(124,58,237,0.15)",
  },
  {
    id: 4,
    badge: "Stage 04",
    name: "The Garden",
    role: "Thriving Community Ecosystem",
    subtitle: "No Seed Grows Alone — Lasting Leadership",
    description:
      "The youth now stands tall as an empowered leader within their family and community. Surrounded by supervisors and partners, the entire garden flourishes—ready to nurture the next generation of Seeds.",
    highlights: ["Lifelong community connections", "Community leadership & giving back", "An ecosystem where all youth thrive"],
    ctaLabel: "Explore Our Impact",
    ctaHref: "/impact",
    ctaExternal: false,
    color: C.purplePrimary,
    accent: "#e9d5ff",
    bgLight: "rgba(91,44,131,0.2)",
  },
];

export default function LivingEcosystem() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const activeStage = STAGES[activeStageIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div
      className="living-ecosystem"
      style={{
        marginTop: 56,
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderRadius: 24,
        padding: "36px 32px",
        backdropFilter: "blur(12px)",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 1200,
        margin: "56px auto 0",
      }}
    >
      <style>{`
        .ecosystem-tab-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.75);
          padding: 12px 18px;
          border-radius: 14px;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 140px;
          justifyContent: center;
        }
        .ecosystem-tab-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          transform: translateY(-2px);
        }
        .ecosystem-tab-btn--active {
          background: #B58A2A !important;
          border-color: #E2C878 !important;
          color: #251C2D !important;
          box-shadow: 0 8px 24px rgba(181, 138, 42, 0.35);
          transform: translateY(-2px);
        }
        .ecosystem-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 36px;
          align-items: center;
          margin-top: 32px;
        }
        .stage-visual-container {
          background: linear-gradient(180deg, rgba(37, 28, 45, 0.75) 0%, rgba(50, 25, 77, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          position: relative;
          min-height: 380px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.3);
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes floatDrop {
          0% { transform: translateY(-8px); opacity: 0.2; }
          50% { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0.2; }
        }
        @media (max-width: 900px) {
          .ecosystem-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .living-ecosystem {
            padding: 24px 18px !important;
          }
        }
        @media (max-width: 600px) {
          .ecosystem-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
            display: grid !important;
            gap: 8px !important;
          }
          .ecosystem-tab-btn {
            font-size: 13px !important;
            padding: 10px 12px !important;
            min-height: 48px !important;
          }
          .stage-visual-container {
            min-height: 300px !important;
            padding: 16px !important;
          }
        }
      `}</style>

      {/* Top Header of the Living Ecosystem */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(181, 138, 42, 0.15)",
            border: "1px solid rgba(181, 138, 42, 0.3)",
            padding: "4px 14px",
            borderRadius: 20,
            color: C.goldLight,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          <Icon name="sprout" size={16} /> Interactive Growth Simulator
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(22px, 2.8vw, 32px)",
            fontWeight: 700,
            color: C.white,
            margin: "0 0 8px",
          }}
        >
          Watch How Every Seed Grows with Xaritoo
        </h3>
        <p style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.7)", maxWidth: 580, margin: "0 auto" }}>
          Click through the stages below to explore how mentorship, education, and community guide each young person from a Seed into a thriving leader.
        </p>
      </div>

      {/* 4 Interactive Stage Tabs */}
      <div className="ecosystem-tabs" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {STAGES.map((s, index) => {
          const isActive = index === activeStageIndex;
          return (
            <button
              key={s.id}
              type="button"
              className={`ecosystem-tab-btn ${isActive ? "ecosystem-tab-btn--active" : ""}`}
              onClick={() => {
                setActiveStageIndex(index);
                setIsAutoPlaying(false);
              }}
              aria-label={`Select ${s.name} stage`}
              aria-selected={isActive}
            >
              <span style={{ fontSize: 16 }}>{index === 0 ? "🌱" : index === 1 ? "🌿" : index === 2 ? "✨" : "🌳"}</span>
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Display */}
      <div className="ecosystem-grid">
        {/* Left: Dynamic Living SVG Illustration */}
        <div className="stage-visual-container">
          {/* Ambient stage glow */}
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: activeStage.color,
              opacity: 0.25,
              filter: "blur(60px)",
              pointerEvents: "none",
              transition: "background 0.5s ease",
            }}
          />

          {/* SVG Artwork Morphing per stage */}
          <div style={{ position: "relative", width: "100%", maxWidth: 320, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {activeStageIndex === 0 && (
              /* Stage 1: The Seed in fertile soil */
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                {/* Soil line */}
                <path d="M20 150 Q100 145 180 150" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" strokeDasharray="4 4" />
                <path d="M20 150 L180 150 L180 190 L20 190 Z" fill="rgba(79, 125, 85, 0.15)" />
                {/* Seed glow aura */}
                <circle cx="100" cy="145" r="28" fill="rgba(226, 200, 120, 0.2)" style={{ animation: "pulseGlow 2.5s infinite ease-in-out" }} />
                {/* The Golden Seed */}
                <path d="M100 125 C88 125 80 140 85 155 C90 165 100 168 100 168 C100 168 110 165 115 155 C120 140 112 125 100 125 Z" fill="#E2C878" stroke="#B58A2A" strokeWidth="2.5" />
                <path d="M100 132 Q100 155 106 160" stroke="#B58A2A" strokeWidth="2" fill="none" />
                {/* Rising curiosity stars */}
                <circle cx="70" cy="90" r="3" fill="#86efac" opacity="0.8" style={{ animation: "pulseGlow 2s infinite" }} />
                <circle cx="130" cy="80" r="4" fill="#E2C878" opacity="0.8" style={{ animation: "pulseGlow 1.8s infinite" }} />
                <circle cx="100" cy="65" r="3.5" fill="#c084fc" opacity="0.9" style={{ animation: "pulseGlow 2.2s infinite" }} />
              </svg>
            )}

            {activeStageIndex === 1 && (
              /* Stage 2: The Gardener watering & root nurturing */
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                {/* Soil line */}
                <path d="M20 140 Q100 135 180 140" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
                <path d="M20 140 L180 140 L180 195 L20 195 Z" fill="rgba(181, 138, 42, 0.12)" />
                {/* Roots branching down */}
                <path d="M100 145 Q85 165 75 185" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M100 145 Q115 165 125 185" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M100 145 V190" stroke="#86efac" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M100 160 Q110 170 118 175" stroke="#86efac" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Sprout emerging */}
                <path d="M100 140 Q100 110 100 95" stroke="#86efac" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Pair of fresh leaves */}
                <path d="M100 110 C80 100 80 120 100 115" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />
                <path d="M100 105 C120 95 120 115 100 110" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />
                {/* Care Drops descending from mentor */}
                <circle cx="100" cy="45" r="5" fill="#E2C878" style={{ animation: "floatDrop 2s infinite ease-in-out" }} />
                <circle cx="85" cy="65" r="4" fill="#86efac" style={{ animation: "floatDrop 1.8s infinite ease-in-out 0.3s" }} />
                <circle cx="115" cy="60" r="4.5" fill="#E2C878" style={{ animation: "floatDrop 2.2s infinite ease-in-out 0.6s" }} />
              </svg>
            )}

            {activeStageIndex === 2 && (
              /* Stage 3: The Blossom (confidence, intellect, rising star) */
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
                {/* Strong deep root network */}
                <path d="M20 145 H180" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M100 145 Q70 170 50 190" stroke="#22c55e" strokeWidth="3.5" fill="none" />
                <path d="M100 145 Q130 170 150 190" stroke="#22c55e" strokeWidth="3.5" fill="none" />
                <path d="M100 145 V195" stroke="#4ade80" strokeWidth="4" />
                {/* Vibrant tall stem */}
                <path d="M100 145 Q98 90 100 65" stroke="#4ade80" strokeWidth="5" strokeLinecap="round" fill="none" />
                {/* Lush side leaves */}
                <path d="M100 120 C70 105 70 135 100 125" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                <path d="M100 100 C130 85 130 115 100 105" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                {/* Glowing Golden Bloom / Star of achievement */}
                <circle cx="100" cy="55" r="32" fill="rgba(226, 200, 120, 0.25)" style={{ animation: "pulseGlow 2s infinite ease-in-out" }} />
                {/* Petals */}
                <circle cx="100" cy="40" r="12" fill="#E2C878" opacity="0.9" />
                <circle cx="115" cy="52" r="12" fill="#E2C878" opacity="0.9" />
                <circle cx="110" cy="68" r="12" fill="#E2C878" opacity="0.9" />
                <circle cx="90" cy="68" r="12" fill="#E2C878" opacity="0.9" />
                <circle cx="85" cy="52" r="12" fill="#E2C878" opacity="0.9" />
                {/* Center Star */}
                <circle cx="100" cy="55" r="13" fill="#B58A2A" />
                <path d="M100 48 L102 53 L107 53 L103 56 L105 61 L100 58 L95 61 L97 56 L93 53 L98 53 Z" fill="#FFFFFF" />
              </svg>
            )}

            {activeStageIndex === 3 && (
              /* Stage 4: The Majestic Community Tree & Garden */
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible", animation: "sway 6s infinite ease-in-out" }}>
                {/* Fertile soil ground */}
                <path d="M10 155 Q100 150 190 155" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                {/* Massive roots anchoring firmly */}
                <path d="M100 155 Q60 175 30 195" stroke="#E2C878" strokeWidth="4.5" fill="none" />
                <path d="M100 155 Q140 175 170 195" stroke="#E2C878" strokeWidth="4.5" fill="none" />
                <path d="M100 155 V198" stroke="#B58A2A" strokeWidth="6" />
                {/* Mighty Trunk */}
                <path d="M90 155 C92 110 85 95 100 80 C115 95 108 110 110 155 Z" fill="#B58A2A" stroke="#E2C878" strokeWidth="2" />
                {/* Broad protective canopy */}
                <circle cx="100" cy="60" r="48" fill="#5B2C83" opacity="0.9" />
                <circle cx="70" cy="65" r="32" fill="#4F7D55" opacity="0.85" />
                <circle cx="130" cy="65" r="32" fill="#4F7D55" opacity="0.85" />
                <circle cx="100" cy="45" r="36" fill="#B58A2A" opacity="0.75" />
                {/* Community stars in the canopy */}
                <circle cx="100" cy="55" r="6" fill="#E2C878" style={{ animation: "pulseGlow 2s infinite" }} />
                <circle cx="75" cy="55" r="4.5" fill="#FFFFFF" style={{ animation: "pulseGlow 2.3s infinite" }} />
                <circle cx="125" cy="55" r="4.5" fill="#FFFFFF" style={{ animation: "pulseGlow 1.9s infinite" }} />
                <circle cx="100" cy="32" r="5" fill="#86efac" style={{ animation: "pulseGlow 2.5s infinite" }} />
                {/* Baby seed sprouting under shelter */}
                <path d="M45 155 Q45 142 45 138" stroke="#86efac" strokeWidth="2" />
                <circle cx="45" cy="136" r="3" fill="#86efac" />
                <path d="M155 155 Q155 142 155 138" stroke="#86efac" strokeWidth="2" />
                <circle cx="155" cy="136" r="3" fill="#86efac" />
              </svg>
            )}
          </div>

          {/* Caption below visual */}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              style={{
                display: "inline-block",
                background: activeStage.bgLight,
                border: `1px solid ${activeStage.accent}40`,
                color: activeStage.accent,
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 20,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {activeStage.role}
            </span>
          </div>
        </div>

        {/* Right: Stage Details & Action Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: activeStage.accent }}>
                {activeStage.badge}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{activeStage.role}</span>
            </div>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3vw, 34px)",
                fontWeight: 700,
                color: C.white,
                margin: "0 0 6px",
                letterSpacing: "-0.01em",
              }}
            >
              {activeStage.name}
            </h4>
            <p style={{ fontSize: 16, fontWeight: 600, color: activeStage.accent, margin: "0 0 14px", lineHeight: 1.4 }}>
              {activeStage.subtitle}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>
              {activeStage.description}
            </p>
          </div>

          {/* Highlights checklist */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {activeStage.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(255, 255, 255, 0.9)" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: activeStage.color,
                    color: C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={12} strokeWidth={3} />
                </span>
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Actions & Navigation row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
            <a
              href={activeStage.ctaHref}
              target={activeStage.ctaExternal ? "_blank" : undefined}
              rel={activeStage.ctaExternal ? "noopener noreferrer" : undefined}
              style={{
                background: C.goldPrimary,
                color: C.textDark,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                padding: "12px 22px",
                borderRadius: 10,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C99A30")}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.goldPrimary)}
            >
              {activeStage.ctaLabel} <span aria-hidden="true">→</span>
            </a>

            {/* Previous / Next buttons */}
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              <button
                type="button"
                onClick={() => {
                  setActiveStageIndex((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1));
                  setIsAutoPlaying(false);
                }}
                aria-label="Previous growth stage"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: C.white,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveStageIndex((prev) => (prev + 1) % STAGES.length);
                  setIsAutoPlaying(false);
                }}
                aria-label="Next growth stage"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: C.white,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
              >
                →
              </button>
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
                title={isAutoPlaying ? "Pause growth animation" : "Play growth animation"}
                style={{
                  background: isAutoPlaying ? "rgba(181, 138, 42, 0.3)" : "rgba(255, 255, 255, 0.1)",
                  border: isAutoPlaying ? "1px solid #E2C878" : "1px solid rgba(255, 255, 255, 0.2)",
                  color: isAutoPlaying ? C.goldLight : C.white,
                  padding: "0 12px",
                  height: 40,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span>{isAutoPlaying ? "❚❚" : "▶"}</span>
                <span>{isAutoPlaying ? "Auto" : "Play"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
