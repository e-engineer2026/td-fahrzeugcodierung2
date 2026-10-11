import { clerkMiddleware } from "@clerk/nextjs/server";

// The marketing pages, robots.txt, and sitemap.xml are public. Keep Clerk's
// request middleware on account and API routes only so crawlers can fetch the
// public site even if the Clerk browser handshake is unavailable.
export default clerkMiddleware();

export const config = {
  matcher: ["/konto(.*)", "/api(.*)", "/trpc(.*)"],
};
