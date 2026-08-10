import Icon from "@/components/ui/icon";

const moments = [
  { icon: "seed", title: "Belonging", text: "A welcoming space where identity, voice, and potential are recognized." },
  { icon: "users", title: "Trusted Relationships", text: "Consistent support from mentors, families, supervisors, and peers." },
  { icon: "book", title: "Learning & Discovery", text: "Academic encouragement, cultural experiences, and exposure to new possibilities." },
  { icon: "star", title: "Confidence & Leadership", text: "Practical skills and opportunities to communicate, contribute, and lead." },
  { icon: "tree", title: "Lasting Growth", text: "A stronger foundation for the next season of school, life, and community." },
];

export default function GrowthJourney() {
  return (
    <section className="growth-journey">
      <div className="growth-journey__shell">
        <div className="growth-journey__intro">
          <p>The Xaritoo Journey</p>
          <h2>Growth Is a Journey, Not a Single Moment.</h2>
          <span>Each stage builds on the one before it, creating an ecosystem where young people can develop roots, confidence, and direction.</span>
          <a href="/framework">Explore Our Framework <span aria-hidden="true">→</span></a>
        </div>
        <div className="journey-track">
          {moments.map((moment, index) => (
            <div className="journey-moment" key={moment.title}>
              <div className="journey-moment__marker"><Icon name={moment.icon} size={22} /></div>
              <div><small>Stage {index + 1}</small><h3>{moment.title}</h3><p>{moment.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
