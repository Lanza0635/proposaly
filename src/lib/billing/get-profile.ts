import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus } from "@/lib/billing/plans";
import { isProPlan } from "@/lib/billing/plans";

export type Profile = {
  id: string;
  subscription_status: SubscriptionStatus;
  lemon_customer_id: string | null;
  lemon_subscription_id: string | null;
  logo_url: string | null;
  company_name: string | null;
};

export async function getCurrentProfile(): Promise<{
  profile: Profile | null;
  authenticated: boolean;
  isPro: boolean;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, authenticated: false, isPro: false };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, subscription_status, lemon_customer_id, lemon_subscription_id, logo_url, company_name"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    // Ensure a free profile exists for older accounts
    await supabase.from("profiles").upsert({
      id: user.id,
      subscription_status: "free",
    });

    return {
      profile: {
        id: user.id,
        subscription_status: "free",
        lemon_customer_id: null,
        lemon_subscription_id: null,
        logo_url: null,
        company_name: null,
      },
      authenticated: true,
      isPro: false,
    };
  }

  const profile = data as Profile;
  return {
    profile,
    authenticated: true,
    isPro: isProPlan(profile.subscription_status),
  };
}
