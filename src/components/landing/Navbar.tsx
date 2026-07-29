import Link from "next/link";
import { AuthNavActions } from "@/components/auth/AuthNavActions";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-ink-950"
        >
          Proposaly
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-ink-600 transition hover:text-ink-950 md:inline"
          >
            Features
          </Link>
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
