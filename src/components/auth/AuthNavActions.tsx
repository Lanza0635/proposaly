"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthNavActionsProps = {
  variant?: "landing" | "plain";
};

export function AuthNavActions({ variant = "landing" }: AuthNavActionsProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-10 w-24 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className={cn(
            "hidden text-sm font-medium transition sm:inline",
            variant === "landing"
              ? "text-ink-600 hover:text-ink-950"
              : "text-ink-600 hover:text-ink-950"
          )}
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-ink-800 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden text-sm font-medium text-ink-600 transition hover:text-ink-950 sm:inline"
      >
        Sign in
      </Link>
      <Link
        href="/login?mode=signup"
        className="rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
      >
        Get started
      </Link>
    </div>
  );
}
