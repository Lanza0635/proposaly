"use server";

import { createClient } from "@/lib/supabase/server";
import { createLemonCheckout } from "@/lib/billing/lemon";

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function startProCheckout(): Promise<CheckoutResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in to upgrade." };
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  const result = await createLemonCheckout({
    userId: user.id,
    userEmail: user.email,
    redirectUrl: `${appUrl}/dashboard?upgraded=1`,
  });

  if ("error" in result) {
    return { ok: false, message: result.error };
  }

  return { ok: true, url: result.url };
}
