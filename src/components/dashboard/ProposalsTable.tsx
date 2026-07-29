"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, Loader2, Trash2 } from "lucide-react";
import { deleteProposal } from "@/lib/proposals/delete-proposal";
import { formatMoney } from "@/lib/currency";
import { isCurrency, type ProposalRow } from "@/types/proposal-row";
import { cn } from "@/lib/utils";

type ProposalsTableProps = {
  proposals: ProposalRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "sent") {
    return "bg-sky-50 text-sky-700 ring-sky-200";
  }
  if (normalized === "accepted") {
    return "bg-accent-soft text-accent-dark ring-accent/20";
  }
  if (normalized === "declined") {
    return "bg-red-50 text-red-700 ring-red-200";
  }
  return "bg-ink-50 text-ink-600 ring-ink-200";
}

export function ProposalsTable({ proposals }: ProposalsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(proposal: ProposalRow) {
    const confirmed = window.confirm(
      `Delete proposal for "${proposal.client_name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    setPendingId(proposal.id);
    startTransition(async () => {
      const result = await deleteProposal(proposal.id);
      setPendingId(null);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  if (proposals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
        <p className="font-display text-lg font-semibold text-ink-900">
          No proposals yet
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Create your first proposal to see it listed here.
        </p>
        <Link
          href="/dashboard/proposals/new"
          className="mt-6 inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          Create New Proposal
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-950">
            Your proposals
          </h2>
          <p className="text-sm text-ink-500">
            {proposals.length} total · newest first
          </p>
        </div>
      </div>

      {error ? (
        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-ink-50/80 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Client</th>
              <th className="px-6 py-3 font-semibold">Project</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {proposals.map((proposal) => {
              const currency = isCurrency(proposal.currency)
                ? proposal.currency
                : "USD";
              const deleting = isPending && pendingId === proposal.id;

              return (
                <tr
                  key={proposal.id}
                  className="transition hover:bg-ink-50/50"
                >
                  <td className="px-6 py-4 font-medium text-ink-900">
                    {proposal.client_name}
                  </td>
                  <td className="px-6 py-4 text-ink-600">
                    {proposal.project_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ink-500">
                    {formatDate(proposal.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium tabular-nums text-ink-900">
                    {formatMoney(Number(proposal.total_amount), currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
                        statusStyles(proposal.status)
                      )}
                    >
                      {proposal.status || "draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/proposals/${proposal.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-ink-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(proposal)}
                        disabled={deleting}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
