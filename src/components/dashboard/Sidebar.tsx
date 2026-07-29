"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FilePlus2, LayoutDashboard, FileText, Loader2, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/proposals/new",
    label: "New Proposal",
    icon: FilePlus2,
  },
  {
    href: "/pricing",
    label: "Upgrade to Pro",
    icon: Sparkles,
  },
];

export function Sidebar() {
  const pathname = usePathname();
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

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
      <div className="border-b border-ink-200 px-5 py-5">
        <Link href="/" className="font-display text-lg font-bold text-ink-950">
          Proposaly
        </Link>
        <p className="mt-1 text-xs text-ink-400">Proposal workspace</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : href === "/pricing"
                ? pathname.startsWith("/pricing")
                : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-accent-soft text-accent-dark"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-ink-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-ink-50 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-200">
            <FileText className="h-4 w-4 text-ink-700" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">
              {loading ? "Loading..." : user?.email?.split("@")[0] || "Guest"}
            </p>
            <p className="truncate text-xs text-ink-500">
              {loading ? "…" : user?.email || "Not signed in"}
            </p>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => void handleSignOut()}
            disabled={signingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink-200 px-3 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
