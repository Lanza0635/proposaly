"use client";

import { forwardRef } from "react";
import type { Proposal } from "@/types/proposal";
import { formatMoney, lineItemTotal, proposalTotal } from "@/lib/currency";

type LivePreviewProps = {
  proposal: Proposal;
};

export const LivePreview = forwardRef<HTMLDivElement, LivePreviewProps>(
  function LivePreview({ proposal }, ref) {
    const total = proposalTotal(proposal.lineItems);
    const hasItems = proposal.lineItems.some(
      (item) => item.serviceName.trim() || item.price > 0
    );

    return (
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
        <div
          data-pdf-hide
          className="flex items-center justify-between border-b border-ink-100 bg-ink-50/80 px-5 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
            Live Preview
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-dark">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Updating
          </span>
        </div>

        <div
          ref={ref}
          data-pdf-root
          className="bg-white p-6 sm:p-8"
          style={{ color: "#0e1519" }}
        >
          <div className="border-b border-ink-100 pb-6">
            <p
              className="font-display text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "#1a9f7a" }}
            >
              Proposal
            </p>
            <h3
              className="mt-2 font-display text-2xl font-bold tracking-tight"
              style={{ color: "#0e1519" }}
            >
              {proposal.projectName.trim() || "Untitled project"}
            </h3>
            <p className="mt-2 text-sm" style={{ color: "#5a7887" }}>
              Prepared for{" "}
              <span className="font-semibold" style={{ color: "#3c4851" }}>
                {proposal.clientName.trim() || "Client name"}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <div
              className="mb-3 grid grid-cols-[minmax(0,1fr)_3rem_6.5rem] gap-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#7694a1" }}
            >
              <span>Service</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Amount</span>
            </div>

            {!hasItems ? (
              <p
                className="rounded-lg border border-dashed border-ink-200 bg-ink-50/50 px-4 py-8 text-center text-sm"
                style={{ color: "#7694a1" }}
              >
                Line items will appear here as you type.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {proposal.lineItems.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_3rem_6.5rem] items-baseline gap-3 py-3 text-sm"
                  >
                    <span
                      className="min-w-0 break-words font-medium"
                      style={{ color: "#3c4851" }}
                    >
                      {item.serviceName.trim() || "Untitled service"}
                    </span>
                    <span className="text-right" style={{ color: "#5a7887" }}>
                      {item.quantity || 0}
                    </span>
                    <span
                      className="text-right font-medium tabular-nums"
                      style={{ color: "#0e1519" }}
                    >
                      {formatMoney(lineItemTotal(item), proposal.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-ink-100 pt-5">
            <span className="text-sm font-medium" style={{ color: "#5a7887" }}>
              Total
            </span>
            <span
              className="font-display text-2xl font-bold tabular-nums"
              style={{ color: "#0e1519" }}
            >
              {formatMoney(total, proposal.currency)}
            </span>
          </div>

          {proposal.notes.trim() ? (
            <div
              className="mt-6 rounded-xl px-4 py-4"
              style={{ backgroundColor: "#f4f7f8" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#7694a1" }}
              >
                Notes
              </p>
              <p
                className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed"
                style={{ color: "#43545f" }}
              >
                {proposal.notes}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm italic" style={{ color: "#a3b8c1" }}>
              Notes will show here when added.
            </p>
          )}

          <p
            className="mt-8 text-center text-xs"
            style={{ color: "#a3b8c1" }}
          >
            Powered by Proposaly
          </p>
        </div>
      </div>
    );
  }
);
