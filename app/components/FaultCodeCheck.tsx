"use client";

import { useState } from "react";

const explanations: Record<string, string> = {
  P0300: "Mehrere bzw. zufällig auftretende Verbrennungsaussetzer erkannt. Mögliche Ursachen müssen am Fahrzeug geprüft werden.",
  P0171: "Das Motorsteuergerät meldet ein zu mageres Gemisch. Die Ursache lässt sich aus dem Code allein nicht bestimmen.",
  P0420: "Die überwachte Wirkung des Katalysators liegt unter dem erwarteten Wert. Sensorik, Abgasanlage und weitere Ursachen müssen geprüft werden.",
  B200049: "Dieser Code kann auf einen internen Fehler eines Steuergeräts hinweisen. Die genaue Bedeutung hängt vom Steuergerät und dem vollständigen Diagnoseprotokoll ab.",
};

export default function FaultCodeCheck() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const normalized = input.toUpperCase().replace(/[\s-]/g, "");
  const valid = /^[PBCU][0-9A-F]{4}([0-9A-F]{2})?$/.test(normalized);
  const message = `Hallo, ich möchte folgenden Fehlercode prüfen lassen: ${code}. Mein Fahrzeug: `;
  return <section className="td-container td-fault-check py-10" aria-labelledby="fault-title">
    <div className="rounded-3xl border border-blue-100 bg-slate-50 p-5 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Diagnose</p>
      <h2 id="fault-title" className="mt-2 text-2xl font-black">Fehlercode-Check</h2>
      <p className="mt-2 text-slate-600">Fehlercode eingeben und eine erste Orientierung erhalten.</p>
      <form className="mt-4 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); setCode(valid ? normalized : "invalid"); }}>
        <label className="sr-only" htmlFor="fault-code">Fehlercode</label>
        <input id="fault-code" value={input} onChange={(event) => setInput(event.target.value)} maxLength={16} placeholder="z. B. B200049" className="min-w-0 flex-1" />
        <button className="rounded-lg bg-blue-700 px-5 py-2 font-bold text-white hover:bg-blue-800">Code prüfen</button>
      </form>
      <div aria-live="polite" className="mt-4 text-sm leading-6 text-slate-700">{code === "invalid" ? "Bitte einen gültigen Fehlercode eingeben, z. B. P0300 oder B200049." : code && <><strong>{code}:</strong> {explanations[code] || "Für diesen Code liegt hier noch keine Einordnung vor. Ich prüfe ihn gern anhand deines Diagnoseprotokolls."}<p className="mt-2">Ein Fehlercode allein ist keine sichere Diagnose. Fahrzeug, Steuergerät und vollständiges Fehlerprotokoll sind entscheidend.</p><a className="mt-3 inline-block font-bold text-blue-700 underline" href={`https://wa.me/4915563047044?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Fehler bei TD anfragen</a></>}</div>
    </div>
  </section>;
}
