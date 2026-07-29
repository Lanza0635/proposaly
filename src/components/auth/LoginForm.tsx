"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toast, type ToastVariant } from "@/components/ui/Toast";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode: AuthMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<ToastVariant>("error");

  const title = useMemo(
    () => (mode === "signin" ? "Welcome back" : "Create your account"),
    [mode]
  );

  const subtitle = useMemo(
    () =>
      mode === "signin"
        ? "Sign in to manage proposals and export PDFs."
        : "Sign up to start creating professional proposals.",
    [mode]
  );

  function showToast(message: string, variant: ToastVariant) {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const supabase = createClient();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          showToast(getAuthErrorMessage(error), "error");
          return;
        }

        if (data.session) {
          showToast("Account created successfully", "success");
          window.setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 700);
          return;
        }

        // Email confirmation may be required depending on Supabase settings
        showToast(
          "Account created. Check your email to confirm, then sign in.",
          "success"
        );
        setMode("signin");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        showToast(getAuthErrorMessage(error), "error");
        return;
      }

      showToast("Signed in successfully", "success");
      window.setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 700);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Authentication failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white/90 p-8 shadow-xl shadow-ink-950/5 backdrop-blur">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ink-950"
        >
          Proposaly
        </Link>

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink-50 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold transition",
                mode === "signin"
                  ? "bg-white text-ink-950 shadow-sm"
                  : "text-ink-500 hover:text-ink-800"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold transition",
                mode === "signup"
                  ? "bg-white text-ink-950 shadow-sm"
                  : "text-ink-500 hover:text-ink-800"
              )}
            >
              Sign up
            </button>
          </div>

          <h1 className="mt-6 font-display text-2xl font-bold text-ink-950">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-ink-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-ink-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-ink-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "signin" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-accent-dark hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-accent-dark hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      <Toast
        open={toastOpen}
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
