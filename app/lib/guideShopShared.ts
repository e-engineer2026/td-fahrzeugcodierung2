/**
 * Erster TD-PDF-Artikel. Ungeprüfte Referenz-PDFs sind standardmäßig nicht verkäuflich.
 * Preise sind ausschließlich serverseitig festgelegt, nicht vom Browser vorgegeben.
 */
export const GOLF7_VZE = Object.freeze({
  id: "golf7-vze",
  sku: "TD-G7-AS-003",
  title: "Verkehrszeichenerkennung (VZE / Sign Assist)",
  model: "VW Golf 7 / 7.5 (5G / AU)",
  revision: "1.2",
  expectedSha256: "c02f065f4d80414b7a7cedc7c01d291c94488ad0e08a380a9d0ef903772dc805",
  priceCents: 1399,
  currency: "EUR",
  pages: 3,
  technicalStatus: "Prüfentwurf: fahrzeugspezifische Validierung ausstehend",
});

type ShopEnv = Record<string, string | undefined>;
export type ShopMode = "off" | "sandbox" | "live";

/** Ohne explizite Freigaben niemals einen Live-Kauf ermöglichen. */
export function resolveShopMode(env: ShopEnv): ShopMode {
  const credentialsReady = !!env.PAYPAL_CLIENT_ID && !!env.PAYPAL_CLIENT_SECRET && !!env.PAYPAL_WEBHOOK_ID;
  if (!credentialsReady) return "off";
  if (env.TD_GUIDE_SHOP_MODE === "sandbox" && env.PAYPAL_ENV === "sandbox") return "sandbox";
  if (env.TD_GUIDE_SHOP_MODE === "live" &&
      env.PAYPAL_ENV === "live" &&
      !!env.PAYPAL_WEBHOOK_ID &&
      env.TD_G7_VZE_TECH_APPROVED === "true" &&
      env.TD_GUIDE_LEGAL_APPROVED === "true" &&
      env.TD_GUIDE_CONFIRMATION_EMAIL_READY === "true") return "live";
  return "off";
}

/** Vercel-Preview ist die einzige zulässige Sandbox-Rückleitungsadresse. */
export function guideShopReturnOrigin(env: ShopEnv): string {
  if (resolveShopMode(env) !== "sandbox") return "https://td-fahrzeugcodierung.de";
  const raw = env.TD_GUIDE_SHOP_RETURN_ORIGIN;
  if (!raw) throw new Error("Sandbox-Rückleitungsadresse nicht konfiguriert.");
  const url = new URL(raw);
  if (url.protocol !== "https:" ||
      !url.hostname.endsWith(".vercel.app") ||
      url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Sandbox-Rückleitungsadresse muss eine HTTPS-Vercel-Preview-Domain sein.");
  }
  return url.origin;
}

/** Erforderlich, bevor ein PayPal-Capture zu einem Downloadanspruch wird. */
export function validateCompletedCapture(
  body: unknown,
  expectedLocalId: string,
  expectedPaypalId: string,
): { captureId: string } | null {
  if (!body || typeof body !== "object") return null;
  const response = body as {
    id?: string;
    status?: string;
    purchase_units?: Array<{
      reference_id?: string; custom_id?: string;
      payments?: { captures?: Array<{
        id?: string; status?: string;
        amount?: { currency_code?: string; value?: string }
      }> }
    }>
  };
  if (response.id !== expectedPaypalId || response.status !== "COMPLETED") return null;
  const units = response.purchase_units ?? [];
  if (units.length !== 1 || units[0].reference_id !== GOLF7_VZE.id ||
      units[0].custom_id !== expectedLocalId) return null;
  const captures = units[0].payments?.captures ?? [];
  if (captures.length !== 1) return null;
  const cap = captures[0];
  if (!cap.id || !/^[A-Z0-9-]{6,64}$/i.test(cap.id) || cap.status !== "COMPLETED" ||
      cap.amount?.currency_code !== GOLF7_VZE.currency ||
      cap.amount?.value !== (GOLF7_VZE.priceCents / 100).toFixed(2)) return null;
  return { captureId: cap.id };
}
