import type { Metadata } from "next";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import SavedVehiclesAccount from "../components/SavedVehiclesAccount";

export const metadata: Metadata = {
  title: { absolute: "Mein Konto | TD Fahrzeugcodierung" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <main className="container-x min-h-[70vh] py-8 sm:py-12">
    <Link href="/" className="text-sm font-bold text-blue-700">← Zur Website</Link>
    <h1 className="mt-4 text-3xl font-black">Mein Konto</h1>
    <p className="mt-2 text-slate-600">Hier findest und verwaltest du deine gespeicherten Fahrzeugauswahlen.</p>
    <div className="mt-6"><Show when="signed-in"><SavedVehiclesAccount /></Show><Show when="signed-out"><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold">Bitte melde dich an, um deine gespeicherten Fahrzeuge aufzurufen.</p><Link href="/sign-in?redirect_url=%2Fkonto" className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-3 font-bold text-white">Anmelden</Link></div></Show></div>
  </main>;
}
