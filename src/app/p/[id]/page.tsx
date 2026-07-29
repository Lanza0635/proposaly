import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProposal } from "@/lib/proposals/get-public-proposal";
import { formatMoney, lineItemTotal } from "@/lib/currency";
import { isCurrency } from "@/types/proposal-row";

export const dynamic = "force-dynamic";

type PublicProposalPageProps = {
  params: { id: string };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default async function PublicProposalPage({
  params,
}: PublicProposalPageProps) {
  const { proposal, ownerLogoUrl, ownerIsPro, error } =
    await getPublicProposal(params.id);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f2f6f7] px-6">
        <p className="text-sm text-red-600">Unable to load proposal.</p>
      </main>
    );
  }

  if (!proposal) {
    notFound();
  }

  const currency = isCurrency(proposal.currency) ? proposal.currency : "USD";
  const lineItems = Array.isArray(proposal.line_items)
    ? proposal.line_items
    : [];

  return (
    <main className="min-h-screen bg-[#f2f6f7]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <article className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
          <div className="border-b border-ink-100 px-8 py-8 sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                {ownerLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ownerLogoUrl}
                    alt="Company logo"
                    className="mb-4 h-10 w-auto max-w-[180px] object-contain"
                  />
                ) : (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Proposal
                  </p>
                )}
                <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-950">
                  {proposal.project_name}
                </h1>
                <p className="mt-2 text-ink-500">
                  Prepared for{" "}
                  <span className="font-semibold text-ink-800">
                    {proposal.client_name}
                  </span>
                </p>
              </div>
              <div className="text-right text-sm text-ink-400">
                <p>{formatDate(proposal.created_at)}</p>
                <p className="mt-1 capitalize">{proposal.status}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 sm:px-10">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                <tr className="border-b border-ink-200">
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 text-right font-semibold">Qty</th>
                  <th className="pb-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-ink-800">
                      {item.serviceName || "Untitled service"}
                    </td>
                    <td className="py-3 text-right text-ink-500">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-medium text-ink-900">
                      {formatMoney(lineItemTotal(item), currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex items-end justify-between border-t border-ink-200 pt-5">
              <span className="text-sm font-medium text-ink-500">Total</span>
              <span className="font-display text-2xl font-bold text-ink-950">
                {formatMoney(Number(proposal.total_amount), currency)}
              </span>
            </div>

            {proposal.notes?.trim() ? (
              <div className="mt-8 rounded-xl bg-ink-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                  {proposal.notes}
                </p>
              </div>
            ) : null}

            {!ownerIsPro ? (
              <p className="mt-10 text-center text-xs text-ink-400">
                Powered by Proposaly
              </p>
            ) : null}
          </div>
        </article>

        {/* Organic viral growth badge — no ad spend */}
        <footer className="mt-8 flex justify-center pb-8">
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-3 rounded-full border border-ink-200 bg-white px-5 py-3 shadow-sm transition hover:border-accent/40 hover:shadow-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-display text-xs font-bold text-accent-dark">
              P
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-ink-900 group-hover:text-accent-dark">
                Create your own proposal with Proposaly
              </span>
              <span className="block text-xs text-ink-400">
                Free to start · no ads · upgrade when you grow
              </span>
            </span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
