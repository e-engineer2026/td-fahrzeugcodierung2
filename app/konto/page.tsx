import type { Metadata } from "next";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import SavedVehiclesAccount from "../components/SavedVehiclesAccount";
import GuidePurchasesPanel from "../components/GuidePurchasesPanel";
import ServiceOrdersPanel from "../components/ServiceOrdersPanel";
import { isGuideAdmin } from "../lib/guideAdmin";

export const metadata: Metadata = {
  title: { absolute: "Mein Konto | TD Fahrzeugcodierung" },
  alternates: { canonical: "/konto" },
  robots: { index: false, follow: false },
};

export default async function AccountPage({ searchParams }: {
  searchParams: Promise<{ auftrag?: string }>;
}) {
  const params = await searchParams;
  const selection = typeof params.auftrag === "string" && params.auftrag.length <= 4000 ? params.auftrag : "";
  const returnPath = "/konto" + (selection ? "?auftrag=" + encodeURIComponent(selection) : "");
  const signInUrl = "/sign-in?redirect_url=" + encodeURIComponent(returnPath);
  const canManagePdfs = await isGuideAdmin();
  return <main className="container-x min-h-[70vh] py-8 sm:py-12">
    <Link href="/" className="text-sm font-bold text-blue-700">← Zur Website</Link>
    <h1 className="mt-4 text-3xl font-black">Mein Konto</h1>
    <p className="mt-2 text-slate-600">Hier findest du deine gespeicherten Fahrzeuge und freigegebenen PDF-Anleitungen.</p>
    <div className="mt-6"><Show when="signed-in"><SavedVehiclesAccount /><GuidePurchasesPanel /><ServiceOrdersPanel initialSelection={selection} />{canManagePdfs && <Link href="/konto/auftraege" className="mt-5 mr-2 inline-flex min-h-11 items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-100">Interne Auftragsverwaltung</Link>}{canManagePdfs && <Link href="/konto/pdf-verwaltung" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-100">Interne PDF-Verwaltung</Link>}</Show><Show when="signed-out"><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold">Bitte melde dich an, um deine gespeicherten Fahrzeuge aufzurufen.</p><Link href={signInUrl} className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-3 font-bold text-white">Anmelden</Link></div></Show></div>
  </main>;
}
