"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { proposalTotal } from "@/lib/currency";
import { getCurrentProfile } from "@/lib/billing/get-profile";
import {
  canCreateProposal,
  FREE_PLAN_PROPOSAL_LIMIT,
} from "@/lib/billing/plans";
import type { Proposal } from "@/types/proposal";

export type SaveProposalResult =
  | { ok: true; id: string }
  | {
      ok: false;
      reason: "unauthenticated" | "limit" | "error";
      message: string;
    };

/**
 * Server Action — cookie session + Free/Pro paywall enforcement.
 */
export async function saveProposal(
  proposal: Proposal
): Promise<SaveProposalResult> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Giriş yapan kullanıcı ID:", user?.id);

  if (userError) {
    console.log("Auth getUser error:", userError.message);
  }

  if (!user?.id) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Please sign in to save",
    };
  }

  const { profile, isPro } = await getCurrentProfile();

  const { count, error: countError } = await supabase
    .from("proposals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return {
      ok: false,
      reason: "error",
      message: countError.message,
    };
  }

  if (!canCreateProposal(profile?.subscription_status, count ?? 0)) {
    return {
      ok: false,
      reason: "limit",
      message: `Free plan allows up to ${FREE_PLAN_PROPOSAL_LIMIT} proposals. Upgrade to Pro for unlimited proposals.`,
    };
  }

  const totalAmount = proposalTotal(proposal.lineItems);

  const row = {
    user_id: user.id,
    client_name: proposal.clientName.trim() || "Untitled client",
    project_name: proposal.projectName.trim() || "Untitled project",
    line_items: proposal.lineItems,
    notes: proposal.notes,
    currency: proposal.currency,
    total_amount: totalAmount,
    status: "draft" as const,
    is_public: true,
  };

  console.log("Insert user_id:", row.user_id, "isPro:", isPro);

  const { data, error } = await supabase
    .from("proposals")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.log("Supabase insert error:", error.message, error.code);
    return {
      ok: false,
      reason: "error",
      message: error.message || "Failed to save proposal",
    };
  }

  revalidatePath("/dashboard");

  return { ok: true, id: data.id };
}
