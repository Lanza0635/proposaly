import { createClient } from "@/lib/supabase/server";
import type { ProposalRow } from "@/types/proposal-row";

export async function getPublicProposal(id: string): Promise<{
  proposal: ProposalRow | null;
  ownerLogoUrl: string | null;
  ownerIsPro: boolean;
  error: string | null;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("proposals")
    .select(
      "id, user_id, client_name, project_name, line_items, notes, currency, total_amount, status, created_at, updated_at, is_public"
    )
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    return {
      proposal: null,
      ownerLogoUrl: null,
      ownerIsPro: false,
      error: error.message,
    };
  }

  if (!data) {
    return {
      proposal: null,
      ownerLogoUrl: null,
      ownerIsPro: false,
      error: null,
    };
  }

  const proposal = data as ProposalRow & { is_public?: boolean };

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, logo_url")
    .eq("id", proposal.user_id)
    .maybeSingle();

  // Public branding: only expose logo if owner is Pro
  const ownerIsPro = (profile?.subscription_status || "").toLowerCase() === "pro";

  return {
    proposal,
    ownerLogoUrl: ownerIsPro ? profile?.logo_url ?? null : null,
    ownerIsPro,
    error: null,
  };
}
