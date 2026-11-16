import "server-only";
import { createDecipheriv, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { guides } from "../anleitungen/guides";

const live = process.env.VERCEL_ENV === "production";
const base = live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const client = live ? process.env.PAYPAL_CLIENT_ID : process.env.PAYPAL_SANDBOX_CLIENT_ID;
const secret = live ? process.env.PAYPAL_CLIENT_SECRET : process.env.PAYPAL_SANDBOX_CLIENT_SECRET;
export const checkoutReady = Boolean(client && secret && process.env.TD_GUIDE_STORAGE_KEY);
export const guideBySku = (sku: string) => guides.find((guide) => guide.sku === sku);
type Guide = (typeof guides)[number];
type Money = { currency_code: string; value: string };
type Order = {
  id: string; status: string;
  links?: { rel: string; href: string }[];
  purchase_units?: { reference_id: string; custom_id: string; amount: Money;
    payments?: { captures?: { status: string; amount: Money }[] } }[];
};

function customerTag(user: string, guide: Guide) {
  return createHmac("sha256", process.env.TD_GUIDE_STORAGE_KEY!).update(JSON.stringify([user, guide.sku, guide.cents])).digest("hex");
}

export async function pdfBytes(sku: string) {
  if (sku !== "uebersicht" && !guideBySku(sku)) throw Error("Unbekannte Datei");
  const data = await readFile(join(process.cwd(), "private", "guide-files", sku + ".bin"));
  const key = Buffer.from(process.env.TD_GUIDE_STORAGE_KEY ?? "", "base64");
  const cipher = createDecipheriv("aes-256-gcm", key, data.subarray(0, 12));
  cipher.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]);
}

async function paypal(path: string, init: RequestInit = {}): Promise<Order> {
  if (!checkoutReady) throw Error("PayPal ist noch nicht eingerichtet");
  const token = await fetch(base + "/v1/oauth2/token", {
    method: "POST", cache: "no-store", headers: {
      Authorization: "Basic " + Buffer.from(client + ":" + secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    }, body: "grant_type=client_credentials",
  });
  if (!token.ok) throw Error("PayPal-Anmeldung fehlgeschlagen");
  const data = await token.json();
  const response = await fetch(base + path, { ...init, cache: "no-store", headers: {
    Authorization: "Bearer " + data.access_token, "Content-Type": "application/json", ...init.headers,
  } });
  if (!response.ok) throw Error("PayPal-Anfrage fehlgeschlagen");
  return response.json();
}

export async function begin(user: string, guide: Guide, origin: string, requestId: string) {
  await Promise.all([pdfBytes(guide.sku), pdfBytes("uebersicht")]);
  const order = await paypal("/v2/checkout/orders", { method: "POST", headers: { "PayPal-Request-Id": requestId },
    body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ reference_id: guide.sku,
      custom_id: customerTag(user, guide), description: guide.title,
      amount: { currency_code: "EUR", value: (guide.cents / 100).toFixed(2) } }],
      payment_source: { paypal: { experience_context: { user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING",
        return_url: origin + "/konto/anleitungen", cancel_url: origin + "/konto/anleitungen?sku=" + guide.sku + "&cancel=1" } } },
    }),
  });
  const target = order.links?.find((link) => ["payer-action", "approve"].includes(link.rel))?.href;
  if (!target || !/^https:\/\/www\.(sandbox\.)?paypal\.com\//.test(target)) throw Error("PayPal-Link fehlt");
  return target;
}

export async function purchase(user: string, id: string) {
  if (!/^[A-Z0-9]{10,32}$/.test(id)) throw Error("Ungültige Bestellung");
  const order = await paypal("/v2/checkout/orders/" + id);
  const units = order.purchase_units;
  const unit = units?.[0];
  const guide = guideBySku(unit?.reference_id ?? "");
  if (order.id !== id || units?.length !== 1 || !unit || !guide || unit.custom_id !== customerTag(user, guide)) throw Error("Bestellung unbekannt");
  const matches = (money?: Money) => money?.currency_code === "EUR" && money.value === (guide.cents / 100).toFixed(2);
  if (!matches(unit.amount)) throw Error("Betrag weicht ab");
  const captures = unit.payments?.captures;
  const paid = order.status === "COMPLETED" && captures?.length === 1 && captures[0].status === "COMPLETED" && matches(captures[0].amount);
  return { guide, paid, status: order.status };
}

export async function finish(user: string, id: string) {
  const current = await purchase(user, id);
  if (current.status !== "APPROVED") return;
  try {
    await paypal("/v2/checkout/orders/" + id + "/capture", { method: "POST", headers: { "PayPal-Request-Id": "pdf-" + id }, body: "{}" });
  } catch (error) {
    if (!(await purchase(user, id)).paid) throw error;
  }
}
