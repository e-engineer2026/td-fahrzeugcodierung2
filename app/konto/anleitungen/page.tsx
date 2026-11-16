import { randomUUID } from "node:crypto";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { checkoutReady, guideBySku, purchase } from "../../lib/guideSales";
import Capture from "./Capture";

export const metadata = { title: "PDF-Kauf | TD Fahrzeugcodierung", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Checkout({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  const sku = typeof query.sku === "string" ? query.sku : "";
  const guide = guideBySku(sku);
  const { userId } = await auth();
  const back = "/konto/anleitungen?" + new URLSearchParams(token ? [["token", token]] : [["sku", sku]]).toString();
  let content;
  if (!userId) {
    content = <Link className="underline" href={"/sign-in?redirect_url=" + encodeURIComponent(back)}>Für Kauf und späteren Download anmelden</Link>;
  } else if (token) {
    try {
      const order = await purchase(userId, token);
      const download = "/api/account/anleitungen?token=" + encodeURIComponent(token);
      content = <><h2 className="font-bold">{order.guide.title}</h2>{order.paid ? <>
        <p>Die PayPal-Zahlung ist abgeschlossen. Du kannst diese Seite für spätere Downloads speichern.</p>
        <p><a className="underline" href={download}>Anleitung als PDF herunterladen</a></p>
        <p><a className="underline" href={download + "&file=uebersicht"}>Leistungsübersicht herunterladen</a></p>
      </> : order.status === "APPROVED" ? <Capture token={token} automatic={!query.error} /> :
        <p>PayPal hat noch keine abgeschlossene Zahlung bestätigt. <Link className="underline" href={back}>Status erneut prüfen</Link></p>}</>;
    } catch { content = <p>Die Bestellung konnte für dein Konto nicht bestätigt werden. <a className="underline" href={back}>Erneut prüfen</a></p>; }
  } else if (guide) {
    const price = (guide.cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
    content = <><h2 className="font-bold">{guide.title}</h2><p>{guide.tool} · {guide.scope}</p>
      <p>Gesamtpreis {price}. Anleitung und Leistungsübersicht stehen nach der Zahlung als PDF bereit.</p>
      {query.cancel && <p>Zahlung abgebrochen.</p>}
      {checkoutReady ? <form method="post" action="/api/account/anleitungen">
        <input type="hidden" name="sku" value={sku} /><input type="hidden" name="attempt" value={randomUUID()} />
        <button className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white" type="submit">Weiter zu PayPal · {price}</button>
      </form> : <p>Der PayPal-Verkauf ist noch nicht freigeschaltet.</p>}</>;
  } else { content = <p>Bitte zuerst eine Anleitung auswählen.</p>; }
  return <main className="container-x max-w-2xl space-y-4 py-10">
    <Link className="underline" href="/anleitungen">← Zu den PDF-Anleitungen</Link>
    <h1 className="text-3xl font-bold">PDF-Kauf</h1>
    {query.error && <p role="alert">PayPal konnte die Anfrage nicht abschließen. Bitte erneut versuchen.</p>}{content}
  </main>;
}
