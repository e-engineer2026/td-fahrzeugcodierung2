import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModelVzeCheckout from "../../components/ModelVzeCheckout";
import { catalogGuideProduct } from "../../lib/guideCatalogDocuments";
import { isAvailableGuideDocument } from "../../lib/guideDocuments";
import { formatGuidePrice } from "../../lib/guidePricing";
import { ensureGuideShopSchema } from "../../lib/guideShopDb";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "PDF-Codieranleitung", robots: { index: false } };

export default async function CatalogDocumentPage({ searchParams }: {
  searchParams: Promise<{ produkt?: string | string[] }>;
}) {
  const { produkt } = await searchParams;
  const product = typeof produkt === "string" ? catalogGuideProduct(produkt) : null;
  if (!product) notFound();

  const { userId } = await auth();
  let ready = false;
  try {
    const sql = await ensureGuideShopSchema();
    const [document] = await sql`SELECT sha256, assigned_filename, withdrawn FROM td_guide_documents
      WHERE product_id=${product.id}`;
    ready = isAvailableGuideDocument(document, product.sha256);
  } catch { /* Bei fehlender Statusprüfung keine Zahlung anbieten. */ }

  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <div className="container-x max-w-4xl py-8 sm:py-12">
      <Link href="/codieranleitungen" className="text-sm font-bold text-blue-700 hover:underline">← PDF-Anleitungen</Link>
      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <p className="text-sm font-semibold text-blue-700">{product.model}</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{product.name}</h1>
        {ready
          ? <><p className="mt-4 text-xl font-black text-blue-700">{formatGuidePrice(product.priceCents / 100)}</p>
              <ModelVzeCheckout signedIn={!!userId} slug={product.slug} name={product.name} catalogPriceCents={product.priceCents} /></>
          : <p className="mt-4 text-sm text-amber-900">Die PDF ist derzeit nicht verfügbar.</p>}
      </article>
    </div>
  </main>;
}
