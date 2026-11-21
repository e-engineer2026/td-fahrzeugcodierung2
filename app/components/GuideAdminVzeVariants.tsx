"use client";

import { useEffect, useState } from "react";

type Draft = {
  slug: string;
  name: string;
  code: string;
  sku: string;
  filename: string;
  stored: boolean;
};

export default function GuideAdminVzeVariants() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [chosen, setChosen] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  async function refresh() {
    const response = await fetch("/api/guide-shop/admin/vze-variants", { cache: "no-store" });
    const data = await response.json() as { drafts?: Draft[]; error?: string };
    if (response.ok) setDrafts(data.drafts ?? []);
    else setMessage(data.error ?? "Die Prüffassungen konnten nicht geladen werden.");
  }
  useEffect(() => { void refresh(); }, []);
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/guide-shop/admin/vze-variants", {
        method: "POST", credentials: "same-origin", body: data,
      });
      const payload = await response.json() as { error?: string; stored?: boolean; model?: string };
      if (!response.ok || !payload.stored) throw new Error(payload.error ?? "Upload fehlgeschlagen.");
      setMessage("Fachfassung für " + payload.model + " privat gespeichert. Kundendownload erst nach bestätigter PayPal-Zahlung.");
      form.reset();
      setChosen("");
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen."); }
    finally { setUploading(false); }
  }

  async function bulkUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true); setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/guide-shop/admin/vze-variants/bulk", {
        method: "POST", credentials: "same-origin", body: new FormData(form),
      });
      const data = await response.json() as { stored?: boolean; count?: number; error?: string };
      if (!response.ok || !data.stored) throw new Error(data.error ?? "Sammelupload fehlgeschlagen.");
      setMessage(data.count + " VZE-Modell-Fachfassungen privat gespeichert. Kunden erhalten den Download erst nach überprüftem Zahlungseingang.");
      form.reset();
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sammelupload fehlgeschlagen."); }
    finally { setUploading(false); }
  }

  const storedCount = drafts.filter(draft => draft.stored).length;

  return <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-black text-slate-900">VZE-Modell-PDFs</h2>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{storedCount} / {drafts.length || 12} hinterlegt</span>
    </div>
    <form onSubmit={event => void bulkUpload(event)} className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="font-bold text-slate-900">Mehrere Modell-PDFs hochladen</p>
      <p className="text-xs leading-5 text-slate-600">ZIP-Datei entpacken und die gewünschten PDFs gemeinsam auswählen. Die Zuordnung erfolgt automatisch.</p>
      <input type="file" multiple required name="pdfs" accept=".pdf,application/pdf"
        className="block w-full rounded-lg border border-blue-200 bg-white p-2"/>
      <button disabled={uploading} type="submit"
        className="min-h-10 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
        {uploading ? "Sammelupload läuft …" : "Ausgewählte PDFs privat hinterlegen"}
      </button>
    </form>
    <details className="mt-4 rounded-lg border border-slate-200 p-3">
      <summary className="cursor-pointer font-bold text-blue-800">Einzelne PDF hochladen</summary>
    <form onSubmit={event => void upload(event)} className="mt-4 grid gap-3">
      <label className="font-semibold">Modell wählen
        <select required name="slug" value={chosen} onChange={event => setChosen(event.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
          <option value="">Modell auswählen</option>
          {drafts.map(draft => <option key={draft.slug} value={draft.slug}>{draft.name} ({draft.code})</option>)}
        </select>
      </label>
      <label className="font-semibold">Passende Fachfassung aus dem neuen Rev.-1.0-ZIP auswählen
        <input type="file" required name="pdf" accept=".pdf,application/pdf"
          className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
      </label>
      <button type="submit" disabled={!chosen || uploading}
        className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
        {uploading ? "Speichern …" : "PDF privat hochladen"}
      </button>
    </form>
    </details>
    {message && <p className="mt-3 font-semibold" role="status">{message}</p>}
    <details className="mt-4 rounded-lg border border-slate-200 p-3">
      <summary className="cursor-pointer font-bold text-blue-800">Alle 12 Modelle und Downloads anzeigen</summary>
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
      {drafts.map(draft => <div key={draft.slug}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-3 last:border-b-0">
        <div><p className="font-semibold text-slate-900">{draft.name} ({draft.code})</p>
          <p className="text-xs text-slate-500">{draft.sku} · {draft.stored ? "Privat bereitgestellt" : "Upload fehlt"}</p></div>
        {draft.stored
          ? <a href={"/api/guide-shop/admin/vze-variants/download?slug=" + encodeURIComponent(draft.slug)}
              className="rounded-lg border border-blue-200 px-3 py-2 font-bold text-blue-800">
              PDF herunterladen
            </a>
          : <span className="text-xs text-slate-500">Fachfassung aus ZIP hochladen</span>}
      </div>)}
    </div>
    </details>
  </section>;
}
