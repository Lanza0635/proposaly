import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-white">Proposaly</p>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            Create, send, and track winning business proposals — built for
            modern B2B teams.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
          <Link href="#features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="/pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Sign In
          </Link>
          <Link href="/login?mode=signup" className="transition hover:text-white">
            Get Started
          </Link>
        </div>
      </div>
      <div className="border-t border-ink-800/80">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-ink-500">
          © {new Date().getFullYear()} Proposaly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
