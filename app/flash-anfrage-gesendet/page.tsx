import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Anfrage gesendet",
  description: "Bestätigung für eine gesendete Flash-Anfrage.",
  robots: { index: false, follow: false },
};

export default function FlashInquirySentPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f8ff] px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white p-6 text-center shadow-xl shadow-blue-950/5 sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-blue-600">TD Fahrzeugcodierung</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Anfrage gesendet</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Vielen Dank. Die Angaben wurden übermittelt. Ich prüfe die Machbarkeit und melde mich per E-Mail bei dir zurück.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex items-center">
          <ChevronLeft className="mr-2 h-4 w-4" /> Zur Startseite
        </Link>
      </section>
    </main>
  );
}
