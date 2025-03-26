import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { FinalCTA } from "@/components/sections/final-cta";
import { Testimonials } from "@/components/sections/testimonials";
import { ScreenshotFeatures } from "@/components/sections/screenshot-features";
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Features />
      <ScreenshotFeatures />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
