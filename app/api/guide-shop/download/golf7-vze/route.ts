import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Anmeldung erforderlich." }, { status: 401, headers });
  try {
    const sql = await ensureGuideShopSchema();
    const [paid] = await sql`SELECT id FROM td_guide_orders
      WHERE clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id}
      AND status='paid' LIMIT 1`;
    if (!paid) return NextResponse.json({ error: "Kein gültiger Kauf für dieses Konto." }, { status: 403, headers });
    const [doc] = await sql`SELECT encode(file_data,'base64') AS data
      FROM td_guide_documents WHERE product_id=${GOLF7_VZE.id}`;
    if (!doc || typeof doc.data !== "string")
      return NextResponse.json({ error: "Dokument nicht bereitgestellt." }, { status: 503, headers });
    const pdf = Buffer.from(doc.data as string, "base64");
    if (pdf.length < 100 || pdf.subarray(0,5).toString("ascii") !== "%PDF-")
      return NextResponse.json({ error: "Dokumentdaten ungültig." }, { status: 503, headers });
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: { ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=TD_Golf7_03_Verkehrszeichenerkennung.pdf",
        "Content-Length": String(pdf.length),
      }
    });
  } catch {
    return NextResponse.json({ error: "Download konnte nicht ausgeliefert werden." }, { status: 500, headers });
  }
}
