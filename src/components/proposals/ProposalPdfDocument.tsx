"use client";

import { formatMoney, lineItemTotal } from "@/lib/currency";
import { isCurrency, type ProposalRow } from "@/types/proposal-row";

export type PdfBranding = {
  isPro: boolean;
  logoUrl?: string | null;
};

type ProposalPdfDocumentProps = {
  proposal: ProposalRow;
  branding?: PdfBranding;
};

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function ProposalPdfDocument({
  proposal,
  branding,
}: ProposalPdfDocumentProps) {
  const currency = isCurrency(proposal.currency) ? proposal.currency : "USD";
  const lineItems = Array.isArray(proposal.line_items)
    ? proposal.line_items
    : [];
  const isPro = branding?.isPro ?? false;
  const logoUrl = branding?.logoUrl;

  return (
    <div
      data-pdf-root
      className="bg-white p-10 text-[#0e1519]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <div className="flex items-start justify-between border-b border-[#c9d6db] pb-6">
        <div>
          {isPro && logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Company logo"
              className="mb-3 h-10 w-auto max-w-[180px] object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#1a9f7a", fontFamily: "system-ui, sans-serif" }}
            >
              Proposaly
            </p>
          )}
          <h1
            className="mt-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Proposal
          </h1>
        </div>
        <div className="text-right text-sm" style={{ color: "#5a7887" }}>
          <p>{formatLongDate(proposal.created_at)}</p>
          <p className="mt-1 capitalize">Status: {proposal.status || "draft"}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#7694a1", fontFamily: "system-ui, sans-serif" }}
          >
            Prepared for
          </p>
          <p
            className="mt-2 text-lg font-semibold"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {proposal.client_name}
          </p>
        </div>
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#7694a1", fontFamily: "system-ui, sans-serif" }}
          >
            Project
          </p>
          <p
            className="mt-2 text-lg font-semibold"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {proposal.project_name}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ borderBottom: "2px solid #0e1519" }}>
              <th
                className="py-3 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Service
              </th>
              <th
                className="py-3 text-right text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Qty
              </th>
              <th
                className="py-3 text-right text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Price
              </th>
              <th
                className="py-3 text-right text-xs font-semibold uppercase tracking-wide"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e3eaed" }}>
                <td className="py-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {item.serviceName || "Untitled service"}
                </td>
                <td
                  className="py-3 text-right"
                  style={{ fontFamily: "system-ui, sans-serif", color: "#5a7887" }}
                >
                  {item.quantity}
                </td>
                <td
                  className="py-3 text-right tabular-nums"
                  style={{ fontFamily: "system-ui, sans-serif", color: "#5a7887" }}
                >
                  {formatMoney(Number(item.price), currency)}
                </td>
                <td
                  className="py-3 text-right font-medium tabular-nums"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {formatMoney(lineItemTotal(item), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-[#0e1519] pt-5">
        <span
          className="text-sm font-medium"
          style={{ color: "#5a7887", fontFamily: "system-ui, sans-serif" }}
        >
          Total ({currency})
        </span>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {formatMoney(Number(proposal.total_amount), currency)}
        </span>
      </div>

      {proposal.notes?.trim() ? (
        <div className="mt-10 rounded-lg bg-[#f4f7f8] p-5">
          <p
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "#7694a1", fontFamily: "system-ui, sans-serif" }}
          >
            Notes
          </p>
          <p
            className="mt-2 whitespace-pre-wrap text-sm leading-relaxed"
            style={{ color: "#43545f", fontFamily: "system-ui, sans-serif" }}
          >
            {proposal.notes}
          </p>
        </div>
      ) : null}

      {!isPro ? (
        <p
          className="mt-12 text-center text-xs"
          style={{ color: "#a3b8c1", fontFamily: "system-ui, sans-serif" }}
        >
          Powered by Proposaly
        </p>
      ) : (
        <p
          className="mt-12 text-center text-xs"
          style={{ color: "#c9d6db", fontFamily: "system-ui, sans-serif" }}
        >
          Confidential
        </p>
      )}
    </div>
  );
}
