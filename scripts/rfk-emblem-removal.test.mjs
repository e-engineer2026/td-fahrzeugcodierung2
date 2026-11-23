import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";

// Prevent previously removed, overlapping VW-emblem retrofit offers from returning
// to any vehicle's PDF list. Keep the combined Low/High PDF untouched.
const research = fs.readFileSync(new URL("../app/data/guideResearch.ts", import.meta.url), "utf8");
const modelProducts = fs.readFileSync(new URL("../app/lib/mqbRfkProducts.ts", import.meta.url), "utf8");
const codings = fs.readFileSync(new URL("../app/data/catalog4.ts", import.meta.url), "utf8");

test("Original-RFK im VW-Emblem ist für Golf 7 und Passat B8 vollständig entfernt", () => {
  assert.doesNotMatch(research, /Original-Rückfahrkamera im VW-Emblem nachrüsten/);
  assert.doesNotMatch(research, /VW-Emblem-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten/);
  assert.doesNotMatch(research, /golf7-rfk-high-kufatec|passat-b8-rueckfahrkamera/);
});

test("Allgemeine Low-High-RFK-Downloads und RFK-Aktivierung bleiben erhalten", () => {
  assert.match(modelProducts, /Rückfahrkamera nachrüsten \(Low\/High, MIB2\/MIB3\)/);
  assert.match(codings, /Rückfahrkamera \/ Rear View aktivieren/);
});
