import Icon from "@/components/ui/icon";
import SectionLabel from "@/components/ui/section-label";
import type { CSSProperties } from "react";
import { MENTEE_APPLICATION_URL, MENTOR_APPLICATION_URL } from "@/lib/application-links";

const steps = [
  { number: "01", icon: "message", title: "Choose Your Path", text: "Join as a Seed, Gardener, volunteer, community partner, or supporter through a simple guided application." },
  { number: "02", icon: "handshake", title: "Connect With Xaritoo", text: "Our team learns about your goals, interests, availability, and the kind of support or contribution that fits you." },
  { number: "03", icon: "sprout", title: "Grow Together", text: "Take part in mentorship, learning, cultural experiences, leadership activities, and meaningful community connection." },
  { number: "04", icon: "star", title: "Celebrate Progress", text: "Recognize new confidence, stronger relationships, practical skills, and every milestone achieved along the journey." },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works__shell">
        <div className="how-it-works__heading">
          <div><SectionLabel>How It Works</SectionLabel><h2>A Clear Path From Connection to Growth</h2></div>
          <p>Xaritoo makes it simple to find your place, build meaningful relationships, and take the next step with confidence.</p>
        </div>
        <div className="how-it-works__grid">
          {steps.map((step, index) => (
            <article className="process-card" key={step.number} style={{ "--process-index": index } as CSSProperties}>
              <span className="process-card__number">{step.number}</span>
              <div className="process-card__icon"><Icon name={step.icon} size={26} /></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <div className="how-it-works__actions">
          <a href={MENTOR_APPLICATION_URL} target="_blank" rel="noopener noreferrer">Become a Mentor</a>
          <a href={MENTEE_APPLICATION_URL} target="_blank" rel="noopener noreferrer">Become a Mentee</a>
        </div>
      </div>
    </section>
  );
}
