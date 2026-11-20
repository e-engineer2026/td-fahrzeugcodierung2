import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "private, no-store" };
const transactionPattern = /^[A-Z0-9]{17}$/;
const referencePattern = /^TDG7-[A-F0-9]{8}$/;

type Input = {
  orderReference?: unknown;
  paypalTransactionId?: unknown;
  gmailMessageId?: unknown;
  amountCents?: unknown;
  currency?: unknown;
  receivedAt?: unknown;
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

/**
 * The caller is a dedicated Google Apps Script in the receiving Gmail account.
 * It verifies PayPal DKIM/DMARC, an exact 13.99 EUR received-amount receipt and
 * one TDG7 order reference before HMAC signing. There is intentionally NO
 * PayPal Live API dependency. This is weaker than PayPal-side verification:
 * an email is evidence of a receipt, not a reliable refund/chargeback status.
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
  const received = typeof input.receivedAt === "string" ? new Date(input.receivedAt) : new Date(NaN);
  if (process.env.VERCEL_ENV !== "production" ||
      process.env.TD_PAYPALME_EMAIL_AUTO_RELEASE !== "enabled")
    return reply({ error: "E-Mail-Freigabe noch nicht aktiviert." }, 503);
  if (!referencePattern.test(reference) || !transactionPattern.test(transaction) ||
      !/^[a-z0-9]{8,64}$/i.test(gmailId) ||
      input.amountCents !== GOLF7_VZE.priceCents || input.currency !== GOLF7_VZE.currency ||
      Number.isNaN(received.getTime()) || received.getTime() > Date.now() + 5 * 60 * 1000 ||
      received.getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000)
    return reply({ error: "Zahlungs-E-Mail unvollständig oder zu alt." }, 400);

  try {
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
    // Do not attach old receipt emails to newer account orders.
    const created = new Date(String(order.created_at)).getTime();
    const paid = received.getTime();
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
    // Never echo secrets, Gmail contents or transaction data.
    return reply({ error: "Freigabe momentan nicht möglich." }, 503);
  }
}
