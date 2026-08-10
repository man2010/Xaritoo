"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { emailUrl, whatsappUrl } from "@/lib/contact-channels";

const opportunities = {
  mentor: { label: "Become a Mentor", icon: "sprout", question: "What experience or strengths would you bring as a mentor?" },
  mentee: { label: "Become a Mentee", icon: "seed", question: "What would you like support with this year?" },
  volunteer: { label: "Volunteer", icon: "users", question: "Which skills or type of support would you like to offer?" },
  partner: { label: "Community Partner", icon: "handshake", question: "How would your organization like to collaborate with Xaritoo?" },
  support: { label: "Support Xaritoo", icon: "star", question: "How would you like to support Xaritoo?" },
} as const;

type Opportunity = keyof typeof opportunities;

export default function EngagementForm() {
  const [role, setRole] = useState<Opportunity>("mentor");
  const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", availability: "", message: "" });

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get("role") as Opportunity | null;
    if (requestedRole && requestedRole in opportunities) setRole(requestedRole);
  }, []);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const opportunity = opportunities[role];
    const text = [
      `Hello Xaritoo, I am interested in: ${opportunity.label}.`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `City / Location: ${form.location}`,
      `Availability: ${form.availability}`,
      `${opportunity.question}: ${form.message}`,
    ].join("\n");

    if (method === "whatsapp") {
      window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = emailUrl(`${opportunity.label} inquiry — ${form.name}`, text);
    }
  };

  return (
    <section id="apply" className="engagement-section">
      <div className="engagement-shell">
        <div className="engagement-heading">
          <p>Choose Your Path</p>
          <h2>How Would You Like to Get Involved?</h2>
          <span>Select an opportunity, answer a few questions, then send your request securely through WhatsApp or email.</span>
        </div>

        <div className="opportunity-tabs" role="tablist" aria-label="Engagement opportunities">
          {(Object.entries(opportunities) as [Opportunity, typeof opportunities[Opportunity]][]).map(([key, item]) => (
            <button key={key} type="button" role="tab" aria-selected={role === key} className={role === key ? "opportunity-tab opportunity-tab--active" : "opportunity-tab"} onClick={() => setRole(key)}>
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <form className="engagement-form" onSubmit={handleSubmit}>
          <div className="engagement-form__intro">
            <div><Icon name={opportunities[role].icon} size={28} /></div>
            <div><small>Application type</small><h3>{opportunities[role].label}</h3></div>
          </div>

          <div className="engagement-fields">
            <label>Full Name <span>*</span><input value={form.name} onChange={(e) => update("name", e.target.value)} required maxLength={120} autoComplete="name" placeholder="Your full name" /></label>
            <label>Email Address <span>*</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required maxLength={254} autoComplete="email" placeholder="your@email.com" /></label>
            <label>Phone / WhatsApp<input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} autoComplete="tel" placeholder="Optional" /></label>
            <label>City / Location <span>*</span><input value={form.location} onChange={(e) => update("location", e.target.value)} required maxLength={100} autoComplete="address-level2" placeholder="Your city" /></label>
            <label className="engagement-field--wide">Availability <span>*</span><input value={form.availability} onChange={(e) => update("availability", e.target.value)} required maxLength={180} placeholder="Example: Saturdays, 2–4 hours per month" /></label>
            <label className="engagement-field--wide">{opportunities[role].question} <span>*</span><textarea value={form.message} onChange={(e) => update("message", e.target.value)} required maxLength={1500} rows={5} placeholder="Tell us a little more..." /></label>
          </div>

          <fieldset className="contact-method">
            <legend>How would you like to send your request?</legend>
            <label className={method === "whatsapp" ? "contact-method__option contact-method__option--active" : "contact-method__option"}><input type="radio" name="method" value="whatsapp" checked={method === "whatsapp"} onChange={() => setMethod("whatsapp")} /><Icon name="message" size={22} /><span><strong>WhatsApp</strong><small>Open a prepared message</small></span></label>
            <label className={method === "email" ? "contact-method__option contact-method__option--active" : "contact-method__option"}><input type="radio" name="method" value="email" checked={method === "email"} onChange={() => setMethod("email")} /><Icon name="mail" size={22} /><span><strong>Email</strong><small>Send to the Xaritoo team</small></span></label>
          </fieldset>

          <button className="engagement-submit" type="submit"><Icon name={method === "whatsapp" ? "message" : "mail"} size={20} />Continue with {method === "whatsapp" ? "WhatsApp" : "Email"}</button>
          <p className="engagement-privacy">Your answers stay in your browser until you choose to send them. Xaritoo does not store this form on the website.</p>
        </form>
      </div>
    </section>
  );
}
