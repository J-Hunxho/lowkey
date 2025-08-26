import { routes } from "./routes";
import type { Env } from "./types";
import { createPaymentLink, verifySquareWebhook } from "./square";

const TIER = {
  founder: { name: "Vault Key — Founder", cents: 100000, key: "founder" },
  inner:   { name: "Vault Key — Inner Circle", cents: 500000, key: "inner" }
};

async function getStatus(env: Env) {
  const founder = Number(await env.LOWKEY_VAULT.get("inventory:founder")) || 100;
  const inner   = Number(await env.LOWKEY_VAULT.get("inventory:inner")) || 30;
  const soldF   = Number(await env.LOWKEY_VAULT.get("sold:founder")) || 0;
  const soldI   = Number(await env.LOWKEY_VAULT.get("sold:inner")) || 0;
  return Response.json({ founder, inner, sold: { founder: soldF, inner: soldI } }, { headers: cors() });
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

async function makeCheckout(env: Env, tier: keyof typeof TIER) {
  const invKey = `inventory:${tier}`;
  const left = Number(await env.LOWKEY_VAULT.get(invKey)) || 0;
  if (left <= 0) return new Response("Sold out", { status: 410, headers: cors() });

  const url = await createPaymentLink(env, TIER[tier].name, TIER[tier].cents);
  return Response.json({ url }, { headers: cors() });
}

async function handleWebhook(env: Env, request: Request) {
  const ok = await verifySquareWebhook(env, request);
  if (!ok) return new Response("Bad signature", { status: 401, headers: cors() });

  const body = await request.json();

  // Square: look for payment update events, ensure status == COMPLETED
  const payment = body?.data?.object?.payment;
  if (payment?.status === "COMPLETED") {
    const itemName = payment?.order?.line_items?.[0]?.name as string | undefined;
    let tier: "founder" | "inner" | undefined =
      itemName?.includes("Founder") ? "founder" :
      itemName?.includes("Inner Circle") ? "inner" : undefined;

    if (tier) {
      const invKey = `inventory:${tier}`;
      const soldKey = `sold:${tier}`;
      const left = Number(await env.LOWKEY_VAULT.get(invKey)) || 0;
      if (left > 0) {
        await env.LOWKEY_VAULT.put(invKey, String(left - 1));
        const sold = Number(await env.LOWKEY_VAULT.get(soldKey)) || 0;
        await env.LOWKEY_VAULT.put(soldKey, String(sold + 1));
      }
    }
  }
  return new Response("OK", { headers: cors() });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return new Response("", { headers: cors() });

    const url = new URL(request.url);
    if (url.pathname === routes.status && request.method === "GET") return getStatus(env);
    if (url.pathname === routes.checkoutFounder && request.method === "POST") return makeCheckout(env, "founder");
    if (url.pathname === routes.checkoutInner && request.method === "POST") return makeCheckout(env, "inner");
    if (url.pathname === routes.squareWebhook && request.method === "POST") return handleWebhook(env, request);

    return new Response("Not Found", { status: 404, headers: cors() });
  }
};
