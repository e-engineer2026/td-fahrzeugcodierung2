import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { UserRound } from "lucide-react";

export default function AccountMenu() {
  return (
    <>
      <Show when="signed-in">
        <Link href="/konto" className="td-header-icon td-account" aria-label="Mein Konto" title="Mein Konto">
          <UserRound aria-hidden="true" />
        </Link>
      </Show>
      <Show when="signed-out">
        <Link href="/sign-in?redirect_url=%2Fkonto" className="td-header-icon td-account" aria-label="Anmelden" title="Anmelden">
          <UserRound aria-hidden="true" />
        </Link>
      </Show>
    </>
  );
}
