import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModelVzeCheckout from "../../../components/ModelVzeCheckout";
import { readMqbGuideDocument } from "../../../lib/mqbGuideDocument";
import { findMqbGuideProduct } from "../../../lib/mqbGuideProducts";
import { formatGuidePrice } from "../../../lib/guidePricing";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "MQB-Prüfunterlage | TD Fahrzeugcodierung",
  robots: { index: false, follow: true },
};

export default async function MqbGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const product = findMqbGuideProduct((await params).slug);
  if (!product) notFound();
  const { userId } = await auth();
  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <div className="container-x max-w-4xl py-8 sm:py-12">
      <Link href="/codieranleitungen" className="text-sm font-bold text-blue-700 hover:underline">← PDF-Anleitungen</Link>
      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">MQB-Prüfunterlage · {product.sku} · Rev. {product.revision}</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{product.name}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">{product.description}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">Zweiseitige Prüfunterlage für Fachkräfte.</p>
        <p className="mt-4 text-xl font-black text-blue-700">{formatGuidePrice(product.priceCents / 100)}</p>
        {readMqbGuideDocument(product)
          ? <ModelVzeCheckout signedIn={!!userId} slug={product.slug} name={product.name} mqb />
          : <p className="mt-4 text-sm text-amber-900">Die PDF ist momentan nicht verfügbar. Bitte noch keine Zahlung ausführen.</p>}
      </article>
    </div>
  </main>;
}
