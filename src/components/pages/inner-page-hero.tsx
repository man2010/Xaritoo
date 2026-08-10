import Icon from "@/components/ui/icon";

type InnerPageHeroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}>;

export default function InnerPageHero({ eyebrow, title, description, icon }: InnerPageHeroProps) {
  return (
    <section className="inner-page-hero">
      <div className="inner-page-hero__orb" aria-hidden="true" />
      <div className="inner-page-hero__content">
        <div className="inner-page-hero__icon"><Icon name={icon} size={30} /></div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
        <a href="#page-content" aria-label={`Discover ${eyebrow}`}>Discover <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
