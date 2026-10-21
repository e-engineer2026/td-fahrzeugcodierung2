"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, Wifi, ArrowUpRight } from "lucide-react";
import { homeVehicleUpdatedEvent, type HomeVehicleSelection } from "../lib/homeVehicleSelection";

export default function AppointmentPreparation({ mode: fixedMode }: { mode?: "onsite" | "remote" }) {
  const [mode, setMode] = useState<"onsite" | "remote">(fixedMode || "onsite");
  useEffect(() => {
    if (fixedMode) return;
    const update = (event: Event) => setMode((event as CustomEvent<HomeVehicleSelection>).detail.mode);
    window.addEventListener(homeVehicleUpdatedEvent, update);
    return () => window.removeEventListener(homeVehicleUpdatedEvent, update);
  }, [fixedMode]);
  const currentMode = fixedMode || mode;
  const remote = currentMode === "remote";
  return <div className="td-preparation-card">
    {!fixedMode && <div className="td-preparation-tabs" role="group" aria-label="Vorbereitung für die Terminart"><button type="button" aria-pressed={!remote} onClick={() => setMode("onsite")}><MapPin aria-hidden="true" />Vor Ort</button><button type="button" aria-pressed={remote} onClick={() => setMode("remote")}><Wifi aria-hidden="true" />Remote</button></div>}
    <div className="td-preparation-main"><div><p className="td-eyebrow">{remote ? "Deutschlandweit per Fernzugriff" : "Leipzig-Süd · nach Terminvereinbarung"}</p><h3>{remote ? "Dein Fahrzeug. Dein Laptop. Meine Unterstützung." : "Gut vorbereitet nach Leipzig-Süd."}</h3><p>{remote ? "Interface und Software stimmen wir vor der Buchung ab. Du bleibst während des Termins am Fahrzeug." : "Bitte zum Kundenparkplatz gegenüber der Schenkendorfstraße 33 kommen. Die Anfahrt kannst du vorab öffnen."}</p><a href={remote ? "/remote-fahrzeugcodierung" : "/anfahrt"}>{remote ? "Remote-Ablauf im Detail" : "Anfahrt & Kundenparkplatz ansehen"}<ArrowUpRight aria-hidden="true" /></a></div>
    <ul>{(remote ? ["Kompatibles Diagnoseinterface vorab abstimmen", "Windows-Laptop mit passender Diagnosesoftware", "Stabile Internetverbindung und vereinbarter Fernzugriff", "Geeignete Spannungsversorgung nach Absprache", "70 % vor Beginn, 30 % nach Durchführung per PayPal"] : ["Modell, Baujahr und Wunschfunktionen bereithalten", "Vorhandene Fehlermeldungen oder Diagnosescans mitbringen", "Bei Schlüsselarbeiten alle benötigten Schlüssel abstimmen", "Auf dem Kundenparkplatz gegenüber parken", "Zahlung beim Termin: bar, PayPal oder Sofortüberweisung"]).map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul></div>
  </div>;
}
