import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-950 text-ink-200">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg font-bold text-white">Proposaly</p>
          <p className="mt-1 text-sm text-ink-400">
            Proposal & PDF Report Generator for modern B2B teams.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-ink-300 transition hover:text-white"
        >
          Open Dashboard
        </Link>
      </div>
    </footer>
  );
}
