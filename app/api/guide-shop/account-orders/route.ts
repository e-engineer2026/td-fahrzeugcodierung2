import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { guideOrderProduct, orderReference, paypalMeUrl } from "../../../lib/vzeShopProducts";
import { findMqbGuideProduct } from "../../../lib/mqbGuideProducts";
import { readMqbGuideDocument } from "../../../lib/mqbGuideDocument";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store" };

/** Order belongs to authenticated Clerk user; not a PayPal payment confirmation. */
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte zuerst anmelden." }, { status: 401, headers });
  const product = guideOrderProduct(new URL(request.url).searchParams.get("productSlug"));
  if (!product) return NextResponse.json({ error: "Modell nicht gefunden." }, { status: 404, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [pending] = await sql`SELECT id FROM td_guide_orders
      WHERE clerk_user_id=${userId} AND product_id=${product.id} AND status='pending'
      ORDER BY created_at DESC LIMIT 1`;
    return NextResponse.json({ order: pending ? {
      orderId: pending.id, reference: orderReference(String(pending.id), product),
      paypalUrl: paypalMeUrl(product),
    } : null }, { headers });
  } catch { return NextResponse.json({ error: "Offene Bestellung konnte nicht geladen werden." }, { status: 500, headers }); }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Bitte zuerst anmelden." }, { status: 401, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Ungültige Herkunft." }, { status: 403, headers });
  let body: { termsAccepted?: boolean; productSlug?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400, headers }); }
  if (body.termsAccepted !== true)
    return NextResponse.json({ error: "Bitte AGB und Widerrufsbelehrung bestätigen." }, { status: 400, headers });
  const slug = typeof body.productSlug === "string" ? body.productSlug : undefined;
  const product = guideOrderProduct(slug);
  if (!product) return NextResponse.json({ error: "Modell nicht verfügbar." }, { status: 404, headers });
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(address => address.verification?.status === "verified")?.emailAddress;
    if (!email) return NextResponse.json({ error: "Verifizierte E-Mail-Adresse erforderlich." }, { status: 403, headers });
    const sql = await ensureGuideShopSchema();
    // Modellbestellungen benötigen eine verfügbare Shop-Datei.
    if (product.slug) {
      const mqb = findMqbGuideProduct(product.slug);
      const [document] = await sql`SELECT product_id FROM td_guide_documents
        WHERE product_id=${product.id} AND (sha256=${product.sha256} OR assigned_filename IS NOT NULL)`;
      if (!document && !(mqb && readMqbGuideDocument(mqb))) return NextResponse.json({ error: "Diese Fachanleitung ist noch nicht bereitgestellt. Noch keine Zahlung ausführen." },
        { status: 503, headers });
    }
    const [paid] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${product.id} AND status='paid' LIMIT 1`;
    if (paid) return NextResponse.json({ error: "Diese PDF ist bereits in deinem Konto freigeschaltet." }, { status: 409, headers });
    const [existing] = await sql`SELECT id FROM td_guide_orders WHERE clerk_user_id=${userId}
      AND product_id=${product.id} AND status='pending'
      ORDER BY created_at DESC LIMIT 1`;
    const [order] = existing ? [existing] : await sql`INSERT INTO td_guide_orders
      (clerk_user_id, buyer_email, product_id, amount_cents, currency, status,
       terms_accepted, immediate_delivery_consent, withdrawal_acknowledged)
      VALUES (${userId}, ${email.toLowerCase()}, ${product.id}, ${product.priceCents},
        'EUR', 'pending', true, false, false) RETURNING id`;
    return NextResponse.json({
      orderId: order.id, reference: orderReference(String(order.id), product),
      paypalUrl: paypalMeUrl(product),
    }, { status: existing ? 200 : 201, headers });
  } catch { return NextResponse.json({ error: "Bestellung konnte nicht vorbereitet werden." }, { status: 500, headers }); }
}
