import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import Golf7VzeCheckout from "../../components/Golf7VzeCheckout";
import AccountPaypalGuideCheckout from "../../components/AccountPaypalGuideCheckout";
import { auth } from "@clerk/nextjs/server";
import { GOLF7_VZE } from "../../lib/guideShopShared";
import { ensureGuideShopSchema } from "../../lib/guideShopDb";
import { configuredShopMode } from "../../lib/guidePaypal";
import { readGuidePdf } from "../../lib/guideDocuments";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Golf 7 Verkehrszeichenerkennung · PDF-Dokument | TD Fahrzeugcodierung",
  description: "Technische Prüfunterlagen für Verkehrszeichenerkennung (VZE) am VW Golf 7 / 7.5.",
  robots: { index: false, follow: true },
};
export default async function Golf7VzePage() {
  const mode = configuredShopMode();
  const { userId } = await auth();
  let available = false;
  try {
    const sql = await ensureGuideShopSchema();
    available = !!(await readGuidePdf(sql, GOLF7_VZE.id, GOLF7_VZE.expectedSha256,
      "TD_Golf7_03_Verkehrszeichenerkennung.pdf"));
  } catch { /* Bei fehlender Statusprüfung keine Zahlung anbieten. */ }
  if (!available) notFound();
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="container-x max-w-4xl py-8 sm:py-12">
        <Link href="/codieranleitungen" className="text-sm font-bold text-blue-700 hover:underline">
          ← Zurück zu PDF-Anleitungen
        </Link>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">
            VW Golf 7 / Assistenzsysteme / {GOLF7_VZE.sku}
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">{GOLF7_VZE.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Professionelle PDF-Dokumentation für
            Golf 7 / 7.5 (5G / AU), mit Steuergeräteübersicht, Voraussetzungen,
            Codierwegen, Rücksicherung und Werkstattprotokoll.</p>

          <div className="mt-5 grid gap-3 border-y border-slate-100 py-4 sm:grid-cols-3">
            <div><span className="block text-xs text-slate-500">PDF-Dokument</span>
              <strong className="text-2xl text-blue-700">13,99 €</strong></div>
            <div><span className="block text-xs text-slate-500">Umfang / Revision</span>
              <strong className="text-sm">{GOLF7_VZE.pages} Seiten · Rev. {GOLF7_VZE.revision}</strong></div>
            <div><span className="block text-xs text-slate-500">Interface</span>
              <strong className="text-sm">VCDS / VCP (Codierung)</strong></div>
          </div>
          <section className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
            <h2 className="text-lg font-bold text-slate-900">Inhalt der PDF-Anleitung</h2>
            <p><FileCheck2 size={16} className="mr-2 inline text-blue-700" aria-hidden="true" />
              A5-Frontkamera, STG 17 und 5F: variantenspezifische Codierung und Anpassung</p>
            <p><FileCheck2 size={16} className="mr-2 inline text-blue-700" aria-hidden="true" />
              Voraussetzungen: Kamera, Navigationssystem, Softwarestand und ggf. FEC-/SWaP-Freigabe</p>
            <p><FileCheck2 size={16} className="mr-2 inline text-blue-700" aria-hidden="true" />
              Sicherheitskontrollen, Backup, Funktionsprüfung, Rückbau und Dokumentationsprotokoll</p>
          </section>

          <div className="mt-6">{mode === "off"
            ? <AccountPaypalGuideCheckout signedIn={!!userId} />
            : <Golf7VzeCheckout mode={mode} />}</div>
          {mode === "off" ? null : <p className="mt-4 text-xs leading-5 text-slate-500">
            Zahlungen ausschließlich über den technisch freigegebenen PayPal-Checkout.
            PDF-Downloads werden erst nach einer serverseitig verifizierten Bezahlung
            für die zugeordnete Gastbestellung bereitgestellt. Eine Registrierung ist nicht nötig.
          </p>}
        </div>
      </div>
    </main>
  );
}
