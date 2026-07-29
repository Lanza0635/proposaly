import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProposalDetailActions } from "@/components/proposals/ProposalDetailActions";
import { getCurrentProfile } from "@/lib/billing/get-profile";
import { getProposalById } from "@/lib/proposals/get-proposals";
import { formatMoney, lineItemTotal } from "@/lib/currency";
import { isCurrency } from "@/types/proposal-row";

export const dynamic = "force-dynamic";

type ProposalDetailPageProps = {
  params: { id: string };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ProposalDetailPage({
  params,
}: ProposalDetailPageProps) {
  const { proposal, error } = await getProposalById(params.id);
  const { isPro, profile } = await getCurrentProfile();

  if (error === "Please sign in to view this proposal.") {
    redirect("/login");
  }

  if (!proposal) {
    notFound();
  }

  const currency = isCurrency(proposal.currency) ? proposal.currency : "USD";
  const lineItems = Array.isArray(proposal.line_items)
    ? proposal.line_items
    : [];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-ink-200 bg-white px-8 py-5">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="font-display text-2xl font-bold text-ink-950">
              {proposal.project_name}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Prepared for {proposal.client_name}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
            <ProposalDetailActions
              proposal={proposal}
              isPro={isPro}
              logoUrl={profile?.logo_url}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-ink-200 bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Status
              </p>
              <p className="mt-1 font-display text-lg font-bold capitalize text-ink-950">
                {proposal.status || "draft"}
              </p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Created
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-900">
                {formatDate(proposal.created_at)}
              </p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Total
              </p>
              <p className="mt-1 font-display text-lg font-bold text-ink-950">
                {formatMoney(Number(proposal.total_amount), currency)}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <div className="border-b border-ink-100 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-ink-950">
                Line items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-ink-50/80 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <tr>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3 text-right">Qty</th>
                    <th className="px-6 py-3 text-right">Price</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-ink-400"
                      >
                        No line items
                      </td>
                    </tr>
                  ) : (
                    lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-3 font-medium text-ink-800">
                          {item.serviceName || "Untitled service"}
                        </td>
                        <td className="px-6 py-3 text-right text-ink-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-3 text-right text-ink-500">
                          {formatMoney(Number(item.price), currency)}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-ink-900">
                          {formatMoney(lineItemTotal(item), currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {proposal.notes?.trim() ? (
            <div className="rounded-2xl border border-ink-200 bg-white px-6 py-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Notes
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                {proposal.notes}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/proposals/new"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Create another
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              Back to list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
