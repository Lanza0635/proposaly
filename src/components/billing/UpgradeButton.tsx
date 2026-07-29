"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { startProCheckout } from "@/lib/billing/start-checkout";
import { PRO_PLAN_PRICE_LABEL } from "@/lib/billing/plans";

type UpgradeButtonProps = {
  isPro?: boolean;
  className?: string;
  label?: string;
};

export function UpgradeButton({
  isPro = false,
  className,
  label = `Upgrade to Pro — ${PRO_PLAN_PRICE_LABEL}`,
}: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent-dark">
        <Sparkles className="h-4 w-4" />
        Pro plan active
      </div>
    );
  }

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const result = await startProCheckout();
      if (!result.ok) {
        if (result.message.toLowerCase().includes("sign in")) {
          router.push("/login?mode=signin&next=/pricing");
          return;
        }
        setError(result.message);
        return;
      }
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={loading}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          label
        )}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
