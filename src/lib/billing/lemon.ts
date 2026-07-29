import crypto from "crypto";

const LEMON_API = "https://api.lemonsqueezy.com/v1";

export function getLemonConfig() {
  return {
    apiKey: process.env.LEMON_SQUEEZY_API_KEY?.trim() || "",
    storeId: process.env.LEMON_SQUEEZY_STORE_ID?.trim() || "",
    variantId: process.env.LEMON_SQUEEZY_VARIANT_ID?.trim() || "",
    webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET?.trim() || "",
    checkoutUrl: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL?.trim() || "",
  };
}

export function verifyLemonWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const check = Buffer.from(signature, "utf8");

  if (digest.length !== check.length) return false;
  return crypto.timingSafeEqual(digest, check);
}

export async function createLemonCheckout(options: {
  userId: string;
  userEmail?: string | null;
  redirectUrl: string;
}): Promise<{ url: string } | { error: string }> {
  const config = getLemonConfig();

  // Fallback: static checkout link with custom user id (no API key required)
  if (!config.apiKey || !config.storeId || !config.variantId) {
    if (!config.checkoutUrl) {
      return {
        error:
          "Lemon Squeezy is not configured. Set LEMON_SQUEEZY_* env vars or NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL.",
      };
    }

    const url = new URL(config.checkoutUrl);
    url.searchParams.set("checkout[custom][user_id]", options.userId);
    if (options.userEmail) {
      url.searchParams.set("checkout[email]", options.userEmail);
    }
    return { url: url.toString() };
  }

  const response = await fetch(`${LEMON_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: options.userEmail || undefined,
            custom: {
              user_id: options.userId,
            },
          },
          product_options: {
            redirect_url: options.redirectUrl,
          },
        },
        relationships: {
          store: {
            data: { type: "stores", id: config.storeId },
          },
          variant: {
            data: { type: "variants", id: config.variantId },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Lemon Squeezy checkout error:", text);
    return { error: "Could not create checkout session." };
  }

  const json = (await response.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url;

  if (!url) {
    return { error: "Checkout URL missing from Lemon Squeezy response." };
  }

  return { url };
}
