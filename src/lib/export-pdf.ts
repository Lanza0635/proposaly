import type { Proposal } from "@/types/proposal";

function sanitizeFilenamePart(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return cleaned || "Client";
}

function formatDateForFilename(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildProposalPdfFilename(clientName: string): string {
  return `Proposal_${sanitizeFilenamePart(clientName)}_${formatDateForFilename()}.pdf`;
}

type Html2PdfWorker = {
  set: (options: Record<string, unknown>) => Html2PdfWorker;
  from: (element: HTMLElement) => Html2PdfWorker;
  save: () => Promise<void>;
};

async function runHtml2Pdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = html2pdfModule.default as unknown as () => Html2PdfWorker;

  const exportWidthPx = 794;

  await html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: exportWidthPx,
        onclone: (clonedDoc: Document) => {
          const clonedRoot = clonedDoc.querySelector(
            "[data-pdf-root]"
          ) as HTMLElement | null;

          if (!clonedRoot) return;

          clonedRoot.style.width = `${exportWidthPx}px`;
          clonedRoot.style.maxWidth = `${exportWidthPx}px`;
          clonedRoot.style.boxShadow = "none";
          clonedRoot.style.borderRadius = "0";
          clonedRoot.style.border = "none";
          clonedRoot.style.overflow = "visible";

          clonedDoc.querySelectorAll("[data-pdf-hide]").forEach((node) => {
            (node as HTMLElement).style.display = "none";
          });

          clonedRoot.querySelectorAll("*").forEach((node) => {
            const el = node as HTMLElement;
            el.style.animation = "none";
            el.style.transition = "none";
          });
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save();
}

export async function exportElementToPdf(
  element: HTMLElement,
  clientName: string
): Promise<void> {
  await runHtml2Pdf(element, buildProposalPdfFilename(clientName));
}

export async function exportProposalPdf(
  element: HTMLElement,
  proposal: Proposal
): Promise<void> {
  await exportElementToPdf(element, proposal.clientName);
}
