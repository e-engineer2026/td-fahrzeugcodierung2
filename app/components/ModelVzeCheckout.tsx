"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogDocumentHref, catalogDownloadHref } from "../lib/guideCatalogLinks";
import { formatGuidePrice } from "../lib/guidePricing";

type Order = { orderId: string; reference: string; paypalUrl: string };
type Purchase = { slug: string; paid: boolean; documentAvailable: boolean };
type Purchases = { vzeModels?: Purchase[]; mqbGuides?: Purchase[]; catalogGuides?: Purchase[] };

async function purchaseReleased(slug: string, group: keyof Purchases, signal?: AbortSignal) {
  const response = await fetch("/api/guide-shop/purchases", { cache: "no-store", credentials: "same-origin", signal });
  const data = response.ok ? await response.json() as Purchases : null;
  return data?.[group]?.some(item => item.slug === slug && item.paid && item.documentAvailable) ?? false;
}

export default function ModelVzeCheckout({ signedIn, slug, name, mqb = false, catalogPriceCents }: {
  signedIn: boolean; slug: string; name: string;
  mqb?: boolean; catalogPriceCents?: number;
}) {
  const isCatalog = catalogPriceCents !== undefined;
  const purchaseGroup = isCatalog ? "catalogGuides" : mqb ? "mqbGuides" : "vzeModels";
  const price = formatGuidePrice((catalogPriceCents ?? 1399) / 100);
  const [terms, setTerms] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [restoring, setRestoring] = useState(signedIn);
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [paypalOpened, setPaypalOpened] = useState(false);
  const [message, setMessage] = useState("");

  async function checkAccess() {
    try {
      const released = await purchaseReleased(slug, purchaseGroup);
      setPaid(released);
      if (!released) setMessage("PayPal-Zahlung noch nicht überprüft. Bitte später erneut prüfen.");
    } catch { setMessage("Freigabestatus nicht erreichbar."); }
  }

  useEffect(() => {
    if (!signedIn) return;
    const controller = new AbortController();
    void purchaseReleased(slug, purchaseGroup, controller.signal).then(released => {
      if (!controller.signal.aborted) setPaid(released);
    }).catch(() => {});
    void fetch("/api/guide-shop/account-orders?productSlug=" + encodeURIComponent(slug), {
      credentials: "same-origin", cache: "no-store", signal: controller.signal,
    }).then(r => r.ok ? r.json() : null)
      .then((data: { order?: Order | null } | null) => {
        if (data?.order && !controller.signal.aborted) setOrder(data.order);
      }).catch(() => {}).finally(() => {
        if (!controller.signal.aborted) setRestoring(false);
      });
    return () => controller.abort();
  }, [signedIn, slug, purchaseGroup]);

  async function prepare() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/guide-shop/account-orders", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsAccepted: terms, productSlug: slug }),
      });
      const data = await response.json() as Order & { error?: string };
      if (!response.ok || !data.orderId) throw new Error(data.error || "Bestellung nicht möglich.");
      setOrder(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Bestellung fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  const here = isCatalog ? catalogDocumentHref(slug) : (mqb ? "/codieranleitungen/mqb-assistenten/" : "/codieranleitungen/vze-modelle/") + slug;
  if (!signedIn) return <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm">
    <p className="font-bold">Anmelden, um diese PDF zu kaufen</p>
    <p className="mt-1 text-slate-600">Nach überprüftem Zahlungseingang erscheint die Anleitung in deinem Kundenkonto.</p>
    <Link href={"/sign-in?redirect_url=" + encodeURIComponent(here)}
      className="mt-3 inline-flex rounded-lg bg-blue-700 px-4 py-3 font-bold text-white">Anmelden</Link>
  </div>;

  if (paid) return <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm">
    <p className="font-bold text-blue-900">{name}: PDF in deinem Kundenkonto freigeschaltet</p>
    <a href={isCatalog ? catalogDownloadHref(slug) : (mqb ? "/api/guide-shop/download/mqb/" : "/api/guide-shop/download/vze/") + slug}
      className="mt-3 inline-flex rounded-lg bg-blue-700 px-4 py-3 font-bold text-white">PDF jetzt herunterladen</a>
    <Link href="/konto" className="ml-3 text-blue-800 underline">Mein Konto</Link>
  </section>;

  return <section className="mt-6 rounded-xl border border-blue-200 bg-white p-5 text-sm">
    <h2 className="text-lg font-black">{isCatalog ? name : (mqb ? "MQB-Prüfunterlage " : "VZE-Fachfassung ") + name} · {price}</h2>
    <p className="mt-2 text-slate-600">Einmaliger Kauf der PDF. Zahlung über PayPal.Me.
      Freigabe erfolgt nach tatsächlicher Prüfung des Zahlungseingangs.</p>
    {restoring ? <p className="mt-3 text-slate-600">Offene Bestellung wird geladen …</p>
      : !order ? <div className="mt-4 space-y-3">
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-1"/>
          <span>Ich habe die <Link href="/agb" className="underline">AGB</Link> und
            die <Link href="/widerruf" className="underline">Widerrufsbelehrung</Link> gelesen.</span>
        </label>
        <button type="button" disabled={!terms || busy} onClick={() => void prepare()}
          className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
          {busy ? "Bestellung wird angelegt …" : "Bestellung"}</button>
      </div> : <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p><strong>Bestellnummer: {order.reference}</strong></p>
        <p className="mt-1">Der Betrag und Empfänger sind im PayPal.Me-Link voreingestellt. Du musst keine Bestellnummer in PayPal eingeben.</p>
        <a href={order.paypalUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => {
            setPaypalOpened(true);
            void fetch("/api/guide-shop/account-orders/payment-start", {
              method: "POST", credentials: "same-origin", keepalive: true,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: order.orderId }),
            }).catch(() => { setMessage("Der PayPal-Zeitstempel konnte nicht erfasst werden. Bitte den Support mit der Bestellnummer kontaktieren."); });
          }}
          className="mt-3 inline-flex min-h-11 rounded-lg bg-blue-700 px-4 py-3 font-bold text-white">
          Zahlungspflichtig per PayPal bezahlen · {price}</a>
        {paypalOpened && <button type="button" onClick={() => void checkAccess()}
          className="mt-3 block rounded-lg border border-blue-300 bg-white px-3 py-2 font-bold text-blue-800">
          Freigabe prüfen</button>}
        <p className="mt-2 text-xs text-slate-600">Bis zur verifizierten Zahlung bleibt die PDF gesperrt.
          Eine passende Gmail-E-Mail oder ein Zeitstempel allein reichen nicht.</p>
      </div>}
    {message && <p className="mt-3 font-semibold text-amber-900" role="status">{message}</p>}
  </section>;
}
