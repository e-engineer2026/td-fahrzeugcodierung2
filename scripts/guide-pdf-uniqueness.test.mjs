import { test } from "node:test";
import { strict as assert } from "node:assert";
import { uniqueGuideAdminDocuments } from "../app/lib/uniqueGuideAdminDocuments.ts";
import { isLaneAssistActivation, isEarlierRearCameraRetrofit, isRearCameraActivationCoding } from "../app/lib/guideDuplicateRules.ts";
import { assistanceCategoryForCoding } from "../app/lib/assistanceCategories.ts";

test("38 registered RFK documents are not doubled by stored catalog entries", () => {
  const configured = Array.from({ length: 38 }, (_, i) => ({
    productId: `catalog:vehicle-${i}:reference-mqb-rfk`,
    slug: `catalog:vehicle-${i}:reference-mqb-rfk`,
    filename: `TD_model-${i}_RFK_Low_High_MIB2_MIB3.pdf`,
    from: "configured",
  }));
  const fromDatabase = configured.map(item => ({ ...item, from: "database" }));
  const result = uniqueGuideAdminDocuments([...configured, ...fromDatabase]);
  assert.equal(result.length, 38);
  assert.ok(result.every(entry => entry.from === "configured"));
  assert.equal(new Set(result.map(entry => entry.slug)).size, 38);
});

test("same slug cannot appear twice even if product ID differs", () => {
  const result = uniqueGuideAdminDocuments([
    { productId: "a", slug: "same" },
    { productId: "b", slug: "same" },
    { productId: "a", slug: "other" },
    { productId: "c", slug: "distinct" },
  ]);
  assert.deepEqual(result.map(entry => entry.productId), ["a", "c"]);
});

test("one Lane Assist activation, while settings remain distinct", () => {
  for (const name of [
    "Lane Assist / Spurhalteassistent aktivieren",
    "Spurhalteassistent (Lane Assist) aktivieren",
    "Spurhalteassistent aktivieren",
  ]) assert.equal(isLaneAssistActivation(name), true);
  for (const name of [
    "Lane Assist – letzte Einstellung speichern",
    "Lane Assist – Warnung, Lenkeingriff und Vibration anpassen",
    "Lane Assist – Einschaltverhalten ändern",
  ]) assert.equal(isLaneAssistActivation(name), false);
});

test("legacy camera-retrofit duplicates excluded only from customer PDF list", () => {
  assert.equal(isEarlierRearCameraRetrofit("Rückfahrkamera Low mit Infotainment-Anbindung nachrüsten"), true);
  assert.equal(isEarlierRearCameraRetrofit("Original-Rückfahrkamera im VW-Emblem nachrüsten"), true);
  assert.equal(isEarlierRearCameraRetrofit("Abschaltgeschwindigkeit Rückfahrkamera anpassen"), false);
});

test("camera activation is a coding and not a new driver-assistance system", () => {
  for (const name of ["Rückfahrkamera / Rear View aktivieren", "Rückfahrkamera nach Nachrüstung aktivieren"]) {
    assert.equal(isRearCameraActivationCoding(name), true);
    assert.equal(assistanceCategoryForCoding({ name, uiGroup: "Assistenz" }), null);
  }
  assert.equal(assistanceCategoryForCoding({ name: "Lane Assist aktivieren", uiGroup: "Assistenz" }), "Assistenzsysteme");
  assert.equal(assistanceCategoryForCoding({ name: "Lane Assist letzte Einstellung speichern", uiGroup: "Assistenz" }), "Anpassungen für Assistenzsysteme");
});
