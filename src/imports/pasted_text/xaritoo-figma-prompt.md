# MASTER PROMPT FOR FIGMA — Xaritoo Website Design System & Mockups

> Copy everything below this line into Figma (Figma Make / First Draft, or as a written brief for a designer). Where this references "generate," it also works as a manual build brief for a human designer in Figma.

---

## ROLE & MISSION

You are a senior brand and product designer. Design a **complete, production-ready Figma design system and full page set** for **Xaritoo**, a youth-development mentorship program (a program of Sen Path Community). The output must be a polished, developer-ready design file — organized, componentized, and annotated — not a rough moodboard. Follow every instruction below precisely. Do not invent facts, statistics, staff names, or testimonials beyond what is provided in the "APPROVED CONTENT" section.

---

## 1. FIGMA FILE ORGANIZATION

Structure the file with these pages (Figma "Pages" panel), in this order:

```
📘 00 — Cover & Brand Overview
🎨 01 — Foundations (Color, Type, Spacing, Grid, Icons)
🧩 02 — Components (Buttons, Cards, Nav, Forms, Footer)
🖥️ 03 — Desktop Wireframes (1440px)
💻 04 — Tablet Wireframes (768px)
📱 05 — Mobile Wireframes (375px)
🌍 06 — Localization (EN / FR / ZH variants)
♿ 07 — Accessibility Annotations
📐 08 — Redlines / Developer Handoff
```

Use consistent frame naming: `Page/Breakpoint/Section` (e.g., `Home/Desktop/Hero`, `Contact/Mobile/Form`). Group related frames with Figma Sections for easy scanning. Every screen must sit on an artboard sized exactly to its breakpoint (1440×auto, 768×auto, 375×auto) with no stray floating elements outside frames.

---

## 2. FOUNDATIONS — SET UP AS FIGMA VARIABLES & STYLES (not just visual swatches)

### Color variables (create a `Xaritoo` variable collection, with modes if you support light/dark later)

| Variable name | Hex | Use |
|---|---|---|
| `color/purple/primary` | `#5B2C83` | Primary brand color — headings, buttons, nav accents |
| `color/purple/dark` | `#32194D` | Hero backgrounds, footer, high-contrast sections |
| `color/purple/lavender-light` | `#F2ECF7` | Soft section backgrounds and cards |
| `color/gold/primary` | `#B58A2A` | Primary highlights / key CTAs |
| `color/gold/light` | `#E2C878` | Highlights on dark backgrounds only — never small text on white |
| `color/green/growth` | `#4F7D55` | Supporting accents, program indicators |
| `color/green/light` | `#EAF2EA` | Volunteer/community section backgrounds |
| `color/text/dark` | `#251C2D` | Primary heading/body contrast |
| `color/text/body` | `#40364A` | Paragraph text |
| `color/text/muted` | `#746C7A` | Captions, labels |
| `color/bg/soft` | `#FAF8FC` | Page background |
| `color/bg/white` | `#FFFFFF` | Primary content background |

Rules: purple is the dominant brand color; gold is an accent only, never large blocks of body text; green supports the growth metaphor without competing with purple. **Run every text/background pairing through a contrast checker and annotate the ratio directly on the Foundations page** (target 4.5:1 body text, 3:1 large text/UI). Flag gold-on-white and light-gold combinations as fail states — do not use them for text.

### Typography styles (create as Figma text styles, named `Heading/Hero`, `Heading/Page-Title`, etc.)

| Style name | Font | Desktop | Mobile | Line height | Weight |
|---|---|---|---|---|---|
| `Heading/Hero` | Playfair Display | 48–64px | 36–44px | 1.1–1.2 | Bold |
| `Heading/Page-Title` | Playfair Display | 40–52px | 32–40px | 1.15 | Bold |
| `Heading/Section-Title` | Playfair Display | 32–44px | 28–34px | 1.2 | Semibold |
| `Heading/Card-Title` | Inter | 22–28px | same | 1.3 | Semibold |
| `Body/Default` | Inter | 17–19px | same | 1.55–1.75 | Regular |
| `UI/Nav-Button` | Inter | 15–17px | same | 1.3 | Medium |
| `UI/Caption-Label` | Inter | 13–15px | same | 1.3 | Regular |

Build each style at both a desktop and mobile size variant if Figma responsive text isn't used, or use Figma variables for font size if available. Document the required Chinese-text fallback: Playfair Display and Inter do not render CJK glyphs, so annotate Chinese headline/body frames with the substitute stack — headings in a suitable serif/system CJK font, body in `PingFang SC` / `Microsoft YaHei` / system sans — and note this directly on the Localization page (Section 6 below).

