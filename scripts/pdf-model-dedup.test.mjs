import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Reuses the repository's TS module loading strategy without a browser or live DB.
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = fileURLToPath(new URL("../", import.meta.url));
const cache = new Map();
function loadTs(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += ".ts";
  if (cache.has(file)) return cache.get(file).exports;
  const record = { exports: {} };
  cache.set(file, record);
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const localRequire = specifier => specifier.startsWith(".")
    ? loadTs(path.resolve(path.dirname(file), specifier)) : require(specifier);
  vm.compileFunction(source, ["require", "module", "exports"], { filename: file })
    (localRequire, record, record.exports);
  return record.exports;
}

const { vehicles, codingCatalog, codingsForVehicle } = loadTs("app/data/catalog");
const { uniqueByCodingName, hasDisplayPrice } = loadTs("app/lib/codingListCleanup");
const { uniquePdfGuideCodings, pdfGuideFunctionKey, isPdfGuideCoding, displayPdfGuideCoding } = loadTs("app/lib/pdfGuideCoding");
const { MQB_LANE_CODING, mqbLaneGuideForVehicle } = loadTs("app/lib/mqbLaneAssistModels");
const { MQB_TJA_CODING, mqbTjaGuideForVehicle } = loadTs("app/lib/mqbTjaModels");
const { MQB_TRAILER_CODING, mqbTrailerGuideForVehicle } = loadTs("app/lib/mqbTrailerAssistModels");
const { guideCategory } = loadTs("app/lib/guideCatalogDocuments");
const { MQB_RFK_PDF_PRODUCTS } = loadTs("app/lib/mqbRfkProducts");
const { uniqueGuideAdminDocuments } = loadTs("app/lib/uniqueGuideAdminDocuments");

function visibleCodings(vehicle) {
  if (vehicle.diagnosticsOnly || vehicle.startYear >= 2024) return [];
  const ids = new Set(codingsForVehicle(vehicle));
  const standard = uniqueByCodingName(codingCatalog
    .filter(c => ids.has(c.id) && c.id !== "diagnose" && c.uiGroup !== "Diagnose")
    .filter(c => hasDisplayPrice(c.price))
    .filter(c => c.id !== "vcds-vze" || !ids.has("golf7-vze-pdf"))
    .filter(isPdfGuideCoding).map(displayPdfGuideCoding));
  return uniquePdfGuideCodings([
    ...((vehicle.platform === "MQB" || vehicle.platform === "MQB-A0") && mqbLaneGuideForVehicle(vehicle.model) ? [MQB_LANE_CODING] : []),
    ...(vehicle.platform === "MQB" && mqbTjaGuideForVehicle(vehicle.model) ? [MQB_TJA_CODING] : []),
    ...(vehicle.platform === "MQB" && mqbTrailerGuideForVehicle(vehicle.model) ? [MQB_TRAILER_CODING] : []),
    ...standard,
  ]);
}

test("Alle Fahrzeugmodelle: keine doppelten aktivierungs- oder anpassungsbezogenen PDF-Codierzeilen", () => {
  assert.ok(vehicles.length >= 70, "Die komplette Fahrzeugliste wurde nicht geladen");
  let checked = 0;
  let modelLane = 0;
  for (const vehicle of vehicles) {
    const list = visibleCodings(vehicle);
    const keys = list.map(pdfGuideFunctionKey);
    assert.equal(new Set(keys).size, keys.length, "Doppelte Codierung in " + vehicle.model);
    const lane = mqbLaneGuideForVehicle(vehicle.model);
    if (lane && (vehicle.platform === "MQB" || vehicle.platform === "MQB-A0") && vehicle.startYear < 2024) {
      const matches = list.filter(c => pdfGuideFunctionKey(c) === "assistenz:lane-assist:aktivieren");
      assert.deepEqual(matches.map(c => c.id), [MQB_LANE_CODING.id], vehicle.model + ": Modell-PDF muss Vorrang haben");
      assert.equal(lane.slug, "mqb-lane-" + (vehicle.model === "Golf 7 (5G)" ? "vw-golf-7-5g" : lane.slug.slice(9)));
      modelLane++;
    }
    checked++;
  }
  assert.ok(modelLane >= 25, "28 MQB-Lane-Assist-Modelle erwartet");
  assert.equal(checked, vehicles.length);
});

