import SectionLabel from "@/components/ui/section-label";

export const questions = [
  { question: "Who can participate in Xaritoo?", answer: "Xaritoo welcomes young people from all backgrounds and is especially committed to supporting youth who benefit from consistent mentorship, cultural connection, educational guidance, and community." },
  { question: "What is the difference between a Seed, Gardener, and Garden?", answer: "Seeds are young participants, Gardeners are trained mentors, and Gardens are the supervisors, families, and community partners who create the conditions for safe and lasting growth." },
  { question: "How can I become a mentor or mentee?", answer: "Choose the appropriate opportunity on the Get Involved page, answer the short questions, and send your request directly to the Xaritoo team through WhatsApp or email." },
  { question: "What support is available through Xaritoo Club?", answer: "Xaritoo Club offers school-year support in areas including math, science, writing, SAT/ACT preparation, scholarships, college planning, careers, résumés, and general mentorship." },
  { question: "Can an organization partner with Xaritoo?", answer: "Yes. Schools, community organizations, businesses, and institutions can support activities, share expertise, host experiences, volunteer, or explore a broader community partnership." },
];

export default function Faq() {
  return (
    <section className="home-faq">
      <div className="home-faq__shell">
        <div className="home-faq__heading"><SectionLabel>Frequently Asked Questions</SectionLabel><h2>Everything You Need to Take the Next Step</h2><p>Quick answers about the program, the Xaritoo model, and ways to get involved.</p></div>
        <div className="home-faq__list">
          {questions.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<i aria-hidden="true">+</i></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
