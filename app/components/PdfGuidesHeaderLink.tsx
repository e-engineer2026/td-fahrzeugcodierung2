import Link from "next/link";
import { LockKeyhole } from "lucide-react";

/** Public catalog entry point. The paid PDF files will never live under /public. */
export default function PdfGuidesHeaderLink() {
  return (
    <Link
      href="/codieranleitungen"
      className="td-header-icon td-guides-shortcut"
      aria-label="Geschützter Bereich: VCDS- und VCP-Codieranleitungen als PDF"
      title="PDF-Codieranleitungen"
    >
      <LockKeyhole aria-hidden="true" />
    </Link>
  );
}
