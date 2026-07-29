"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type DeleteProposalResult =
  | { ok: true }
  | { ok: false; message: string };

export async function deleteProposal(
  proposalId: string
): Promise<DeleteProposalResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in to delete proposals." };
  }

  const { error } = await supabase
    .from("proposals")
    .delete()
    .eq("id", proposalId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message || "Failed to delete proposal." };
  }

  revalidatePath("/dashboard");
  return { ok: true };
}
