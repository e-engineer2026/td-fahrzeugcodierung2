import assert from "node:assert/strict";
import test from "node:test";
import { vehicleHeroImage } from "../app/lib/vehicleHero.ts";
import { resolveHomeVehicleDraftSelection, resolveHomeVehicleSelection, vehicleBookingHref } from "../app/lib/homeVehicleSelection.ts";
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

test("editing the vehicle clears old model and year instead of retaining a stale booking", () => {
  assert.deepEqual(resolveHomeVehicleDraftSelection({ brand: "Škoda", model: "", year: 2015 }, catalog), { brand: "Škoda", model: "", year: 0, mode: "onsite" });
  assert.deepEqual(resolveHomeVehicleDraftSelection({ brand: "", model: vehicle.model, year: 2015 }, catalog), { brand: "", model: "", year: 0, mode: "onsite" });
  assert.deepEqual(resolveHomeVehicleDraftSelection({ ...vehicle, year: 2030 }, catalog), { ...vehicle, year: 0, mode: "onsite" });
  assert.equal(resolveHomeVehicleDraftSelection({ brand: "unknown" }, catalog), null);
});

test("changing appointment mode retains the current vehicle and year", () => {
  assert.deepEqual(resolveHomeVehicleDraftSelection({ ...vehicle, year: 2015, mode: "remote" }, catalog), { ...vehicle, year: 2015, mode: "remote" });
});

test("vehicle imagery does not silently use a different generation or facelift", () => {
  assert(vehicleHeroImage({ brand: "Volkswagen", model: "Golf 7 (5G)", year: 2016 }));
  assert.equal(vehicleHeroImage({ brand: "Volkswagen", model: "Golf 7 (5G)", year: 2020 }), null);
  assert.equal(vehicleHeroImage({ brand: "Audi", model: "unknown", year: 2015 }), null);
  assert(vehicleHeroImage({ brand: "Škoda", model: "Octavia 3 5E Facelift", year: 2019 }));
});
