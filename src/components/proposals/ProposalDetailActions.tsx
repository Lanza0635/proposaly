"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Link2 } from "lucide-react";
import { ProposalPdfDocument } from "@/components/proposals/ProposalPdfDocument";
import { Toast, type ToastVariant } from "@/components/ui/Toast";
import { exportElementToPdf } from "@/lib/export-pdf";
import { updateProposalStatus } from "@/lib/proposals/update-proposal-status";
import {
  type ProposalRow,
  type ProposalStatus,
} from "@/types/proposal-row";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: ProposalStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

type ProposalDetailActionsProps = {
  proposal: ProposalRow;
  isPro: boolean;
  logoUrl?: string | null;
};

export function ProposalDetailActions({
  proposal,
  isPro,
  logoUrl,
}: ProposalDetailActionsProps) {
  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(proposal.status || "draft");
  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<ToastVariant>("success");

  function showToast(message: string, variant: ToastVariant) {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  async function handleDownloadPdf() {
    const element = pdfRef.current;
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      await exportElementToPdf(element, proposal.client_name);
      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to download PDF. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  }

  function handleStatusChange(nextStatus: string) {
    const previous = status;
    setStatus(nextStatus);

    startTransition(async () => {
      const result = await updateProposalStatus(proposal.id, nextStatus);
      if (!result.ok) {
        setStatus(previous);
        showToast(result.message, "error");
        return;
      }

      showToast(`Status updated to ${result.status}`, "success");
      router.refresh();
    });
  }

  async function handleCopyShareLink() {
    const url = `${window.location.origin}/p/${proposal.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Public share link copied", "success");
    } catch {
      showToast(url, "success");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <label
            htmlFor="proposal-status"
            className="text-xs font-semibold uppercase tracking-wide text-ink-400"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="proposal-status"
              value={status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={cn(
                "w-full appearance-none rounded-lg border border-ink-200 bg-white py-2.5 pl-3 pr-10 text-sm font-semibold capitalize text-ink-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[11rem]"
              )}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isPending ? (
              <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-400" />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleCopyShareLink()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            <Link2 className="h-4 w-4" />
            Copy public link
          </button>
          <button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {!isPro ? (
        <p className="mt-4 text-xs text-ink-400">
          Free plan PDFs include a “Powered by Proposaly” footer.{" "}
          <a href="/pricing" className="font-semibold text-accent-dark hover:underline">
            Upgrade to remove it
          </a>
        </p>
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none fixed left-[-10000px] top-0 w-[794px] bg-white"
      >
        <div ref={pdfRef}>
          <ProposalPdfDocument
            proposal={{ ...proposal, status }}
            branding={{ isPro, logoUrl }}
          />
        </div>
      </div>

      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
