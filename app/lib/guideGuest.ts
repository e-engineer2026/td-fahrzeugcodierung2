import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const GUEST_COOKIE_NAME = "td_g7_vze_guest";
export const GUEST_ACCESS_DAYS = 30;
const maxAge = GUEST_ACCESS_DAYS * 24 * 60 * 60;

export function newGuestToken() {
  return randomBytes(32).toString("hex");
}
export function hashGuestToken(token: string): string | null {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return createHash("sha256").update(token, "utf8").digest("hex");
}
export async function guestTokenHashFromCookie(): Promise<string | null> {
  const jar = await cookies();
  return hashGuestToken(jar.get(GUEST_COOKIE_NAME)?.value ?? "");
}
export function setGuestCookie(reply: NextResponse, token: string): void {
  reply.cookies.set(GUEST_COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge,
  });
}
/** Pseudonymisierte Rate-Limit-Kennung; rohe IP wird nicht gespeichert. */
export function guestVisitorHash(request: Request): string | null {
  const address = request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = process.env.TD_GUIDE_STORAGE_KEY;
  if (!address || !key || key.length < 24) return null;
  return createHmac("sha256", key).update(address).digest("hex");
}
