"use client";
import { useState } from "react";
import { FileUp, LockKeyhole } from "lucide-react";
export default function GuideAdminPdfUpload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true); setComplete(false); setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const resp = await fetch("/api/guide-shop/admin/upload", {
        method: "POST", body: data, credentials: "same-origin", cache: "no-store",
      });
      const response = await resp.json() as { stored?: boolean; error?: string; sha256?: string };
      if (!resp.ok || !response.stored) throw Error(response.error ?? "Upload fehlgeschlagen.");
      setComplete(true);
      setMessage("Das Rev.-1.2-Dokument wurde verschlüsselt über HTTPS in der privaten Neon-Datenbank abgelegt. Die fachliche Freigabe und PayPal bleiben gesperrt.");
      form.reset();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload fehlgeschlagen.");
    } finally { setUploading(false); }
  }
  return (
    <form onSubmit={(e) => void upload(e)} encType="multipart/form-data"
      className="mt-6 rounded-xl border border-blue-100 bg-white p-5">
      <h2 className="flex items-center gap-2 text-lg font-black"><FileUp size={20}/> Prüf-PDF intern hochladen</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Artikel TD-G7-AS-003 · Revision 1.2. Nur die zugeordnete PDF mit exakt geprüfter SHA-256-Prüfsumme wird angenommen.
        Kein öffentliches GitHub-Verzeichnis und kein öffentlicher PDF-Link.
      </p>
      <label className="mt-4 block text-sm font-semibold" htmlFor="guide-pdf">PDF-Dokument auswählen</label>
      <input required id="guide-pdf" name="pdf" type="file" accept="application/pdf,.pdf"
        className="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm" />
      <button disabled={uploading} type="submit"
        className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
        <LockKeyhole size={17}/> {uploading ? "Speichern läuft …" : "PDF privat hinterlegen"}
      </button>
      {message && <p role="status" className={"mt-3 text-sm " + (complete ? "text-green-700" : "text-red-700")}>{message}</p>}
      <p className="mt-3 text-xs text-slate-500">Auch nach erfolgreichem Upload bleibt der Artikel ein Prüfentwurf. Live-Verkauf ist weiterhin gesperrt.</p>
    </form>
  );
}
