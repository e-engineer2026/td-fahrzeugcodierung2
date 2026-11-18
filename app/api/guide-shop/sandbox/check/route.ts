import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { configuredShopMode, testPaypalSandboxConnection } from "../../../../lib/guidePaypal";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Diagnose-Status für Vercel-Preview. Kein Checkout, kein Zahlungsversuch. */
export async function GET() {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Nicht vorhanden." }, { status: 404, headers });
  }
  if (configuredShopMode() !== "sandbox") {
    return NextResponse.json({ mode: "off", paypalAuthVerified: false,
      pdfStored: false, readyForSandboxCheckout: false }, { status: 503, headers });
  }
  const paypal = await testPaypalSandboxConnection();
  const paypalAuthVerified = paypal.ok;
  let pdfStored = false, storageReachable = false;
  try {
    const sql = await ensureGuideShopSchema();
    storageReachable = true;
    const [file] = await sql`SELECT product_id FROM td_guide_documents
      WHERE product_id = ${GOLF7_VZE.id} AND version = ${GOLF7_VZE.revision}
        AND sha256 = ${GOLF7_VZE.expectedSha256} LIMIT 1`;
    pdfStored = !!file;
  } catch { /* Diagnose lässt Fehler nicht nach außen durchreichen. */ }
  return NextResponse.json({
    environment: "sandbox",
    paypalAuthVerified,
    paypalHttpStatus: paypal.httpStatus,
    paypalDiagnostic: paypal.diagnostic,
    storageReachable,
    pdfStored,
    documentRevision: GOLF7_VZE.revision,
    readyForSandboxCheckout: paypalAuthVerified && pdfStored,
    realPaymentEnabled: false,
  }, { status: paypalAuthVerified && storageReachable ? 200 : 503, headers });
}
