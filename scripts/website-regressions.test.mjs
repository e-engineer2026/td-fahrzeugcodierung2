import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { resolveHomeVehicleSelection, vehicleBookingHref } from "../app/lib/homeVehicleSelection.ts";
import { matchesCodingSearch } from "../app/lib/codingSearch.ts";
import { smartphoneAidForVehicle } from "../app/data/smartphoneAid.ts";

const catalog = [{ brand: "Škoda", model: "Octavia 3 5E", startYear: 2013, endYear: 2020 }];
const vehicle = { brand: "Škoda", model: "Octavia 3 5E" };

test("smartphone navigation is confined to compatible model generations and years", () => {
  const golf = { brand: "Volkswagen", model: "Golf 7 (5G)" };
  assert.equal(smartphoneAidForVehicle(golf, 2018)?.price, 49);
  for (const year of [2016, 2021, 2024, NaN, 2018.5]) {
    assert.equal(smartphoneAidForVehicle(golf, year), undefined);
  }
  for (const model of ["Golf 8 (CD)", "Polo AW", "Golf 6 (1K)"]) {
    assert.equal(smartphoneAidForVehicle({ brand: "Volkswagen", model }, 2018), undefined);
  }
  assert.equal(smartphoneAidForVehicle({ brand: "Audi", model: "A3 / S3 8Y" }, 2021), undefined);
  assert.equal(smartphoneAidForVehicle({ brand: "Volkswagen", model: "A3 / S3 8V" }, 2018), undefined);
});

test("Audi smartphone navigation retains the matching hardware and iPhone requirements", () => {
  const audi = smartphoneAidForVehicle({ brand: "Audi", model: "A3 / S3 8V" }, 2018);
  assert.equal(audi.price, 49);
  assert.match(audi.hardware, /iPhone per USB/);
  assert.match(audi.hardware, /MMI Navigation plus MIB2 High/);
});

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

test("Golf-7-VZE-PDF ersetzt den generischen VZE-Eintrag in der Anleitungsliste", () => {
  const guide = fs.readFileSync("app/components/GuideSelector.tsx", "utf8");
  assert.match(guide, /coding\.id !== "vcds-vze" \|\| !ids\.has\("golf7-vze-pdf"\)/);
  assert.match(guide, /coding\.id === "golf7-vze-pdf"/);
  assert.equal(matchesCodingSearch("Verkehrszeichenerkennung (VZE / Sign Assist) aktivieren", "VZE"), true);
  assert.equal(matchesCodingSearch("Verkehrszeichenerkennung (VZE / Sign Assist) aktivieren", "verkehrszeichen"), true);
});

test("PDF-Suche durchsucht alle Kategorien, kann geleert werden und findet Umlaute", () => {
  const guide = fs.readFileSync("app/components/GuideSelector.tsx", "utf8");
  assert.match(guide, /searching \|\| entry\.category === activeCategory/);
  assert.match(guide, /searching \|\| idea\.category === activeCategory/);
  assert.match(guide, /searching \|\| guideCategory\(coding\) === activeCategory/);
  assert.match(guide, /matchesCodingSearch\(/);
  assert.match(guide, /setCodingSearch\(" "\)|setCodingSearch\(""\)/);
  for (const query of ["Rueckleuchten", "rückleuchten", "RÜCKLEUCHTEN"]) {
    assert.equal(matchesCodingSearch("Rückleuchten aktivieren", query), true);
  }
});

test("Entfernter VZE-PayPal-Hinweis erscheint nicht mehr in der PDF-Übersicht", () => {
  const page = fs.readFileSync("app/codieranleitungen/page.tsx", "utf8");
  assert.doesNotMatch(page, /Golf 7 VZE: 13,99 €/);
  assert.doesNotMatch(page, /Weitere Anleitungen sind noch nicht kaufbar/);
});

test("Golf 7 VZE: Freigabeaktionen erst nach PayPal und Kundenbestätigung sichtbar", () => {
  const component = fs.readFileSync("app/components/AccountPaypalGuideCheckout.tsx", "utf8");
  assert.doesNotMatch(component, /TD prüft den Zahlungseingang und schaltet die PDF in deinem Konto frei\./);
  assert.match(component, /onClick=\{\(\) => setPaypalOpened\(true\)\}/);
  assert.match(component, /paypalOpened && !paymentCompletedByCustomer/);
  assert.match(component, /Ich habe die PayPal-Zahlung abgeschlossen/);
  assert.match(component, /paymentCompletedByCustomer && \(/);
  const hiddenActions = component.split("paymentCompletedByCustomer && (")[1];
  assert.ok(hiddenActions);
  assert.match(hiddenActions, /Freigabe prüfen/);
  assert.match(hiddenActions, /Bestellnummer vergessen\? Zahlung melden/);
  assert.match(component, /setPaymentCompletedByCustomer\(false\)/);
});

test("Golf-7-VZE-Kauf verlangt kein zusaetzliches manuelles Zustimmungskaestchen", () => {
  const checkout = fs.readFileSync("app/components/AccountPaypalGuideCheckout.tsx", "utf8");
  const route = fs.readFileSync("app/api/guide-shop/account-orders/route.ts", "utf8");
  assert.doesNotMatch(checkout, /Mir ist bekannt, dass die PDF erst nach manueller Prüfung/);
  assert.doesNotMatch(checkout, /setManual|manualDeliveryAccepted|!manual/);
  assert.doesNotMatch(route, /manualDeliveryAccepted/);
  assert.match(checkout, /termsAccepted: terms/);
  assert.match(checkout, /disabled=\{!terms \|\| busy\}/);
  assert.match(route, /body\.termsAccepted !== true/);
});
