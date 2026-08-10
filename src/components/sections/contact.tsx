"use client";

import { useState } from "react";
import SectionLabel from "@/components/ui/section-label";
import { colors as C } from "@/lib/design-tokens";
import Icon from "@/components/ui/icon";
import { emailUrl } from "@/lib/contact-channels";

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Subject: ${formData.subject || 'General inquiry'}`,
      '',
      formData.message,
    ].join('\n')
    window.location.href = emailUrl(formData.subject || `Xaritoo website inquiry — ${formData.name}`, message)
    setSubmitted(true)
  }

  const fieldStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid rgba(91,44,131,0.2)`,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'var(--font-sans)',
    color: C.textBody,
    background: C.white,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <section id="contact" style={{ background: C.white, padding: '96px 24px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
        }}
      >
        {/* Left: info */}
        <div>
          <SectionLabel>Get In Touch</SectionLabel>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.textDark,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            We'd Love to Hear From You
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.textBody, marginBottom: 40 }}>
            Whether you're a student, parent, potential mentor, or community partner — reach out.
            Every connection is a seed.
          </p>

          {[
            { icon: 'mail', label: 'General Email', value: 'senpathcommunity@gmail.com' },
            { icon: 'mail', label: 'Director', value: 'mamediaw@xaritoo.org' },
            { icon: 'globe', label: 'Website', value: 'xaritoo.org' },
            { icon: 'instagram', label: 'Instagram', value: '@xaritoomentorship' },
            { icon: 'facebook', label: 'Facebook', value: 'Xaritoo Mentorship' },
            { icon: 'music', label: 'TikTok', value: '@xaritoomentorship' },
            { icon: 'play', label: 'YouTube', value: '@XaritooMentorship' },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: C.purpleLavender,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                <Icon name={c.icon} size={18} />
              </span>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 15, color: C.textBody }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: form */}
        <div>
          {submitted ? (
            <div
              style={{
                background: C.greenLight,
                border: `1px solid rgba(79,125,85,0.2)`,
                borderRadius: 20,
                padding: '48px',
                textAlign: 'center',
              }}
            >
              <Icon name="seed" size={48} style={{ color: C.greenGrowth, margin: '0 auto 16px' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 24,
                  color: C.textDark,
                  marginBottom: 12,
                }}
              >
                Message received!
              </h3>
              <p style={{ fontSize: 16, color: C.textBody }}>
                Thank you for reaching out. A member of the Xaritoo team will be in touch with you
                soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name', required: true },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
                { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?', required: false },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.textDark, marginBottom: 6 }}
                  >
                    {f.label} {f.required && <span style={{ color: C.purplePrimary }}>*</span>}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                    name={f.id}
                    maxLength={f.id === 'email' ? 254 : 120}
                    autoComplete={f.id === 'name' ? 'name' : f.id === 'email' ? 'email' : 'off'}
                    value={formData[f.id as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = C.purplePrimary)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  style={{ display: 'block', fontSize: 14, fontWeight: 600, color: C.textDark, marginBottom: 6 }}
                >
                  Message <span style={{ color: C.purplePrimary }}>*</span>
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us about yourself and how you'd like to get involved..."
                  required
                  name="message"
                  maxLength={2000}
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...fieldStyle, resize: 'vertical', minHeight: 120 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.purplePrimary)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(91,44,131,0.2)')}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: C.purplePrimary,
                  color: C.white,
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  padding: '14px 28px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4a2068'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.purplePrimary
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
