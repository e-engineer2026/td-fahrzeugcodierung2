import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isGuideAdmin } from "../../lib/guideAdmin";
import AdminServiceOrdersPanel from "../../components/AdminServiceOrdersPanel";
import AdminDashboardOverview from "../../components/AdminDashboardOverview";
import AdminCalBookingsPanel from "../../components/AdminCalBookingsPanel";

export const metadata: Metadata = {
  title: { absolute: "Auftragsverwaltung | TD Fahrzeugcodierung" },
  robots: { index: false, follow: false },
};

export default async function ServiceAdminPage() {
  if (!await isGuideAdmin()) notFound();
  return <main className="container-x min-h-[70vh] py-8 sm:py-12">
    <Link href="/konto" className="text-sm font-bold text-blue-700">← Mein Konto</Link>
    <h1 className="mt-4 text-3xl font-black">Interne Auftragsverwaltung</h1>
    <AdminDashboardOverview />
    <AdminCalBookingsPanel />
    <AdminServiceOrdersPanel />
    <Link href="/konto/pdf-verwaltung" className="mt-6 inline-flex rounded-lg border border-blue-200 p-3 font-semibold text-blue-800">PDF-Bestellungen und Freigaben verwalten</Link>
  </main>;
}