test("Low/High-Rückfahrkamera PDFs gehören ausschließlich zu ihrem Fahrzeugmodell", () => {
  assert.equal(MQB_RFK_PDF_PRODUCTS.length, 38);
  assert.equal(new Set(MQB_RFK_PDF_PRODUCTS.map(p => p.model)).size, 38);
  assert.equal(new Set(MQB_RFK_PDF_PRODUCTS.map(p => p.filename)).size, 38);
  for (const product of MQB_RFK_PDF_PRODUCTS) {
    const vehicle = vehicles.find(v => v.model === product.model);
    assert.ok(vehicle, "Unbekanntes Fahrzeug " + product.model);
    assert.ok(["MQB", "MQB-A0", "MQBevo"].includes(vehicle.platform), product.model + " falsche Plattform");
    assert.equal(product.category, "Nachrüstungen");
    assert.ok(product.filename.endsWith("_RFK_Low_High_MIB2_MIB3.pdf"));
  }
});

test("Aktivierung von bereits installierter Kamera, Nachrüstung und Spurhalte-Anpassung sind getrennt", () => {
  assert.equal(guideCategory({ name: "Rückfahrkamera / Rear View aktivieren" }), "Codierungen");
  assert.equal(guideCategory({ name: "Rückfahrkamera nach Nachrüstung aktivieren" }), "Codierungen");
  assert.equal(guideCategory({ name: "Lane Assist – letzte Einstellung speichern" }), "Anpassungen für Assistenzsysteme");
  assert.equal(guideCategory({ name: "Spurhalteassistent (Lane Assist) aktivieren" }), "Assistenzsysteme");
  const before = [
    { id: "tcross-lane-activate", name: "Lane Assist / Spurhalteassistent aktivieren" },
    MQB_LANE_CODING,
    { id: "tcross-lane-memory", name: "Lane Assist – letzte Einstellung speichern" },
  ];
  assert.deepEqual(uniquePdfGuideCodings(before).map(p => p.id), [
    "tcross-lane-activate", "tcross-lane-memory",
  ]);
});

test("Admin-Sammelupload: dieselben 38 RFK-Produkt-IDs werden nicht doppelt angezeigt/veröffentlicht", () => {
  const fixed = MQB_RFK_PDF_PRODUCTS.map(p => ({ ...p, source: "configured" }));
  const fromStore = fixed.map(p => ({ ...p, source: "database" }));
  const result = uniqueGuideAdminDocuments([...fixed, ...fromStore]);
  assert.equal(result.length, 38);
  assert.ok(result.every(p => p.source === "configured"));
  assert.equal(new Set(result.map(p => p.productId)).size, 38);
  assert.equal(new Set(result.map(p => p.slug)).size, 38);
});

test("Admin-Produkte bleiben auch bei unterschiedlicher ID und gleicher Download-Zuordnung eindeutig", () => {
  const result = uniqueGuideAdminDocuments([
    { productId: "p1", slug: "same" },
    { productId: "p2", slug: "same" },
    { productId: "p1", slug: "other" },
    { productId: "p3", slug: "different" },
  ]);
  assert.deepEqual(result.map(p => p.productId), ["p1", "p3"]);
});

test("AHK-Plattform-PDFs werden eindeutig erkannt und stehen den dokumentierten Fahrzeugen zur Verfügung", () => {
  const { AHK_GUIDE_PRODUCTS, AHK_ADDITIONAL_GUIDE_VEHICLES, ahkGuidesForVehicle } = loadTs("app/lib/ahkGuideProducts");
  const { catalogGuideProduct } = loadTs("app/lib/guideCatalogDocuments");
  const { GUIDE_ADMIN_DOCUMENTS } = loadTs("app/lib/vzeAdminDocuments");
  const { TOUAREG_CR_GUIDE_VEHICLE } = loadTs("app/lib/mlbevoVzeModels");
  const models = new Set([...vehicles, ...AHK_ADDITIONAL_GUIDE_VEHICLES, TOUAREG_CR_GUIDE_VEHICLE].map(vehicle => vehicle.model));

  assert.equal(AHK_GUIDE_PRODUCTS.length, 10);
  for (const product of AHK_GUIDE_PRODUCTS) {
    assert.equal(catalogGuideProduct(product.slug)?.id, product.id);
    assert.equal(GUIDE_ADMIN_DOCUMENTS.filter(document => document.filename === product.filename).length, 1);
    for (const model of product.models) assert.ok(models.has(typeof model === "string" ? model : model[0]));
  }

  const names = (model, year) => ahkGuidesForVehicle(model, year).map(product => product.model);
  assert.deepEqual(names("Polo 6R", 2012), ["PQ25"]);
  assert.deepEqual(names("Polo 6R", 2014), ["PQ25", "PQ26"]);
  assert.deepEqual(names("Polo 6R", 2015), ["PQ26"]);
  assert.deepEqual(names("Polo AW", 2018), ["MQB-A0"]);
  assert.deepEqual(names("Touran 1T", 2008), []);
  assert.deepEqual(names("Touran 1T", 2012), ["PQ36"]);
  assert.deepEqual(names("CUPRA Born K11", 2021), ["MEB"]);
  assert.deepEqual(names("up! (1S)", 2020), []);
});
