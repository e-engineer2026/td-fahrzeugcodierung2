import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { begin, finish, guideBySku, pdfBytes, purchase } from "../../../lib/guideSales";

export const runtime = "nodejs";
const plain = (message: string, status: number) => new Response(message, { status, headers: { "Cache-Control": "private, no-store" } });

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return plain("Unzulässiger Ursprung.", 403);
  const { userId } = await auth();
  if (!userId) return plain("Bitte erneut anmelden.", 401);
  const form = await request.formData();
  const token = String(form.get("token") ?? "");
  const receipt = new URL("/konto/anleitungen", url);
  try {
    if (token) {
      receipt.searchParams.set("token", token);
      await finish(userId, token);
      return NextResponse.redirect(receipt, 303);
    }
    const guide = guideBySku(String(form.get("sku")));
    const attempt = String(form.get("attempt"));
    if (!guide || !/^[0-9a-f-]{36}$/.test(attempt)) return plain("Ungültige Bestellung.", 400);
    receipt.searchParams.set("sku", guide.sku);
    const target = await begin(userId, guide, url.origin, attempt);
    return NextResponse.redirect(target, 303);
  } catch {
    receipt.searchParams.set("error", "1");
    return NextResponse.redirect(receipt, 303);
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return plain("Bitte anmelden.", 401);
  const params = new URL(request.url).searchParams;
  try {
    const order = await purchase(userId, params.get("token") ?? "");
    if (!order.paid) return plain("Die Zahlung ist noch nicht abgeschlossen.", 403);
    const sku = params.get("file") === "uebersicht" ? "uebersicht" : order.guide.sku;
    const data = await pdfBytes(sku);
    return new Response(new Uint8Array(data), { headers: { "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="TD-Audi-A4-8W-' + sku + '.pdf"',
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return plain("Der Download konnte nicht freigegeben werden.", 403); }
}
