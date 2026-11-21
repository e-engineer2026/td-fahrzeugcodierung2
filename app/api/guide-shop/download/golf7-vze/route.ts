import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GOLF7_VZE } from "../../../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../../../lib/guideShopDb";
import { guestTokenHashFromCookie } from "../../../../lib/guideGuest";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const sql = await ensureGuideShopSchema();
    const hash = await guestTokenHashFromCookie();
    let permitted = false;
    if (hash) {
      // Kein Login nötig. Bezahlte Bestellung UND derselbe geheime Browser-Cookie
      // sind gemeinsam die Berechtigung. Nach 30 Tagen verfällt der Gastzugang.
      const [guestPaid] = await sql`SELECT id FROM td_guide_guest_orders
        WHERE guest_token_hash=${hash} AND product_id=${GOLF7_VZE.id}
        AND status='paid' AND paid_at > now() - interval '30 days' LIMIT 1`;
      permitted = !!guestPaid;
    }
    // Bestandsschutz für vorherige Käufe über ein Clerk-Kundenkonto.
    if (!permitted) {
      const { userId } = await auth();
      if (userId) {
        const [accountPaid] = await sql`SELECT id FROM td_guide_orders WHERE
          clerk_user_id=${userId} AND product_id=${GOLF7_VZE.id}
          AND status='paid' LIMIT 1`;
        permitted = !!accountPaid;
      }
    }
    if (!permitted) return url.searchParams.get("liste") === "1"
      ? NextResponse.redirect(new URL("/codieranleitungen/golf7-vze", url), { headers })
      : NextResponse.json({ error: "Kein bezahlter Downloadanspruch für diesen Browser." },
      { status: 403, headers });
    const [file] = await sql`SELECT encode(file_data,'base64') AS data FROM td_guide_documents
      WHERE product_id=${GOLF7_VZE.id} AND sha256=${GOLF7_VZE.expectedSha256}`;
    if (!file || typeof file.data !== "string") return NextResponse.json({
      error: "PDF-Dokument nicht bereitgestellt."
    }, { status: 503, headers });
    const pdf = Buffer.from(file.data as string, "base64");
    if (pdf.length < 100 || pdf.subarray(0, 5).toString("ascii") !== "%PDF-")
      return NextResponse.json({ error: "Ungültige PDF-Daten." }, { status: 503, headers });
    return new Response(new Uint8Array(pdf), {
      status: 200, headers: { ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=TD_Golf7_03_Verkehrszeichenerkennung.pdf",
        "Content-Length": String(pdf.length),
      }
    });
  } catch {
    return NextResponse.json({ error: "Download derzeit nicht erreichbar." },
      { status: 500, headers });
  }
}
