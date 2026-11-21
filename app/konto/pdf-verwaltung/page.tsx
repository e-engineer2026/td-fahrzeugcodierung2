import type { Metadata } from "next";
import Link from "next/link";
import { isGuideAdmin } from "../../lib/guideAdmin";
import GuideAdminWorkspace from "../../components/GuideAdminWorkspace";
import { resolveShopMode } from "../../lib/guideShopShared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Interne PDF-Verwaltung | TD Fahrzeugcodierung",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function GuideAdminPage() {
  const admin = await isGuideAdmin();
  const preview = process.env.VERCEL_ENV === "preview";
  const production = process.env.VERCEL_ENV === "production";
  const liveMode = production && resolveShopMode(process.env) === "live";
  // Nur boolesche Statuswerte, niemals Zugangsdaten im Browser.
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
  return <main className="container-x min-h-[70vh] max-w-4xl py-8 sm:py-10">
    <Link href="/konto" className="text-sm font-bold text-blue-700 hover:underline">
      ← Zum Kundenkonto
    </Link>
    <h1 className="mt-4 text-2xl font-black">PDF-Verwaltung</h1>
    {admin ? <GuideAdminWorkspace production={production} preview={preview}
      liveMode={liveMode} liveChecks={liveChecks} paypalChecks={paypalChecks} /> :
      <p className="mt-5 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        Für die PDF-Verwaltung ist ein ausdrücklich freigegebenes, verifiziertes Administratorkonto erforderlich.
      </p>}
  </main>;
}
