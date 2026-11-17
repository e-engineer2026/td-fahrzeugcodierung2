import test from "node:test";
import assert from "node:assert/strict";
import { guideDetails } from "../app/lib/guideDetails.ts";

test("Hardware, SFD und Funktionsbeschreibung ohne doppelte Klauseln", () => {
  const result = guideDetails({
    title: "Sitzheizung vorne nachrüsten",
    note: "Sitzbezüge nach PR prüfen; Heizmatten müssen vom Sattler eingebaut werden; SFD2-Inbetriebnahme nur autorisiert"
  });
  assert.match(result.prerequisites, /Sitzbezüge/);
  assert.match(result.prerequisites, /Heizmatten/);
  assert.match(result.prerequisites, /SFD2/);
  assert.match(result.description, /Sitztemperatur/);
  assert.doesNotMatch(result.description, /Sitzbezüge|Heizmatten|SFD2/);
});

test("PR und Software-/Lizenzanforderungen erscheinen unter Technik", () => {
  const result = guideDetails({
    title: "ACC-Geschwindigkeitsbereich von 160 auf 210 km/h erweitern",
    note: "Nur bei bestehendem ACC bis 160 km/h (PR 6K3); Audi A3 8V nur bis 200 km/h; Radarhardware/Freigaben individuell prüfen"
  });
  assert.match(result.prerequisites, /PR 6K3/);
  assert.match(result.prerequisites, /Audi A3 8V nur bis 200 km\/h/);
  assert.doesNotMatch(result.description, /PR 6K3|Audi A3 8V/);
});

test("Einbauanleitungen, Quellen und Anbietertexte gehören nicht zu den Voraussetzungen", () => {
  const result = guideDetails({
    title: "Rückfahrkamera nachrüsten",
    note: "Einbauvorschau öffentlich, vollständige Anleitung nach Kauf; Limousine/Variant und Infotainment-PR-Code beachten"
  });
  assert.doesNotMatch(result.prerequisites, /Einbauvorschau|Anleitung nach Kauf|Quelle|Anbieter/);
  assert.match(result.prerequisites, /Infotainment-PR-Code/);
});

test("codierfreie Nachrüstung ohne doppelte Aussage", () => {
  const result = guideDetails({
    title: "USB-Ladehub im Fond nachrüsten",
    note: "Originaler Ladehub und Leitungssatz; funktioniert bei eingeschalteter Zündung; keine Codierung erforderlich"
  });
  assert.match(result.prerequisites, /Ladehub und Leitungssatz/);
  assert.match(result.prerequisites, /eingeschalteter Zündung/);
  assert.match(result.description, /Lade-/);
  assert.doesNotMatch(result.description, /Leitungssatz|Zündung/);
  assert.doesNotMatch(result.prerequisites, /keine Codierung/);
});

test("bereits vorhandene Hardware- und Toolfelder werden als Technik übernommen", () => {
  const result = guideDetails({
    title: "Auto-Lock aktivieren",
    explicitHardware: "Kompatibles BCM erforderlich",
    interfaceInfo: "VCDS / VCP"
  });
  assert.match(result.prerequisites, /Kompatibles BCM erforderlich/);
  assert.match(result.prerequisites, /VCDS \/ VCP/);
  assert.equal(result.description, null);
});

test("kein Beschreibungsknopf ohne zusätzlichen Informationstext", () => {
  const result = guideDetails({ title: "Zeigertest aktivieren" });
  assert.equal(result.prerequisites, null);
  assert.equal(result.description, null);
});

test("gemischte QQ2-Hinweise enthalten keine Fremdanleitungs-Metadaten", () => {
  const result = guideDetails({
    title: "Mehrfarbige Kontur-Ambientebeleuchtung (QQ2) nachrüsten",
    note: "Praxisbericht mit QQ2-Codierung und VCP-Parametrierung; keine geprüfte Komplettanleitung, Datensätze und Steuergeräte müssen zum Fahrzeug passen"
  });
  assert.match(result.prerequisites, /Datensätze und Steuergeräte/);
  assert.doesNotMatch(result.prerequisites, /Praxisbericht|Komplettanleitung/);
  assert.doesNotMatch(result.description, /Datensätze und Steuergeräte/);
});
