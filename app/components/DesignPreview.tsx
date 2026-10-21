"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function DesignPreview() {
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      const button = (event.target as Element | null)?.closest("button");
      if (button && /Auswahl speichern|Konto.*löschen/.test(button.textContent || "")) { event.preventDefault(); event.stopImmediatePropagation(); setNotice(true); return; }
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (/wa\.me|cal\.com|paypal\.me|^mailto:|^tel:|^\/sign-|^\/konto|^\/zahlung/.test(href)) { event.preventDefault(); event.stopImmediatePropagation(); setNotice(true); }
    };
    const onSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.closest("#kontakt") || form.querySelector('input[type="email"]')) { event.preventDefault(); event.stopImmediatePropagation(); setNotice(true); }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("submit", onSubmit, true); };
  }, []);
  return <><aside className="td-preview-ribbon"><span><b>ENTWURF</b> Vorschau für TD Fahrzeugcodierung</span><details><summary>Hinweise zum Entwurf</summary><p>Fahrzeugauswahl und Preisberechnung sind bedienbar. Nachrichten, Zahlungen und Buchungen werden in dieser Vorschau nicht ausgelöst. Die Praxisbeispiele sind beschriebene Anwendungssituationen. Für einen Kundenprojektbereich werden noch freigegebene Originalfotos und Referenzen benötigt.</p></details></aside>{notice && <div className="td-preview-toast" role="status"><div><b>Das ist eine Entwurfsvorschau.</b><p>Es wurde keine Anfrage, Buchung oder Zahlung ausgelöst.</p></div><button type="button" aria-label="Hinweis schließen" onClick={() => setNotice(false)}><X aria-hidden="true" /></button></div>}</>;
}
