"use client";

import { useState, useEffect, useRef } from "react";
import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

// Types pour les actualités
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "event" | "update" | "success" | "spotlight";
  image: string;
  gallery?: string[];
  author?: string;
  featured?: boolean;
}

// Données d'exemple pour les actualités avec galerie intégrée
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Xaritoo Summer Pilot 2026: A Season of Growth",
    excerpt: "Our inaugural summer program brought together 53 participants for 8 weeks of mentorship, cultural activities, and personal development.",
    content: "The 2026 Summer Pilot exceeded all expectations with 31 Seeds, 15 Gardeners, and 7 Gardens actively participating. From leadership workshops to cultural celebrations, every moment was designed to foster growth and connection. Seeds built confidence through mentorship, explored career paths, and developed lasting friendships. Gardeners provided guidance and encouragement, while Gardens created the supportive environment needed for meaningful transformation.",
    date: "August 2026",
    category: "event",
    image: "/images/xaritoo-summer-program.jpeg",
    gallery: ["/images/xaritoo-summer-program.jpeg", "/images/xaritoo-mentors.jpeg", "/images/xaritoo-culture.jpeg"],
    author: "Mame Diaw",
    featured: true,
  },
  {
    id: "2",
    title: "Success Story: Adji's Journey to College",
    excerpt: "Meet Adji, one of our first Seeds, who is now preparing for college with confidence and a clear vision for her future.",
    content: "When Adji joined Xaritoo, she was unsure about her college options. Through her mentorship relationship, she discovered her passion for environmental science, received guidance on college applications, and secured scholarship opportunities. 'Xaritoo gave me the confidence to believe in myself and the support to make my dreams reality,' Adji shares. She will be attending university this fall with a full scholarship.",
    date: "July 2026",
    category: "success",
    image: "/images/mentor-gallery-01.jpeg",
    gallery: ["/images/mentor-gallery-01.jpeg", "/images/xaritoo-mentor-mentee.jpeg"],
    author: "Xaritoo Team",
  },
  {
    id: "3",
    title: "Cultural Heritage Day Celebration",
    excerpt: "A beautiful celebration of our community's diverse cultural backgrounds through food, music, art, and storytelling.",
    content: "Our Cultural Heritage Day brought together families, mentors, and community partners for an unforgettable celebration. Participants shared traditional dishes, performed cultural dances, displayed artwork, and told stories that honored their heritage. The event strengthened cultural identity while building bridges between different communities. 'Seeing our youth proudly share their culture was incredibly moving,' says Program Coordinator El Hadji Dioum.",
    date: "June 2026",
    category: "event",
    image: "/images/xaritoo-culture.jpeg",
    gallery: ["/images/xaritoo-culture.jpeg", "/images/mentor-gallery-03.jpeg", "/images/mentor-gallery-05.jpeg"],
    author: "El Hadji Dioum",
  },
  {
    id: "4",
    title: "Xaritoo Club Fall Registration Now Open",
    excerpt: "Register your student for our fall academic support program. Math, science, writing, SAT prep, and more.",
    content: "Xaritoo Club is accepting registrations for the fall semester. Our school-year support program provides students with academic assistance, tutoring, college and career guidance, and mentorship. Available subjects include Math, Science, Writing, SAT/ACT Preparation, Scholarships & College Planning, Career & Resume Support, and General Mentorship. Students work with trained mentors in small groups to build skills and confidence.",
    date: "August 2026",
    category: "update",
    image: "/images/xaritoo-student-support.jpeg",
    gallery: ["/images/xaritoo-student-support.jpeg", "/images/xaritoo-mentor-mentee-2.jpeg"],
    author: "Xaritoo Team",
  },
  {
    id: "5",
    title: "Community Spotlight: Senegalese Association of Chicago",
    excerpt: "We're grateful for our partnership with SAC and their continued support of Xaritoo's mission.",
    content: "The Senegalese Association of Chicago has been an invaluable partner since Xaritoo's inception. From providing venue space for events to connecting us with families who can benefit from mentorship, SAC's support has been instrumental. 'Xaritoo aligns perfectly with our mission to support youth and preserve cultural heritage,' says SAC leadership. We look forward to many more years of collaboration.",
    date: "July 2026",
    category: "spotlight",
    image: "/images/partner-sac.jpeg",
    gallery: ["/images/partner-sac.jpeg"],
    author: "Xaritoo Team",
  },
  {
    id: "6",
    title: "Mentor Training Workshop 2026",
    excerpt: "Our newest Gardeners completed comprehensive training to prepare for meaningful mentorship relationships.",
    content: "Before the summer program began, our mentor team participated in an intensive training workshop covering topics such as youth development, cultural competency, communication skills, safety protocols, and mentorship best practices. The training ensured that every Gardener was prepared to provide safe, effective, and transformative mentorship. 'The training gave me the tools and confidence to be the mentor these Seeds deserve,' shares first-time mentor Binta Mbaye.",
    date: "May 2026",
    category: "update",
    image: "/images/xaritoo-mentors.jpeg",
    gallery: ["/images/xaritoo-mentors.jpeg", "/images/mentor-gallery-06.jpeg", "/images/mentor-gallery-07.jpeg"],
    author: "Mahamadou Ndiaye",
  },
];

