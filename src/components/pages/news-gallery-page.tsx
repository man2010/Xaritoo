"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// Data model
// ─────────────────────────────────────────────────────────────────────────────

type NewsCategory = "program-highlight" | "community" | "impact-story" | "partnership" | "update";

interface MediaAsset {
  type: "video" | "image";
  src: string;
  poster?: string; // video thumbnail — TODO: add real poster frames once received
  alt: string;
  aspect?: string; // CSS aspect-ratio, e.g. "9 / 16" (portrait phone clip) or "4 / 5" (photo)
}

interface MediaBlock {
  label: string;
  assets: MediaAsset[];
}

interface StorySection {
  heading: string;
  paragraphs: string[];
  mediaBlocks: MediaBlock[];
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: NewsCategory;
  image: string;
  featured?: boolean;
  intro?: string[];
  sections?: StorySection[];
  closing?: { paragraphs: string[]; tagline: string };
}

const categoryLabels: Record<"all" | NewsCategory, string> = {
  all: "All",
  "program-highlight": "Program Highlights",
  community: "Community",
  "impact-story": "Impact Stories",
  partnership: "Partnerships",
  update: "Updates",
};

const categoryColors: Record<NewsCategory, string> = {
  "program-highlight": C.goldPrimary,
  community: C.greenGrowth,
  "impact-story": C.purplePrimary,
  partnership: "#E91E63",
  update: "#3B82F6",
};

// ─────────────────────────────────────────────────────────────────────────────
// Media placeholders — folder convention below. Drop matching files in
// /public/videos/... and /public/images/... (or swap each `src` for the
// hosted URL once uploaded to R2 / Cloudinary / etc). Every video is
// click-to-play (nothing downloads until the visitor presses play), so
// adding more assets here does not slow down the initial page load.
// ─────────────────────────────────────────────────────────────────────────────

const video = (src: string, alt: string, aspect = "9 / 16"): MediaAsset => ({ type: "video", src, alt, aspect });
const photo = (src: string, alt: string, aspect = "4 / 5"): MediaAsset => ({ type: "image", src, alt, aspect });

