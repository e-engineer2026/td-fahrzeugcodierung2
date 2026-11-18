import type { Metadata } from "next";
import Link from "next/link";
import { isGuideAdmin } from "../../lib/guideAdmin";
import GuideAdminPdfUpload from "../../components/GuideAdminPdfUpload";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Interne PDF-Verwaltung | TD Fahrzeugcodierung",
  robots: { index: false, follow: false, noarchive: true } };
export default async function GuideAdminPage() {
  const admin = await isGuideAdmin();
  return <main className="container-x min-h-[70vh] max-w-3xl py-10">
    <Link href="/konto" className="text-sm font-bold text-blue-700 hover:underline">← Zurück zum Kundenkonto</Link>
    <h1 className="mt-5 text-2xl font-black">Interne PDF-Verwaltung</h1>
    {admin ? <GuideAdminPdfUpload /> :
      <p className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        Für die PDF-Verwaltung ist ein ausdrücklich freigegebenes, verifiziertes Administratorkonto erforderlich.
      </p>}
  </main>;
}
