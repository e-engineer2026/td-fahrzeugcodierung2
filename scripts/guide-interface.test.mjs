import test from "node:test";
import assert from "node:assert/strict";
import { guideInterface } from "../app/lib/guideInterface.ts";
import { guideVehicleRequirements } from "../app/lib/guideVehicleRequirements.ts";

test("VCDS nur bei belegtem reinen Anpassungsschritt", () => {
  assert.equal(guideInterface({ title: "Lane Assist letzte Einstellung speichern", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS / VCP");
  assert.equal(guideInterface({ title: "Coming Home anpassen", interfaceInfo: "VCDS; ggf. VCP oder ODIS", vehicleYear: 2016 }).label, "Interfaceprüfung erforderlich");
});

test("VZE wegen FEC, Kamera und Navigation nicht pauschal für VCDS freigeben", () => {
  assert.equal(guideInterface({ title: "Verkehrszeichenerkennung aktivieren", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS / VCP");
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
  assert.equal(guideInterface({ title: "QQ2 Ambientebeleuchtung", note: "VCP-Parametrierung erforderlich" }).label, "VCP");
  assert.equal(guideInterface({ title: "Kombiinstrument tauschen", note: "Komponentenschutz anlernen" }).label, "ODIS Service (Online)");
  assert.equal(guideInterface({ title: "Area View nachrüsten", note: "SFD2 erforderlich" }).label, "Herstellerfreigabe prüfen");
});

test("Vollständige ACC-Inbetriebnahme nicht als einfache VCDS-Codierung verkaufen", () => {
  assert.equal(guideInterface({ title: "ACC-Radar vollständig nachrüsten", vehicleYear: 2018 }).label, "Inbetriebnahme prüfen");
  assert.equal(guideInterface({ title: "Rückfahrkamera nachrüsten", note: "Datensatz parametrieren" }).label, "VCP");
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
  assert.equal(guideInterface({ title: "R-Mode-Tasten nachrüsten", note: "Gateway-Parametrierung nötig" }).label, "VCP");
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
  assert.equal(golf.sfdNotice, "SFD (1) ab Bj. 2019");
  const born = guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS \/ OBD11",
    vehicleYear: 2021, vehicleEndYear: 2026, platform: "MEB", sfd1From: 2021 });
  assert.equal(born.label, "VCDS / VCP");
  assert.equal(born.sfdNotice, "SFD (1) ab Bj. 2021");
  const oldCar = guideInterface({ title: "Komfortblinken anpassen", interfaceInfo: "VCDS", vehicleYear: 2015 });
  assert.equal(oldCar.sfdNotice, undefined);
});

test("2024er Modelle trotz SFD1 nicht pauschal als VCDS-kompatibel behaupten", () => {
  const recent = guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS",
    vehicleYear: 2024, vehicleEndYear: 2026, platform: "MQBevo", sfd1From: 2024 });
  assert.equal(recent.label, "Herstellerverfahren prüfen");
  assert.equal(recent.sfdNotice, "SFD (1) ab Bj. 2024");
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
  assert.equal(zdc.label, "VCP");
  assert.doesNotMatch(zdc.label, /VCDS/);
  const online = guideInterface({title:"Wegfahrsperre anlernen", vehicleYear:2015});
  assert.equal(online.label, "ODIS Service (Online)");
  const sfd2 = guideInterface({title:"Area View nachrüsten", note:"SFD2 erforderlich", vehicleYear:2025});
  assert.equal(sfd2.label, "Herstellerfreigabe prüfen");
});

test("Audi VZE auf MLB/MLB-evo wird regelmäßig als VCP-Parametrierung dargestellt", () => {
  for (const platform of ["MLB", "MLBevo"]) {
    const audi = guideInterface({ title: "Verkehrszeichenerkennung aktivieren", vehicleBrand: "Audi",
      platform, vehicleYear: 2016, interfaceInfo: "VCDS" });
    assert.equal(audi.label, "VCP");
    assert.match(audi.qualification, /parametriert/);
  }
  const audiA3 = guideInterface({ title: "Verkehrszeichenerkennung aktivieren", vehicleBrand: "Audi",
    platform: "MQB", vehicleYear: 2017, interfaceInfo: "VCDS" });
  assert.equal(audiA3.label, "VCDS / VCP");
  const vw = guideInterface({ title: "Verkehrszeichenerkennung aktivieren", vehicleBrand: "Volkswagen",
    platform: "MQB", vehicleYear: 2017, interfaceInfo: "VCDS" });
  assert.equal(vw.label, "VCDS / VCP");
});

test("VCP für Parameterdateien, ODIS bei SVM, Flash nicht als VCP-only ausgeben", () => {
  const param = guideInterface({ title: "Kamera parametrieren", vehicleBrand: "Audi", vehicleYear: 2019 });
  assert.equal(param.label, "VCP");
  const zdc = guideInterface({ title: "Steuergerät", note: "ZDC Datei aufspielen", vehicleYear: 2019 });
  assert.equal(zdc.label, "VCP");
  const svm = guideInterface({ title: "Steuergerät parametrieren", note: "SVM erforderlich", vehicleYear: 2020 });
  assert.equal(svm.label, "Lizenz/Freigabe prüfen");
  const flash = guideInterface({ title: "Steuergerät flashen", vehicleYear: 2019 });
  assert.equal(flash.label, "Hersteller-/Flashverfahren prüfen");
  const sfd2 = guideInterface({ title: "Kamera parametrieren", note: "SFD2 erforderlich", vehicleYear: 2024 });
  assert.equal(sfd2.label, "Herstellerfreigabe prüfen");
});

test("SFD-Anzeige nur mit kurzen Typ- und Baujahrangaben", () => {
  const a3 = guideInterface({title:"Spiegelabsenkung anpassen", vehicleBrand:"Audi",
    vehicleModel:"A3 / S3 8Y", vehicleYear:2020, sfd1From:2020, platform:"MQBevo"});
  assert.equal(a3.sfdNotice, "SFD (1) ab Bj. 2020 · SFD (2) ab Bj. 2025");
  const born = guideInterface({title:"Spiegelabsenkung anpassen", vehicleBrand:"SEAT / CUPRA",
    vehicleModel:"CUPRA Born K11", vehicleYear:2021, sfd1From:2021, platform:"MEB"});
  assert.equal(born.sfdNotice, "SFD (1) ab Bj. 2021 · SFD (2) ab Bj. 2025");
  const a4 = guideInterface({title:"Verkehrszeichenerkennung aktivieren", vehicleBrand:"Audi",
    vehicleModel:"A4 / S4 B9", vehicleYear:2015, platform:"MLBevo"});
  assert.equal(a4.sfdNotice, "SFD (2) ab Bj. 2024");
  const unknown = guideInterface({title:"Zeigertest", vehicleBrand:"Volkswagen",
    vehicleModel:"Golf 7 (5G)", vehicleYear:2012, platform:"MQB"});
  assert.equal(unknown.sfdNotice, undefined);
  const withoutCoding = guideInterface({title:"45 Watt USB Ladeanschlüsse", note:"Keine Codierung erforderlich",
    vehicleBrand:"Audi", vehicleModel:"A3 / S3 8Y", vehicleYear:2020, sfd1From:2020});
  assert.equal(withoutCoding.sfdNotice, undefined);
});
