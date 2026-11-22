"use client";

import { useEffect, useState } from "react";

type DownloadDocument = {
  slug: string;
  title: string;
  sku: string;
  filename: string | null;
  available: boolean;
};

const endpoint = "/api/guide-shop/admin/vze-variants";

async function loadDocuments(signal?: AbortSignal) {
  const response = await fetch(endpoint, { cache: "no-store", signal });
  const data = await response.json() as { documents?: DownloadDocument[] };
  if (!response.ok || !data.documents) throw new Error("PDF-Liste konnte nicht geladen werden.");
  return data.documents;
}

export default function GuideAdminVzeVariants() {
  const [documents, setDocuments] = useState<DownloadDocument[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void loadDocuments(controller.signal).then(result => {
      if (!controller.signal.aborted) setDocuments(result);
    }).catch(() => {
      if (!controller.signal.aborted) setMessage("PDF-Liste konnte nicht geladen werden. Bitte erneut versuchen.");
    });
    return () => controller.abort();
  }, [loadAttempt]);

  async function upload(event: React.FormEvent<HTMLFormElement>, bulk = false) {
    event.preventDefault();
    setUploading(true);
    setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch(bulk ? endpoint + "/bulk" : endpoint, {
        method: "POST", body: new FormData(form),
      });
      const data = await response.json() as {
        stored?: boolean; slug?: string; title?: string; filename?: string;
        count?: number; skipped?: number; error?: string;
      };
      if (!response.ok || !data.stored) throw new Error(data.error || "Upload fehlgeschlagen.");
      if (bulk) {
        const skipped = data.skipped ? ` ${data.skipped} manuelle Zuordnungen beibehalten.` : "";
        setMessage(`${data.count} VZE-PDFs hinterlegt.${skipped}`);
        await loadDocuments().then(setDocuments).catch(() => {
          setMessage(current => current + " Lade die Seite neu, um den aktuellen Status zu sehen.");
        });
      } else if (data.filename) {
        const filename = data.filename;
        setDocuments(current => current?.map(item => item.slug === data.slug
          ? { ...item, available: true, filename } : item) ?? null);
        setMessage(`PDF für ${data.title} gespeichert.`);
        setSelected(null);
      }
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  const readyCount = documents?.filter(document => document.available).length;
  return <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-black text-slate-900">PDF-Downloads</h2>
      {documents && <span className="text-xs font-semibold text-slate-700">
        {readyCount} / {documents.length} verfügbar
      </span>}
    </div>
    {message && <p className="mt-3 break-words rounded-lg bg-slate-50 p-3 font-semibold" role="status">{message}</p>}
    {!documents && (message
      ? <button type="button" onClick={() => { setMessage(""); setLoadAttempt(attempt => attempt + 1); }}
        className="mt-3 font-bold text-blue-800 underline">Erneut laden</button>
      : <p className="mt-3 text-slate-600">Downloads werden geladen …</p>)}
    {documents && <ul className="mt-4 divide-y divide-slate-200">
      {documents.map(document => <li key={document.slug} className="py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-slate-900">{document.title}</p>
            <p className="text-xs text-slate-600">{document.sku} · {document.available ? "Verfügbar" : "PDF fehlt"}</p>
            {document.filename && <p className="break-all text-xs text-slate-600">{document.filename}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {document.available && <a href={endpoint + "/download?slug=" + encodeURIComponent(document.slug)}
              className="inline-flex min-h-10 items-center px-2 font-semibold text-blue-800">
              Herunterladen<span className="sr-only"> · {document.title}</span>
            </a>}
            <button type="button" disabled={uploading}
              aria-expanded={selected === document.slug}
              aria-label={(document.available ? "PDF ersetzen" : "PDF zuweisen") + " · " + document.title}
              onClick={() => { setMessage(""); setSelected(selected === document.slug ? null : document.slug); }}
              className="min-h-10 rounded-lg border border-blue-200 px-3 font-bold text-blue-800 disabled:opacity-50">
              {document.available ? "PDF ersetzen" : "PDF zuweisen"}
            </button>
          </div>
        </div>
        {selected === document.slug && <form onSubmit={event => void upload(event)} className="mt-3 space-y-3 rounded-lg bg-slate-50 p-3">
          <input type="hidden" name="slug" value={document.slug} />
          <label className="block font-semibold">
            Datei auswählen (PDF, max. 3 MB)
            <input className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2"
              type="file" name="pdf" accept=".pdf,application/pdf" required disabled={uploading} />
          </label>
          {document.available && <p className="text-xs text-slate-700">
            Nach dem Speichern erhalten auch bisherige Käufer bei einem erneuten Download diese Datei.
          </p>}
          <button type="submit" disabled={uploading}
            className="min-h-10 rounded-lg bg-blue-700 px-4 font-bold text-white disabled:opacity-50">
            {uploading ? "Wird gespeichert …" : "Zuordnung speichern"}
          </button>
        </form>}
      </li>)}
    </ul>}
    <details className="mt-4 rounded-lg border border-slate-200 p-3">
      <summary className="cursor-pointer font-bold text-blue-800">VZE-Sammelupload</summary>
      <form onSubmit={event => void upload(event, true)} className="mt-3 space-y-3">
        <label className="block font-semibold">
          Originale VZE-Fachfassungen aus dem entpackten ZIP auswählen
          <input type="file" multiple required name="pdfs" accept=".pdf,application/pdf" disabled={uploading}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2" />
        </label>
        <button disabled={uploading} type="submit"
          className="min-h-10 rounded-lg bg-blue-700 px-4 font-bold text-white disabled:opacity-50">
          {uploading ? "Wird gespeichert …" : "VZE-PDFs hinterlegen"}
        </button>
      </form>
    </details>
  </section>;
}
