import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";

/** PDF-Verwaltung nur für ausdrücklich eingetragene, verifizierte Clerk-Konten. */
export async function isGuideAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const allow = new Set((process.env.TD_GUIDE_ADMIN_EMAILS ?? "")
    .split(",").map(v => v.trim().toLocaleLowerCase("de")).filter(Boolean));
  if (!allow.size) return false;
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses.some(address =>
      address.verification?.status === "verified" &&
      allow.has(address.emailAddress.trim().toLocaleLowerCase("de"))
    );
  } catch {
    return false;
  }
}
