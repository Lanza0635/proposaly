"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import { LivePreview } from "@/components/proposals/LivePreview";
import { Toast, type ToastVariant } from "@/components/ui/Toast";
import { exportProposalPdf } from "@/lib/export-pdf";
import { saveProposal } from "@/lib/proposals/save-proposal";
import { createEmptyProposal, type Proposal } from "@/types/proposal";
import { createClient } from "@/lib/supabase/client";

export default function NewProposalPage() {
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal>(createEmptyProposal);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<ToastVariant>("success");
  const previewRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, variant: ToastVariant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }, []);

  const handleExportPdf = useCallback(async () => {
    const element = previewRef.current;
    if (!element || isExporting || isSaving) return;

    setIsExporting(true);
    try {
      await exportProposalPdf(element, proposal);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      showToast("Failed to export PDF. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, isSaving, proposal, showToast]);

  const handleSave = useCallback(async () => {
    if (isSaving || isExporting) return;

    setIsSaving(true);
    try {
      // Ensure browser cookies are in sync before the Server Action runs
      const browserClient = createClient();
      const {
        data: { session },
      } = await browserClient.auth.getSession();

      if (!session?.user) {
        showToast("Please sign in to save", "error");
        return;
      }

      // Server Action: createServerClient + cookies() + user_id: user.id
      const result = await saveProposal(proposal);

      if (!result.ok) {
        showToast(
          result.reason === "unauthenticated"
            ? "Please sign in to save"
            : result.message,
          "error"
        );
        if (result.reason === "limit") {
          window.setTimeout(() => router.push("/pricing"), 1200);
        }
        return;
      }

      showToast("Proposal saved successfully", "success");
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (error) {
      console.error("Failed to save proposal:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to save proposal. Check your Supabase configuration.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  }, [isExporting, isSaving, proposal, router, showToast]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-ink-200 bg-white px-8 py-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">
          Create New Proposal
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Fill in the details on the left — preview updates in real time.
        </p>
      </header>

      <div className="flex-1 p-6 lg:p-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 sm:p-8">
            <ProposalForm
              value={proposal}
              onChange={setProposal}
              onSave={handleSave}
              onExportPdf={handleExportPdf}
              isSaving={isSaving}
              isExporting={isExporting}
            />
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <LivePreview ref={previewRef} proposal={proposal} />
          </div>
        </div>
      </div>

      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
