"use client";

import { useEffect, useState } from "react";
import GuideSelector from "./GuideSelector";

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
  async function refresh() { setDocuments(await loadDocuments()); }
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
  async function uploadBatch() {
    setMessageSlug(null);
    if (!candidates.length || candidates.some(item => !item.slug) || new Set(candidates.map(item => item.slug)).size !== candidates.length) {
      setMessage("Bitte jede Datei genau einem unterschiedlichen Download zuordnen."); return;
    }
    setBusy(true); setMessage("");
    let stored = 0;
    try {
      for (const candidate of candidates) { await stage(candidate.slug, candidate.file); stored++; }
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
      await refresh(); setMessage(`${document.title}: PDF veröffentlicht.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Veröffentlichung fehlgeschlagen."); }
    finally { setBusy(false); }
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
      setMessage("Veröffentlichte PDF gelöscht.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Löschen fehlgeschlagen."); }
    finally { setBusy(false); }
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

  const publishedDocuments = (documents ?? [])
    .filter(document => document.available && document.publishedSha256)
    .sort((a, b) => a.title.localeCompare(b.title, "de"));

  return <>
    <div className="mx-auto mb-4 max-w-5xl">
      <details className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-blue-800">PDF-Sammelupload</summary>
        <label className="mt-2 block font-semibold">PDF-Dateien auswählen
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
      {!documents ? <p className="p-4 text-sm text-slate-600" role="status">Veröffentlichte PDFs werden geladen …</p>
        : publishedDocuments.length === 0
          ? <p className="p-4 text-sm text-slate-600">Zurzeit sind keine PDFs veröffentlicht.</p>
          : <ul className="divide-y divide-slate-100">
              {publishedDocuments.map(document => <li key={document.slug}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{document.title}</p>
                  <p className="mt-1 break-all text-xs text-slate-500">{document.filename ?? document.defaultFilename}</p>
                </div>
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