### Spacing & grid
- Desktop grid: 12-column, max content width ≈1200px, centered, responsive gutters (24px desktop / 16px mobile).
- Vertical section spacing variables: `space/section-desktop` = 80–110px, `space/section-mobile` = 48–72px.
- Component spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px as Figma spacing variables — use these consistently rather than arbitrary values.
- Paragraph text frames constrained to a 55–75 character measure at body size.

### Icons & logo
Use the two supplied Xaritoo logo files (dark-purple-background version and light/transparent-background version) placed as components — do not recolor, stretch, rotate, or rebuild the wordmark with a different font. Define a `Logo/Clearspace` guide equal to the height of the "X" and enforce it in the component's auto-layout padding. Header logo width: 140–180px desktop / 120–150px mobile, set as a component property. Use `lucide` style icons (simple, single-weight line icons) for UI icons; keep one icon style throughout — no mixed icon families.

---

## 3. COMPONENT LIBRARY (build as real Figma components with variants & auto-layout)

Build each as a proper component set with variants (state, size, breakpoint as applicable) and Auto Layout so they resize correctly when content or breakpoint changes:

- **Button** — variants: `Primary` (gold bg, dark text), `Secondary` (purple bg, white text), `Outline` (transparent, visible border), `Text Link` (purple text). States: Default / Hover / Focus (visible focus ring) / Disabled.
- **Header/Nav** — variants: Desktop (full nav + one highlighted CTA) and Mobile (hamburger menu state: Closed / Open, with the open state shown as its own frame demonstrating the full-screen or slide-in menu and visible focus order).
- **Hero** — variants: `Dark Background` and `Photo Overlay`. Auto-layout so headline + subtext + up to two buttons resize together.
- **Section Label** — small uppercase text with a gold underline, 2–5 words, as a component.
- **Program Card** — image, title, short summary, one link; variant for image-top and horizontal layouts.
- **Impact Stat** — large number + short label + timeframe caption; build as a set of 4 for the impact grid.
- **Framework Card** — three consistent variants for Seed / Gardener / Garden, same structure, different icon/label.
- **Testimonial** — large quote, name/role, and a small "✓ Approved with consent" internal annotation tag (internal-only marker, not shown to site visitors) so editors always see which testimonials are cleared for use.
- **CTA Band** — purple/green gradient or dark background, one action + one clear benefit line.
- **Form Field** — text input, textarea, select — each with persistent visible label (not placeholder-only), helper text slot, and Default / Focus / Error / Disabled states with the error state using both a color change and an icon+text message (never color alone).
- **Footer** — org line, nav columns, contact channels, social icon row, policy links, copyright line.
- **Language Switcher** — a small component showing "EN / FR / ZH" as three real link-style targets (not a dropdown-only interaction) for the header and footer.

Publish this component set as a Team Library if the workspace supports it, so downstream files can consume it.

---

## 4. PAGES TO DESIGN (each at Desktop 1440 / Tablet 768 / Mobile 375)

```
Home
About                (Our Story, Mission & Vision, Org relationship)
Framework            (Seed / Gardener / Garden)
Programs             (overview: Mentorship, Club, Community Experiences)
Programs → Mentorship (Summer Program detail)
Programs → Club      (Student Support, Fall & Spring detail)
Impact               (2026 pilot data + testimonials)
Get Involved         (Mentor / Volunteer / Partner pathways)
Contact              (form + official channels)
Privacy / Terms / Photo & Media Policy (can share one simple long-form template)
```

### Home page frame — section order (build each section as its own named frame/group)
1. Header (sticky nav)
2. Hero — headline **"Every Seed Deserves the Opportunity to Grow."** / subtext **"Helping young people grow through mentorship, culture, and connection."** / buttons `[Become a Mentor] [Support Xaritoo]` + text link "Learn More About Xaritoo →"
3. Identity strip — "Mentorship • Culture • Connection" / "No Seed Grows Alone."
4. What is Xaritoo? — Who We Are copy (see Section 5 below)
5. Three pillars (Mentorship / Culture / Connection)
6. Programs — two Program Cards (Xaritoo Mentorship, Xaritoo Club)
7. Framework — three Framework Cards (Seed, Gardener, Garden)
8. Impact — four Impact Stat components: 🌱 31 Youth (Seeds) · 🌿 15 Mentors (Gardeners) · 🌳 7 Supervisors (Gardens) · 🤝 53 Total Participants, labeled "2026 Inaugural Summer Pilot"
9. One approved Testimonial
10. Community Partners — current partner: Senegalese Association of Chicago (SAC)
11. Get Involved CTA band
12. Footer

