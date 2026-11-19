import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "private, no-store" };
const transactionPattern = /^[A-Z0-9]{17}$/;
const referencePattern = /^TDG7-[A-F0-9]{8}$/;

type Input = { orderReference?: unknown; paypalTransactionId?: unknown; gmailMessageId?: unknown };
type PayPalTransaction = {
  transaction_info?: {
    transaction_id?: string;
    transaction_status?: string;
    transaction_event_code?: string;
    transaction_amount?: { value?: string; currency_code?: string };
    transaction_initiation_date?: string;
  };
};

function reply(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status, headers: noStore });
}

/** Authenticate a private Apps Script caller; neither Gmail sender nor browser cookies are trusted. */
function authentic(request: Request, raw: string): boolean {
  const secret = process.env.TD_PAYPALME_GMAIL_SECRET;
  const timestamp = request.headers.get("x-td-timestamp");
  const signature = request.headers.get("x-td-signature");
  if (!secret || secret.length < 32 || !timestamp || !/^\d{10}$/.test(timestamp) ||
      Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300 ||
      !signature || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(timestamp + "." + raw, "utf8").digest();
  const supplied = Buffer.from(signature.slice(7), "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function confirmedPayPalMePayment(transactionId: string): Promise<{
  valid: boolean; date?: Date; reason?: string;
}> {
  // PayPal.Me is NOT changed to a PayPal Checkout. Reporting API is only a
  // second, independent verification of money received by this PayPal account.
  if (process.env.VERCEL_ENV !== "production" || process.env.PAYPAL_ENV !== "live")
    throw new Error("PayPal-Live-Abgleich nicht konfiguriert");
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal-Live-Zugang fehlt");

  const authResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(id + ":" + secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store", signal: AbortSignal.timeout(12000),
  });
  if (!authResponse.ok) throw new Error("PayPal-OAuth nicht verfügbar");
  const auth = await authResponse.json() as { access_token?: string };
  if (!auth.access_token) throw new Error("PayPal-Token fehlt");

  const end = new Date();
  const start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
  const query = new URLSearchParams({
    start_date: start.toISOString(), end_date: end.toISOString(),
    transaction_id: transactionId, fields: "all", page_size: "20",
  });
  const response = await fetch("https://api-m.paypal.com/v1/reporting/transactions?" + query, {
    headers: { Authorization: "Bearer " + auth.access_token, Accept: "application/json" },
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("PayPal-Transaktionsabgleich nicht verfügbar");
  const result = await response.json() as { transaction_details?: PayPalTransaction[] };
  const matches = (result.transaction_details ?? []).map(row => row.transaction_info)
    .filter(info => info?.transaction_id === transactionId);
  if (matches.length !== 1) return { valid: false, reason: "payment_not_yet_found" };
  const info = matches[0]!;
  const amount = Number(info.transaction_amount?.value);
  const date = info.transaction_initiation_date ? new Date(info.transaction_initiation_date) : null;
  const incoming = info.transaction_event_code === "T0000" || info.transaction_event_code === "T0011";
  if (info.transaction_status !== "S" || !incoming || !Number.isFinite(amount) ||
      Math.round(amount * 100) !== GOLF7_VZE.priceCents ||
      info.transaction_amount?.currency_code !== GOLF7_VZE.currency ||
      !date || Number.isNaN(date.getTime()) || date > new Date()) {
    return { valid: false, reason: "payment_not_completed_or_amount_wrong" };
  }
  return { valid: true, date };
}

/**
 * Apps Script signs the extracted Gmail order reference and PayPal transaction
 * identifier. This endpoint independently verifies money received, exact
 * product/amount and the unique open Clerk order before granting the PDF.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 2048) return reply({ error: "Ungültige Länge." }, 413);
  if (!authentic(request, raw)) return reply({ error: "Nicht autorisiert." }, 401);
  let input: Input;
  try { input = JSON.parse(raw) as Input; }
  catch { return reply({ error: "Ungültige Daten." }, 400); }
  const reference = typeof input.orderReference === "string" ? input.orderReference.trim().toUpperCase() : "";
  const transaction = typeof input.paypalTransactionId === "string" ?
    input.paypalTransactionId.trim().toUpperCase() : "";
  const gmailId = typeof input.gmailMessageId === "string" ? input.gmailMessageId : "";
  if (!referencePattern.test(reference) || !transactionPattern.test(transaction) ||
      !/^[a-z0-9]{8,64}$/i.test(gmailId)) return reply({ error: "Referenz ungültig." }, 400);

  try {
    const payment = await confirmedPayPalMePayment(transaction);
    if (!payment.valid) return reply({ error: payment.reason ?? "payment_unverified" }, 503);

    const sql = await ensureGuideShopSchema();
    const orderPrefix = reference.slice(5).toLowerCase();
    const orders = await sql`SELECT id, created_at, status, paypal_transaction_id
      FROM td_guide_orders WHERE left(id::text, 8)=${orderPrefix}
        AND product_id=${GOLF7_VZE.id} LIMIT 2`;
    if (orders.length !== 1) return reply({ error: "Bestellnummer nicht eindeutig." }, 409);
    const order = orders[0];
    if (order.status === "paid" && order.paypal_transaction_id === transaction)
      return reply({ released: true, alreadyReleased: true });
    if (order.status !== "pending")
      return reply({ error: "Bestellung nicht offen." }, 409);
    // Avoid pairing a new order with an unrelated older transaction.
    const created = new Date(String(order.created_at)).getTime();
    const paid = payment.date!.getTime();
    if (paid < created - 60 * 60 * 1000 || paid > created + 30 * 24 * 60 * 60 * 1000)
      return reply({ error: "Zahlung zeitlich nicht zuzuordnen." }, 409);

    const [document] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND sha256=${GOLF7_VZE.expectedSha256}`;
    if (!document) return reply({ error: "Dokument nicht verfügbar." }, 503);

    const [result] = await sql`UPDATE td_guide_orders AS o
      SET status='paid', paid_at=now(), paypal_transaction_id=${transaction}
      WHERE o.id=${String(order.id)}::uuid AND o.status='pending'
        AND o.product_id=${GOLF7_VZE.id}
        AND o.amount_cents=${GOLF7_VZE.priceCents}
        AND o.currency=${GOLF7_VZE.currency}
        AND o.buyer_email IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM td_guide_manual_grants
          WHERE paypal_transaction_id=${transaction})
      RETURNING id`;
    if (!result) return reply({ error: "Freigabe bereits vergeben oder Bestellung verändert." }, 409);
    return reply({ released: true });
  } catch (error) {
    const detail = String(error);
    if (/unique constraint|duplicate key|23505/i.test(detail))
      return reply({ error: "PayPal-Transaktion bereits verwendet." }, 409);
    // Never echo tokens, secrets, internal URLs or transaction data.
    return reply({ error: "PayPal-Prüfung oder Freigabe momentan nicht möglich." }, 503);
  }
}
