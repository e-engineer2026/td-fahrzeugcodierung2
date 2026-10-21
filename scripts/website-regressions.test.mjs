import assert from "node:assert/strict";
import test from "node:test";
import { resolveHomeVehicleSelection, vehicleBookingHref } from "../app/lib/homeVehicleSelection.ts";
import { matchesCodingSearch } from "../app/lib/codingSearch.ts";

const catalog = [{ brand: "Škoda", model: "Octavia 3 5E", startYear: 2013, endYear: 2020 }];
const vehicle = { brand: "Škoda", model: "Octavia 3 5E" };

test("model-page links round-trip Unicode and model names without browser storage", () => {
  const url = new URL(vehicleBookingHref(vehicle), "https://td-fahrzeugcodierung.de");
  assert.equal(url.hash, "#fahrzeugauswahl");
  assert.deepEqual(resolveHomeVehicleSelection(Object.fromEntries(url.searchParams), catalog), { ...vehicle, year: 0, mode: "onsite" });
});

test("quick selection retains the chosen year and remote mode", () => {
  const url = new URL(vehicleBookingHref({ ...vehicle, year: 2015 }), "https://td-fahrzeugcodierung.de");
  url.searchParams.set("mode", "remote");
  assert.deepEqual(resolveHomeVehicleSelection(Object.fromEntries(url.searchParams), catalog), { ...vehicle, year: 2015, mode: "remote" });
});

test("invalid or missing years ask for a year while retaining the correct vehicle", () => {
  for (const year of [undefined, null, "", "abc", 2026, 2012, 2015.5, Infinity, {}, true]) {
    assert.deepEqual(resolveHomeVehicleSelection({ ...vehicle, year }, catalog), { ...vehicle, year: 0, mode: "onsite" });
  }
});

test("unknown vehicles and malformed data cannot select a different vehicle", () => {
  for (const input of [null, [], "Škoda", {}, { ...vehicle, brand: "Audi" }, { ...vehicle, model: "unknown" }]) {
    assert.equal(resolveHomeVehicleSelection(input, catalog), null);
  }
});

test("coding search accepts umlauts, transliterations, punctuation, and reordered words", () => {
  for (const query of ["Rückleuchten", "ruckleuchten", "Rueckleuchten", "aktiv RUECKLEUCHTEN", "  rückleuchten,   aktiv "]) {
    assert.equal(matchesCodingSearch("Tagfahrlicht – Rückleuchten zusätzlich aktiv", query), true, query);
  }
  assert.equal(matchesCodingSearch("Komfortschließen – Außenspiegel", "komfortschliessen aussenspiegel"), true);
  assert.equal(matchesCodingSearch("Spiegel anklappen", ""), true);
  assert.equal(matchesCodingSearch("Spiegel anklappen", "spiegel kamera"), false);
});
