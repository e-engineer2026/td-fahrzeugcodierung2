import "server-only";
import { GOLF7_VZE, resolveShopMode, guideShopReturnOrigin } from "./guideShopShared";

export function configuredShopMode() {
  return resolveShopMode(process.env);
}

function paypalRoot() {
  if (process.env.PAYPAL_ENV === "sandbox") return "https://api-m.sandbox.paypal.com";
  if (process.env.PAYPAL_ENV === "live") return "https://api-m.paypal.com";
  throw new Error("PayPal-Umgebung fehlt.");
}

async function accessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret || configuredShopMode() === "off") throw new Error("PayPal nicht konfiguriert.");
  const auth = Buffer.from(id + ":" + secret).toString("base64");
  const response = await fetch(paypalRoot() + "/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("PayPal-Authentifizierung fehlgeschlagen.");
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("Kein PayPal-Token.");
  return data.access_token;
}

/** Sandbox-only OAuth check; returns no credentials or token contents. */
export async function testPaypalSandboxConnection(): Promise<boolean> {
  if (process.env.VERCEL_ENV !== "preview" || configuredShopMode() !== "sandbox") return false;
  try {
    const token = await accessToken();
    return token.length > 16;
  } catch { return false; }
}

export async function paypalApi<T>(
  path: string,
  method: "POST" | "GET",
  body?: unknown,
  requestId?: string,
): Promise<T> {
  const token = await accessToken();
  const headers: Record<string, string> = {
    Authorization: "Bearer " + token,
    Accept: "application/json",
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  if (requestId) headers["PayPal-Request-Id"] = requestId;
  const response = await fetch(paypalRoot() + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("PayPal-Anfrage fehlgeschlagen (" + response.status + ").");
  return response.json() as Promise<T>;
}

export type PaypalOrder = {
  id: string; status?: string;
  links?: Array<{ rel: string; href: string }>;
};

export async function createPaypalGuideOrder(orderId: string) {
  const origin = guideShopReturnOrigin(process.env);
  const returnUrl = origin + "/codieranleitungen/golf7-vze?payment=approved";
  const cancelUrl = origin + "/codieranleitungen/golf7-vze?payment=cancelled";
  const order = await paypalApi<PaypalOrder>("/v2/checkout/orders", "POST", {
    intent: "CAPTURE",
    purchase_units: [{
      reference_id: GOLF7_VZE.id,
      custom_id: orderId,
      invoice_id: "TDG7VZE-" + orderId,
      description: "TD Fahrzeugcodierung - PDF Verkehrszeichenerkennung Golf 7",
      amount: { currency_code: GOLF7_VZE.currency, value: (GOLF7_VZE.priceCents / 100).toFixed(2) },
    }],
    payment_source: { paypal: { experience_context: {
      shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW",
      return_url: returnUrl, cancel_url: cancelUrl,
    } } },
  }, orderId);
  if (!/^[A-Z0-9-]{6,64}$/i.test(order.id)) throw new Error("Ungültige PayPal-Bestell-ID.");
  const link = order.links?.find(x => x.rel === "payer-action" || x.rel === "approve")?.href;
  const url = link ? new URL(link) : null;
  if (!url || url.protocol !== "https:" ||
      !(url.hostname === "paypal.com" || url.hostname.endsWith(".paypal.com"))) {
    throw new Error("PayPal-Freigabelink fehlt.");
  }
  return { paypalOrderId: order.id, approveUrl: url.toString() };
}

export async function capturePaypalGuideOrder(orderId: string, localId: string) {
  // Bei Browser-Neuladen oder einer DB-Unterbrechung nie erneut abbuchen,
  // sondern zuerst den tatsächlichen Status der PayPal-Bestellung prüfen.
  const path = "/v2/checkout/orders/" + encodeURIComponent(orderId);
  const current = await paypalApi<{status?: string}>(path, "GET");
  if (current.status === "COMPLETED") return current;
  return paypalApi<unknown>(path + "/capture", "POST", {}, "td-capture-" + localId);
}

export async function verifyPayPalWebhook(
  headers: Headers,
  event: unknown,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const required = ["paypal-transmission-id", "paypal-transmission-time", "paypal-transmission-sig",
    "paypal-cert-url", "paypal-auth-algo"];
  if (!webhookId || required.some(name => !headers.get(name))) return false;
  const body = {
    webhook_id: webhookId,
    transmission_id: headers.get("paypal-transmission-id"),
    transmission_time: headers.get("paypal-transmission-time"),
    transmission_sig: headers.get("paypal-transmission-sig"),
    cert_url: headers.get("paypal-cert-url"),
    auth_algo: headers.get("paypal-auth-algo"),
    webhook_event: event,
  };
  const result = await paypalApi<{verification_status:string}>(
    "/v1/notifications/verify-webhook-signature", "POST", body);
  return result.verification_status === "SUCCESS";
}
