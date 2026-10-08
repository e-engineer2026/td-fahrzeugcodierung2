import { clerkMiddleware } from "@clerk/nextjs/server";

// Keep crawler endpoints independent of Clerk's authentication handshake.
// Public marketing pages remain accessible; protected API routes still use Clerk.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|robots\\.txt$|sitemap\\.xml$|google[a-zA-Z0-9_-]+\\.html$|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
