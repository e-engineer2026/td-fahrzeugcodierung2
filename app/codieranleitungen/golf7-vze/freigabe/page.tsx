import type { Metadata } from "next";
import Link from "next/link";
import ManualPdfActivation from "../../../components/ManualPdfActivation";

export const metadata: Metadata = {
  title: "Persoenliche PDF-Freigabe | TD Fahrzeugcodierung",
  robots: { index: false, follow: false, noarchive: true },
};
export default function ManualPdfReleasePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="container-x max-w-2xl py-10 sm:py-14">
        <Link href="/codieranleitungen/golf7-vze"
          className="text-sm font-semibold text-blue-700 hover:underline">
          ← Zurück zur PDF-Anleitung
        </Link>
        <ManualPdfActivation />
      </div>
    </main>
  );
}
