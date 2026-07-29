import Link from "next/link";
import { ArrowRight, FilePlus2, Sparkles } from "lucide-react";
import { ProposalsTable } from "@/components/dashboard/ProposalsTable";
import { LogoUploader } from "@/components/billing/LogoUploader";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { getCurrentProfile } from "@/lib/billing/get-profile";
import { FREE_PLAN_PROPOSAL_LIMIT } from "@/lib/billing/plans";
import { getCurrentUserProposals } from "@/lib/proposals/get-proposals";

export const dynamic = "force-dynamic";

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function DashboardPage() {
  const { proposals, error, authenticated } = await getCurrentUserProposals();
  const { isPro, profile } = await getCurrentProfile();

  const drafts = proposals.filter(
    (p) => (p.status || "draft").toLowerCase() === "draft"
  ).length;

  const sentThisMonth = proposals.filter((p) => {
    const status = (p.status || "").toLowerCase();
    if (status !== "sent" && status !== "accepted") return false;
    return new Date(p.created_at) >= startOfMonth();
  }).length;

  const totalProposals = proposals.length;
  const remainingFree = Math.max(0, FREE_PLAN_PROPOSAL_LIMIT - totalProposals);

  const stats = [
    { label: "Drafts", value: String(drafts) },
    { label: "Sent this month", value: String(sentThisMonth) },
    {
      label: isPro ? "Total proposals" : "Free slots left",
      value: isPro ? String(totalProposals) : String(remainingFree),
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-ink-200 bg-white px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-950">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Manage proposals and create client-ready PDF reports.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPro
                ? "bg-accent-soft text-accent-dark"
                : "bg-ink-50 text-ink-600"
            }`}
          >
            {isPro ? "Pro plan" : "Free plan"}
          </span>
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {!isPro && authenticated ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-accent/20 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-bold text-ink-950">
                  Upgrade to Pro
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Unlimited proposals, custom logo, and no “Powered by”
                  watermark — {FREE_PLAN_PROPOSAL_LIMIT - remainingFree}/
                  {FREE_PLAN_PROPOSAL_LIMIT} free proposals used.
                </p>
              </div>
              <UpgradeButton />
            </div>
          ) : null}

          {authenticated ? (
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-ink-950">
                Company logo
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Pro accounts can brand PDFs and public proposal pages.
              </p>
              <div className="mt-4">
                <LogoUploader isPro={isPro} logoUrl={profile?.logo_url} />
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <div className="border-b border-ink-100 bg-gradient-to-br from-accent-soft via-white to-ink-50 px-8 py-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent-dark shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {authenticated ? "Ready to draft" : "Sign in to sync proposals"}
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950">
                Create your next proposal
              </h2>
              <p className="mt-3 max-w-md text-ink-500">
                Add client details, line items, and notes — then watch the live
                preview update instantly.
              </p>
              <Link
                href="/dashboard/proposals/new"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                <FilePlus2 className="h-4 w-4" />
                Create New Proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-px bg-ink-100 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white px-6 py-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {!authenticated ? (
            <div className="rounded-2xl border border-ink-200 bg-white px-6 py-10 text-center">
              <p className="font-display text-lg font-semibold text-ink-900">
                Sign in to see your proposals
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Your drafts and sent proposals will appear here after you log
                in.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
              >
                Sign in
              </Link>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
              Could not load proposals: {error}
            </div>
          ) : (
            <ProposalsTable proposals={proposals} />
          )}
        </div>
      </div>
    </div>
  );
}
