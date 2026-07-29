import { createClient } from "@/lib/supabase/server";
import type { ProposalRow } from "@/types/proposal-row";

export async function getCurrentUserProposals(): Promise<{
  proposals: ProposalRow[];
  error: string | null;
  authenticated: boolean;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { proposals: [], error: null, authenticated: false };
  }

  const { data, error } = await supabase
    .from("proposals")
    .select(
      "id, user_id, client_name, project_name, line_items, notes, currency, total_amount, status, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      proposals: [],
      error: error.message,
      authenticated: true,
    };
  }

  return {
    proposals: (data ?? []) as ProposalRow[],
    error: null,
    authenticated: true,
  };
}

export async function getProposalById(
  id: string
): Promise<{ proposal: ProposalRow | null; error: string | null }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { proposal: null, error: "Please sign in to view this proposal." };
  }

  const { data, error } = await supabase
    .from("proposals")
    .select(
      "id, user_id, client_name, project_name, line_items, notes, currency, total_amount, status, created_at, updated_at"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return { proposal: null, error: error.message };
  }

  return { proposal: (data as ProposalRow | null) ?? null, error: null };
}