Alternate section backgrounds intentionally down the page: white → light lavender → dark purple → light green — annotate this rhythm directly on the frame (a small note layer per section stating its background token) so it reads clearly in handoff.

---

## 5. APPROVED CONTENT (place verbatim into the design — do not invent or alter facts)

**Who We Are:**
"Xaritoo is a youth development initiative of Sen Path Community that empowers young people through mentorship, culture, and connection. We believe every young person has unique potential that flourishes when surrounded by caring mentors, supportive families, and a strong community.
While Xaritoo welcomes youth from all backgrounds, we are especially committed to supporting first-generation American youth and children of immigrant families as they navigate school, identity, leadership, college, careers, and life in the United States.
Through our unique Seed–Gardener–Garden model, we connect young people with dedicated mentors who provide guidance, encouragement, accountability, and meaningful relationships that help them grow into confident, responsible, and compassionate leaders."

**Our Vision:** "We envision a future where every young person has the support, opportunities, and confidence to reach their fullest potential—because No Seed Grows Alone."

**🌱 Xaritoo Mentorship — Summer Program:**
"A structured mentorship experience that pairs youth (Seeds) with trained mentors (Gardeners) and caring supervisors (Gardens). Through one-on-one mentoring, cultural experiences, educational activities, and community engagement, participants build confidence, friendships, and life skills."

**📚 Xaritoo Club — Student Support | Fall & Spring:**
"A school-year support program providing students with academic assistance, educational resources, tutoring, college and career guidance, and encouragement through trained volunteers and mentors."
Support includes: Math, Science, Writing, SAT/ACT Preparation, Scholarships & College Planning, Career & Resume Support.

**🌍 Community Experiences** (a feature of the programs, not a third standalone program):
"Throughout the year, Xaritoo brings youth, families, mentors, and community partners together through cultural celebrations, leadership workshops, service projects, educational trips, and special events that strengthen relationships and build a lasting sense of belonging."

**Impact copy:** "Our impact goes beyond numbers. Every mentorship relationship helps young people: Build confidence · Strengthen leadership skills · Explore careers and higher education · Develop meaningful friendships · Strengthen cultural identity · Create positive lifelong connections." / "As Xaritoo grows, we will continue measuring our impact through participant outcomes, family feedback, mentor engagement, and community partnerships."

**Testimonials (place with name + role + the internal "✓ Approved with consent" tag from Section 3):**
- Parent — Astou Nguere (gratitude message about the summer program, as provided in source material)
- Mentor — Binta Mbaye: "Met new people."
- Mentee — Adji Ndiaye: "It made me get advice [from] other 1st generation kids who had experience."
- Community Partner — Babacar Fall: congratulatory message ending with "No seed grows alone."

**Community Partners copy:** "Xaritoo believes lasting impact is created through collaboration. We are grateful for the organizations and community leaders who have partnered with us to invest in young people." Current Partner: Senegalese Association of Chicago (SAC).

**Footer copy:** "XARITOO — Mentorship • Culture • Connection — No Seed Grows Alone. Xaritoo is a youth development initiative of Sen Path Community, dedicated to helping young people grow through mentorship, education, leadership, and community."
Explore: Home, About, Our Programs, Our Impact, Get Involved, Contact
Get Involved: Become a Mentor, Volunteer, Become a Community Partner, Support Xaritoo
Connect: 📧 senpathcommunity@gmail.com · 🌐 xaritoo.org · 📸 Instagram @xaritoomentorship · 📘 Facebook Xaritoo Mentorship · 🎵 TikTok @xaritoomentorship · ▶️ YouTube @XaritooMentorship · 💬 WhatsApp Channel
Bottom line: "© 2026 Sen Path Community. Xaritoo is a youth development initiative of Sen Path Community. All rights reserved." — Privacy Policy • Photo & Media Policy • Terms of Use

**Naming rules to enforce across every frame:** always "Xaritoo Mentorship" for the summer program and "Xaritoo Club — Student Support" for the school-year program; always describe Xaritoo as "a youth development initiative/program of Sen Path Community"; never invent statistics, roles, program names, dates, or testimonials; label every impact figure with its year/cycle ("2026 Inaugural Summer Pilot"); never imply tax-deductibility anywhere in CTA copy; never depict an identifiable minor or name a staff member in a public role without a documented-consent note.

---

## 6. LOCALIZATION PAGE (EN / FR / ZH)

On the `🌍 06 — Localization` page, duplicate the **Home** and **Contact** frames three times each (Desktop breakpoint is enough here) — one set per language — to prove the layouts hold up in all three languages, since French text runs longer and Chinese text runs shorter/denser than English.

