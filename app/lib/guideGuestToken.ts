import { createHash, randomBytes } from "node:crypto";

/** 256 Bit entropy, never placed into a URL and never stored in plaintext. */
export function newGuestToken(): string {
  return randomBytes(32).toString("hex");
}

/** Only the SHA256 digest is persisted alongside the order. */
export function hashGuestToken(token: string): string | null {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return createHash("sha256").update(token, "utf8").digest("hex");
}
