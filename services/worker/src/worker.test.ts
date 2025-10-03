import { test, expect } from "bun:test";
import worker from "./worker";
import { routes } from "./routes";

class KVStub {
  store = new Map<string, string>();
  async get(key: string) { return this.store.get(key) ?? null; }
  async put(key: string, value: string) { this.store.set(key, value); }
}

test("webhook decrements inventory on completed payment", async () => {
  const env: any = {
    LOWKEY_VAULT: new KVStub(),
    SQUARE_ACCESS_TOKEN: "",
    SQUARE_WEBHOOK_SIGNATURE_KEY: "",
    SQUARE_LOCATION_ID: "",
    PUBLIC_SITE_BASE_URL: ""
  };
  await env.LOWKEY_VAULT.put("inventory:founder", "1");
  const body = {
    data: {
      object: {
        payment: {
          status: "COMPLETED",
          order: { line_items: [{ name: "Vault Key — Founder" }] }
        }
      }
    }
  };
  const req = new Request(`https://example.com${routes.squareWebhook}`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  const res = await worker.fetch(req, env);
  expect(res.status).toBe(200);
  const remaining = await env.LOWKEY_VAULT.get("inventory:founder");
  expect(remaining).toBe("0");
});
