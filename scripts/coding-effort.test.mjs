import test from "node:test";
import assert from "node:assert/strict";
import { codingEffortStep } from "../app/lib/codingEffort.ts";

test("Einbau- und Umbaukategorien erhöhen die Codierpreise nicht pauschal", () => {
  assert.equal(codingEffortStep("LED-Fußraumbeleuchtung vorne nachrüsten"), 1);
  assert.equal(codingEffortStep("Originale Rückleuchten umbauen"), 1);
});

test("ausdrücklich codierfreie oder rein mechanische Arbeiten erhalten keinen Codierpreis", () => {
  assert.equal(codingEffortStep("USB-Ladehub nachrüsten", "Laut Quelle keine Codierung erforderlich"), null);
  assert.equal(codingEffortStep("LED-Fußraumbeleuchtung hinten nachrüsten", "Ohne zusätzliche Codierung"), null);
  assert.equal(codingEffortStep("Harman/Kardon OEM Subwoofergehäuse modifizieren"), null);
  assert.equal(codingEffortStep("45-Watt-USB-Modul einbauen", "", "ref-golf8-033"), null);
});

test("bestehende ACC-Einstellung ist einfacher als komplette ACC-Aktivierung", () => {
  assert.equal(codingEffortStep("ACC-Abstandseinstellung im MMI konfigurieren"), 2);
  assert.equal(codingEffortStep("ACC-Radar vollständig nachrüsten", "Radar-Kalibrierung erforderlich"), 5);
  assert.equal(codingEffortStep("ACC-Radar vollständig nachrüsten", "Remote-Erstinbetriebnahme erforderlich"), 6);
});

test("Kabelsatz ist kein kompletter ACC-Codierauftrag", () => {
  assert.equal(codingEffortStep(
    "ACC-Radar mit fahrzeugspezifischem Kabelsatz ergänzen",
    "Nur ACC-Verkabelung: Sensor und Freigaben separat"
  ), 1);
});

test("Keyless Access wird nicht als ACC-Regelung interpretiert", () => {
  assert.equal(codingEffortStep("Kessy/Keyless Access nachrüsten", "Türgriffe und SFD-Status prüfen"), 3);
});

test("AHK- und Lichtumbau werden nach Codierung und nicht nach Montage bewertet", () => {
  assert.equal(codingEffortStep("Originale Anhängerkupplung nachrüsten", "Steuergerät codieren"), 3);
  assert.equal(codingEffortStep("Auf Matrix-LED-Scheinwerfer umrüsten", "aLWR und Kalibrierung beachten"), 4);
});

test("Wegfahrsperre und Datensatzparametrierung sind aufwendig", () => {
  assert.equal(codingEffortStep("Kombiinstrument mit Wegfahrsperre tauschen"), 7);
  assert.equal(codingEffortStep("Golf 8 R-Mode-Tasten am Lenkrad nachrüsten", "Gateway-Parametrierung erforderlich"), 7);
});

test("einzelne Komfortcodierung erhält die niedrigste Stufe", () => {
  assert.equal(codingEffortStep("Zeigertest / Needle Sweep aktivieren"), 0);
});
