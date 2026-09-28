import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Ungültige Webhook-Signatur." }, { status: 400 });
  }

  if (event.type !== "user.deleted") return NextResponse.json({ received: true });
  const userId = event.data.id;
  if (!userId) return NextResponse.json({ error: "Clerk User-ID fehlt." }, { status: 400 });

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
    const sql = neon(databaseUrl);
    await sql`DELETE FROM saved_vehicles WHERE clerk_user_id = ${userId}`;
    return NextResponse.json({ received: true });
  } catch {
    // A 5xx response lets Clerk retry the event.
    return NextResponse.json({ error: "Verknüpfte Daten konnten nicht gelöscht werden." }, { status: 500 });
  }
}
