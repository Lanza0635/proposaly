import Link from "next/link";
import { Check, X } from "lucide-react";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { getCurrentProfile } from "@/lib/billing/get-profile";
import {
  FREE_PLAN_PROPOSAL_LIMIT,
  PRO_PLAN_PRICE_LABEL,
} from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

const FREE_FEATURES = [
  { ok: true, text: `Up to ${FREE_PLAN_PROPOSAL_LIMIT} active proposals` },
  { ok: true, text: "Live preview + PDF export" },
  { ok: true, text: "Public share link for clients" },
  { ok: false, text: "Removes “Powered by Proposaly”" },
  { ok: false, text: "Custom company logo on PDFs" },
  { ok: false, text: "Unlimited proposals" },
];

const PRO_FEATURES = [
  { ok: true, text: "Unlimited proposals" },
  { ok: true, text: "Custom logo on proposals & PDFs" },
  { ok: true, text: "No “Powered by” watermark" },
  { ok: true, text: "Priority-ready client sharing links" },
  { ok: true, text: "Cancel anytime" },
];

export default async function PricingPage() {
  const { isPro, authenticated } = await getCurrentProfile();

  return (
    <main className="min-h-screen bg-atmosphere">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-ink-950"
          >
            Proposaly
          </Link>
          <Link
            href={authenticated ? "/dashboard" : "/login"}
            className="text-sm font-semibold text-ink-600 hover:text-ink-950"
          >
            {authenticated ? "Dashboard" : "Sign in"}
          </Link>
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-dark">
            Simple pricing
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">
            Upgrade to Pro
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-500">
            Start free. Upgrade when you need unlimited proposals and
            white-label PDFs — no ads, no fixed platform fees for you beyond the
            subscription.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-ink-200 bg-white p-8">
            <p className="text-sm font-semibold text-ink-500">Free</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink-950">
              $0
            </p>
            <p className="mt-1 text-sm text-ink-500">Forever · organic growth</p>
            <ul className="mt-8 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3 text-sm">
                  {feature.ok ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />
                  )}
                  <span className={feature.ok ? "text-ink-700" : "text-ink-400"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={authenticated ? "/dashboard/proposals/new" : "/login?mode=signup"}
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
            >
              {authenticated ? "Continue free" : "Start free"}
            </Link>
          </section>

          <section className="rounded-2xl border border-accent/30 bg-white p-8 shadow-lg shadow-accent/10">
            <p className="text-sm font-semibold text-accent-dark">Pro</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink-950">
              {PRO_PLAN_PRICE_LABEL.replace("/mo", "")}
              <span className="text-lg font-semibold text-ink-400">/mo</span>
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Billed monthly via Lemon Squeezy
            </p>
            <ul className="mt-8 space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-ink-700">{feature.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <UpgradeButton
                isPro={isPro}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </section>
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          Payments processed by Lemon Squeezy (Merchant of Record). No ads. No
          monthly platform fee from Proposaly — only your Pro subscription.
        </p>
      </div>
    </main>
  );
}
