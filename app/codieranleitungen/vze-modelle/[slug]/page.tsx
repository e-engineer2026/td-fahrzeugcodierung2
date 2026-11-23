import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { findVzeDraft } from "../../../lib/vzeVariantDrafts";
import { ensureGuideShopSchema } from "../../../lib/guideShopDb";
import { readGuidePdf } from "../../../lib/guideDocuments";
import ModelVzeCheckout from "../../../components/ModelVzeCheckout";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Verkehrszeichenerkennung · VZE-Modellanleitung | TD Fahrzeugcodierung",
  description: "Professionelle VZE-Fachanleitungen für ausgewählte MQB-Fahrzeuge, mit A5-, STG17- und 5F-Variantenprüfung.",
  robots: { index: false, follow: true },
};

export default async function ModelVzePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = findVzeDraft(slug);
  if (!draft) notFound();
  const { userId } = await auth();
  let ready = false;
  try {
    const sql = await ensureGuideShopSchema();
    ready = !!(await readGuidePdf(sql, draft.productId, draft.sha256, draft.filename));
  } catch { ready = false; }
  if (!ready) notFound();
  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <div className="container-x max-w-4xl py-8 sm:py-12">
      <Link href="/codieranleitungen/vze-modelle" className="text-sm font-bold text-blue-700 hover:underline">
        ← Zur Modellübersicht
      </Link>
      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">{draft.sku} · MQB-VZE</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Verkehrszeichenerkennung (VZE) · {draft.name}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Vierseitige, modellbezogene VZE-Prüfanleitung. Freigabe und Verkauf erfolgen erst nach ausdrücklicher Veröffentlichung durch TD Fahrzeugcodierung.
          Die Freigabe gilt für das beschriebene Prüfverfahren, nicht pauschal für jede Motorisierung,
          Kamera-, Modelljahr- und Softwarevariante.
        </p>
        <div className="mt-4 grid gap-3 border-y border-slate-100 py-4 text-sm sm:grid-cols-3">
          <p><span className="block text-xs text-slate-500">PDF-Dokument</span><strong className="text-xl text-blue-700">13,99 €</strong></p>
          <p><span className="block text-xs text-slate-500">Umfang / Fassung</span><strong>4 Seiten · Fachfassung</strong></p>
          <p><span className="block text-xs text-slate-500">Interface</span><strong>VCDS / VCP, je nach Variante</strong></p>
        </div>
        <h2 className="mt-5 text-lg font-bold">Voraussetzungen und Inhalt</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>Passende und VZE-fähige Frontkamera A5, Kombiinstrument 17 und Infotainment 5F</li>
          <li>Navigation beziehungsweise Datenfusion, mögliche FEC-/SWaP-Lizenzen und notwendige Kalibrierung</li>
          <li>Variantenbezogener VCDS-/VCP-Prüfablauf, Sicherung der Originalcodierung, Endkontrolle und Werkstattprotokoll</li>
        </ul>
        <p className="mt-4 text-xs leading-5 text-slate-600">
          Die modellübergreifenden Referenz-Bytes sind keine verbindliche Anweisung für jede Steuergerätegeneration.
          Fehlende Lizenzen und Softwarevoraussetzungen lassen sich nicht durch Codierung ersetzen.
          Nur für qualifizierte Fachkräfte.
        </p>
        <ModelVzeCheckout signedIn={!!userId} slug={draft.slug} name={draft.name}/>
      </article>
    </div>
  </main>;
}
