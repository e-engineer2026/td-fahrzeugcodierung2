"use client";

import { useEffect, useState } from "react";
import GuideSelector from "./GuideSelector";
import { extractGuidePdfsFromZip } from "../lib/guideZipClient";

type DownloadDocument = {
  slug: string; title: string; sku: string; filename: string | null; available: boolean;
  defaultFilename: string; publishedSha256: string | null; draftFilename: string | null; draftSha256: string | null;
};
type Candidate = { file: File; slug: string };
const endpoint = "/api/guide-shop/admin/vze-variants";

async function loadDocuments(signal?: AbortSignal) {
  const response = await fetch(endpoint, { cache: "no-store", signal });
  const data = await response.json() as { documents?: DownloadDocument[] };
  if (!response.ok || !data.documents) throw new Error("PDF-Liste konnte nicht geladen werden.");
  return data.documents;
}

export default function GuideAdminVzeVariants() {
  const [documents, setDocuments] = useState<DownloadDocument[] | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedPublished, setSelectedPublished] = useState<string[]>([]);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSlug, setMessageSlug] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void loadDocuments(controller.signal).then(setDocuments).catch(() => {
      if (!controller.signal.aborted) setMessage("PDF-Liste konnte nicht geladen werden.");
    });
    return () => controller.abort();
  }, [loadAttempt]);
  async function refresh() {
    const next = await loadDocuments();
    setDocuments(next);
    setSelectedPublished(current => current.filter(slug =>
      next.some(document => document.slug === slug && document.available && document.publishedSha256)));
    setSelectedDrafts(current => current.filter(slug =>
      next.some(document => document.slug === slug && document.draftSha256)));
  }
  async function stage(slug: string, file: File) {
    const data = new FormData(); data.set("slug", slug); data.set("pdf", file);
    const response = await fetch(endpoint, { method: "POST", body: data });
    const result = await response.json() as { stored?: boolean; error?: string };
    if (!response.ok || !result.stored) throw new Error(result.error ?? "Upload fehlgeschlagen.");
  }
  async function uploadOne(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const file = data.get("pdf"), slug = data.get("slug");
    if (!(file instanceof File) || typeof slug !== "string") return;
    setBusy(true); setMessage(""); setMessageSlug(slug);
    try { await stage(slug, file); await refresh(); form.reset(); setSelected(null); setMessage("PDF als Entwurf gespeichert."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  function chooseFiles(files: FileList | null) {
    setMessage(""); setMessageSlug(null);
    setCandidates(Array.from(files ?? []).map(file => {
      const matches = documents?.filter(doc => doc.defaultFilename.toLowerCase() === file.name.toLowerCase()) ?? [];
      return { file, slug: matches.length === 1 ? matches[0].slug : "" };
    }));
  }
  async function chooseZip(file: File | null) {
    if (!file) return;
    setBusy(true); setMessage(""); setMessageSlug(null);
    try {
      const files = await extractGuidePdfsFromZip(file);
      const next = files.map(pdf => {
        const matches = documents?.filter(doc =>
          doc.defaultFilename.toLowerCase() === pdf.name.toLowerCase()) ?? [];
        return { file: pdf, slug: matches.length === 1 ? matches[0].slug : "" };
      });
      setCandidates(next);
      const unassigned = next.filter(item => !item.slug).length;
      setMessage(`${files.length} PDFs im ZIP erkannt.${unassigned
        ? ` ${unassigned} Dateien bitte manuell einem Download zuordnen.`
        : " Alle Dateinamen sind den PDF-Downloads zugeordnet."} Noch nichts veröffentlicht.`);
    } catch (error) {
      setCandidates([]);
      setMessage(error instanceof Error ? error.message : "ZIP konnte nicht geöffnet werden.");
    } finally { setBusy(false); }
  }
  async function uploadBatch() {
    setMessageSlug(null);
    if (!candidates.length || candidates.some(item => !item.slug) || new Set(candidates.map(item => item.slug)).size !== candidates.length) {
      setMessage("Bitte jede Datei genau einem unterschiedlichen Download zuordnen."); return;
    }
    setBusy(true); setMessage("");
    let stored = 0;
    try {
      for (const candidate of candidates) {
        await stage(candidate.slug, candidate.file);
        stored++;
        setMessage(`${stored} von ${candidates.length} PDFs als Entwurf gespeichert …`);
      }
      setCandidates([]); await refresh(); setMessage(`${stored} PDF-Entwürfe gespeichert.`);
    } catch (error) {
      setCandidates(current => current.slice(stored));
      await refresh().catch(() => {});
      setMessage(`${stored} Dateien gespeichert. ${error instanceof Error ? error.message : "Upload fehlgeschlagen."}`);
    } finally { setBusy(false); }
  }
  async function publish(document: DownloadDocument) {
    if (!document.draftSha256 || !window.confirm(`PDF für ${document.title} veröffentlichen? Die Datei steht danach berechtigten Käufern zum Download zur Verfügung.`)) return;
    setBusy(true); setMessage(""); setMessageSlug(document.slug);
    try {
      const response = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: document.slug, sha256: document.draftSha256 }) });
      const result = await response.json() as { published?: boolean; error?: string };
      if (!response.ok || !result.published) throw new Error(result.error ?? "Veröffentlichung fehlgeschlagen.");
      setSelectedDrafts(current => current.filter(slug => slug !== document.slug));
      await refresh(); setMessage(`${document.title}: PDF veröffentlicht.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Veröffentlichung fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  async function publishSelectedDrafts() {
    const targets = (documents ?? []).filter(document =>
      selectedDrafts.includes(document.slug) && document.draftSha256);
    if (!targets.length || !window.confirm(
      `${targets.length} ausgewählte PDF-${targets.length === 1 ? "Entwurf" : "Entwürfe"} veröffentlichen? Die Anleitungen stehen danach berechtigten Käufern zum Download zur Verfügung. Bereits veröffentlichte Versionen werden gegebenenfalls ersetzt.`
    )) return;

    setBusy(true);
    setMessage(""); setMessageSlug(null);
    const published: string[] = [];
    const failed: string[] = [];
    try {
      for (const document of targets) {
        try {
          const response = await fetch(endpoint, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: document.slug, sha256: document.draftSha256 }),
          });
          const result = await response.json() as { published?: boolean; error?: string };
          if (!response.ok || !result.published) {
            throw new Error(result.error ?? "Veröffentlichung fehlgeschlagen.");
          }
          published.push(document.slug);
          setMessage(`${published.length} von ${targets.length} PDF-Entwürfen veröffentlicht …`);
        } catch (error) {
          failed.push(`${document.title}: ${error instanceof Error ? error.message : "Veröffentlichung fehlgeschlagen."}`);
        }
      }
      if (published.length) {
        setDocuments(current => current?.map(document => published.includes(document.slug)
          ? {
              ...document, available: true, filename: document.draftFilename,
              publishedSha256: document.draftSha256, draftSha256: null, draftFilename: null,
            } : document) ?? null);
        setSelectedDrafts(current => current.filter(slug => !published.includes(slug)));
      }
      try { await refresh(); } catch {
        failed.push("Die Liste konnte nicht aktualisiert werden. Bitte Seite neu laden.");
      }
      setMessage(failed.length
        ? `${published.length} veröffentlicht, ${failed.length} Fehler: ${failed.join(" | ")}`
        : `${published.length} PDF-${published.length === 1 ? "Entwurf" : "Entwürfe"} erfolgreich veröffentlicht.`);
    } finally {
      setBusy(false);
    }
  }
  async function deletePublished(document: DownloadDocument) {
    if (!document.publishedSha256 ||
        !window.confirm(`Veröffentlichte PDF für ${document.title} löschen? Auch bisherige Käufer können diese Datei danach nicht mehr herunterladen.`)) return;
    setBusy(true); setMessage(""); setMessageSlug(document.slug);
    try {
      const response = await fetch(endpoint, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: document.slug, sha256: document.publishedSha256 }),
      });
      const result = await response.json() as { deleted?: boolean; error?: string };
      if (!response.ok || !result.deleted) {
        if (response.status === 409) await refresh().catch(() => {});
        throw new Error(result.error ?? "Löschen fehlgeschlagen.");
      }
      setDocuments(current => current?.map(item => item.slug === document.slug
        ? { ...item, available: false, filename: null, publishedSha256: null }
        : item) ?? null);
      setSelectedPublished(current => current.filter(slug => slug !== document.slug));
      setMessage("Veröffentlichte PDF gelöscht.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Löschen fehlgeschlagen."); }
    finally { setBusy(false); }
  }
  async function deleteSelectedPublished() {
    const targets = (documents ?? []).filter(document =>
      selectedPublished.includes(document.slug) && document.available && document.publishedSha256);
    if (!targets.length || !window.confirm(
      `${targets.length} veröffentlichte PDF${targets.length === 1 ? "" : "s"} endgültig löschen? Auch bisherige Käufer können diese Dateien danach nicht mehr herunterladen.`
    )) return;
    setBusy(true);
    setMessage("");
    setMessageSlug(null);
    const deleted: string[] = [];
    const failed: string[] = [];
    try {
      // Serverseitige SHA256-Prüfung und Admin-Berechtigung gelten für jede einzelne Datei.
      for (const document of targets) {
        try {
          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: document.slug, sha256: document.publishedSha256 }),
          });
          const result = await response.json() as { deleted?: boolean; error?: string };
          if (!response.ok || !result.deleted) throw new Error(result.error ?? "Löschen fehlgeschlagen.");
          deleted.push(document.slug);
        } catch (error) {
          failed.push(`${document.title}: ${error instanceof Error ? error.message : "Löschen fehlgeschlagen."}`);
        }
      }
      // Bestätigte Löschungen sofort ausblenden, auch falls das Neuladen fehlschlägt.
      if (deleted.length) {
        setDocuments(current => current?.map(document => deleted.includes(document.slug)
          ? { ...document, available: false, filename: null, publishedSha256: null }
          : document) ?? null);
        setSelectedPublished(current => current.filter(slug => !deleted.includes(slug)));
      }
      await refresh().catch(() => {});
      setMessage(failed.length
        ? `${deleted.length} PDF(s) gelöscht. ${failed.length} fehlgeschlagen: ${failed.join(" | ")}`
        : `${deleted.length} veröffentlichte PDF${deleted.length === 1 ? "" : "s"} gelöscht.`);
    } finally { setBusy(false); }
  }

  function renderDocumentActions(slug: string) {
    const document = documents?.find(item => item.slug === slug);
    if (!document) return null;

    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm sm:p-3">
      <p className="text-xs font-semibold text-slate-600">{document.available ? "Veröffentlicht" : "PDF fehlt"}</p>
      {document.filename && <p className="break-all text-xs text-slate-600">{document.filename}</p>}
      {document.draftFilename && <p className="mt-1 break-all font-semibold text-amber-800">Entwurf: {document.draftFilename}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {document.available && <a href={endpoint + "/download?slug=" + encodeURIComponent(document.slug)} className="inline-flex min-h-10 items-center px-2 font-semibold text-blue-800">Herunterladen<span className="sr-only"> · {document.title}</span></a>}
        {document.available && !document.draftSha256 && <a href={endpoint + "/download?inline=1&slug=" + encodeURIComponent(document.slug)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 px-3 font-bold text-blue-800">Vorschau<span className="sr-only"> · {document.title}</span></a>}
        {document.draftSha256 && <><a href={endpoint + "/download?draft=1&slug=" + encodeURIComponent(document.slug)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 px-3 font-bold text-blue-800">Vorschau<span className="sr-only"> · {document.title}</span></a>
          <button type="button" disabled={busy} onClick={() => void publish(document)} className="min-h-10 rounded-lg bg-blue-700 px-3 font-bold text-white disabled:opacity-50">Veröffentlichen<span className="sr-only"> · {document.title}</span></button></>}
        <button type="button" disabled={busy} aria-expanded={selected === document.slug} onClick={() => { setMessage(""); setSelected(selected === document.slug ? null : document.slug); }} className="min-h-10 rounded-lg border border-blue-200 px-3 font-bold text-blue-800 disabled:opacity-50">PDF zuweisen<span className="sr-only"> · {document.title}</span></button>
        {document.publishedSha256 && <button type="button" disabled={busy}
          onClick={() => void deletePublished(document)}
          className="min-h-10 rounded-lg border border-red-200 px-3 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
          Löschen<span className="sr-only"> · veröffentlichte PDF · {document.title}</span>
        </button>}
      </div>
      {selected === document.slug && <form onSubmit={event => void uploadOne(event)} className="mt-3 space-y-3 rounded-lg bg-slate-50 p-3"><input type="hidden" name="slug" value={document.slug} />
        <label className="block font-semibold">Datei auswählen (PDF, max. 3 MB)<input className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" type="file" name="pdf" accept=".pdf,application/pdf" required disabled={busy} /></label>
        <button type="submit" disabled={busy} className="min-h-10 rounded-lg bg-blue-700 px-4 font-bold text-white disabled:opacity-50">Als Entwurf speichern</button></form>}
      {message && messageSlug === slug && <p className="mt-2 break-words text-xs font-semibold text-slate-700" role="status">{message}</p>}
    </div>;
  }

  const draftDocuments = (documents ?? [])
    .filter(document => document.draftSha256)
    .sort((a, b) => a.title.localeCompare(b.title, "de"));
  const selectedDraftCount = draftDocuments.filter(document =>
    selectedDrafts.includes(document.slug)).length;
  const allDraftsSelected = draftDocuments.length > 0 && selectedDraftCount === draftDocuments.length;
  const publishedDocuments = (documents ?? [])
    .filter(document => document.available && document.publishedSha256)
    .sort((a, b) => a.title.localeCompare(b.title, "de"));
  const selectedPublishedCount = publishedDocuments.filter(document =>
    selectedPublished.includes(document.slug)).length;
  const allPublishedSelected = publishedDocuments.length > 0 &&
    selectedPublishedCount === publishedDocuments.length;

  return <>
    <div className="mx-auto mb-4 max-w-5xl">
      <details className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-blue-800">PDF-Sammelupload</summary>
        <p className="mt-2 text-xs leading-5 text-slate-600">Die 28 MQB-VZE-PDFs können gemeinsam als ZIP eingelesen werden. Sie bleiben bis zu deiner ausdrücklichen Freigabe privat als Entwürfe.</p>
        <label className="mt-3 block font-semibold">PDF-Paket (ZIP) auswählen
          <input type="file" accept=".zip,application/zip,application/x-zip-compressed" disabled={busy || !documents}
            onChange={event => { void chooseZip(event.target.files?.[0] ?? null); event.target.value = ""; }}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" />
        </label>
        <label className="mt-3 block font-semibold">Einzelne PDF-Dateien auswählen
          <input type="file" multiple accept=".pdf,application/pdf" disabled={busy || !documents} onChange={e => { chooseFiles(e.target.files); e.target.value = ""; }}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" />
        </label>
        {candidates.length > 0 && <div className="mt-3 space-y-3">{candidates.map((item, index) => <label key={index} className="block break-all font-semibold">{item.file.name}
          <select value={item.slug} disabled={busy} onChange={e => setCandidates(current => current.map((c, i) => i === index ? { ...c, slug: e.target.value } : c))}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 font-normal">
            <option value="">Download zuordnen …</option>{documents?.map(doc => <option key={doc.slug} value={doc.slug}>{doc.title}</option>)}
          </select></label>)}
          <button type="button" onClick={() => void uploadBatch()} disabled={busy} className="min-h-10 rounded-lg bg-blue-700 px-4 font-bold text-white disabled:opacity-50">{busy ? "Wird gespeichert …" : "PDFs als Entwürfe speichern"}</button>
        </div>}
      </details>
      {message && !messageSlug && <p className="mt-2 break-words text-sm font-semibold text-slate-700" role="status">{message}</p>}
      {!documents && (message
        ? <button type="button" onClick={() => { setMessage(""); setLoadAttempt(x => x + 1); }}
            className="mt-2 text-sm font-bold text-blue-800 underline">Erneut laden</button>
        : <p className="mt-2 text-sm text-slate-600" role="status">PDF-Status wird geladen …</p>)}
    </div>
    <section className="mx-auto mb-6 max-w-5xl overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm" aria-label="PDF-Entwürfe zur Freigabe">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 p-4 sm:px-5">
        <div>
          <h2 className="text-lg font-black text-slate-900">PDF-Entwürfe zur Freigabe</h2>
          <p className="mt-1 text-xs text-slate-600">Vorschau prüfen und jede Anleitung erst danach selbst veröffentlichen.</p>
        </div>
        {documents && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{draftDocuments.length} Entwürfe</span>}
      </div>
      {documents && draftDocuments.length > 0 && <div className="flex flex-wrap items-center gap-3 border-b border-blue-100 bg-blue-50/40 px-4 py-3 sm:px-5">
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
          <input type="checkbox" checked={allDraftsSelected} disabled={busy}
            onChange={event => setSelectedDrafts(event.target.checked
              ? draftDocuments.map(document => document.slug) : [])}
            className="h-5 w-5 rounded border-slate-300 accent-blue-700" />
          Alle auswählen
        </label>
        <span className="text-xs text-slate-600">{selectedDraftCount} ausgewählt</span>
        <button type="button" disabled={busy || selectedDraftCount === 0}
          onClick={() => void publishSelectedDrafts()}
          className="ml-auto min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Bitte warten …" : `Ausgewählte veröffentlichen (${selectedDraftCount})`}
        </button>
      </div>}
      {!documents ? <p className="p-4 text-sm text-slate-600">Entwürfe werden geladen …</p>
        : !draftDocuments.length ? <p className="p-4 text-sm text-slate-600">Noch keine PDF-Entwürfe hinterlegt. Verwende oben den Sammelupload.</p>
        : <ul className="divide-y divide-slate-100">
          {draftDocuments.map(document => <li key={document.slug}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <label className="flex min-w-0 cursor-pointer items-start gap-3">
              <input type="checkbox" checked={selectedDrafts.includes(document.slug)} disabled={busy}
                onChange={event => setSelectedDrafts(current => event.target.checked
                  ? [...new Set([...current, document.slug])]
                  : current.filter(slug => slug !== document.slug))}
                aria-label={`PDF-Entwurf auswählen: ${document.title}`}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 accent-blue-700" />
              <span className="min-w-0">
                <span className="block font-bold text-slate-900">{document.title}</span>
                <span className="mt-1 block break-all text-xs text-slate-500">{document.draftFilename}</span>
              </span>
            </label>
            <div className="flex shrink-0 flex-wrap gap-2 text-sm">
              <a href={endpoint + "/download?draft=1&slug=" + encodeURIComponent(document.slug)}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 px-3 font-bold text-blue-800 hover:bg-blue-50">
                Vorschau<span className="sr-only"> · {document.title}</span>
              </a>
              <button type="button" disabled={busy}
                onClick={() => void publish(document)}
                className="min-h-10 rounded-lg bg-blue-700 px-3 font-bold text-white hover:bg-blue-800 disabled:opacity-50">
                Veröffentlichen<span className="sr-only"> · {document.title}</span>
              </button>
            </div>
          </li>)}
        </ul>}
    </section>
    <section className="mx-auto mb-6 max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Veröffentlichte PDF-Anleitungen">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4 sm:px-5">
        <div>
          <h2 className="text-lg font-black text-slate-900">Veröffentlichte PDFs</h2>
          <p className="mt-1 text-xs text-slate-600">Hier stehen alle aktuell zum Download bereitgestellten Anleitungen.</p>
        </div>
        {documents && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
          {publishedDocuments.length} veröffentlicht
        </span>}
      </div>
      {documents && publishedDocuments.length > 0 && <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
        <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
          <input type="checkbox" checked={allPublishedSelected} disabled={busy}
            onChange={event => setSelectedPublished(event.target.checked
              ? publishedDocuments.map(document => document.slug) : [])}
            className="h-5 w-5 rounded border-slate-300 accent-blue-700" />
          Alle auswählen
        </label>
        <span className="text-xs text-slate-600">{selectedPublishedCount} ausgewählt</span>
        <button type="button" disabled={busy || selectedPublishedCount === 0}
          onClick={() => void deleteSelectedPublished()}
          className="ml-auto min-h-10 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">
          {busy ? "Bitte warten …" : `Ausgewählte löschen (${selectedPublishedCount})`}
        </button>
      </div>}
      {!documents ? <p className="p-4 text-sm text-slate-600" role="status">Veröffentlichte PDFs werden geladen …</p>
        : publishedDocuments.length === 0
          ? <p className="p-4 text-sm text-slate-600">Zurzeit sind keine PDFs veröffentlicht.</p>
          : <ul className="divide-y divide-slate-100">
              {publishedDocuments.map(document => <li key={document.slug}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">

                <label className="flex min-w-0 cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={selectedPublished.includes(document.slug)} disabled={busy}
                    onChange={event => setSelectedPublished(current => event.target.checked
                      ? [...new Set([...current, document.slug])]
                      : current.filter(slug => slug !== document.slug))}
                    aria-label={`Veröffentlichte PDF auswählen: ${document.title}`}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 accent-blue-700" />
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-900">{document.title}</span>
                    <span className="mt-1 block break-all text-xs text-slate-500">{document.filename ?? document.defaultFilename}</span>
                  </span>
                </label>
                <div className="flex shrink-0 flex-wrap gap-2 text-sm">
                  <a href={endpoint + "/download?inline=1&slug=" + encodeURIComponent(document.slug)}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 px-3 font-bold text-blue-800 hover:bg-blue-50">
                    Vorschau<span className="sr-only"> · {document.title}</span>
                  </a>
                  <a href={endpoint + "/download?slug=" + encodeURIComponent(document.slug)}
                    className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3 font-bold text-slate-800 hover:bg-slate-50">
                    Herunterladen<span className="sr-only"> · {document.title}</span>
                  </a>
                  <button type="button" disabled={busy}
                    onClick={() => void deletePublished(document)}
                    className="min-h-10 rounded-lg border border-red-200 px-3 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
                    Löschen<span className="sr-only"> · veröffentlichte PDF · {document.title}</span>
                  </button>
                </div>
              </li>)}
            </ul>}
      {message && messageSlug && <p className="border-t border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700" role="status">{message}</p>}
    </section>
    <GuideSelector renderDocumentActions={renderDocumentActions} />
  </>;
}
