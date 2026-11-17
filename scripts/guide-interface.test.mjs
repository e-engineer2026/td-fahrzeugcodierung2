import test from "node:test";
import assert from "node:assert/strict";
import { guideInterface } from "../app/lib/guideInterface.ts";
import { guideVehicleRequirements } from "../app/lib/guideVehicleRequirements.ts";

test("VCDS nur bei belegtem reinen Anpassungsschritt", () => {
  assert.equal(guideInterface({ title: "Lane Assist letzte Einstellung speichern", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS");
  assert.equal(guideInterface({ title: "Coming Home anpassen", interfaceInfo: "VCDS; ggf. VCP oder ODIS", vehicleYear: 2016 }).label, "Interface prüfen");
});

test("VZE wegen FEC, Kamera und Navigation nicht pauschal für VCDS freigeben", () => {
  assert.equal(guideInterface({ title: "Verkehrszeichenerkennung aktivieren", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "Interface prüfen");
  const hardware = guideVehicleRequirements({ title: "Verkehrszeichenerkennung aktivieren" });
  assert.match(hardware, /Front-\/Umfeldkamera/);
  assert.match(hardware, /Navigationssystem/);
  assert.match(hardware, /FEC-\/SWaP/);
});

test("AHK: benötigte Steuergeräte und Software benennen", () => {
  const requirements = guideVehicleRequirements({ title: "AHK nachrüsten", note: "SFD2 zu prüfen" });
  assert.match(requirements, /Anhängerkupplung|AHK/);
  assert.match(requirements, /Anhängersteuergerät/);
  assert.match(requirements, /Softwarestand/);
  assert.match(requirements, /SFD2/);
});

test("VCP-ZDC statt VCDS und GeKo statt VCP für Online-Schutz", () => {
  assert.equal(guideInterface({ title: "QQ2 Ambientebeleuchtung", note: "VCP-Parametrierung erforderlich" }).label, "VCP (Parametrierung)");
  assert.equal(guideInterface({ title: "Kombiinstrument tauschen", note: "Komponentenschutz anlernen" }).label, "ODIS Service (Online)");
  assert.equal(guideInterface({ title: "Area View nachrüsten", note: "SFD2 erforderlich" }).label, "Herstellerfreigabe prüfen");
});

test("Vollständige ACC-Inbetriebnahme nicht als einfache VCDS-Codierung verkaufen", () => {
  assert.equal(guideInterface({ title: "ACC-Radar vollständig nachrüsten", vehicleYear: 2018 }).label, "Inbetriebnahme prüfen");
  assert.equal(guideInterface({ title: "Rückfahrkamera nachrüsten", note: "Datensatz parametrieren" }).label, "Parametrierung prüfen");
});

test("Codierfreie Maßnahmen benötigen kein Interface", () => {
  assert.equal(guideInterface({ title: "USB-Ladehub nachrüsten", note: "Laut Anbieter keine Codierung erforderlich" }).label, "Nicht erforderlich");
});

test("Neuere SFD2-Plattform ohne Nachweis nicht pauschal mit VCDS anbieten", () => {
  assert.equal(guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS", vehicleYear: 2025 }).label, "Herstellerverfahren prüfen");
});
