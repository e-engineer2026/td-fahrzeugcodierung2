import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { guestTokenHashFromCookie } from "../../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
/** Speicherkopie für Gastkäufer. Eine rechtskonforme Kaufbestätigung per E-Mail
 * muss vor der Live-Freigabe gesondert eingerichtet und geprüft werden. */
export async function GET() {
  const guestHash = await guestTokenHashFromCookie();
  if (!guestHash) return NextResponse.json({ error: "Kein Gastkauf vorhanden." },
    { status: 403, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [order] = await sql`SELECT id, paid_at, amount_cents, currency, paypal_order_id,
      immediate_delivery_consent, withdrawal_acknowledged, terms_accepted
      FROM td_guide_guest_orders WHERE guest_token_hash=${guestHash}
        AND product_id=${GOLF7_VZE.id} AND status='paid'
        AND paid_at > now() - interval '30 days' LIMIT 1`;
    if (!order) return NextResponse.json({ error: "Keine bezahlte Bestellung vorhanden." },
      { status: 403, headers });
    const content = [
      "TD Fahrzeugcodierung - Bestellbestaetigung fuer Gastkaeufer",
      "Bestellnummer: " + order.id,
      "Zahlungsdatum: " + new Date(String(order.paid_at)).toLocaleString("de-DE",
        { timeZone:"Europe/Berlin" }),
      "Artikel: " + GOLF7_VZE.sku + " - " + GOLF7_VZE.title,
      "Preis: " + (Number(order.amount_cents) / 100).toFixed(2) + " " + order.currency,
      "PayPal-Referenz: " + order.paypal_order_id,
      "AGB/Widerruf bestaetigt: " + order.terms_accepted,
      "Sofortige Bereitstellung verlangt: " + order.immediate_delivery_consent,
      "Kenntnis bzgl. Widerrufsrecht bestaetigt: " + order.withdrawal_acknowledged,
      "Kontakt: info@td-fahrzeugcodierung.de",
      "AGB: https://td-fahrzeugcodierung.de/agb",
      "Widerruf: https://td-fahrzeugcodierung.de/widerruf",
      "Dies ist eine Bestellbestaetigung, keine steuerliche Rechnung.",
    ].join("\r\n");
    return new Response(content, { headers: { ...headers,
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=TD_Golf7_VZE_Gastbestellung.txt",
    } });
  } catch {
    return NextResponse.json({ error: "Bestellbestätigung nicht erreichbar." },
      { status: 500, headers });
  }
}
