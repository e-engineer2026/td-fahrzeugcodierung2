import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Seite nicht gefunden | TD Fahrzeugcodierung" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="text-sm font-black uppercase tracking-[.18em] text-blue-600">Fehler 404</div>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Seite nicht gefunden</h1>
        <p className="mt-4 leading-7 text-slate-600">Die aufgerufene Seite existiert nicht oder wurde verschoben.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Zur Startseite</Link>
          <Link href="/fahrzeuge" className="btn-secondary">Fahrzeuge & Preise</Link>
        </div>
      </section>
    </main>
  );
}
