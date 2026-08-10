import About from "@/components/sections/about";
import CommunityPartners from "@/components/sections/community-partners";
import Contact from "@/components/sections/contact";
import CtaBand from "@/components/sections/cta-band";
import Framework from "@/components/sections/framework";
import Hero from "@/components/sections/hero";
import IdentityStrip from "@/components/sections/identity-strip";
import Impact from "@/components/sections/impact";
import Pillars from "@/components/sections/pillars";
import Programs from "@/components/sections/programs";
import Team from "@/components/sections/team";
import Testimonials from "@/components/sections/testimonials";
import HowItWorks from "@/components/sections/how-it-works";
import GrowthJourney from "@/components/sections/growth-journey";
import Faq from "@/components/sections/faq";

export default function App() {
  return (
    <main id="main-content">
        <Hero />
        <IdentityStrip />
        <About />
        <Pillars />
        <Programs />
        <HowItWorks />
        <Framework />
        <GrowthJourney />
        <Impact />
        <Testimonials />
        <CommunityPartners />
        <Team />
        <Faq />
        <CtaBand />
        <Contact />
    </main>
  );
}
