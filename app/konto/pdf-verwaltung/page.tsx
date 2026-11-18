import type { Metadata } from "next";
import Link from "next/link";
import { isGuideAdmin } from "../../lib/guideAdmin";
import GuideAdminPdfUpload from "../../components/GuideAdminPdfUpload";
import GuideAdminManualRelease from "../../components/GuideAdminManualRelease";
import GuideAdminAccountOrders from "../../components/GuideAdminAccountOrders";
import { resolveShopMode } from "../../lib/guideShopShared";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Interne PDF-Verwaltung | TD Fahrzeugcodierung",
  robots: { index: false, follow: false, noarchive: true } };
export default async function GuideAdminPage() {
  const admin = await isGuideAdmin();
  const preview = process.env.VERCEL_ENV === "preview";
  const production = process.env.VERCEL_ENV === "production";
  const liveMode = production && resolveShopMode(process.env) === "live";
  // Zeigt nur boolesche Konfigurationszustände; kein Schlüssel oder Token gelangt zum Browser.
  const liveChecks = [
    { name: "PayPal-Live Client-ID", ready: production && !!process.env.PAYPAL_CLIENT_ID },
    { name: "PayPal-Live Client-Secret", ready: production && !!process.env.PAYPAL_CLIENT_SECRET },
    { name: "PayPal-Live Webhook-ID", ready: production && !!process.env.PAYPAL_WEBHOOK_ID },
    { name: "PayPal-Live Betriebsart", ready: production && process.env.PAYPAL_ENV === "live" && process.env.TD_GUIDE_SHOP_MODE === "live" },
    { name: "Technische Fachfreigabe", ready: production && process.env.TD_G7_VZE_TECH_APPROVED === "true" },
    { name: "Rechtliche Freigabe", ready: production && process.env.TD_GUIDE_LEGAL_APPROVED === "true" },
    { name: "Bestätigungsmail als getestet markiert", ready: production && process.env.TD_GUIDE_CONFIRMATION_EMAIL_READY === "true" },
  ];
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
      {production && <GuideAdminAccountOrders />}
      {production && <GuideAdminManualRelease />}
      {preview && <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm">
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
      </section>}
      {production && <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm">
        <h2 className="text-lg font-bold text-slate-900">Live-Freigabe des PDF-Shops</h2>
        <p className="mt-2 text-slate-600">Aktueller Checkout:
          <strong className={liveMode ? "ml-1 text-green-700" : "ml-1 text-amber-700"}>
            {liveMode ? "Live konfiguriert" : "Nicht freigegeben"}
          </strong>. Die Anzeige prüft Konfigurationswerte, nicht die tatsächliche
          Zustellung von E-Mails, die Rechtmäßigkeit der Rechtstexte oder eine Live-Testzahlung.
        </p>
        <ul className="mt-3 space-y-1.5">
          {liveChecks.map(check => <li className="flex items-center justify-between gap-3" key={check.name}>
            <span className="font-medium text-slate-700">{check.name}</span>
            <span className={check.ready ? "font-bold text-green-700" : "font-bold text-amber-700"}>
              {check.ready ? "Konfiguriert" : "Offen"}
            </span>
          </li>)}
        </ul>
        <p className="mt-3 text-xs leading-5 text-slate-600">
          Für den Echtgeldverkauf sind gültige Live-PayPal-Daten, ein tatsächlich getesteter
          automatischer Bestätigungsversand und die rechtliche Abnahme nötig. Diese beiden
          Freigabeschalter niemals nur für einen grünen Status setzen. Auch ein vollständig
          konfigurierter Checkout ersetzt keinen erfolgreichen Live-Ende-zu-Ende-Test.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="https://developer.paypal.com/dashboard/applications/live" target="_blank"
            rel="noopener noreferrer" className="font-bold text-blue-700 underline">PayPal-Live-Zugang</a>
          <a href="https://vercel.com/e-engineer2026s-projects/td-fahrzeugcodierung/settings/environment-variables"
            target="_blank" rel="noopener noreferrer"
            className="font-bold text-blue-700 underline">Vercel-Umgebungsvariablen</a>
        </div>
      </section>}
    </> :
      <p className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        Für die PDF-Verwaltung ist ein ausdrücklich freigegebenes, verifiziertes Administratorkonto erforderlich.
      </p>}
  </main>;
}
