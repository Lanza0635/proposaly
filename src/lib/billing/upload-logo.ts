"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/billing/get-profile";
import { isProPlan } from "@/lib/billing/plans";

export type LogoUploadResult =
  | { ok: true; logoUrl: string }
  | { ok: false; message: string };

export async function uploadCompanyLogo(
  formData: FormData
): Promise<LogoUploadResult> {
  const { profile, authenticated, isPro } = await getCurrentProfile();

  if (!authenticated || !profile) {
    return { ok: false, message: "Please sign in." };
  }

  if (!isPro) {
    return {
      ok: false,
      message: "Custom logos are available on the Pro plan.",
    };
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose an image file." };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, message: "Logo must be under 2MB." };
  }

  const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return { ok: false, message: "Use PNG, JPG, WEBP, or SVG." };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `${profile.id}/logo.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { ok: false, message: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(path);

  const logoUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
    .eq("id", profile.id);

  if (updateError) {
    return { ok: false, message: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/pricing");
  return { ok: true, logoUrl };
}

export async function ensureProForBranding(): Promise<boolean> {
  const { profile } = await getCurrentProfile();
  return isProPlan(profile?.subscription_status);
}
