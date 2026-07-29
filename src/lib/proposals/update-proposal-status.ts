"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProposalStatus } from "@/types/proposal-row";

const ALLOWED_STATUSES: ProposalStatus[] = [
  "draft",
  "sent",
  "accepted",
  "declined",
];

export type UpdateStatusResult =
  | { ok: true; status: ProposalStatus }
  | { ok: false; message: string };

export async function updateProposalStatus(
  proposalId: string,
  status: string
): Promise<UpdateStatusResult> {
  const normalized = status.toLowerCase() as ProposalStatus;

  if (!ALLOWED_STATUSES.includes(normalized)) {
    return { ok: false, message: "Invalid status." };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in to update status." };
  }

  const { error } = await supabase
    .from("proposals")
    .update({ status: normalized })
    .eq("id", proposalId)
    .eq("user_id", user.id);

  if (error) {
    return {
      ok: false,
      message: error.message || "Failed to update status.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/proposals/${proposalId}`);

  return { ok: true, status: normalized };
}
