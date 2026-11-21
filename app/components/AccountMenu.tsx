import Link from "next/link";
import { UserRound } from "lucide-react";

// Public pages do not run Clerk middleware. Keep this navigation component
// independent of server authentication; /konto handles signed-out visitors.
export default function AccountMenu() {
  return (
    <Link href="/konto" className="td-header-icon td-account" aria-label="Mein Konto und Anmeldung" title="Mein Konto">
      <UserRound aria-hidden="true" />
    </Link>
  );
}
