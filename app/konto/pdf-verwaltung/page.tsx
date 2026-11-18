import type { Metadata } from "next";
import Link from "next/link";
import { isGuideAdmin } from "../../lib/guideAdmin";
import GuideAdminPdfUpload from "../../components/GuideAdminPdfUpload";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Interne PDF-Verwaltung | TD Fahrzeugcodierung",
  robots: { index: false, follow: false, noarchive: true } };
export default async function GuideAdminPage() {
  const admin = await isGuideAdmin();
  const preview = process.env.VERCEL_ENV === "preview";
  const paypalChecks = [
    { name: "PayPal Client-ID", ready: !!process.env.PAYPAL_CLIENT_ID },
    { name: "PayPal Client-Secret", ready: !!process.env.PAYPAL_CLIENT_SECRET },
    { name: "PayPal Webhook-ID", ready: !!process.env.PAYPAL_WEBHOOK_ID },
    { name: "Sandbox-Betriebsart", ready: process.env.TD_GUIDE_SHOP_MODE === "sandbox" && process.env.PAYPAL_ENV === "sandbox" },
    { name: "HTTPS-Preview-Rückleitung", ready: !!process.env.TD_GUIDE_SHOP_RETURN_ORIGIN },
  ];
  return <main className="container-x min-h-[70vh] max-w-3xl py-10">
    <Link href="/konto" className="text-sm font-bold text-blue-700 hover:underline">← Zurück zum Kundenkonto</Link>
    <h1 className="mt-5 text-2xl font-black">Interne PDF-Verwaltung</h1>
    {admin ? <>
      <GuideAdminPdfUpload />
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <h2 className="text-lg font-bold text-slate-900">PayPal-Sandbox-Konfiguration</h2>
        <p className="mt-2 text-slate-600">Status der aktuellen Vercel-Umgebung:
          <strong className="ml-1">{preview ? "Preview / Sandbox" : "Produktion (kein Sandbox-Verkauf)"}</strong>.
          Es werden nur vorhandene Einstellungen angezeigt, niemals Schlüssel oder Geheimnisse.</p>
        <ul className="mt-3 space-y-1.5">
          {paypalChecks.map(check => <li className="flex items-center justify-between gap-3" key={check.name}>
            <span className="font-medium text-slate-700">{check.name}</span>
            <span className={check.ready ? "font-bold text-green-700" : "font-bold text-amber-700"}>
              {check.ready ? "Eingerichtet" : "Fehlt"}
            </span>
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-600">Für PayPal-Tests die drei PayPal-Zugangsdaten in den
          <strong> Vercel-Preview-Umgebungsvariablen</strong> hinterlegen und einen neuen Preview-Build auslösen.
          Auf der Produktions-Domain bleibt die Kauffunktion gesperrt.</p>
        <p className="mt-2 text-xs leading-5 text-amber-800">Wichtig: Die Preview ist durch Vercel Authentication
          geschützt. Für echte PayPal-Webhook-Tests ist ein abgesicherter Vercel Automation Bypass für den
          Webhook-Endpunkt erforderlich. Der Bypass ersetzt niemals die PayPal-Signaturprüfung.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="https://developer.paypal.com/dashboard/applications/sandbox" target="_blank"
            rel="noopener noreferrer" className="font-bold text-blue-700 underline">PayPal Developer</a>
          <a href="https://vercel.com/dashboard" target="_blank"
            rel="noopener noreferrer" className="font-bold text-blue-700 underline">Vercel Dashboard</a>
        </div>
      </section>
    </> :
      <p className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        Für die PDF-Verwaltung ist ein ausdrücklich freigegebenes, verifiziertes Administratorkonto erforderlich.
      </p>}
  </main>;
}
