"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { UserRound } from "lucide-react";

// Keep the public header independent of server-side authentication so that
// marketing pages can render without Clerk middleware or a session handshake.
export default function AccountMenu() {
  const { isSignedIn } = useUser();

  return (
    <div className="td-account">
      {isSignedIn ? (
        <>
          <Link href="/konto">Mein Konto</Link>
          <UserButton />
        </>
      ) : (
        <Link href="/sign-in?redirect_url=%2Fkonto">
          <UserRound aria-hidden="true" />Anmelden
        </Link>
      )}
    </div>
  );
}
