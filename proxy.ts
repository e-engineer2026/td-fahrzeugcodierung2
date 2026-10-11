import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware must run on public pages too because shared UI components
// such as Clerk's <Show> call auth() while rendering. Public routes remain
// public: this middleware does not protect routes unless auth.protect() is used.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Match application routes while skipping Next.js internals and static assets.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API and tRPC routes.
    "/(api|trpc)(.*)",
  ],
};
