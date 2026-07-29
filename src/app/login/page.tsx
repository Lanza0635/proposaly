import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-atmosphere px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative w-full max-w-md">
        <Suspense
          fallback={
            <div className="h-[28rem] w-full animate-pulse rounded-2xl border border-ink-200 bg-white/70" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
