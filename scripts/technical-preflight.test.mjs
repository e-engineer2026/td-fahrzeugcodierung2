import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { EMPTY_TECHNICAL_EVIDENCE as empty, evaluateTechnicalPreflight } from "../app/lib/technicalPreflight.ts";

const check = (names, year = 2020, evidence = empty) =>
  evaluateTechnicalPreflight(names.map(name => ({ name })), year, evidence);

test("Comfort codings remain bookable when no extra hardware is required", () => {
  assert.equal(check(["Zeigertest", "Komfortblinken"]).status, "bookable");
  assert.equal(check([]).status, "bookable");
});

test("VZE requires camera, navigation and individual licence/ECU review", () => {
  const vze = check(["Verkehrszeichenerkennung freischalten"]);
  assert.equal(vze.status, "review");
  assert.deepEqual(vze.required, ["camera", "navigation"]);
  assert.equal(check(["Verkehrszeichenerkennung freischalten"], 2020,
    { ...empty, camera: "no", navigation: "yes" }).status, "blocked");
  assert.equal(check(["Verkehrszeichenerkennung freischalten"], 2020,
    { ...empty, camera: "yes", navigation: "yes" }).status, "review");
});

test("Assistants require matching camera/radar/lights, not model year guesses", () => {
  const tja = check(["Traffic Jam Assist freischalten"]);
  assert.deepEqual(tja.required, ["camera", "radar", "acc"]);
  const fla = check(["Fernlichtassistent (FLA/DLA) aktivieren"]);
  assert.deepEqual(fla.required, ["camera", "lights"]);
  const trailer = check(["Trailer Assist freischalten"]);
  assert.deepEqual(trailer.required, ["trailer"]);
  assert.equal(check(["Lane Assist freischalten"], 2024).status, "review");
  assert.ok(check(["Lane Assist freischalten"], 2024).reasons.some(x => x.includes("Auto-Scan")));
});

test("Confirmed SFD2 blocks coding; SFD status must not be guessed", () => {
  assert.equal(check(["Zeigertest"], 2020, { ...empty, sfd: "sfd2" }).status, "blocked");
  assert.equal(check(["Zeigertest"], 2020, { ...empty, sfd: "unknown" }).status, "bookable");
});

test("Retrofits without hardware are offered only as technical evaluation, not falsely blocked", () => {
  assert.deepEqual(check(["Rückfahrkamera nachrüsten"]).required, []);
  assert.equal(check(["Fernlichtassistent nachrüsten"]).status, "bookable");
});

test("Configurator disables live bookings when preflight is not bookable", () => {
  const source = fs.readFileSync("app/components/BookingConfigurator.tsx", "utf8");
  assert.match(source, /evaluateTechnicalPreflight\(selectedEntries, year, activeEquipment\)/);
  assert.match(source, /preflight\.status !== "bookable"/);
  assert.match(source, /TechnicalPreflightCard/);
  assert.match(source, /equipmentAnswers\.key === equipmentKey/);
});
