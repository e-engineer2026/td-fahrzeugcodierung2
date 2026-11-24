"use client";

import { useEffect, useState } from "react";

type RegistryRow = {
  id: string; model: string; title: string; pdfSlug: string;
  servicePriceCents: number; pdfPriceCents: number; requirements: string;
  draftStatus: "not_imported" | "draft" | "outdated" | "reviewed";
};
type ModelData = { rows: RegistryRow[]; sourceCount: number; storedCount: number;
  audit: { total: number; duplicates: string[]; invalidPrices: string[]; reviewRequired: number } };
type Master = { id: string; title: string; revision: string;
  variants: Array<{ slug: string; model: string; reviewed: boolean }> };

const registryApi = "/api/guide-shop/admin/catalog-registry";
const masterApi = "/api/guide-shop/admin/master-factory";

export default function AdminCatalogFactoryPanel() {
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [catalog, setCatalog] = useState<ModelData | null>(null);
  const [selectedRow, setSelectedRow] = useState("");
  const [draft, setDraft] = useState<RegistryRow | null>(null);
  const [masterId, setMasterId] = useState("td-mqb-vorlage");
  const [revision, setRevision] = useState("1.0");
  const [overview, setOverview] = useState("");
  const [safety, setSafety] = useState("");
  const [variantNote, setVariantNote] = useState("");
  const [steps, setSteps] = useState("");
  const [masters, setMasters] = useState<Master[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(registryApi, { cache: "no-store", signal: controller.signal })
      .then(r => r.json()).then((data: { models?: string[] }) => {
        if (!controller.signal.aborted) setModels(data.models ?? []);
      }).catch(() => {
        if (!controller.signal.aborted) setMessage("Fahrzeugliste konnte nicht geladen werden.");
      });
    fetch(masterApi, { cache: "no-store", signal: controller.signal })
      .then(r => r.json()).then((data: { masters?: Master[] }) => {
        if (!controller.signal.aborted) setMasters(data.masters ?? []);
      }).catch(() => {});
    return () => controller.abort();
  }, []);

  async function getModel(name: string) {
    if (!name) { setCatalog(null); return; }
    const response = await fetch(registryApi + "?model=" + encodeURIComponent(name), { cache: "no-store" });
    const data = await response.json() as ModelData & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "Katalog konnte nicht geladen werden.");
    setCatalog(data);
  }

  async function importModel() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(registryApi, { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model }) });
      const data = await response.json() as { imported?: number; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Import fehlgeschlagen.");
      await getModel(model);
      setMessage((data.imported ?? 0) + " Codierungen als internen Katalogentwurf übernommen. Die Websitepreise wurden nicht verändert.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Import fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  async function reviewRow() {
    if (!draft) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(registryApi, { method: "PATCH",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({
          id: draft.id, servicePriceCents: draft.servicePriceCents,
          pdfPriceCents: draft.pdfPriceCents, requirements: draft.requirements, reviewed: true,
        }) });
      const data = await response.json() as { saved?: boolean; error?: string };
      if (!response.ok || !data.saved) throw new Error(data.error ?? "Speichern fehlgeschlagen.");
      await getModel(model);
      setMessage("Katalogeintrag fachlich geprüft und intern gespeichert. Keine öffentliche Preisänderung.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Speichern fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  async function createDrafts() {
    const row = catalog?.rows.find(r => r.id === selectedRow);
    if (!row) { setMessage("Zuerst eine Codierung auswählen."); return; }
    const parsed = steps.split("\n").map(line => line.split("|").map(value => value.trim()))
      .filter(parts => parts.some(Boolean));
    if (!parsed.length || parsed.some(parts => parts.length < 4)) {
      setMessage("Jede Codierzeile muss Steuergerät | Pfad/Kanal | Istwert | Zielwert enthalten."); return;
    }
    setBusy(true); setMessage("");
    try {
      const master = {
        id: masterId, title: row.title, revision, overview, safety,
        variants: [{
          slug: row.pdfSlug, model: row.model, variantNote,
          reviewed: false,
          steps: parsed.map(parts => ({
            ecu: parts[0], path: parts[1], original: parts[2], target: parts[3],
            note: parts.slice(4).join(" | "),
          })),
        }],
      };
      const existing = masters.some(item => item.id === masterId);
      const save = await fetch(masterApi, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(existing ? {
          action: "append-variant", masterId, variant: master.variants[0],
        } : { action: "save", master }) });
      const saved = await save.json() as { error?: string };
      if (!save.ok) throw new Error(saved.error ?? "Vorlage konnte nicht gespeichert werden.");
      const generate = await fetch(masterApi, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", masterId, slugs: [row.pdfSlug] }) });
      const result = await generate.json() as {
        error?: string; generatedDrafts?: number; skippedExistingDrafts?: number;
      };
      if (!generate.ok) throw new Error(result.error ?? "Entwurf konnte nicht erzeugt werden.");
      setMessage(result.generatedDrafts
        ? "PDF-Entwurf erzeugt. Vorschau und Veröffentlichen sind in der PDF-Dateiliste verfügbar."
        : "PDF-Entwurf bereits vorhanden. Kein bestehender Entwurf wurde überschrieben.");
      const refresh = await fetch(masterApi, { cache: "no-store" });
      const data = await refresh.json() as { masters?: Master[] };
      setMasters(data.masters ?? []);
    } catch (error) { setMessage(error instanceof Error ? error.message : "PDF-Erstellung fehlgeschlagen."); }
    finally { setBusy(false); }
  }

  return <section className="mx-auto max-w-5xl space-y-5" aria-labelledby="td-master-catalog-title">
    <h2 id="td-master-catalog-title" className="text-xl font-bold">Zentraler Codierkatalog und PDF-Vorlagen</h2>
    <p className="text-sm text-slate-600">Migration in eine interne Prüfdatenbank. Bestehende Produkte, Preise, Shop-IDs und PDF-Downloads bleiben unverändert.</p>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <label className="block text-sm font-semibold">Fahrzeugmodell
        <select className="mt-2 block w-full rounded-lg border p-2" value={model}
          onChange={event => { setModel(event.target.value); setCatalog(null); setDraft(null);
            void getModel(event.target.value).catch(e => setMessage(String(e))); }}>
          <option value="">Modell auswählen</option>{models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      {catalog && <>
        <p className="mt-3 text-sm text-slate-700">{catalog.sourceCount} bestehende Codierungen, {catalog.storedCount} bereits intern importiert.
          {catalog.audit.duplicates.length ? " Duplikate in der Quelle gefunden." : ""}</p>
        <button type="button" disabled={busy || !model} onClick={() => void importModel()}
          className="mt-3 rounded-lg border border-blue-300 px-4 py-2 font-bold text-blue-800 disabled:opacity-50">
          Modellcodierungen in Prüfdatenbank importieren</button>
        <div className="mt-4 max-h-80 space-y-2 overflow-auto">
          {catalog.rows.map(row => <button type="button" key={row.id}
            onClick={() => { setSelectedRow(row.id); setDraft({ ...row }); }}
            className="block w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-blue-50">
            <span className="block font-semibold">{row.title}</span>
            <span className="text-xs text-slate-600">{row.draftStatus} · Codierung {(row.servicePriceCents / 100).toFixed(2)} € · PDF {(row.pdfPriceCents / 100).toFixed(2)} €</span>
          </button>)}
        </div>
      </>}
      {draft && <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <h3 className="font-bold">Eintrag fachlich prüfen: {draft.title}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">Codierleistung (Cent)
            <input className="mt-1 w-full rounded-lg border p-2" type="number" min={0} max={2000000}
              value={draft.servicePriceCents} onChange={e => setDraft({ ...draft, servicePriceCents: Number(e.target.value) })} />
          </label>
          <label className="text-sm font-semibold">PDF-Preis (Cent)
            <input className="mt-1 w-full rounded-lg border p-2" type="number" min={0} max={200000}
              value={draft.pdfPriceCents} onChange={e => setDraft({ ...draft, pdfPriceCents: Number(e.target.value) })} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">Fahrzeug-/Hardwarevoraussetzungen
            <textarea className="mt-1 w-full rounded-lg border p-2" rows={3} value={draft.requirements}
              onChange={e => setDraft({ ...draft, requirements: e.target.value })} />
          </label>
        </div>
        <button type="button" disabled={busy || draft.draftStatus === "not_imported"} onClick={() => void reviewRow()}
          className="mt-3 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
          Intern fachlich geprüft speichern</button>
      </div>}
    </div>
    <details className="rounded-xl border border-blue-200 bg-white p-4">
      <summary className="cursor-pointer font-bold text-blue-800">PDF aus geprüfter Master-Anleitung als Entwurf erzeugen</summary>
      <p className="mt-3 text-sm text-slate-700">Erforderlich sind echte, modellbezogene Codierwerte. Kein Wert wird von einem anderen Fahrzeug übernommen. Veröffentlichung erfolgt weiterhin ausschließlich über die PDF-Dateiliste.</p>
      {catalog && <label className="mt-3 block text-sm font-semibold">PDF-Zuordnung
        <select className="mt-1 block w-full rounded-lg border p-2" value={selectedRow}
          onChange={e => setSelectedRow(e.target.value)}>
          <option value="">Codierung auswählen</option>
          {catalog.rows.map(row => <option key={row.id} value={row.id}>{row.title}</option>)}
        </select>
      </label>}
      {masters.length > 0 && <label className="mt-3 block text-sm font-semibold">Bestehende Mastervorlage für weitere Modellvarianten
        <select className="mt-1 block w-full rounded-lg border p-2" value={masters.some(m => m.id === masterId) ? masterId : ""}
          onChange={event => { const master = masters.find(m => m.id === event.target.value);
            if (master) { setMasterId(master.id); setRevision(master.revision); }
          }}>
          <option value="">Neue Vorlage verwenden</option>
          {masters.map(master => <option key={master.id} value={master.id}>
            {master.title} ({master.variants.length} Varianten)
          </option>)}
        </select>
      </label>}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Vorlagenkennung
          <input className="mt-1 w-full rounded-lg border p-2" value={masterId} onChange={e => setMasterId(e.target.value)} />
        </label>
        <label className="text-sm font-semibold">Revision
          <input className="mt-1 w-full rounded-lg border p-2" value={revision} onChange={e => setRevision(e.target.value)} />
        </label>
      </div>
      <label className="mt-3 block text-sm font-semibold">Funktionsbeschreibung / Voraussetzungen
        <textarea rows={3} className="mt-1 w-full rounded-lg border p-2" value={overview} onChange={e => setOverview(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm font-semibold">Datensicherung / Sicherheitsbedingungen
        <textarea rows={3} className="mt-1 w-full rounded-lg border p-2" value={safety} onChange={e => setSafety(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm font-semibold">Fahrzeugspezifische Merkmale und Nachweise
        <textarea rows={3} className="mt-1 w-full rounded-lg border p-2" value={variantNote} onChange={e => setVariantNote(e.target.value)} />
      </label>
      <label className="mt-3 block text-sm font-semibold">Codierschritte, je Zeile: Steuergerät | Pfad/Kanal | Istwert | Zielwert | Hinweis
        <textarea rows={7} className="mt-1 w-full rounded-lg border p-2 font-mono text-xs" value={steps}
          onChange={e => setSteps(e.target.value)} placeholder={"09 Bordnetz | Anpassung Leuchte... | Originalwert | Zielwert | Nur beim bestätigten Softwarestand"} />
      </label>
      <button type="button" disabled={busy || !selectedRow} onClick={() => void createDrafts()}
        className="mt-3 rounded-lg bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50">
        Master speichern und privaten PDF-Entwurf erzeugen
      </button>
      <p className="mt-3 text-xs text-slate-600">Bisher hinterlegte Master: {masters.length}. Neue Entwürfe sind nicht im öffentlichen Shop sichtbar.</p>
    </details>
    {message && <p className="text-sm font-semibold text-blue-800" role="status">{message}</p>}
  </section>;
}
