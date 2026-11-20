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
      setMessage("Prüffassung für " + payload.model + " privat gespeichert. Kein Kauf oder Kundendownload aktiviert.");
      form.reset();
      setChosen("");
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload fehlgeschlagen."); }
    finally { setUploading(false); }
  }

  return <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm">
    <h2 className="text-lg font-black">VZE-Modell-PDFs · interne Prüffassungen</h2>
    <p className="mt-2 leading-6 text-slate-600">12 dreiseitige modellbezogene Arbeitsfassungen. Nur für
      qualifizierte Fachkräfte; noch keine technische Modellfreigabe und kein Kundenverkauf.
      Die PDFs bleiben in der privaten Datenbank und werden vor dem Speichern per SHA-256 auf
      exakt die vorbereiteten Versionen geprüft.</p>
    <form onSubmit={event => void upload(event)} className="mt-4 grid gap-3">
      <label className="font-semibold">Modell wählen
        <select required name="slug" value={chosen} onChange={event => setChosen(event.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
          <option value="">Modell auswählen</option>
          {drafts.map(draft => <option key={draft.slug} value={draft.slug}>{draft.name} ({draft.code})</option>)}
        </select>
      </label>
      <label className="font-semibold">Passende PDF aus dem bereitgestellten ZIP auswählen
        <input type="file" required name="pdf" accept=".pdf,application/pdf"
          className="mt-1 block w-full rounded-lg border border-slate-300 p-2" />
      </label>
      <button type="submit" disabled={!chosen || uploading}
        className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 font-bold text-white disabled:opacity-50">
        {uploading ? "Speichern …" : "PDF privat hochladen"}
      </button>
    </form>
    {message && <p className="mt-3 font-semibold" role="status">{message}</p>}
    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
      {drafts.map(draft => <div key={draft.slug}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-3 last:border-b-0">
        <div><p className="font-semibold text-slate-900">{draft.name} ({draft.code})</p>
          <p className="text-xs text-slate-500">{draft.sku} · {draft.stored ? "Privat bereitgestellt" : "Upload fehlt"}</p></div>
        {draft.stored
          ? <a href={"/api/guide-shop/admin/vze-variants/download?slug=" + encodeURIComponent(draft.slug)}
              className="rounded-lg border border-blue-200 px-3 py-2 font-bold text-blue-800">
              PDF herunterladen
            </a>
          : <span className="text-xs text-slate-500">Prüffassung aus ZIP hochladen</span>}
      </div>)}
    </div>
  </section>;
}