- Translate the Section 5 content into natural, professionally-toned French and Simplified Chinese, preserving warmth and meaning (not literal machine translation). Keep brand/program proper nouns untranslated (Xaritoo, Seed, Gardener, Garden, Xaritoo Mentorship, Xaritoo Club) and translate only their surrounding descriptions.
- Signature phrases, kept consistent across languages:
  - "Mentorship • Culture • Connection" → FR: "Mentorat • Culture • Connexion" → ZH: "导师指导 • 文化 • 联结"
  - "No Seed Grows Alone." → FR: "Aucune graine ne grandit seule." → ZH: "没有种子能独自成长。"
- Apply the CJK font fallback noted in Section 2 to every Chinese text layer (do not leave Chinese text set in Playfair Display/Inter, which will render as missing glyphs/tofu boxes).
- Include the `Language Switcher` component in the header/footer of every localized frame, and annotate on this page how the switcher maps to real URLs (`/en`, `/fr`, `/zh`) for developer handoff.
- Add a short annotation callout on this page listing text-expansion risk areas (e.g., button labels, nav items) where French text is noticeably longer, so engineering knows where to test for overflow.

---

## 7. ACCESSIBILITY ANNOTATIONS (WCAG 2.1 AA — mandatory, use Figma's annotation/dev-mode tools)

On the `♿ 07 — Accessibility Annotations` page, annotate the Home and Contact frames with:
- Heading order overlay: confirm one H1 per page and logical H2/H3 nesting — mark each text layer with its intended heading level.
- Alt text notes on every meaningful image layer (what should be read aloud); mark decorative images as `alt=""`.
- Focus order overlay (numbered) across header nav, hero buttons, and the contact form, matching visual/logical reading order.
- Visible focus state swatches for buttons, links, and form fields — do not rely on Figma's default selection outline; design an explicit, visible focus ring style as its own component state.
- Color-independent error/success states shown side-by-side (icon + text + color, not color alone).
- Minimum touch target callouts (44×44px) on all mobile tap targets.
- A contrast-ratio annotation table cross-referencing Section 2's color pairs actually used in text, with pass/fail marked per WCAG AA.

---

## 8. DEVELOPER HANDOFF (Redlines page)

On `📐 08 — Redlines / Developer Handoff`, provide for the Home page at each breakpoint:
- Spacing redlines between major sections using the spacing scale from Section 2 (not arbitrary pixel call-outs).
- Component property documentation (list each component's variants/props as they should map to a design-token-driven front end).
- A note confirming which components are Auto Layout–resizable and which breakpoints they were tested at (375 / 768 / 1024 / 1440).
- Export-ready settings note for the two logo assets and any placeholder photography (recommended export at 2x for raster, SVG for the logo).

---

## 9. PLACEHOLDER PHOTOGRAPHY

Use tasteful, warm, diverse stock photography as **temporary placeholders only** in program/impact/testimonial image slots, each tagged with a small internal annotation layer reading `TODO: replace with approved consented Xaritoo photography` — do not present placeholder photos as real participants, and do not fabricate identifiable "real" people. Favor a mix of wide environmental shots and close human-interaction moments, avoiding generic staged corporate stock imagery where a warmer, more candid style is available.

---

## 10. DELIVERABLES CHECKLIST (self-verify before finishing)

- [ ] File organized into the pages listed in Section 1, with consistent frame naming.
- [ ] Color, typography, and spacing set up as real Figma variables/styles — not one-off manual values.
- [ ] Every component in Section 3 built with variants + Auto Layout, and states (Default/Hover/Focus/Error/Disabled) where applicable.
- [ ] All pages in Section 4 designed at 1440 / 768 / 375px.
- [ ] All copy matches Section 5 verbatim; no invented stats/quotes/roles; testimonials tagged with consent annotation.
- [ ] Localization page shows Home + Contact fully translated and laid out in EN/FR/ZH with correct CJK font fallback and a text-expansion risk callout.
- [ ] Accessibility annotations completed for heading order, alt text, focus order, focus states, color-independent errors, touch targets, and contrast ratios.
- [ ] Developer handoff redlines completed for spacing, component properties, and asset export settings.
- [ ] Logo used exactly as supplied, correct variant per background, clearspace respected.
- [ ] Placeholder photography clearly tagged as temporary.

Design the entire file now, starting with Foundations (variables/styles), then the Component library, then the Desktop wireframes for every page listed in Section 4, then Tablet and Mobile, then the Localization and Accessibility annotation pages.