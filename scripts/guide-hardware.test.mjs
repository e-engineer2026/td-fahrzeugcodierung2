import test from "node:test";
import assert from "node:assert/strict";
import { guideHardware } from "../app/lib/guideHardware.ts";

test("klare Steuergeräteanforderungen als Hardware ausweisen", () => {
  assert.equal(guideHardware("Klimasteuergerät mit Air Care erforderlich"), "Klimasteuergerät mit Air Care erforderlich");
  assert.equal(guideHardware("Nur bei passender Klima-Bedieneinheit"), "Nur bei passender Klima-Bedieneinheit");
});

test("gemischte Hinweise erhalten nur hardwarebezogene Klauseln", () => {
  assert.equal(guideHardware(
    "Sitzbezüge nach PR prüfen; Heizmatten müssen vom Sattler eingebaut werden; SFD2-Inbetriebnahme nur autorisiert"
  ), "Sitzbezüge nach PR prüfen; Heizmatten müssen vom Sattler eingebaut werden");
});

test("reine Codierung, Quelle und Modelljahre nicht zu Hardware umetikettieren", () => {
  assert.equal(guideHardware("Nur Modelljahr 2021, SFD-Freigabe erforderlich"), null);
  assert.equal(guideHardware("Laut Anbieter keine Codierung erforderlich"), null);
  assert.equal(guideHardware("Anleitung und Softwarestand prüfen"), null);
});

test("Hardware eines Coding-Datensatzes bevorzugen, ohne zu raten", () => {
  assert.equal(guideHardware("Softwarestand prüfen", "Highline-Gateway erforderlich"), "Highline-Gateway erforderlich");
  assert.equal(guideHardware(), null);
});