export default function NewsGalleryPage() {
  const [activeNewsFilter, setActiveNewsFilter] = useState<string>("all");
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const categoryLabels: Record<string, string> = {
    all: "All",
    event: "Events",
    update: "Updates",
    success: "Success Stories",
    spotlight: "Spotlight",
  };

  const categoryColors: Record<string, string> = {
    event: C.goldPrimary,
    update: C.purplePrimary,
    success: C.greenGrowth,
    spotlight: "#E91E63",
  };

  const filteredNews = activeNewsFilter === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeNewsFilter);

  const featuredNews = newsItems.filter(item => item.featured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="news-page">
      {/* Hero Section - Same style as homepage */}
      <section 
        ref={heroRef}
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          background: C.purpleDark,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image with dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url(/images/xaritoo-mentors.jpeg)",
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.22,
          }}
          aria-hidden
        />
        
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${C.purpleDark} 40%, ${C.purplePrimary}88 100%)`,
          }}
          aria-hidden
        />

        {/* Decorative gold accent line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '30%',
            width: 4,
            height: '40%',
            background: C.goldPrimary,
            borderRadius: '0 2px 2px 0',
          }}
          aria-hidden
        />

        <div
          style={{
            position: 'relative',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '120px 24px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left: text content */}
          <div>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 32,
                  height: 2,
                  background: C.goldPrimary,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: C.goldLight,
                }}
              >
                Latest Updates
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(36px, 5vw, 62px)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: C.white,
                marginBottom: 24,
                letterSpacing: '-0.02em',
              }}
            >
              Stories from Our{' '}
              <em style={{ fontStyle: 'italic', color: C.goldLight }}>Community</em>
            </h1>

            <p
              style={{
                fontSize: 19,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.78)',
                marginBottom: 40,
                maxWidth: 480,
              }}
            >
              Follow Xaritoo's journey through mentorship, culture, and connection. Every moment tells a story of growth.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { num: newsItems.length, label: 'Articles' },
                { num: newsItems.filter(i => i.category === 'event').length, label: 'Events' },
                { num: newsItems.filter(i => i.category === 'success').length, label: 'Success Stories' },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 36,
                      fontWeight: 700,
                      color: C.goldLight,
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: featured news card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid rgba(255,255,255,0.14)`,
                borderRadius: 20,
                padding: '32px',
                backdropFilter: 'blur(12px)',
                maxWidth: 320,
                width: '100%',
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: C.goldLight,
                  marginBottom: 24,
                }}
              >
                Featured Story
              </p>
              {featuredNews[0] && (
                <>
                  <div style={{ height: 180, marginBottom: 20, borderRadius: 12, overflow: 'hidden' }}>
                    <Image
                      src={featuredNews[0].image}
                      alt={featuredNews[0].title}
                      width={400}
                      height={300}
                      sizes="320px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 12, lineHeight: 1.3 }}>
                    {featuredNews[0].title}
                  </h3>
                  <button
                    onClick={() => setSelectedNewsItem(featuredNews[0])}
                    style={{
                      background: C.goldPrimary,
                      color: C.textDark,
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#C99A30'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.goldPrimary
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Read Story
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-section > div:last-of-type > div {
              grid-template-columns: 1fr !important;
            }
            .hero-section > div:last-of-type > div > div:last-child {
              display: none !important;
            }
          }
        `}</style>
      </section>

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <section
          className="featured-news-section animate-on-scroll"
          style={{
            background: C.white,
            padding: "80px 24px",
          }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ marginBottom: 48 }}>
              <SectionLabel>Featured Story</SectionLabel>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  color: C.textDark,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Highlighting Our Impact
              </h2>
            </div>

            <div
              className="featured-news-card"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "center",
                background: C.purpleLavender,
                borderRadius: 24,
                overflow: "hidden",
                border: `1px solid rgba(91,44,131,0.1)`,
              }}
            >
              <div style={{ position: "relative", height: 500, overflow: "hidden" }}>
                <Image
                  src={featuredNews[0].image}
                  alt={featuredNews[0].title}
                  width={1200}
                  height={800}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 40%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    background: categoryColors[featuredNews[0].category],
                    color: C.white,
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {categoryLabels[featuredNews[0].category]}
                </div>
              </div>

              <div style={{ padding: "48px", maxWidth: 600 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  {featuredNews[0].date}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 32,
                    fontWeight: 700,
                    color: C.textDark,
                    lineHeight: 1.2,
                    marginBottom: 20,
                  }}
                >
                  {featuredNews[0].title}
                </h3>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.7,
                    color: C.textBody,
                    marginBottom: 32,
                  }}
                >
                  {featuredNews[0].excerpt}
                </p>
                <button
                  onClick={() => setSelectedNewsItem(featuredNews[0])}
                  style={{
                    background: C.purplePrimary,
                    color: C.white,
                    border: "none",
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4a2068";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.purplePrimary;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Read Full Story
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .featured-news-card {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
              }
              .featured-news-card > div:first-child {
                height: 300px !important;
              }
              .featured-news-card > div:last-child {
                padding: 32px 24px !important;
              }
            }
          `}</style>
        </section>
      )}

      {/* All News Grid Section */}
      <section
        className="news-section animate-on-scroll"
        style={{
          background: C.bgSoft,
          padding: "96px 24px",
        }}
      >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
                <div>
                  <SectionLabel>Latest News</SectionLabel>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(32px, 4vw, 48px)",
                      fontWeight: 700,
                      color: C.textDark,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Stories from Our Community
                  </h2>
                </div>

                {/* News Filter */}
                <div
                  className="news-filter"
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {Object.keys(categoryLabels).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveNewsFilter(category)}
                      style={{
                        padding: "8px 16px",
                        border: "1.5px solid rgba(91,44,131,0.2)",
                        borderRadius: 8,
                        background: activeNewsFilter === category ? C.purplePrimary : "transparent",
                        color: activeNewsFilter === category ? C.white : C.textBody,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (activeNewsFilter !== category) {
                          e.currentTarget.style.borderColor = C.purplePrimary;
                          e.currentTarget.style.background = C.purpleLavender;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeNewsFilter !== category) {
                          e.currentTarget.style.borderColor = "rgba(91,44,131,0.2)";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {categoryLabels[category]}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="news-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: 32,
                }}
              >
                {filteredNews.map((item) => (
                  <article
                    key={item.id}
                    className="news-card"
                    style={{
                      background: C.white,
                      borderRadius: 20,
                      overflow: "hidden",
                      border: "1px solid rgba(91,44,131,0.08)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedNewsItem(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(91,44,131,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={800}
                        height={600}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                        loading="lazy"
                        quality={75}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          background: categoryColors[item.category],
                          color: C.white,
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {categoryLabels[item.category]}
                      </div>
                    </div>

                    <div style={{ padding: "28px" }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.textMuted,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 12,
                        }}
                      >
                        {item.date}
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 22,
                          fontWeight: 700,
                          color: C.textDark,
                          lineHeight: 1.3,
                          marginBottom: 12,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: C.textBody,
                          marginBottom: 20,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.excerpt}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: C.purplePrimary,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        Read More →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <style>{`
              @media (max-width: 600px) {
                .news-grid {
                  grid-template-columns: 1fr !important;
                  gap: 24px !important;
                }
                .news-filter {
                  width: 100% !important;
                }
                .news-filter button {
                  flex: 1 !important;
                  min-width: 120px !important;
                }
              }
            `}</style>
        </section>

      {/* News Detail Modal */}
      {selectedNewsItem && (
        <div
          className="news-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSelectedNewsItem(null)}
        >
          <div
            className="news-modal-content"
            style={{
              background: C.white,
              borderRadius: 24,
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNewsItem(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(91,44,131,0.2)",
                cursor: "pointer",
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.purplePrimary;
                e.currentTarget.style.color = C.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
                e.currentTarget.style.color = C.textDark;
              }}
            >
              ×
            </button>

            <div style={{ height: 350, position: "relative" }}>
              <Image
                src={selectedNewsItem.image}
                alt={selectedNewsItem.title}
                width={1200}
                height={800}
                sizes="(max-width: 900px) 100vw, 900px"
                priority
                quality={85}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 40%",
                }}
              />
            </div>

            <div style={{ padding: "48px" }}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    background: categoryColors[selectedNewsItem.category],
                    color: C.white,
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {categoryLabels[selectedNewsItem.category]}
                </span>
                <span style={{ color: C.textMuted, fontSize: 13, fontWeight: 600 }}>
                  {selectedNewsItem.date}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 36,
                  fontWeight: 700,
                  color: C.textDark,
                  lineHeight: 1.2,
                  marginBottom: 24,
                }}
              >
                {selectedNewsItem.title}
              </h2>

              {selectedNewsItem.author && (
                <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(91,44,131,0.1)" }}>
                  <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>By {selectedNewsItem.author}</span>
                </div>
              )}

              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: C.textBody,
                  whiteSpace: "pre-line",
                  marginBottom: 32,
                }}
              >
                {selectedNewsItem.content}
              </div>

              {/* Gallery section within article */}
              {selectedNewsItem.gallery && selectedNewsItem.gallery.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: C.textDark, marginBottom: 20 }}>
                    Gallery
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {selectedNewsItem.gallery.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: 12,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "1px solid rgba(91,44,131,0.1)",
                          transition: "transform 0.2s",
                        }}
                        onClick={() => setLightboxImage({ src: img, alt: `${selectedNewsItem.title} - Image ${index + 1}` })}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <Image
                          src={img}
                          alt={`${selectedNewsItem.title} - Image ${index + 1}`}
                          width={400}
                          height={400}
                          sizes="200px"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: C.white,
              cursor: "pointer",
              fontSize: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            }}
          >
            ×
          </button>

          <div
            className="lightbox-content"
            style={{ maxWidth: 1200, maxHeight: "85vh", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              width={1200}
              height={1200}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              quality={90}
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
