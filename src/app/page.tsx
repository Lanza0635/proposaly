import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { LandingCta } from "@/components/landing/LandingCta";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <LandingCta />
      <Footer />
    </main>
  );
}