const newsItems: NewsItem[] = [
  {
    id: "summer-2026-highlight",
    title: "More Than Mentorship: Inside Xaritoo's First Summer",
    excerpt:
      "From DIY Xaritoo shirts and cooking challenges at the library to July 4 activities and our closing celebration, discover some of the moments that brought Seeds, Gardeners, and Gardens together during Xaritoo's inaugural summer.",
    date: "Summer 2026",
    category: "program-highlight",
    image: "/images/xaritoo-summer-program.jpeg",
    featured: true,
    intro: [
      "Xaritoo's inaugural summer mentorship program was built around a simple belief: meaningful relationships grow when young people have opportunities to learn, create, laugh, explore, and spend time together.",
      "Throughout the summer, our Seeds, Gardeners, and Gardens came together for library sessions, creative projects, games, cooking challenges, outdoor activities, and community celebrations. Each experience gave participants another opportunity to connect beyond traditional mentoring conversations.",
    ],
    sections: [
      {
        heading: "Creating Together at the Library",
        paragraphs: [
          "Our library sessions became a space for creativity, teamwork, and connection.",
          "Participants worked on hands-on DIY projects, including creating their own Xaritoo shirts, aprons, and sports bags. Instead of simply receiving Xaritoo-branded items, they had an opportunity to personalize and create something connected to their experience in the program.",
          "The sessions also included games and group activities that encouraged participants to interact, have fun, and get to know one another.",
          "One of the memorable activities was our cooking challenge. Participants worked together, shared ideas, and experienced the fun — and sometimes the surprises — that come with creating something as a team.",
        ],
        mediaBlocks: [
          {
            label: "DIY Xaritoo Shirts",
            assets: [
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-shirts-1.mp4.mp4", "Participants decorating their own Xaritoo shirts — clip 1"),
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-shirts-2.mp4.mp4", "Participants decorating their own Xaritoo shirts — clip 2"),
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-shirts-3.mp4.mp4", "Participants decorating their own Xaritoo shirts — clip 3"),
            ],
          },
          {
            label: "Getting Shirts Ready for Distribution",
            assets: [video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/Library-sessions.mp4.mp4", "Volunteers organizing Xaritoo shirts by size and color and adding names")],
          },
          {
            label: "DIY Xaritoo Aprons",
            assets: [
              photo("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-apron-1.jpg.jpeg", "A participant decorating their Xaritoo apron — photo 1"),
              photo("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-apron-2.jpg.jpeg", "A participant decorating their Xaritoo apron — photo 2"),
              photo("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-apron-3.jpg.jpeg", "A participant decorating their Xaritoo apron — photo 3"),
            ],
          },
          {
            label: "DIY Xaritoo Sports Bags",
            assets: [video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/diy-sports-bags.mp4.mp4", "Participants personalizing their Xaritoo sports bags")],
          },
          {
            label: "What's Inside?",
            assets: [
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/whats-inside-1.mp4.mp4", "Unboxing what's inside the Xaritoo kit — clip 1"),
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/whats-inside-2.mp4.mp4", "Unboxing what's inside the Xaritoo kit — clip 2"),
            ],
          },
          {
            label: "Cooking Challenge",
            assets: Array.from({ length: 6 }, (_, i) => video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/cooking-challenge-" + (i + 1) + ".mp4.mp4", `Cooking challenge — clip ${i + 1} of 6`)),
          },
        ],
      },
      {
        heading: "July 4: Connection Beyond the Library",
        paragraphs: [
          "Mentorship also moved outside the walls of the library.",
          "During our July 4 activities, Xaritoo participants came together for outdoor games, sports, conversations, and time with the broader community.",
          "These informal moments mattered. Seeds and Gardeners had an opportunity to interact differently, build friendships, enjoy themselves, and strengthen the sense of belonging that Xaritoo hopes to create.",
        ],
        mediaBlocks: [
          {
            label: "July 4 Celebrations",
            assets: [
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/july4-1.mp4.mp4", "July 4 outdoor activities — clip 1"),
              video("https://pub-ca5a60ca01484c16bede7ba44924da59.r2.dev/july4-2.mp4.mp4", "July 4 outdoor activities — clip 2"),
            ],
          },
        ],
      },
      {
        heading: "Celebrating How Far We Grew",
        paragraphs: [
          "The summer concluded with the Xaritoo Closing Ceremony, a moment to recognize everyone who helped make the inaugural program possible.",
          "We celebrated our Seeds for showing up, participating, and being willing to grow. We recognized our Gardeners for giving their time, guidance, and encouragement. And we acknowledged the Gardens and community members who helped create the supportive environment around them.",
          "The closing ceremony wasn't simply the end of a summer program. It was an opportunity to look back at the relationships, experiences, and memories created along the way — and to recognize the beginning of the Xaritoo community.",
        ],
        // TODO: replace with closing group photo → recognition/certificate photos → candid celebration photos → closing video, once received
        mediaBlocks: [
          {
            label: "Closing Ceremony",
            assets: [photo("/images/xaritoo-mentors.jpeg", "Xaritoo closing ceremony"), photo("/images/mentor-gallery-08.jpeg", "Recognizing Gardeners and Seeds at the closing ceremony")],
          },
        ],
      },
    ],
    closing: {
      paragraphs: [
        "Xaritoo's first summer showed us that mentorship can happen in many ways.",
        "Sometimes it happens through an important conversation between a Seed and a Gardener. Sometimes it happens while decorating a shirt, working through a cooking challenge, playing a game, competing on a field, or simply laughing together.",
        "Those shared experiences helped turn a group of participants into a community.",
      ],
      tagline: "Mentorship. Culture. Connection. No Seed Grows Alone.",
    },
  },
  {
    id: "impact-stories-2026",
    title: "Impact Stories: Growth You Can See, Voices You Can Hear",
    excerpt:
      "From new friendships to family connection, creativity, trust, and quiet confidence — real stories from Xaritoo's inaugural 2026 mentorship summer.",
    date: "September 2026",
    category: "impact-story",
    image: "/images/xaritoo-summer-program.jpeg",
    intro: [
      "Xaritoo began with a simple belief: young people grow stronger when they have people around them who listen, guide, encourage, and create opportunities for them to belong.",
      "During our inaugural Xaritoo Mentorship summer in 2026, Seeds, Gardeners, Gardens, and families came together through mentorship, creativity, sports, culture, conversation, and shared experiences. These are not just program highlights — these are stories of connection, confidence, belonging, and growth.",
    ],
    sections: [
      {
        heading: "\"I Met People I Wouldn't Have Met Before.\"",
        paragraphs: [
          "One of the earliest ideas behind Xaritoo was simple: help young people build friendships and relationships beyond the circles they already knew. During the first Xaritoo Mentorship summer, that idea became real.",
          "Young people arrived with different personalities, interests, career dreams, schools, and experiences — some drawn to medicine and nursing, others to engineering, technology, business, entrepreneurship, teaching, veterinary medicine, fashion, and finance. Their Gardeners brought experience from fields including public health, chemistry, criminal justice, business, and social work.",
          "\"Met new people.\" \"It allowed me to make connections with people.\" \"To talk to more people.\" Those answers may be short, but they represent something important: sometimes growth begins simply because a young person discovers there are people here they can talk to.",
        ],
        mediaBlocks: [
          {
            label: "New Connections",
            assets: [
              photo("/images/mentor-gallery-01.jpeg", "Xaritoo participants building new connections"),
              photo("/images/mentor-gallery-03.jpeg", "Xaritoo mentors and mentees together during a program activity"),
            ],
          },
        ],
      },
      {
        heading: "\"I Wanted My Children to Feel Connected.\" — A Parent's Perspective",
        paragraphs: [
          "For one parent, Xaritoo answered a hope she already had for her children. She wanted them to meet other young people their age, develop friendships, and have positive people around them.",
          "\"The Xaritoo mentorship program had a big impact on my family. I've always wanted my children to connect with other children their age, build friendships, and have positive role models. The program gave them an opportunity to grow, learn, and feel connected to a supportive community. It has been a wonderful experience for my family.\"",
          "That story matters because youth development doesn't happen in isolation. When a young person finds connection, the impact can reach beyond the individual Seed — it can reach the family.",
        ],
        mediaBlocks: [
          {
            label: "Family Connection",
            assets: [photo("/images/xaritoo-mentor-mentee.jpeg", "A Xaritoo mentor and mentee celebrating their connection")],
          },
        ],
      },
      {
        heading: "A Shirt Became More Than a Shirt",
        paragraphs: [
          "Some of Xaritoo's most memorable moments weren't lectures. They happened around tables, as participants personalized Xaritoo shirts, aprons, and sports bags themselves — with creativity, conversation, and laughter.",
          "They weren't simply receiving something with a Xaritoo logo. They were making it their own. Belonging grows when young people are invited to participate, contribute, create, and see themselves as part of what is being built.",
        ],
        mediaBlocks: [
          {
            label: "Creating Together",
            assets: [photo("/images/xaritoo-culture.jpeg", "Xaritoo participants creating and celebrating together")],
          },
        ],
      },
      {
        heading: "Sometimes Mentorship Looks Like a Cooking Challenge",
        paragraphs: [
          "During Xaritoo's summer activities, Seeds, Gardeners, and Gardens participated in cooking challenges, sports, games, outdoor activities, and community celebrations. Those moments weren't separate from mentorship — they were part of it.",
          "Young people don't build trust simply because adults tell them to. Trust develops through time, consistency, conversation, laughter, shared challenges, and experiences.",
          "\"I had fun playing sports.\" \"Positive experience for me and good interactions with the community.\" The activity may be what brought everyone together. The relationship is what we hope stays afterward.",
        ],
        mediaBlocks: [
          {
            label: "Trust & Teamwork",
            assets: [photo("/images/mentor-gallery-05.jpeg", "A Xaritoo mentor supporting three mentees")],
          },
        ],
      },
      {
        heading: "\"Empowerment and Leadership.\"",
        paragraphs: [
          "When participants were asked what impact Xaritoo had on them, one response contained only three words: \"Empowerment and leadership.\"",
          "Throughout the summer, young people had opportunities to communicate with peers, interact with mentors, participate in group activities, explore interests, make decisions, and contribute their ideas.",
          "Growth doesn't always look dramatic. Sometimes confidence grows quietly — in a new friendship, a question asked of a mentor, or a career considered for the first time.",
        ],
        mediaBlocks: [
          {
            label: "Confidence & Leadership",
            assets: [photo("/images/mentor-gallery-06.jpeg", "Xaritoo mentors and mentees celebrating together")],
          },
        ],
      },
      {
        heading: "31 Seeds. 15 Gardeners. 7 Gardens. One Community.",
        paragraphs: [
          "It started much smaller than this. In 2024, Sen Path Community began with conversations around a library table. The questions were about young people's real lives: friendship, confidence, school, careers, jobs, connection, and their future.",
          "Two years later, Xaritoo's inaugural mentorship pilot brought together 31 Seeds, 15 Gardeners, 7 Gardens, and 53 total participants. They talked. They created. They cooked. They competed. They played. They learned. They connected — and they gave us feedback about what Xaritoo should become next.",
          "A seed planted around one library table had begun growing into a community.",
        ],
        mediaBlocks: [
          {
            label: "Our Journey",
            assets: [photo("/images/xaritoo-mentors.jpeg", "A group of Xaritoo mentors together")],
          },
        ],
      },
      {
        heading: "They Told Us What They Want Next",
        paragraphs: [
          "Xaritoo's first summer was a pilot for a reason. It gave us an opportunity to test ideas, build relationships, listen to participants, and learn what young people want from the Xaritoo experience.",
          "Participants asked for more activities, more sports, more outings and field trips, stronger cultural programming, better planning and communication, and greater consistency in mentor participation.",
          "We asked. They answered. Now we grow. That's what youth-centered programming should look like: not simply creating something for young people, but continuing to build it with them.",
        ],
        mediaBlocks: [],
      },
    ],
    closing: {
      paragraphs: [
        "Xaritoo's story is still beginning. Our first summer showed us what can happen when young people, mentors, families, and community members come together with one purpose: helping young people grow.",
        "There is more to learn. More relationships to build. More young people to listen to. And more stories waiting to be written.",
      ],
      tagline: "No Seed Grows Alone.",
    },
  },
  {
    id: "collaboration-sac-2026",
    title: "Growing Through Collaboration: Xaritoo & the Senegalese Association of Chicago",
    excerpt:
      "How a partnership with the Senegalese Association of Chicago helped bring the inaugural Xaritoo Mentorship program to life in summer 2026.",
    date: "September 2026",
    category: "partnership",
    image: "/images/partner-sac.jpeg",
    intro: [
      "Every meaningful community initiative begins with a vision. Bringing that vision to life takes people and organizations who are willing to come together around a shared purpose.",
    ],
    sections: [
      {
        heading: "A Shared Purpose",
        paragraphs: [
          "For Sen Path Community, that vision is to help young people build friendships, receive mentorship, explore their interests, and develop the confidence to pursue their goals. In summer 2026, collaboration with the Senegalese Association of Chicago (SAC) became part of that journey as we launched the inaugural Xaritoo Mentorship program.",
          "Through this collaboration, Xaritoo connected its youth development mission with SAC's established community network serving Senegalese families in the Chicago area. Together, these connections created opportunities for young people to take part in experiences that encouraged friendship, cultural connection, and meaningful relationships.",
          "These shared experiences reflect an important part of Xaritoo's mission: helping young people form lasting connections while strengthening their sense of belonging within their communities.",
        ],
        mediaBlocks: [
          {
            label: "Community Partnership",
            assets: [
              photo("/images/partner-sac.jpeg", "Senegalese Association of Chicago logo"),
              photo("/images/xaritoo-culture.jpeg", "A Xaritoo cultural activity featuring art, food, and community traditions"),
            ],
          },
        ],
      },
      {
        heading: "Building on What Works",
        paragraphs: [
          "As Sen Path Community continues to develop Xaritoo's mentorship and school-year support programs, we recognize the value of community relationships in opening doors for young people. Our experience with SAC is one example of how collaboration can bring people together around youth development.",
          "When young people, families, mentors, and community organizations come together, they create more opportunities for connection, learning, and growth.",
        ],
        mediaBlocks: [],
      },
    ],
    closing: {
      paragraphs: [],
      tagline: "No Seed Grows Alone.",
    },
  },
  {
    id: "help-us-grow-2026",
    title: "Help Us Grow the Next Generation",
    excerpt:
      "Xaritoo welcomes schools, libraries, businesses, and individuals who share our commitment to youth development to collaborate with us.",
    date: "September 2026",
    category: "community",
    image: "/images/xaritoo-mentors.jpeg",
    intro: [
      "At Xaritoo, we believe that every young person deserves access to mentorship, guidance, meaningful relationships, and opportunities to explore their potential.",
    ],
    sections: [
      {
        heading: "Ways to Collaborate",
        paragraphs: [
          "We welcome opportunities to collaborate with schools, libraries, community organizations, businesses, educational institutions, and individuals who share our commitment to youth development.",
          "Through community collaboration, we can create more opportunities for young people to learn, build confidence, strengthen their cultural identity, explore educational and career pathways, and connect with positive role models.",
          "Whether through mentorship, educational resources, program activities, volunteer engagement, or financial and in-kind support, your contribution can help us build a stronger community around our youth.",
        ],
        mediaBlocks: [
          {
            label: "Get Involved",
            assets: [photo("/images/xaritoo-mentors.jpeg", "A group of Xaritoo mentors together")],
          },
        ],
      },
    ],
    closing: {
      paragraphs: [
        "Together, we can create an environment where every Seed has the support it needs to grow.",
        "Interested in collaborating? We would love to explore how your organization can support Xaritoo's mission. Contact us at senpathcommunity@gmail.com.",
      ],
      tagline: "No Seed Grows Alone.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Lazy, click-to-play video tile — no network request happens until the
// visitor presses play, so the page's initial weight is unaffected no
// matter how many videos a section holds.
// ─────────────────────────────────────────────────────────────────────────────

function LazyVideo({ src, poster, alt, aspect }: MediaAsset) {
  const [activated, setActivated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!activated) return;
    videoRef.current?.play().catch(() => {
      /* autoplay blocked by the browser — the visitor can press the native controls */
    });
  }, [activated]);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: aspect ?? "9 / 16", borderRadius: 12, overflow: "hidden", background: C.purpleDark }}>
      {activated ? (
        <video ref={videoRef} src={src} controls playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <button
          type="button"
          onClick={() => setActivated(true)}
          aria-label={`Play video: ${alt}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
        >
          {poster ? (
            <Image src={poster} alt={alt} fill sizes="220px" loading="lazy" style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.purpleDark}, ${C.purplePrimary})` }} />
          )}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,8,32,0.3)" }}>
            <span style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
              <Icon name="play" size={19} style={{ color: C.purplePrimary, marginLeft: 3 }} />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

function MediaBlockGrid({ block, onImageClick }: { block: MediaBlock; onImageClick: (image: { src: string; alt: string }) => void }) {
  return (
    <div style={{ marginTop: 22 }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.purplePrimary, marginBottom: 10 }}>{block.label}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {block.assets.map((asset, i) =>
          asset.type === "video" ? (
            <LazyVideo key={i} {...asset} />
          ) : (
            <div
              key={i}
              onClick={() => onImageClick({ src: asset.src, alt: asset.alt })}
              style={{ position: "relative", width: "100%", aspectRatio: asset.aspect ?? "4 / 5", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(91,44,131,0.1)" }}
            >
              <Image src={asset.src} alt={asset.alt} fill sizes="200px" loading="lazy" style={{ objectFit: "cover" }} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function NewsGalleryPage() {
  const [activeNewsFilter, setActiveNewsFilter] = useState<"all" | NewsCategory>("all");
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filteredNews = activeNewsFilter === "all" ? newsItems : newsItems.filter((item) => item.category === activeNewsFilter);
  const featuredNews = newsItems.filter((item) => item.featured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="news-page">
      {/* Hero */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{ position: "relative", minHeight: "100vh", background: C.purpleDark, display: "flex", alignItems: "center", overflow: "hidden" }}
      >
        <div
          style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/xaritoo-mentors.jpeg)", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.22 }}
          aria-hidden
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.purpleDark} 40%, ${C.purplePrimary}88 100%)` }} aria-hidden />
        <div style={{ position: "absolute", left: 0, top: "30%", width: 4, height: "40%", background: C.goldPrimary, borderRadius: "0 2px 2px 0" }} aria-hidden />

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ display: "inline-block", width: 32, height: 2, background: C.goldPrimary }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.goldLight }}>News &amp; Stories</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.1, color: C.white, marginBottom: 24, letterSpacing: "-0.02em" }}>
              Stories From Our <em style={{ fontStyle: "italic", color: C.goldLight }}>Community</em>
            </h1>

            <p style={{ fontSize: 19, lineHeight: 1.65, color: "rgba(255,255,255,0.78)", marginBottom: 40, maxWidth: 520 }}>
              Follow Xaritoo's journey through mentorship, culture, and connection. Explore program milestones, community experiences, participant voices, partnerships, and opportunities to get involved.
            </p>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                { num: newsItems.length, label: "Stories" },
                { num: newsItems.filter((i) => i.category === "program-highlight").length, label: "Program Highlights" },
                { num: newsItems.filter((i) => i.category === "impact-story").length, label: "Impact Stories" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, color: C.goldLight, lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: 32, backdropFilter: "blur(12px)", maxWidth: 320, width: "100%" }}>
              <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.goldLight, marginBottom: 24 }}>Program Highlight</p>
              {featuredNews[0] && (
                <>
                  <div style={{ height: 180, marginBottom: 20, borderRadius: 12, overflow: "hidden" }}>
                    <Image src={featuredNews[0].image} alt={featuredNews[0].title} width={400} height={300} sizes="320px" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 12, lineHeight: 1.3 }}>{featuredNews[0].title}</h3>
                  <button
                    onClick={() => setSelectedNewsItem(featuredNews[0])}
                    style={{ background: C.goldPrimary, color: C.textDark, border: "none", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#C99A30"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.goldPrimary; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Read the Story
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-section > div:last-of-type > div { grid-template-columns: 1fr !important; }
            .hero-section > div:last-of-type > div > div:last-child { display: none !important; }
          }
        `}</style>
      </section>

      {/* Category filter + news grid */}
      <section className="news-section animate-on-scroll" style={{ background: C.bgSoft, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <SectionLabel>Latest News</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.textDark, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Stories from Our Community
              </h2>
            </div>

            <div className="news-filter" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(Object.keys(categoryLabels) as Array<"all" | NewsCategory>).map((category) => (
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

          {filteredNews.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: C.textMuted, background: C.white, borderRadius: 16, border: "1px solid rgba(91,44,131,0.08)" }}>
              No stories in this category yet — check back soon.
            </div>
          ) : (
            <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 32 }}>
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="news-card"
                  style={{ background: C.white, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(91,44,131,0.08)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" }}
                  onClick={() => setSelectedNewsItem(item)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(91,44,131,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <Image src={item.image} alt={item.title} width={800} height={600} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" loading="lazy" quality={75} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
                    <div style={{ position: "absolute", top: 16, left: 16, background: categoryColors[item.category], color: C.white, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {categoryLabels[item.category]}
                    </div>
                  </div>

                  <div style={{ padding: 28 }}>
                    <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{item.date}</div>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: C.textDark, lineHeight: 1.3, marginBottom: 12 }}>{item.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textBody, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.excerpt}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purplePrimary, fontWeight: 600, fontSize: 14 }}>Read the Story →</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 600px) {
            .news-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
            .news-filter { width: 100% !important; }
            .news-filter button { flex: 1 !important; min-width: 120px !important; }
          }
        `}</style>
      </section>

      {/* Full story modal */}
      {selectedNewsItem && (
        <div
          className="news-modal-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(4px)" }}
          onClick={() => setSelectedNewsItem(null)}
        >
          <div
            className="news-modal-content"
            style={{ background: C.white, borderRadius: 24, maxWidth: 900, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNewsItem(null)}
              aria-label="Close story"
              style={{ position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(91,44,131,0.2)", cursor: "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.purplePrimary; e.currentTarget.style.color = C.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.color = C.textDark; }}
            >
              ×
            </button>

            <div style={{ height: 350, position: "relative" }}>
              <Image src={selectedNewsItem.image} alt={selectedNewsItem.title} width={1200} height={800} sizes="(max-width: 900px) 100vw, 900px" priority quality={85} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
            </div>

            <div style={{ padding: 48 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <span style={{ background: categoryColors[selectedNewsItem.category], color: C.white, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {categoryLabels[selectedNewsItem.category]}
                </span>
                <span style={{ color: C.textMuted, fontSize: 13, fontWeight: 600 }}>{selectedNewsItem.date}</span>
              </div>

              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 36, fontWeight: 700, color: C.textDark, lineHeight: 1.2, marginBottom: 24 }}>{selectedNewsItem.title}</h2>

              {selectedNewsItem.intro && (
                <div style={{ marginBottom: 32 }}>
                  {selectedNewsItem.intro.map((p, i) => (
                    <p key={i} style={{ fontSize: 17, lineHeight: 1.8, color: C.textBody, marginBottom: 16 }}>{p}</p>
                  ))}
                </div>
              )}

              {selectedNewsItem.sections?.map((section) => (
                <div key={section.heading} style={{ marginBottom: 44 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: C.textDark, marginBottom: 16 }}>{section.heading}</h3>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: C.textBody, marginBottom: 14 }}>{p}</p>
                  ))}
                  {section.mediaBlocks.map((block) => (
                    <MediaBlockGrid key={block.label} block={block} onImageClick={setLightboxImage} />
                  ))}
                </div>
              ))}

              {selectedNewsItem.closing && (
                <div style={{ borderTop: "1px solid rgba(91,44,131,0.1)", paddingTop: 32, marginBottom: 32 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: C.textDark, marginBottom: 16 }}>What We Planted Together</h3>
                  {selectedNewsItem.closing.paragraphs.map((p, i) => (
                    <p key={i} style={{ fontSize: 16, lineHeight: 1.75, color: C.textBody, marginBottom: 14 }}>{p}</p>
                  ))}
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontStyle: "italic", color: C.purplePrimary, marginTop: 20 }}>{selectedNewsItem.closing.tagline}</p>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 8 }}>
                <a href="/programs" style={{ background: C.purplePrimary, color: C.white, textDecoration: "none", padding: "13px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
                  Explore Our Programs
                </a>
                <a href="/get-involved" style={{ background: "transparent", color: C.purplePrimary, border: `1.5px solid ${C.purplePrimary}`, textDecoration: "none", padding: "13px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
                  Get Involved
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox (photos only — videos play inline in their own tile) */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            aria-label="Close image"
            style={{ position: "absolute", top: 24, right: 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: C.white, cursor: "pointer", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            ×
          </button>
          <div style={{ maxWidth: 1200, maxHeight: "85vh", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxImage.src} alt={lightboxImage.alt} width={1200} height={1200} sizes="(max-width: 1200px) 100vw, 1200px" priority quality={90} style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        </div>
      )}
    </main>
  );
}