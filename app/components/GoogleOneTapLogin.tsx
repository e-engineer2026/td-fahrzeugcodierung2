"use client";

import { GoogleOneTap } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

// Google One Tap requires a configured Google OAuth connection with custom
// credentials in the production Clerk instance. Render this only when enabled
// explicitly by NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=true.
export function GoogleOneTapLogin() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("redirect_url");
  const redirectUrl =
    requested?.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\")
      ? requested
      : "/konto";

  return (
    <GoogleOneTap
      signInForceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    />
  );
}
