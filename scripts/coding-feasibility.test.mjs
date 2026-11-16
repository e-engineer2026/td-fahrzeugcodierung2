import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = fileURLToPath(new URL('../', import.meta.url));
const cache = new Map();
// Exercise the real production modules, including catalog composition and curation.
function loadTs(file) {
  file = path.resolve(root, file);
  if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const moduleRecord = { exports: {} }; cache.set(file, moduleRecord);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const localRequire = (specifier) => specifier.startsWith('.') ? loadTs(path.resolve(path.dirname(file), specifier)) : require(specifier);
  vm.compileFunction(source, ['require', 'module', 'exports'], { filename: file })(localRequire, moduleRecord, moduleRecord.exports);
  return moduleRecord.exports;
}
const { vehicles } = loadTs('app/data/catalog');
const { vehicleSpecificCodings, needsProtectionReview, yearAllowed } = loadTs('app/lib/vehicleCodings');
const { curateCodingEntries, mergePrerequisites } = loadTs('app/lib/codingDisplay');
const entriesFor = (model, year) => {
  const vehicle = vehicles.find((v) => v.model === model); assert.ok(vehicle);
  return vehicleSpecificCodings(vehicle, year, Boolean(vehicle.sfd1From && year >= vehicle.sfd1From && year < 2024), needsProtectionReview(year));
};

test('all catalog model/year combinations enforce the final year and protection restrictions', () => {
  let combinations = 0;
  for (const vehicle of vehicles) for (let year = vehicle.startYear; year <= vehicle.endYear; year++) {
    const entries = vehicleSpecificCodings(vehicle, year, Boolean(vehicle.sfd1From && year >= vehicle.sfd1From && year < 2024), false);
    combinations++;
    if (year >= 2024) assert.deepEqual(entries, [], `${vehicle.model} ${year}`);
    for (const entry of entries) assert.ok(yearAllowed(entry.name, year), `${vehicle.model} ${year}: ${entry.name}`);
    assert.equal(new Set(entries.map((e) => e.id)).size, entries.length, `${vehicle.model}: duplicate offer IDs`);
  }
  assert.ok(combinations > 700);
});

test('an unmarked 2024 Audi needs review without claiming SFD2 was detected', () => {
  assert.equal(needsProtectionReview(2024), true);
  assert.deepEqual(entriesFor('A6 / S6 C8', 2024), []);
  assert.equal(needsProtectionReview(2023), false);
});

test('MQB-evo assistant entries do not leak to ordinary MQB and SFD1 activations do not return from platform lists', () => {
  assert.ok(!entriesFor('Polo AW', 2022).some((e) => /bis 2023/.test(e.name)));
  assert.ok(!entriesFor('Golf 8 (CD)', 2022).some((e) => /Fernlichtassistent freischalten/.test(e.name)));
  assert.ok(!entriesFor('Octavia 3 5E', 2015).some((e) => /Emergency Assist|Traffic Jam Assist|Trailer Assist/.test(e.name)));
});

test('camera software, licensing, navigation and Travel Assist prerequisites survive grouping', () => {
  const adaptive = entriesFor('Golf 8 (CD)', 2022).find((e) => /Adaptive Spurführung/.test(e.name));
  assert.ok(adaptive?.reviewOnly); assert.match(adaptive.requirements, /Travel Assist ab Werk/);
  const vze = entriesFor('Golf 7 (5G)', 2018).find((e) => /Verkehrszeichenerkennung freischalten/.test(e.name));
  assert.ok(vze?.reviewOnly); assert.match(vze.hardware, /Navigation/); assert.match(vze.hardware, /SWaP\/FEC/);
  const maps = entriesFor('Golf 7 (5G)', 2018).find((e) => /Smartphone-Navigation/.test(e.name));
  assert.match(maps.requirements, /MU1102|MU1367/);
  const rain = entriesFor('Golf 7 (5G)', 2018).find((e) => /Regenschließen/.test(e.name));
  assert.match(rain.hardware, /Sensor|sensor/); assert.match(rain.hardware, /Softwarestand/);
});

test('Apple-only wireless evidence never creates Android support and keeps wired/licensing prerequisites', () => {
  const apple = curateCodingEntries([{ id: 'apple', name: 'Wireless CarPlay aktivieren', price: 35, uiGroup: 'Infotainment', source: 'vehicle', requirements: 'Nur Software P2470 oder höher.' }]);
  assert.equal(apple.length, 1); assert.equal(apple[0].name, 'Apple CarPlay Wireless aktivieren');
  assert.ok(apple[0].reviewOnly); assert.match(apple[0].hardware, /bereits per USB/); assert.match(apple[0].requirements, /P2470/);
  const both = curateCodingEntries([{ id: 'both', name: 'Wireless CarPlay / Android Auto aktivieren', price: 35, uiGroup: 'Infotainment', source: 'vehicle' }]);
  assert.deepEqual(both.map((e) => e.name).sort(), ['Android Auto Wireless aktivieren', 'Apple CarPlay Wireless aktivieren']);
  assert.ok(both.every((e) => e.reviewOnly));
});

test('grouping preserves restrictions from every matching source', () => {
  const entries = curateCodingEntries([
    { id: 'first', name: 'Lane Assist aktivieren', price: 49, uiGroup: 'Assistenz', source: 'vehicle', hardware: 'Kamera A erforderlich.', requirements: 'Nur Software X.', interfaceInfo: 'VCDS nach Prüfung.' },
    { id: 'second', name: 'Lane Assist freischalten', price: 49, uiGroup: 'Assistenz', source: 'platform', hardware: 'Lenkungssteuergerät B erforderlich.', requirements: 'Kalibrierung erforderlich.' },
  ]);
  const lane = entries.find((e) => /Lane Assist – Freischaltung/.test(e.name));
  assert.match(lane.hardware, /Kamera A/); assert.match(lane.hardware, /Lenkungssteuergerät B/);
  assert.match(lane.requirements, /Software X/); assert.match(lane.requirements, /Kalibrierung/);
  assert.match(lane.interfaceInfo, /VCDS/); assert.equal(lane.reviewOnly, true);
});

test('ordinary supported comfort offers remain bookable', () => {
  const entries = entriesFor('Golf 7 (5G)', 2018);
  assert.ok(entries.some((e) => /Komfortblinken/.test(e.name) && !e.reviewOnly));
  assert.ok(entries.some((e) => /Auto-Lock/.test(e.name) && !e.reviewOnly));
  assert.ok(entries.some((e) => /Tagfahrlicht mit Heckleuchten/.test(e.name) && !e.reviewOnly));
});


test('repeated evidence stays readable without dropping specific restrictions', () => {
  assert.equal(mergePrerequisites('Kamera erforderlich. Software X nötig.', 'Kamera erforderlich.'), 'Kamera erforderlich. Software X nötig.');
});
