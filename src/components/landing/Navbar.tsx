import Link from "next/link";
import { AuthNavActions } from "@/components/auth/AuthNavActions";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ink-950"
        >
          Proposaly
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="hidden text-sm font-medium text-ink-600 transition hover:text-ink-950 sm:inline"
          >
            Pricing
          </Link>
          <AuthNavActions />
        </div>
      </nav>
    </header>
  );
}
