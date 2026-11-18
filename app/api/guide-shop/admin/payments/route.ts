import { NextResponse } from "next/server";
import { isGuideAdmin } from "../../../../lib/guideAdmin";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { listGuidePayments, ReportingError } from "../../../../lib/guidePaypalReporting";

export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" };
  if (!await isGuideAdmin()) return NextResponse.json({ error: "Keine Administratorberechtigung." }, { status: 403, headers });
  if (process.env.VERCEL_ENV !== "production") return NextResponse.json({ error: "Nur in Produktion verfügbar." }, { status: 403, headers });
  try {
    const [payments, sql] = await Promise.all([listGuidePayments(), ensureGuideShopSchema()]);
    const rows = await sql`SELECT paypal_transaction_id FROM td_guide_manual_grants
      WHERE created_at > now() - interval '45 days'`;
    const released = new Set(rows.map(row => String(row.paypal_transaction_id)));
    return NextResponse.json({ payments: payments.map(payment => ({ ...payment,
      released: released.has(payment.id) })) }, { headers });
  } catch (error) {
    const code = error instanceof ReportingError ? error.code : "reporting_unavailable";
    return NextResponse.json({ error: code }, { status: 503, headers });
  }
}
