import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

const customerParkingMaps = "https://www.google.com/maps/search/?api=1&query=51.323915%2C12.375662";

export const metadata = {
  title: "Anfahrt & Kundenparkplatz | TD Fahrzeugcodierung Leipzig",
  description: "Anfahrt zum Kundenparkplatz von TD Fahrzeugcodierung in Leipzig-Süd. Bitte gegenüber der Schenkendorfstraße 33 parken.",
};

export default function ArrivalPage() {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:py-12">
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"><ArrowLeft className="h-4 w-4" />Zur Website</Link>
      <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-blue-700">TD Fahrzeugcodierung · Leipzig-Süd</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Anfahrt zum Kundenparkplatz</h1>
      <p className="mt-4 text-base leading-7 text-slate-700">Bitte auf dem Parkplatz gegenüber der Schenkendorfstraße 33 parken. Der rote Marker zeigt den Kundenparkplatz. Das Wohnhaus mit dem blauen Marker ist privat – bitte dort nicht klingeln.</p>
      <a href={customerParkingMaps} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"><MapPin className="h-5 w-5" />Route zum Kundenparkplatz öffnen</a>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Image src="/anfahrt-kunden.webp" alt="Satellitenkarte mit rotem Marker am Kundenparkplatz gegenüber der Schenkendorfstraße 33 und blauem Marker am privaten Wohnhaus" width={1024} height={1536} priority sizes="(max-width: 700px) 100vw, 768px" className="h-auto w-full" />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">Bitte fahre direkt zum roten Marker auf dem Parkplatz. Falls du unsicher bist, ruf kurz an: <a className="font-semibold text-blue-700 underline" href="tel:+4915563047044">01556 3047044</a>.</p>
    </div>
  </main>;
}
