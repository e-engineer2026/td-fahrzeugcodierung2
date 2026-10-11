import { clerkMiddleware } from "@clerk/nextjs/server";

// Public marketing pages, robots.txt, and sitemap.xml should stay directly
// crawlable. Run Clerk only on account, authentication, and API routes.
export default clerkMiddleware();

export const config = {
  matcher: ["/konto(.*)", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)", "/trpc(.*)"],
};
