import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
export const runtime = "nodejs";
/** Speicherkopie für den Käufer. Ersetzt nicht die vorgeschriebene individuelle E-Mail-Kommunikation. */
export async function GET() {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [order] = await sql`SELECT id, paid_at, amount_cents, currency,
      terms_accepted, withdrawal_acknowledged, immediate_delivery_consent,
      paypal_order_id, paypal_transaction_id FROM td_guide_orders
      WHERE clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id} AND status='paid'
      ORDER BY paid_at DESC LIMIT 1`;
    if (!order) return NextResponse.json({ error: "Keine Bestellbestätigung vorhanden." },
      { status: 403, headers });
    const text = [
      "TD Fahrzeugcodierung - Bestellbestätigung (Speicherkopie)",
      "-------------------------------------------------------",
      "Bestellnummer: " + order.id,
      "Bestelldatum/Zahlung: " + new Date(String(order.paid_at)).toLocaleString("de-DE", {timeZone:"Europe/Berlin"}),
      "PayPal-Referenz: " + (order.paypal_order_id ?? order.paypal_transaction_id),
      "Produkt: " + GOLF7_VZE.title + " - Golf 7 / 7.5",
      "Artikelnummer: " + GOLF7_VZE.sku,
      "Digitales PDF-Dokument, Revision " + GOLF7_VZE.revision,
      "Preis: " + (Number(order.amount_cents) / 100).toFixed(2).replace(".", ",") + " EUR",
      "Gemäß § 19 UStG wird Umsatzsteuer nicht gesondert ausgewiesen.",
      "",
      "Bei Bestellung protokollierte Erklärungen:",
      "AGB/Widerrufshinweise bestätigt: " + String(order.terms_accepted),
      "Sofortige Bereitstellung verlangt: " + String(order.immediate_delivery_consent),
      "Kenntnis bzgl. Widerrufsrecht bestätigt: " + String(order.withdrawal_acknowledged),
      "",
      "Händler: TD Fahrzeugcodierung, Leipzig",
      "Kontakt: info@td-fahrzeugcodierung.de",
      "AGB: https://td-fahrzeugcodierung.de/agb",
      "Widerruf: https://td-fahrzeugcodierung.de/widerruf",
      "",
      "Diese Kopie ist keine steuerliche Rechnung.",
      "",
    ].join("\r\n");
    return new Response(text, {
      status: 200, headers: { ...headers, "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=TD_Golf7_VZE_Bestellbestaetigung.txt" }
    });
  } catch {
    return NextResponse.json({ error: "Bestellbestätigung nicht verfügbar." }, { status: 500, headers });
  }
}
