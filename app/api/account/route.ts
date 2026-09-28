import { auth, clerkClient } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
    const sql = neon(databaseUrl);
    await sql`DELETE FROM saved_vehicles WHERE clerk_user_id = ${userId}`;

    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Konto konnte nicht vollständig gelöscht werden. Bitte kontaktiere uns." }, { status: 500 });
  }
}
