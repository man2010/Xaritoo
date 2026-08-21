"use client";

import { useState } from "react";
import Image from "next/image";
import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import { emailUrl, whatsappUrl } from "@/lib/contact-channels";

function ClubJoinForm() {
  const [data, setData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    studentName: '',
    studentGrade: '',
    schoolName: '',
    interest: '',
    notes: '',
  })
  const [sent, setSent] = useState(false)
  const [sendMethod, setSendMethod] = useState<'whatsapp' | 'email'>('whatsapp')

  const submitClubApplication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = [
      'Hello Xaritoo, I am a parent/guardian requesting support for my child through the Xaritoo Club.',
      '',
      '--- PARENT / GUARDIAN ---',
      `Parent / Guardian Name: ${data.parentName}`,
      `Parent Email: ${data.parentEmail}`,
      `Parent Phone: ${data.parentPhone || 'Not provided'}`,
      '',
      '--- STUDENT INFORMATION ---',
      `Student's Full Name: ${data.studentName}`,
      `Current Grade / School Year: ${data.studentGrade || 'Not provided'}`,
      `School / District: ${data.schoolName || 'Not provided'}`,
      '',
      '--- SUPPORT REQUESTED ---',
      `Primary Area: ${data.interest || 'General student support'}`,
      data.notes ? `Specific Needs / Goals: ${data.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    if (sendMethod === 'whatsapp') {
      window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
    } else {
      window.open(
        emailUrl(`Xaritoo Club Student Registration — ${data.studentName} (Parent: ${data.parentName})`, message),
        '_blank',
        'noopener,noreferrer',
      )
    }

    setSent(true)
  }

  const fieldStyle = {
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid rgba(91,44,131,0.2)`,
    borderRadius: 8,
    fontSize: 15,
    fontFamily: 'var(--font-sans)',
    color: '#40364A',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <div className="club-join-form" style={{ padding: '36px 36px', background: '#fff', minWidth: 0 }}>
      {sent ? (
        <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 20 }}>
          <Icon name="book" size={42} style={{ color: C.purplePrimary, margin: '0 auto 12px' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#251C2D', marginBottom: 8 }}>
            Registration Request Received!
          </h4>
          <p style={{ fontSize: 15, color: '#40364A', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
            Thank you! We will reach out to you (the parent/guardian) shortly to discuss how we can best support your student.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false)
              setData({
                parentName: '',
                parentEmail: '',
                parentPhone: '',
                studentName: '',
                studentGrade: '',
                schoolName: '',
                interest: '',
                notes: '',
              })
            }}
            style={{
              marginTop: 20,
              background: 'none',
              border: `1px solid ${C.purplePrimary}`,
              color: C.purplePrimary,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit Another Registration
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: C.purplePrimary,
                background: C.purpleLavender,
                padding: '4px 10px',
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              Parent &amp; Guardian Registration
            </span>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#251C2D', marginBottom: 6 }}>
              Register Your Student for Xaritoo Club
            </h4>
            <p style={{ fontSize: 14, color: '#746C7A', lineHeight: 1.5, margin: 0 }}>
              As a parent or guardian, please tell us about your child and their academic support needs. Our team will contact you to finalize placement.
            </p>
          </div>

          <form onSubmit={submitClubApplication} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Parent Section */}
            <div style={{ borderBottom: '1px solid rgba(91,44,131,0.1)', paddingBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.purplePrimary, marginBottom: 10 }}>
                1. Parent / Guardian Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="club-parentName" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Parent / Guardian Full Name <span style={{ color: '#5B2C83' }}>*</span>
                  </label>
                  <input
                    id="club-parentName"
                    name="parentName"
                    type="text"
                    placeholder="e.g. Aminata Diallo"
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={data.parentName}
                    onChange={(e) => setData({ ...data, parentName: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
                <div>
                  <label htmlFor="club-parentEmail" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Email Address <span style={{ color: '#5B2C83' }}>*</span>
                  </label>
                  <input
                    id="club-parentEmail"
                    name="parentEmail"
                    type="email"
                    placeholder="parent@email.com"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={data.parentEmail}
                    onChange={(e) => setData({ ...data, parentEmail: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
                <div>
                  <label htmlFor="club-parentPhone" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Phone Number
                  </label>
                  <input
                    id="club-parentPhone"
                    name="parentPhone"
                    type="tel"
                    placeholder="(312) 555-0199"
                    maxLength={30}
                    autoComplete="tel"
                    value={data.parentPhone}
                    onChange={(e) => setData({ ...data, parentPhone: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
              </div>
            </div>

            {/* Student Section */}
            <div style={{ borderBottom: '1px solid rgba(91,44,131,0.1)', paddingBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.purplePrimary, marginBottom: 10 }}>
                2. Student Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="club-studentName" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Student's Full Name (Child) <span style={{ color: '#5B2C83' }}>*</span>
                  </label>
                  <input
                    id="club-studentName"
                    name="studentName"
                    type="text"
                    placeholder="e.g. Ibrahim Diallo"
                    required
                    maxLength={120}
                    value={data.studentName}
                    onChange={(e) => setData({ ...data, studentName: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
                <div>
                  <label htmlFor="club-studentGrade" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Current Grade / Level <span style={{ color: '#5B2C83' }}>*</span>
                  </label>
                  <input
                    id="club-studentGrade"
                    name="studentGrade"
                    type="text"
                    placeholder="e.g. 10th Grade / Sophomore"
                    required
                    maxLength={60}
                    value={data.studentGrade}
                    onChange={(e) => setData({ ...data, studentGrade: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
                <div>
                  <label htmlFor="club-schoolName" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    School Name
                  </label>
                  <input
                    id="club-schoolName"
                    name="schoolName"
                    type="text"
                    placeholder="e.g. Lincoln High School"
                    maxLength={120}
                    value={data.schoolName}
                    onChange={(e) => setData({ ...data, schoolName: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
              </div>
            </div>

            {/* Needs Section */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.purplePrimary, marginBottom: 10 }}>
                3. Academic &amp; Mentorship Needs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label htmlFor="club-interest" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Primary Support Needed <span style={{ color: '#5B2C83' }}>*</span>
                  </label>
                  <select
                    id="club-interest"
                    name="interest"
                    required
                    value={data.interest}
                    onChange={(e) => setData({ ...data, interest: e.target.value })}
                    style={{ ...fieldStyle }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  >
                    <option value="">Select primary support area…</option>
                    {[
                      'Math Tutoring & Support',
                      'Science (Biology, Chemistry, Physics)',
                      'Writing, Reading & English',
                      'SAT / ACT Test Preparation',
                      'Scholarships & College Planning',
                      'Career Guidance & Resume Building',
                      'Comprehensive Academic Tutoring',
                      'General Mentorship & Accountability',
                      'Other / Multiple Areas',
                    ].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="club-notes" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#251C2D', marginBottom: 4 }}>
                    Specific Goals or Challenges (Optional)
                  </label>
                  <input
                    id="club-notes"
                    name="notes"
                    type="text"
                    placeholder="e.g. Needs help in Geometry and college prep"
                    maxLength={300}
                    value={data.notes}
                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#5B2C83')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
              </div>
            </div>

            <fieldset className="club-send-method">
              <legend>Send registration request via</legend>
              <label className={sendMethod === 'whatsapp' ? 'club-send-option club-send-option--active' : 'club-send-option'}>
                <input type="radio" name="club-send-method" value="whatsapp" checked={sendMethod === 'whatsapp'} onChange={() => setSendMethod('whatsapp')} />
                <Icon name="message" size={19} />
                <span>WhatsApp</span>
              </label>
              <label className={sendMethod === 'email' ? 'club-send-option club-send-option--active' : 'club-send-option'}>
                <input type="radio" name="club-send-method" value="email" checked={sendMethod === 'email'} onChange={() => setSendMethod('email')} />
                <Icon name="mail" size={19} />
                <span>Email</span>
              </label>
            </fieldset>

            <button
              type="submit"
              style={{
                background: '#5B2C83',
                color: '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
                padding: '13px 24px',
                borderRadius: 10,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.2s, transform 0.2s',
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4a2068'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#5B2C83'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Send Request with {sendMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

// ─── Programs ─────────────────────────────────────────────────────────────────
export default function Programs() {
  const [clubOpen, setClubOpen] = useState(false)

  return (
    <section id="programs" style={{ background: C.white, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Our Programs</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              letterSpacing: '-0.02em',
              maxWidth: 600,
            }}
          >
            Programs Designed for Every Season of Growth
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* ── Xaritoo Mentorship card ── */}
          <article
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid rgba(91,44,131,0.1)`,
              background: C.white,
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,44,131,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ position: 'relative', height: 240, background: C.purpleLavender, overflow: 'hidden' }}>
              <Image
                src="/images/xaritoo-summer-program.jpeg"
                alt="Xaritoo Summer Program participants gathered together"
                width={2048}
                height={1365}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 54%' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${C.purpleDark}88)` }} />
              <span style={{ position: 'absolute', top: 16, left: 16, background: C.goldPrimary, color: C.textDark, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Summer Program
              </span>
            </div>
            <div style={{ padding: '28px 32px 32px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: C.textDark, marginBottom: 12 }}>
                <Icon name="seed" size={23} /> Xaritoo Mentorship
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: C.textBody, marginBottom: 20 }}>
                A structured mentorship experience that pairs youth (Seeds) with trained mentors (Gardeners) and caring supervisors (Gardens). Through one-on-one mentoring, cultural experiences, educational activities, and community engagement, participants build confidence, friendships, and life skills.
              </p>
              <a
                href="/get-involved#join-as"
                style={{ color: C.purplePrimary, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'gap 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
                onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
              >
                Learn more →
              </a>
            </div>
          </article>

          {/* ── Xaritoo Club card ── */}
          <article
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid rgba(91,44,131,0.1)`,
              background: C.white,
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,44,131,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <div style={{ position: 'relative', height: 240, background: C.purpleLavender, overflow: 'hidden' }}>
              <Image
                src="/images/xaritoo-student-support.jpeg"
                alt="Xaritoo students working together during an academic support session"
                width={2048}
                height={1365}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 52%' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${C.purpleDark}88)` }} />
              <span style={{ position: 'absolute', top: 16, left: 16, background: C.goldPrimary, color: C.textDark, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Fall &amp; Spring — Student Support
              </span>
            </div>
            <div style={{ padding: '28px 32px 32px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, color: C.textDark, marginBottom: 12 }}>
                <Icon name="book" size={23} /> Xaritoo Club — Student Support
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: C.textBody, marginBottom: 20 }}>
                A school-year support program providing students with academic assistance, educational resources, tutoring, college and career guidance, and encouragement through trained volunteers and mentors.
              </p>
              <button
                onClick={() => setClubOpen(!clubOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: C.purplePrimary,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'gap 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = '10px')}
                onMouseLeave={(e) => (e.currentTarget.style.gap = '6px')}
                aria-expanded={clubOpen}
              >
                {clubOpen ? 'Close ↑' : 'Learn more & Register Your Student →'}
              </button>
            </div>
          </article>
        </div>

        {/* ── Xaritoo Club expanded detail panel ── */}
        {clubOpen && (
          <div
            className="club-expanded-panel"
            style={{
              marginTop: 24,
              borderRadius: 20,
              border: `2px solid ${C.purplePrimary}`,
              background: C.purpleLavender,
              overflow: 'hidden',
              animation: 'slideDown 0.25s ease',
            }}
          >
            <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="club-expanded-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Left: program details */}
              <div className="club-program-details" style={{ padding: '40px 40px', borderRight: `1px solid rgba(91,44,131,0.15)`, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Icon name="book" size={28} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: C.textDark, margin: 0 }}>
                    Xaritoo Club — Student Support
                  </h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textBody, marginBottom: 20 }}>
                  A school-year support program providing students with academic assistance, educational resources, tutoring, college and career guidance, and encouragement through trained volunteers and mentors.
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted, marginBottom: 12 }}>
                  Support includes
                </p>
                <div className="club-support-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Math', 'Science', 'Writing', 'SAT/ACT Preparation', 'Scholarships & College Planning', 'Career & Resume Support'].map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.textBody }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.purplePrimary, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="check" size={12} strokeWidth={3} /></span>
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(91,44,131,0.08)', borderRadius: 10, fontSize: 14, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon name="calendar" size={17} /> <strong>Fall &amp; Spring</strong> — School year program
                </div>
              </div>

              {/* Right: join form */}
              <ClubJoinForm />
            </div>
          </div>
        )}

        {/* Community Experiences note */}
        <div
          style={{
            marginTop: 32,
            background: C.greenLight,
            borderRadius: 16,
            padding: '28px 32px',
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
            border: `1px solid rgba(79,125,85,0.15)`,
          }}
        >
          <Icon name="globe" size={28} style={{ color: C.greenGrowth, flexShrink: 0 }} />
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                fontWeight: 700,
                color: C.textDark,
                marginBottom: 8,
              }}
            >
              Community Experiences
            </h4>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.textBody }}>
              Throughout the year, Xaritoo brings youth, families, mentors, and community partners
              together through cultural celebrations, leadership workshops, service projects,
              educational trips, and special events that strengthen relationships and build a lasting
              sense of belonging.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #programs > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
          .club-expanded-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .club-program-details { border-right: 0 !important; border-bottom: 1px solid rgba(91,44,131,0.15) !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Framework ────────────────────────────────────────────────────────────────
