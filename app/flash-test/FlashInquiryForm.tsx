"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

const brands = ["Volkswagen", "Audi", "Škoda", "SEAT", "CUPRA"];
const requestTypes = [
  "Softwarestand prüfen",
  "Herstellerkonformes Softwareupdate",
  "Steuergerät nach Austausch anpassen",
  "Fehlerhaften Flashvorgang prüfen",
  "Sonstiges",
];

export default function FlashInquiryForm() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [controlUnit, setControlUnit] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [serviceMode, setServiceMode] = useState("Vor Ort in Leipzig");

  const whatsappHref = useMemo(() => {
    const message = [
      "Hallo, ich möchte die Flashbarkeit eines Steuergeräts prüfen lassen.",
      "",
      `Fahrzeug: ${brand || "-"} ${model || "-"}`,
      `Baujahr: ${year || "-"}`,
      `FIN: ${vin || "nicht angegeben"}`,
      `Steuergerät: ${controlUnit || "-"}`,
      `Teilenummer: ${partNumber || "nicht angegeben"}`,
      `Softwarestand: ${softwareVersion || "nicht angegeben"}`,
      `Anliegen: ${requestType || "-"}`,
      `Durchführung: ${serviceMode}`,
      `Beschreibung: ${description || "-"}`,
    ].join("\n");

    return `https://wa.me/4915563047044?text=${encodeURIComponent(message)}`;
  }, [brand, model, year, vin, controlUnit, partNumber, softwareVersion, requestType, serviceMode, description]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-[#0c2f68] p-5 text-white shadow-xl shadow-blue-950/10 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-blue-200">Technische Vorprüfung</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Flashbarkeit anfragen</h2>
          <p className="mt-2 text-sm leading-6 text-blue-100">Noch keine verbindliche Buchung oder Zahlung.</p>
        </div>
        <div className="hidden rounded-2xl bg-white/10 p-3 sm:block"><CheckCircle2 className="h-6 w-6 text-blue-200" /></div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-blue-100">
          Marke <span aria-hidden="true">*</span>
          <select value={brand} onChange={event => setBrand(event.target.value)} required className="mt-2 text-slate-900">
            <option value="">Bitte auswählen</option>
            {brands.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="text-sm font-bold text-blue-100">
          Modell <span aria-hidden="true">*</span>
          <input value={model} onChange={event => setModel(event.target.value)} required placeholder="z. B. Golf 7" className="mt-2" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Baujahr <span aria-hidden="true">*</span>
          <input value={year} onChange={event => setYear(event.target.value)} required inputMode="numeric" pattern="[0-9]{4}" placeholder="z. B. 2019" className="mt-2" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          FIN (optional)
          <input value={vin} onChange={event => setVin(event.target.value.toUpperCase())} maxLength={17} placeholder="17-stellige FIN" className="mt-2 uppercase" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Steuergerät <span aria-hidden="true">*</span>
          <input value={controlUnit} onChange={event => setControlUnit(event.target.value)} required placeholder="z. B. 5F Informationselektronik" className="mt-2" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Teilenummer (optional)
          <input value={partNumber} onChange={event => setPartNumber(event.target.value.toUpperCase())} placeholder="z. B. 3Q0 035 819 B" className="mt-2 uppercase" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Softwarestand (optional)
          <input value={softwareVersion} onChange={event => setSoftwareVersion(event.target.value)} placeholder="Aktuell angezeigte Version" className="mt-2" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Gewünschte Leistung <span aria-hidden="true">*</span>
          <select value={requestType} onChange={event => setRequestType(event.target.value)} required className="mt-2 text-slate-900">
            <option value="">Bitte auswählen</option>
            {requestTypes.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-blue-100">Durchführung</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {["Vor Ort in Leipzig", "Remote nach Vorprüfung"].map(item => (
            <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${serviceMode === item ? "border-blue-300 bg-blue-500/20" : "border-white/15 bg-white/5 hover:bg-white/10"}`}>
              <input type="radio" name="serviceMode" value={item} checked={serviceMode === item} onChange={() => setServiceMode(item)} className="h-4 w-4" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 block text-sm font-bold text-blue-100">
        Fehler oder gewünschtes Ergebnis <span aria-hidden="true">*</span>
        <textarea value={description} onChange={event => setDescription(event.target.value)} required rows={4} placeholder="Bitte kurz beschreiben, was geändert oder geprüft werden soll …" className="mt-2 resize-y text-slate-900" />
      </label>

      <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3.5 font-bold text-white transition hover:brightness-95">
        <MessageCircle className="mr-2 h-5 w-5" />
        Anfrage per WhatsApp vorbereiten
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-blue-200">Die Angaben werden erst beim Öffnen von WhatsApp übergeben.</p>
    </form>
  );
}
