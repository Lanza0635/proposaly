import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-atmosphere">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />

      {/* Full-bleed visual plane: proposal document silhouette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full max-w-xl opacity-40 sm:opacity-55 lg:max-w-2xl lg:opacity-70"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#eef4f5]" />
        <div className="absolute right-[-8%] top-[18%] h-[70%] w-[85%] animate-float rounded-tl-[2rem] border border-ink-200/80 bg-white/70 shadow-[0_40px_80px_-20px_rgba(14,21,25,0.25)] backdrop-blur-sm">
          <div className="space-y-4 p-8 sm:p-10">
            <div className="h-3 w-28 rounded bg-accent/30" />
            <div className="h-8 w-3/4 rounded bg-ink-950/10" />
            <div className="h-3 w-1/2 rounded bg-ink-200" />
            <div className="mt-10 space-y-3">
              <div className="flex justify-between gap-4">
                <div className="h-3 w-2/5 rounded bg-ink-100" />
                <div className="h-3 w-16 rounded bg-ink-100" />
              </div>
              <div className="flex justify-between gap-4">
                <div className="h-3 w-1/3 rounded bg-ink-100" />
                <div className="h-3 w-20 rounded bg-ink-100" />
              </div>
              <div className="flex justify-between gap-4">
                <div className="h-3 w-2/5 rounded bg-ink-100" />
                <div className="h-3 w-14 rounded bg-ink-100" />
              </div>
            </div>
            <div className="mt-12 flex justify-end">
              <div className="h-10 w-32 rounded-lg bg-accent/25" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-24 pt-28">
        <p className="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-dark opacity-0 [animation-delay:80ms]">
          Proposaly
        </p>
        <h1 className="animate-fade-up mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink-950 opacity-0 [animation-delay:180ms] sm:text-5xl lg:text-6xl">
          Create Professional Proposals in Seconds
        </h1>
        <p className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-ink-500 opacity-0 [animation-delay:300ms]">
          Build polished B2B proposals with live preview — then export clean PDF
          reports your clients will trust.
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap items-center gap-4 opacity-0 [animation-delay:420ms]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/proposals/new"
            className="inline-flex items-center rounded-lg border border-ink-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-ink-800 backdrop-blur transition hover:border-ink-400 hover:bg-white"
          >
            Create a Proposal
          </Link>
        </div>
      </div>
    </section>
  );
}
