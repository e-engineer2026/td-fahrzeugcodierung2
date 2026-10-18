import { clerkMiddleware } from "@clerk/nextjs/server";

// Only account-related routes need server-side authentication. Public pages,
// sitemaps, assets and webhooks must not enter Clerk's session handshake.
// Account API handlers still verify auth() before accessing any user data.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/konto/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/api/account/:path*",
    "/api/saved-vehicles/:path*",
  ],
};
