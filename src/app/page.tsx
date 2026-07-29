import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
