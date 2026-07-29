import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-atmosphere">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.45]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse-soft" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-ink-400/15 blur-3xl" />

      {/* Full-bleed proposal visual plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] md:block"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#eef4f5]/40 to-[#eef4f5]" />
        <div className="absolute right-[-6%] top-[14%] h-[72%] w-[92%] animate-float rounded-tl-[2.5rem] border border-white/70 bg-white/75 shadow-[0_50px_100px_-30px_rgba(14,21,25,0.35)] backdrop-blur-md">
          <div className="flex h-full flex-col p-8 lg:p-12">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-accent/35" />
              <div className="h-8 w-8 rounded-full bg-ink-100" />
            </div>
            <div className="mt-8 h-9 w-4/5 rounded-lg bg-ink-950/10" />
            <div className="mt-4 h-3 w-2/5 rounded-full bg-ink-200" />
            <div className="mt-12 flex-1 space-y-4">
              {[0.72, 0.58, 0.66, 0.5].map((width, index) => (
                <div key={index} className="flex items-center justify-between gap-6">
                  <div
                    className="h-3 rounded-full bg-ink-100"
                    style={{ width: `${width * 100}%` }}
                  />
                  <div className="h-3 w-16 shrink-0 rounded-full bg-ink-100" />
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-end justify-between pt-8">
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-ink-100" />
                <div className="h-6 w-28 rounded-lg bg-ink-950/10" />
              </div>
              <div className="h-11 w-36 rounded-xl bg-accent/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-24 pt-28">
        <p className="animate-fade-up font-display text-3xl font-bold tracking-tight text-ink-950 opacity-0 [animation-delay:60ms] sm:text-4xl">
          Proposaly
        </p>
        <h1 className="animate-fade-up mt-5 max-w-2xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-950 opacity-0 [animation-delay:160ms] sm:text-5xl lg:text-[3.5rem]">
          Win More Clients with AI-Powered Proposals
        </h1>
        <p className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-ink-500 opacity-0 [animation-delay:280ms] sm:text-xl">
          Create, send, and track winning business proposals in minutes,
          effortlessly.
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-3 opacity-0 [animation-delay:400ms] sm:gap-4">
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-dark"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl border border-ink-300/80 bg-white/70 px-6 py-3.5 text-sm font-semibold text-ink-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-ink-400 hover:bg-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
