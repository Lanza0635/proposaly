"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { uploadCompanyLogo } from "@/lib/billing/upload-logo";
import Link from "next/link";

type LogoUploaderProps = {
  isPro: boolean;
  logoUrl?: string | null;
};

export function LogoUploader({ isPro, logoUrl }: LogoUploaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isPro) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/60 px-4 py-4 text-sm text-ink-500">
        Custom logos are a Pro feature.{" "}
        <Link href="/pricing" className="font-semibold text-accent-dark hover:underline">
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  function onFileChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("logo", file);
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await uploadCompanyLogo(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage("Logo updated");
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-xl border border-ink-200 bg-white px-4 py-4">
      <div className="flex items-center gap-4">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Your logo"
            className="h-12 w-auto max-w-[140px] object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink-50 text-xs font-semibold text-ink-400">
            Logo
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload logo
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            disabled={isPending}
            onChange={(e) => onFileChange(e.target.files)}
          />
        </label>
      </div>
      {message ? <p className="text-sm text-accent-dark">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
