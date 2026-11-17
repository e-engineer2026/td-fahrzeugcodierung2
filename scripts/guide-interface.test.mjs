import test from "node:test";
import assert from "node:assert/strict";
import { guideInterface } from "../app/lib/guideInterface.ts";
import { guideVehicleRequirements } from "../app/lib/guideVehicleRequirements.ts";

test("VCDS nur bei belegtem reinen Anpassungsschritt", () => {
  assert.equal(guideInterface({ title: "Lane Assist letzte Einstellung speichern", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS / VCP");
  assert.equal(guideInterface({ title: "Coming Home anpassen", interfaceInfo: "VCDS; ggf. VCP oder ODIS", vehicleYear: 2016 }).label, "Interfaceprüfung erforderlich");
});

test("VZE wegen FEC, Kamera und Navigation nicht pauschal für VCDS freigeben", () => {
  assert.equal(guideInterface({ title: "Verkehrszeichenerkennung aktivieren", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS / VCP (Codierung)");
  const hardware = guideVehicleRequirements({ title: "Verkehrszeichenerkennung aktivieren" });
  assert.match(hardware, /Front-\/Umfeldkamera/);
  assert.match(hardware, /Navigationssystem/);
  assert.match(hardware, /FEC-\/SWaP/);
});

test("AHK: benötigte Steuergeräte und Software benennen", () => {
  const requirements = guideVehicleRequirements({ title: "AHK nachrüsten", note: "SFD2 zu prüfen" });
  assert.match(requirements, /Anhängerkupplung|AHK/);
  assert.match(requirements, /Anhängersteuergerät/);
  assert.match(requirements, /Softwarestand/);
  assert.match(requirements, /SFD2/);
});

test("VCP-ZDC statt VCDS und GeKo statt VCP für Online-Schutz", () => {
  assert.equal(guideInterface({ title: "QQ2 Ambientebeleuchtung", note: "VCP-Parametrierung erforderlich" }).label, "VCP (Parametrierung)");
  assert.equal(guideInterface({ title: "Kombiinstrument tauschen", note: "Komponentenschutz anlernen" }).label, "ODIS Service (Online)");
  assert.equal(guideInterface({ title: "Area View nachrüsten", note: "SFD2 erforderlich" }).label, "Herstellerfreigabe prüfen");
});

test("Vollständige ACC-Inbetriebnahme nicht als einfache VCDS-Codierung verkaufen", () => {
  assert.equal(guideInterface({ title: "ACC-Radar vollständig nachrüsten", vehicleYear: 2018 }).label, "Inbetriebnahme prüfen");
  assert.equal(guideInterface({ title: "Rückfahrkamera nachrüsten", note: "Datensatz parametrieren" }).label, "Parametrierung prüfen");
});

test("Codierfreie Maßnahmen benötigen kein Interface", () => {
  assert.equal(guideInterface({ title: "USB-Ladehub nachrüsten", note: "Laut Anbieter keine Codierung erforderlich" }).label, "Nicht erforderlich");
});

test("Neuere SFD2-Plattform ohne Nachweis nicht pauschal mit VCDS anbieten", () => {
  assert.equal(guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS", vehicleYear: 2025 }).label, "Herstellerverfahren prüfen");
});


test("GeKo-Status allein ist kein Beweis für eine zwingende ODIS-Maßnahme", () => {
  assert.equal(guideInterface({ title: "230-V-Steckdose nachrüsten", note: "GeKo/SFD-Status klären" }).label, "Herstellerfreigabe prüfen");
  assert.equal(guideInterface({ title: "Side Assist nachrüsten", note: "Nur mit berechtigtem GeKo freigeben" }).label, "ODIS Service (Online)");
});

test("Gateway-Datensatz nicht ohne Werkzeugnachweis als VCP ausgeben", () => {
  assert.equal(guideInterface({ title: "R-Mode-Tasten nachrüsten", note: "Gateway-Parametrierung nötig" }).label, "Parametrierung prüfen");
});

test("Modellreihe mit möglichen SFD2-Baujahren erfordert zusätzliche Prüfung", () => {
  assert.equal(guideInterface({
    title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS", platform: "MQBevo",
    vehicleYear: 2020, vehicleEndYear: 2026
  }).label, "VCDS / VCP");
});

test("SFD1-Online-Freischaltung und konkretes Baujahr anzeigen", () => {
  const golf = guideInterface({ title: "Zeigertest aktivieren", interfaceInfo: "VCDS",
    vehicleYear: 2019, vehicleEndYear: 2026, platform: "MQBevo", sfd1From: 2019 });
  assert.equal(golf.label, "VCDS / VCP");
  assert.match(golf.sfdNotice, /Baujahr 2019/);
  assert.match(golf.sfdNotice, /VCDS-Online-Freischaltung/);
  const born = guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS \/ OBD11",
    vehicleYear: 2021, vehicleEndYear: 2026, platform: "MEB", sfd1From: 2021 });
  assert.equal(born.label, "VCDS / VCP");
  assert.match(born.sfdNotice, /Baujahr 2021/);
  const oldCar = guideInterface({ title: "Komfortblinken anpassen", interfaceInfo: "VCDS", vehicleYear: 2015 });
  assert.equal(oldCar.sfdNotice, undefined);
});

test("2024er Modelle trotz SFD1 nicht pauschal als VCDS-kompatibel behaupten", () => {
  const recent = guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS",
    vehicleYear: 2024, vehicleEndYear: 2026, platform: "MQBevo", sfd1From: 2024 });
  assert.equal(recent.label, "Herstellerverfahren prüfen");
  assert.match(recent.sfdNotice, /Baujahr 2024/);
});


test("Eigene Standardcodierungen erhalten eine funktionsbezogene Interfacezuordnung", () => {
  assert.equal(guideInterface({
    title: "Komfortblinken Anzahl Blinkzyklen ändern",
    interfaceInfo: "VCDS; je nach Steuergerät ggf. VCP oder ODIS",
    category: "Codierungen", source: "catalog", vehicleYear: 2015
  }).label, "VCDS / VCP");
  assert.equal(guideInterface({
    title: "Reifendruckkontrolle über ABS aktivieren",
    category: "Codierungen", source: "catalog", vehicleYear: 2015
  }).label, "VCDS / VCP");
  assert.equal(guideInterface({
    title: "Lane Assist Warnverzögerung anpassen",
    category: "Assistenzsysteme", source: "catalog", vehicleYear: 2021, sfd1From: 2021
  }).label, "VCDS / VCP");
});

test("Komplexe Arbeiten ohne nachgewiesenes Verfahren bekommen keine pauschale VCDS-Freigabe", () => {
  assert.equal(guideInterface({
    title: "Wireless CarPlay aktivieren",
    interfaceInfo: "VCDS; ggf. VCP oder ODIS",
    category: "Codierungen", source: "catalog", vehicleYear: 2018
  }).label, "Interfaceprüfung erforderlich");
  assert.equal(guideInterface({
    title: "AHK nachrüsten und codieren",
    category: "Nachrüstungen", source: "research", vehicleYear: 2018
  }).label, "Interfaceprüfung erforderlich");
  assert.equal(guideInterface({
    title: "Ambientebeleuchtung nachrüsten",
    category: "Nachrüstungen", source: "reference", vehicleYear: 2020
  }).label, "Interfaceprüfung erforderlich");
});

test("VCP für belegte VCDS-Codierungen mitnennen, nicht bei Herstellerfreigaben", () => {
  const coding = guideInterface({title:"Komfortblinken anpassen", interfaceInfo:"VCDS", source:"catalog", category:"Codierungen", vehicleYear:2017});
  assert.equal(coding.label, "VCDS / VCP");
  const zdc = guideInterface({title:"QQ2 Ambientebeleuchtung", note:"VCP-Parametrierung mittels ZDC erforderlich", vehicleYear:2022});
  assert.equal(zdc.label, "VCP (Parametrierung)");
  assert.doesNotMatch(zdc.label, /VCDS/);
  const online = guideInterface({title:"Wegfahrsperre anlernen", vehicleYear:2015});
  assert.equal(online.label, "ODIS Service (Online)");
  const sfd2 = guideInterface({title:"Area View nachrüsten", note:"SFD2 erforderlich", vehicleYear:2025});
  assert.equal(sfd2.label, "Herstellerfreigabe prüfen");
});
