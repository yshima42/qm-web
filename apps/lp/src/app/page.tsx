import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Testimonials } from "@/components/sections/testimonials";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Features />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
