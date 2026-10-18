import Image from "next/image";

const customerParkingMaps = "https://www.google.com/maps/search/?api=1&query=51.323915%2C12.375662";

export default function ArrivalGuide({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "rounded-2xl border border-blue-200 bg-blue-50 p-4" : "rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"}>
      <h3 className="text-lg font-black text-slate-950">{compact ? "Anfahrt zum Vor-Ort-Termin" : "Vor-Ort-Termin: Kundenparkplatz"}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Bitte auf dem Parkplatz gegenüber der Schenkendorfstraße 33 parken. Der rote Marker zeigt den Kundenparkplatz. Das Wohnhaus mit dem blauen Marker ist privat – bitte dort nicht klingeln.
      </p>
      <a href={customerParkingMaps} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
        Kundenparkplatz in Google Maps öffnen
      </a>
      <a href="/anfahrt" className="mt-3 block text-sm font-semibold text-blue-700 underline">Anfahrtsgrafik groß anzeigen</a>
      {!compact && <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <Image src="/anfahrt-kunden.webp" alt="Satellitenkarte zur Anfahrt: roter Marker am Kundenparkplatz gegenüber, blauer Marker am privaten Wohnhaus" width={1024} height={1536} sizes="(max-width: 700px) 100vw, 680px" className="h-auto w-full" />
      </div>}
    </div>
  );
}
