import test from "node:test";
import assert from "node:assert/strict";
import { guideDetails } from "../app/lib/guideDetails.ts";

const examples = [
  "Air-Care-Einstellung nach Neustart beibehalten",
  "Umluftmodus beim Neustart wiederherstellen",
  "Klimatisierung: zusätzliche Lüfterprofile anbieten",
  "Sitzheizung nach Zeit automatisch herunterstufen",
  "G-Kräfte im digitalen Kombiinstrument einblenden",
  "Ladedruckanzeige im Digital Cockpit hinzufügen",
  "VCDS Komfortblinken Anzahl Blinkzyklen anpassen",
  "Anhänger-Rangierassistent mit Kamera und Sensorik nachrüsten",
  "Originale Fußraumbeleuchtung vorne einbauen und freischalten",
  "Audi A4 B9: Geschwindigkeitsregelanlage auf Radar-ACC umbauen",
  "Navigationsradio: WLAN-Medienstreaming einschalten",
  "230-V-Steckdose mit Wechselrichter nachrüsten",
  "Frontscheibenwischer: Wischtempo der Stufen konfigurieren",
  "Spurhalteassistent: Aktivierungsberechtigung prüfen",
  "HomeLink-Garagentoröffnung mit Bedienfeld nachrüsten",
  "Unbekannte Spezialfunktion der Steuergeräte"
];

test("Jedes Codier-, Retrofit- und Referenzthema erhält eine echte Beschreibung", () => {
  for (const title of examples) {
    const details = guideDetails({ title });
    assert.ok(details.description && details.description.length >= 35, title);
    assert.doesNotMatch(details.description, /laut (?:Quelle|Anbieter)|KUFATEC/);
  }
});

test("Technische Voraussetzungen bleiben getrennt von der Beschreibung", () => {
  const details = guideDetails({
    title: "Rückfahrkamera nachrüsten",
    explicitHardware: "Kompatible Kamera und Infotainment erforderlich",
    note: "Kamera mit passendem Steuergerät; Aufnahme beim Rückwärtsfahren möglich"
  });
  assert.ok(details.description);
  assert.match(details.prerequisites, /Kompatible Kamera/);
});
