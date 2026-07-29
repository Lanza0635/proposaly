import { NextResponse } from "next/server";
import {
  getLemonConfig,
  verifyLemonWebhookSignature,
} from "@/lib/billing/lemon";
import { createAdminClient } from "@/lib/supabase/admin";

type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: { user_id?: string };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      customer_id?: number | string;
      user_email?: string;
      variant_id?: number | string;
    };
  };
};

function mapSubscriptionStatus(
  eventName: string,
  lemonStatus?: string
): "pro" | "free" | "cancelled" | null {
  const status = (lemonStatus || "").toLowerCase();

  if (
    eventName === "subscription_created" ||
    eventName === "subscription_resumed" ||
    eventName === "subscription_uncancelled" ||
    eventName === "subscription_payment_success"
  ) {
    return "pro";
  }

  if (
    eventName === "subscription_cancelled" ||
    eventName === "subscription_expired" ||
    eventName === "subscription_payment_failed"
  ) {
    if (status === "cancelled" || eventName === "subscription_cancelled") {
      return "cancelled";
    }
    return "free";
  }

  if (eventName === "subscription_updated") {
    if (status === "active" || status === "on_trial") return "pro";
    if (status === "cancelled" || status === "expired" || status === "past_due") {
      return status === "cancelled" ? "cancelled" : "free";
    }
  }

  return null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature");
  const { webhookSecret } = getLemonConfig();

  if (!verifyLemonWebhookSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LemonWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LemonWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name || "";
  const userId = payload.meta?.custom_data?.user_id;
  const nextStatus = mapSubscriptionStatus(
    eventName,
    payload.data?.attributes?.status
  );

  if (!userId || !nextStatus) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("profiles").upsert({
      id: userId,
      subscription_status: nextStatus,
      lemon_customer_id: String(payload.data?.attributes?.customer_id ?? ""),
      lemon_subscription_id: payload.data?.id ? String(payload.data.id) : null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Webhook profile update failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Webhook admin client error:", error);
    return NextResponse.json(
      { error: "Server misconfigured for webhooks" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
