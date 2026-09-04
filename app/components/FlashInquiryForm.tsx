"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, FileUp, X } from "lucide-react";
import { vehicles } from "../data/catalog";

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
  const [customerEmail, setCustomerEmail] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [serviceMode, setServiceMode] = useState("Vor Ort in Leipzig");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const attachmentInput = useRef<HTMLInputElement>(null);

  const models = useMemo(() => {
    if (!brand) return [];

    return vehicles
      .filter(vehicle => {
        if (brand === "SEAT") return vehicle.brand === "SEAT / CUPRA" && vehicle.model.startsWith("SEAT ");
        if (brand === "CUPRA") return vehicle.brand === "SEAT / CUPRA" && vehicle.model.startsWith("CUPRA ");
        return vehicle.brand === brand;
      })
      .map(vehicle => vehicle.model.replace(/^(SEAT|CUPRA)\s/, ""));
  }, [brand]);

  const years = useMemo(() => {
    const selectedVehicle = vehicles.find(vehicle => {
      if (brand === "SEAT") return vehicle.brand === "SEAT / CUPRA" && vehicle.model === `SEAT ${model}`;
      if (brand === "CUPRA") return vehicle.brand === "SEAT / CUPRA" && vehicle.model === `CUPRA ${model}`;
      return vehicle.brand === brand && vehicle.model === model;
    });

    if (!selectedVehicle) return [];
    return Array.from(
      { length: selectedVehicle.endYear - selectedVehicle.startYear + 1 },
      (_, index) => String(selectedVehicle.endYear - index),
    );
  }, [brand, model]);

  function chooseAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > 10 * 1024 * 1024) {
      setAttachment(null);
      setAttachmentError("Die Datei darf höchstens 10 MB groß sein.");
      event.target.value = "";
      return;
    }

    setAttachment(file);
    setAttachmentError("");
  }

  function removeAttachment() {
    setAttachment(null);
    setAttachmentError("");
    if (attachmentInput.current) attachmentInput.current.value = "";
  }

  return (
    <form action="https://formsubmit.co/td.codierung@gmail.com" method="POST" encType="multipart/form-data" aria-label="Technische Vorprüfung Steuergeräte-Flash" className="rounded-3xl bg-[#0c2f68] p-4 text-white shadow-xl shadow-blue-950/10 sm:p-6">
      <input type="hidden" name="_subject" value="Neue Anfrage: Steuergeräte-Flash" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value="https://td-fahrzeugcodierung.vercel.app/flash-anfrage-gesendet" />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-blue-200">Technische Vorprüfung</p>
        <div className="hidden rounded-xl bg-white/10 p-2.5 sm:block"><CheckCircle2 className="h-5 w-5 text-blue-200" /></div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold text-blue-100">
          Marke <span aria-hidden="true">*</span>
          <select
            name="Marke"
            value={brand}
            onChange={event => {
              setBrand(event.target.value);
              setModel("");
              setYear("");
            }}
            required
            className="mt-1.5 px-3 py-2.5 text-slate-900"
          >
            <option value="">Bitte auswählen</option>
            {brands.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="text-sm font-bold text-blue-100">
          Modell <span aria-hidden="true">*</span>
          <select name="Modell" value={model} onChange={event => { setModel(event.target.value); setYear(""); }} required disabled={!brand} className="mt-1.5 px-3 py-2.5 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-200">
            <option value="">{brand ? "Bitte auswählen" : "Zuerst Marke auswählen"}</option>
            {models.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="text-sm font-bold text-blue-100">
          Baujahr <span aria-hidden="true">*</span>
          <select name="Baujahr" value={year} onChange={event => setYear(event.target.value)} required disabled={!model} className="mt-1.5 px-3 py-2.5 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-200">
            <option value="">{model ? "Bitte auswählen" : "Zuerst Modell auswählen"}</option>
            {years.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="text-sm font-bold text-blue-100">
          E-Mail für Rückfragen <span aria-hidden="true">*</span>
          <input type="email" name="email" value={customerEmail} onChange={event => setCustomerEmail(event.target.value)} required placeholder="name@beispiel.de" className="mt-1.5 px-3 py-2.5" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Teilenummer <span aria-hidden="true">*</span>
          <input name="Teilenummer" value={partNumber} onChange={event => setPartNumber(event.target.value.toUpperCase())} required placeholder="z. B. 3Q0 035 819 B" className="mt-1.5 px-3 py-2.5 uppercase" />
        </label>

        <label className="text-sm font-bold text-blue-100">
          Gewünschte Leistung <span aria-hidden="true">*</span>
          <select name="Gewünschte Leistung" value={requestType} onChange={event => setRequestType(event.target.value)} required className="mt-1.5 px-3 py-2.5 text-slate-900">
            <option value="">Bitte auswählen</option>
            {requestTypes.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-bold text-blue-100">Durchführung</legend>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {["Vor Ort in Leipzig", "Remote"].map(item => (
            <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold transition ${serviceMode === item ? "border-blue-300 bg-blue-500/20" : "border-white/15 bg-white/5 hover:bg-white/10"}`}>
              <input type="radio" name="Durchführung" value={item} checked={serviceMode === item} onChange={() => setServiceMode(item)} className="h-4 w-4" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="flash-attachment" className="block text-sm font-bold text-blue-100">VCDS-Scan oder Diagnosedatei (optional)</label>
        <label htmlFor="flash-attachment" className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300/70 bg-white/5 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-white/10">
          <FileUp className="h-4 w-4" /> Datei auswählen
        </label>
        <input ref={attachmentInput} id="flash-attachment" name="VCDS-Scan oder Diagnosedatei" type="file" accept=".txt,.log,.csv,.xml,.pdf,.zip" onChange={chooseAttachment} className="sr-only" />
        {attachment && (
          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-white/10 px-3 py-2 text-sm">
            <span className="min-w-0 truncate">{attachment.name}</span>
            <button type="button" onClick={removeAttachment} aria-label="Datei entfernen" className="shrink-0 rounded-md p-1 text-blue-100 hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>
        )}
        {attachmentError && <p role="alert" className="mt-2 text-sm text-red-200">{attachmentError}</p>}
        <p className="mt-1.5 text-xs leading-5 text-blue-200">TXT, LOG, CSV, XML, PDF oder ZIP · maximal 10 MB</p>
      </div>

      {requestType === "Sonstiges" && (
        <label className="mt-4 block text-sm font-bold text-blue-100">
          Beschreibung <span aria-hidden="true">*</span>
          <textarea name="Beschreibung" value={description} onChange={event => setDescription(event.target.value)} required rows={3} placeholder="Bitte kurz beschreiben, was geändert oder geprüft werden soll …" className="mt-1.5 resize-y px-3 py-2.5 text-slate-900" />
        </label>
      )}

      <button type="submit" className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white transition hover:brightness-95">
        Formular senden
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}
