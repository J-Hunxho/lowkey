import type { Env } from "./types";

const API = "https://connect.squareup.com/v2";

export async function createPaymentLink(env: Env, name: string, amountCents: number) {
  const body = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: env.SQUARE_LOCATION_ID,
      line_items: [
        { name, quantity: "1", base_price_money: { amount: amountCents, currency: "USD" } }
      ]
    }
  };
  const r = await fetch(`${API}/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": "2025-07-20"
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`Square error ${r.status}`);
  const json = await r.json();
  return json.payment_link.url as string;
}

// NOTE: In production, verify Square signature header 'x-square-hmacsha256-signature' against body using the webhook signature key.
export async function verifySquareWebhook(_env: Env, _request: Request): Promise<boolean> {
  // TODO: implement HMAC-SHA256 verification per Square docs
  return true;
}
