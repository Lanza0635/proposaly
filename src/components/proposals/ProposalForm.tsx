"use client";

import { Loader2 } from "lucide-react";
import type { Proposal, Currency } from "@/types/proposal";
import { CURRENCIES } from "@/types/proposal";
import { LineItemsEditor } from "@/components/proposals/LineItemsEditor";

type ProposalFormProps = {
  value: Proposal;
  onChange: (next: Proposal) => void;
  onSave?: () => void | Promise<void>;
  onExportPdf?: () => void | Promise<void>;
  isSaving?: boolean;
  isExporting?: boolean;
};

export function ProposalForm({
  value,
  onChange,
  onSave,
  onExportPdf,
  isSaving = false,
  isExporting = false,
}: ProposalFormProps) {
  const busy = isSaving || isExporting;

  function patch(partial: Partial<Proposal>) {
    onChange({ ...value, ...partial });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy) void onSave?.();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="clientName"
            className="text-sm font-semibold text-ink-800"
          >
            Client Name
          </label>
          <input
            id="clientName"
            type="text"
            value={value.clientName}
            onChange={(e) => patch({ clientName: e.target.value })}
            placeholder="Acme Corp"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="projectName"
            className="text-sm font-semibold text-ink-800"
          >
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={value.projectName}
            onChange={(e) => patch({ projectName: e.target.value })}
            placeholder="Website redesign"
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      <LineItemsEditor
        items={value.lineItems}
        onChange={(lineItems) => patch({ lineItems })}
      />

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-semibold text-ink-800">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={value.notes}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="Payment terms, timeline, or additional context…"
          className="w-full resize-y rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="currency"
          className="text-sm font-semibold text-ink-800"
        >
          Currency
        </label>
        <select
          id="currency"
          value={value.currency}
          onChange={(e) => patch({ currency: e.target.value as Currency })}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:max-w-xs"
        >
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-ink-100 pt-6">
        <button
          type="submit"
          disabled={busy || !onSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Proposal"
          )}
        </button>
        <button
          type="button"
          onClick={() => void onExportPdf?.()}
          disabled={busy || !onExportPdf}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating PDF…
            </>
          ) : (
            "Export PDF"
          )}
        </button>
      </div>
    </form>
  );
}
