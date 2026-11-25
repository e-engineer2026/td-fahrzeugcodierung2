import test from "node:test";
import assert from "node:assert/strict";
import { guideInterface } from "../app/lib/guideInterface.ts";
import { guideVehicleRequirements } from "../app/lib/guideVehicleRequirements.ts";

test("VCDS nur bei belegtem reinen Anpassungsschritt", () => {
  assert.equal(guideInterface({ title: "Lane Assist letzte Einstellung speichern", interfaceInfo: "VCDS", vehicleYear: 2018 }).label, "VCDS / VCP (Codierung)");
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
  assert.equal(guideInterface({ title: "ACC-Radar vollständig nachrüsten", vehicleYear: 2018 }).label, "VCDS / VCP (Codierung) + Fachinbetriebnahme");
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
  }).label, "VCDS / VCP (Codierung)");
});

test("SFD1-Online-Freischaltung und konkretes Baujahr anzeigen", () => {
  const golf = guideInterface({ title: "Zeigertest aktivieren", interfaceInfo: "VCDS",
    vehicleYear: 2019, vehicleEndYear: 2026, platform: "MQBevo", sfd1From: 2019 });
  assert.equal(golf.label, "VCDS / VCP (Codierung)");
  assert.equal(golf.sfdNotice, "SFD (1) ab Bj. 2019");
  const born = guideInterface({ title: "Spiegelabsenkung anpassen", interfaceInfo: "VCDS \/ OBD11",
    vehicleYear: 2021, vehicleEndYear: 2026, platform: "MEB", sfd1From: 2021 });
  assert.equal(born.label, "VCDS / VCP (Codierung)");
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
  }).label, "VCDS / VCP (Codierung)");
  assert.equal(guideInterface({
    title: "Reifendruckkontrolle über ABS aktivieren",
    category: "Codierungen", source: "catalog", vehicleYear: 2015
  }).label, "VCDS / VCP (Codierung)");
  assert.equal(guideInterface({
    title: "Lane Assist Warnverzögerung anpassen",
    category: "Assistenzsysteme", source: "catalog", vehicleYear: 2021, sfd1From: 2021
  }).label, "VCDS / VCP (Codierung)");
});

test("Komplexe Arbeiten ohne nachgewiesenes Verfahren bekommen keine pauschale VCDS-Freigabe", () => {
  assert.equal(guideInterface({
    title: "Wireless CarPlay aktivieren",
    interfaceInfo: "VCDS; ggf. VCP oder ODIS",
    category: "Codierungen", source: "catalog", vehicleYear: 2018
  }).label, "ODIS Service (FEC/SWaP) + ggf. VCDS / VCP");
  assert.equal(guideInterface({
    title: "AHK nachrüsten und codieren",
    category: "Nachrüstungen", source: "research", vehicleYear: 2018
  }).label, "VCDS / VCP (AHK-Codierung)");
  assert.equal(guideInterface({
    title: "Ambientebeleuchtung nachrüsten",
    category: "Nachrüstungen", source: "reference", vehicleYear: 2020
  }).label, "Interfaceprüfung erforderlich");
});

test("VCP für belegte VCDS-Codierungen mitnennen, nicht bei Herstellerfreigaben", () => {
  const coding = guideInterface({title:"Komfortblinken anpassen", interfaceInfo:"VCDS", source:"catalog", category:"Codierungen", vehicleYear:2017});
  assert.equal(coding.label, "VCDS / VCP (Codierung)");
  const zdc = guideInterface({title:"QQ2 Ambientebeleuchtung", note:"VCP-Parametrierung mittels ZDC erforderlich", vehicleYear:2022});
  assert.equal(zdc.label, "VCP");
  assert.doesNotMatch(zdc.label, /VCDS/);
  const online = guideInterface({title:"Wegfahrsperre anlernen", vehicleYear:2015});
  assert.equal(online.label, "ODIS Service (Online)");
  const sfd2 = guideInterface({title:"Area View nachrüsten", note:"SFD2 erforderlich", vehicleYear:2025});
  assert.equal(sfd2.label, "Herstellerfreigabe prüfen");
});

test("Audi VZE: VCP nur bei benötigtem Kameradatensatz", () => {
  for (const platform of ["MLB", "MLBevo"]) {
    const audi = guideInterface({ title: "Verkehrszeichenerkennung aktivieren", vehicleBrand: "Audi",
      platform, vehicleYear: 2016, interfaceInfo: "VCDS" });
    assert.equal(audi.label, "VCDS / VCP (Codierung) · ggf. VCP (Datensatz)");
    assert.match(audi.qualification, /Parametrierung/);
    assert.equal(guideInterface({title:"Verkehrszeichenerkennung aktivieren", vehicleBrand:"Audi", platform,
      vehicleYear:2016, note:"VCP-Parametrierung erforderlich"}).label, "VCP");
    assert.equal(guideInterface({title:"Verkehrszeichenerkennung aktivieren", vehicleBrand:"Audi", platform,
      vehicleYear:2016, note:"Kamera bereits parametriert"}).label, "VCDS / VCP (Codierung)");
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


test("Golf 7 Fahrprofilauswahl: originale Lizenz statt nur VCDS-Schalter", () => {
  const r = guideInterface({ title: "Fahrprofilauswahl aktivieren",
    vehicleBrand:"Volkswagen", platform:"MQB", vehicleYear:2015,
    source:"catalog", category:"Codierungen" });
  assert.equal(r.label, "ODIS Service (SWaP) + VCDS / VCP");
  assert.match(r.qualification, /SWaP/);
});

test("Audi QQ2 mit zusätzlichem Parameterdatensatz braucht VCP", () => {
  const r = guideInterface({ title: "Mehrfarbige Kontur-Ambientebeleuchtung (QQ2) nachrüsten",
    vehicleBrand:"Audi", platform:"MLBevo", vehicleYear:2019, source:"research" });
  assert.equal(r.label, "VCP");
  assert.equal(guideInterface({title:"QQ2 Ambientebeleuchtung", vehicleBrand:"Audi",
    platform:"MLBevo", vehicleYear:2019}).label, "VCDS / VCP (Codierung) · ggf. VCP (Datensatz)");
  assert.equal(guideInterface({title:"QQ2 Ambientebeleuchtung", vehicleBrand:"Audi",
    platform:"MLBevo", vehicleYear:2019, note:"BCM bereits parametriert"}).label, "VCDS / VCP (Codierung)");
});

test("AHK, Drive Select, Easy Entry und Ambientemenü unterstützen reine VCDS/VCP-Codierung", () => {
  const cases = [
    ["Anhängerkupplung codieren", "VCDS / VCP (AHK-Codierung)", "Volkswagen", "MQB"],
    ["Audi Drive Select aktivieren", "VCDS / VCP (Codierung)", "Audi", "MLBevo"],
    ["Easy Entry für Fahrersitz aktivieren", "VCDS / VCP (Sitzeinstellung)", "Škoda", "MQB"],
    ["Ambientebeleuchtung im MMI aktivieren", "VCDS / VCP (Menü) · ggf. VCP (Datensatz)", "Audi", "MLBevo"],
    ["Fernlichtassistent aktivieren", "VCDS / VCP (Codierung)", "Audi", "MLBevo"]
  ];
  for (const [title, label, vehicleBrand, platform] of cases) {
    assert.equal(guideInterface({ title, vehicleBrand, platform, vehicleYear: 2018, source: "catalog",
      category: "Codierungen" }).label, label, title);
  }
});

test("Aktivierbares Cockpit-Layout von notwendigem Softwareverfahren trennen", () => {
  const r = guideInterface({ title:"Sportlayout / RS-Ansicht im Virtual Cockpit aktivieren",
    vehicleBrand:"Audi", platform:"MLBevo", vehicleYear:2018, source:"catalog", category:"Codierungen" });
  assert.match(r.label,/VCDS \/ VCP/);
  assert.match(r.qualification,/Softwarestand/);
});

test("Luftfahrwerk VCDS Grundeinstellung, aber ODIS bei unparametriertem Steuergerät", () => {
  const r = guideInterface({ title:"Luftfahrwerk Niveauanzeige / Lift-Funktion prüfen",
    vehicleBrand:"Audi", platform:"MLBevo", vehicleYear:2018, source:"catalog" });
  assert.equal(r.label,"VCDS (Diagnose/Grundeinstellung) · ggf. ODIS");
});

test("Rückfahrkamera Low gegen parametrisierungspflichtige High-Kamera abgrenzen", () => {
  const low = guideInterface({ title:"Rückfahrkamera aktivieren", source:"catalog",
    vehicleYear:2017, category:"Codierungen" });
  assert.equal(low.label,"VCDS / VCP (Kameracodierung)");
  const high = guideInterface({ title:"Original-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten",
    note:"Datensatz parametrieren", source:"research", vehicleYear:2017 });
  assert.equal(high.label,"VCP");
});

test("Assistenz-Nachrüstung nur als Codierung plus Fachinbetriebnahme", () => {
  const r = guideInterface({ title:"Radar-ACC vollständig nachrüsten",
    source:"research", vehicleYear:2018, category:"Nachrüstungen" });
  assert.equal(r.label,"VCDS / VCP (Codierung) + Fachinbetriebnahme");
  const matrix = guideInterface({ title:"Halogen auf originale LED-Scheinwerfer umrüsten",
    source:"research", vehicleYear:2018, category:"Umbauten" });
  assert.equal(matrix.label,"VCDS / VCP (Codierung) + Kalibrierung");
});

test("Recherchierte Referenzanpassungen sind Kandidaten, keine pauschale Freigabe", () => {
  const r = guideInterface({ title:"ACC-Tempo in 1-km/h-Schritten einstellen",
    source:"reference", vehicleYear:2018 });
  assert.equal(r.label,"VCDS / VCP (Anpassung, modellabhängig)");
  assert.match(r.qualification,/nicht am konkreten Fahrzeug geprüft/);
  const newCar = guideInterface({ title:"ACC-Tempo in 1-km/h-Schritten einstellen",
    source:"reference", vehicleYear:2025 });
  assert.equal(newCar.label,"ODIS Service (Online)");
});

test("Recherche: GRA und direkte Reifendruckkontrolle", () => {
  const gra = guideInterface({title:"VW Polo 6R: Tempomat GRA ohne Multifunktionsanzeige nachrüsten",source:"research",vehicleYear:2010});
  assert.equal(gra.label, "VCDS / VCP (GRA-Codierung) · ggf. ODIS/SWaP");
  const rdk = guideInterface({title:"Direkte Reifendruckkontrolle RDK High nachrüsten",source:"research",vehicleYear:2017});
  assert.equal(rdk.label, "VCDS / VCP (RDK-Codierung)");
});

test("ACC-Anzeigemenü und VZE im Katalog von vollständiger Aktivierung trennen", () => {
  const acc = guideInterface({title:"ACC Fahrprofilauswahl im MMI aktivieren",source:"catalog",vehicleYear:2017});
  assert.equal(acc.label,"VCDS / VCP (ACC-Menü)");
  const vze = guideInterface({title:"Verkehrszeichenerkennung auf geeigneten Fahrzeugen aktivieren",source:"reference",vehicleYear:2017});
  assert.equal(vze.label,"VCDS / VCP (Codieranteil, modellabhängig)");
});

test("Kamera High und Xenon-aLWR nicht als reine Codierung verkaufen", () => {
  const camera = guideInterface({title:"Original-Rückfahrkamera mit dynamischen Hilfslinien nachrüsten",source:"research",vehicleYear:2017});
  assert.equal(camera.label,"VCDS / VCP (Codierung) · ggf. VCP (Datensatz)");
  const lwr = guideInterface({title:"Audi A3 8V: automatische Leuchtweitenregulierung für Xenon nachrüsten",source:"research",vehicleYear:2017});
  assert.equal(lwr.label,"VCDS / VCP (Codierung) + Kalibrierung");
});

test("AID-Umbau benötigt Online-Autorisierung, Blind Spot zusätzliche Inbetriebnahme", () => {
  const aid = guideInterface({title:"Golf 7: Analogtacho auf Active Info Display (AID) umbauen",source:"research",vehicleYear:2015});
  assert.equal(aid.label,"ODIS Service (Online) · ggf. VCP");
  const side = guideInterface({title:"Blind Spot und Ausparkassistent nachrüsten",source:"research",vehicleYear:2017});
  assert.equal(side.label,"VCDS / VCP (Codierung) + Fachinbetriebnahme");
});

test("Neue SFD2-Fahrzeuge ohne Freigabe nicht pauschal als VCDS-kompatibel deklarieren", () => {
  const a = guideInterface({title:"Anhängerkupplung nachrüsten",source:"research",vehicleYear:2025,platform:"MQBevo"});
  assert.equal(a.label,"ODIS Service (Online)");
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

test("Quellenlisten haben für jedes Thema eine vorläufige Werkzeugzuordnung, keine leere Standardanzeige", async () => {
  const { researchedGuides } = await import("../app/data/guideResearch.ts");
  const { referenceIdeas } = await import("../app/data/referenceIdeas.ts");
  assert.ok(researchedGuides.length >= 120);
  assert.ok(referenceIdeas.length >= 100);
  const missing = [];
  const tested = [];
  for (const item of researchedGuides) {
    const r = guideInterface({ id:item.id, title:item.title, note:item.note, source:"research",
      category:item.category, vehicleYear:2018, platform:"MQB" });
    tested.push(r);
    if (!r.label || r.label === "Interfaceprüfung erforderlich") missing.push(item.id);
  }
  for (const idea of referenceIdeas) {
    const r = guideInterface({ id:idea.id, title:idea.title, note:idea.note, source:"reference",
      category:idea.category, vehicleYear:2018, platform:"MQB" });
    tested.push(r);
    if (!r.label || r.label === "Interfaceprüfung erforderlich") missing.push(idea.id);
  }
  assert.deepEqual(missing, []);
  assert.ok(tested.some(r => r.label === "VCP"));
  assert.ok(tested.some(r => r.label.includes("VCDS / VCP")));
});

test("Bisher offene Sonderfälle bekommen nur plausible und entsprechend eingeschränkte Interfaces", () => {
  const tools = [
    { title:"HomeLink-Garagentoröffnung mit Bedienfeld nachrüsten", source:"research", category:"Nachrüstungen", label:"VCDS / VCP" },
    { title:"Elektrisch anklappbare Spiegel mit Umfeldbeleuchtung nachrüsten", source:"research", category:"Nachrüstungen", label:"VCDS / VCP" },
    { title:"Garagentoröffner im Fahrzeug mit passender Hardware nachrüsten", source:"reference", category:"Nachrüstungen", label:"VCDS / VCP" },
    { title:"Nachträgliche Klimaeinstellung konfigurieren", source:"reference", category:"Codierungen", label:"VCDS / VCP" },
  ];
  for (const t of tools) {
    const r=guideInterface({title:t.title,source:t.source,category:t.category,vehicleYear:2017});
    assert.equal(r.label,t.label,t.title);
    assert.match(r.qualification,/je nach|voraussicht|konkreten|fahrzeugseitigen/i);
  }
});

test("SFD2-Prüfvorbehalte sind keine bestätigte Sperre für den gesamten Umbau", () => {
  const optional=guideInterface({title:"VW Golf 8: Radar-ACC vollständig nachrüsten",
    note:"SFD1/SFD2, Assistenzhardware und Kalibrierung vorab prüfen",
    source:"research",category:"Nachrüstungen",platform:"MQBevo",vehicleYear:2020});
  assert.equal(optional.label,"VCDS / VCP (Codierung) + Fachinbetriebnahme");
  const required=guideInterface({title:"Sitzheizung vorne nachrüsten",
    note:"SFD2-Inbetriebnahme nur autorisiert",
    source:"research",category:"Nachrüstungen",vehicleYear:2020});
  assert.equal(required.label,"ODIS Service (Online)");
  const geko=guideInterface({title:"230-V-Steckdose im Fond samt Wechselrichter nachrüsten",
    note:"Anschlussset und Codierung; GeKo/SFD-Status klären",
    source:"research",category:"Nachrüstungen",vehicleYear:2018});
  assert.equal(geko.label,"VCDS / VCP");
});

test("Für recherchierte Quellen keine reinen Status-Texte statt einer Zuordnung", async () => {
  const {researchedGuides}=await import("../app/data/guideResearch.ts");
  const {referenceIdeas}=await import("../app/data/referenceIdeas.ts");
  const unavailable=/^(?:Interfaceprüfung erforderlich|Herstellerverfahren prüfen|Herstellerfreigabe prüfen|Lizenz\/Freigabe prüfen)$/;
  const bad=[];
  for (const x of researchedGuides) {
    const result=guideInterface({id:x.id,title:x.title,note:x.note,source:"research",
      category:x.category,vehicleYear:2018,platform:"MQB"});
    if(unavailable.test(result.label)) bad.push([x.id,result.label]);
  }
  for (const x of referenceIdeas) {
    const result=guideInterface({id:x.id,title:x.title,note:x.note,source:"reference",
      category:x.category,vehicleYear:2018,platform:"MQB"});
    if(unavailable.test(result.label)) bad.push([x.id,result.label]);
  }
  assert.deepEqual(bad,[]);
});

test("Flash-Verfahren und Anbieter-Remote-Inbetriebnahme bleiben von VCP-ZDC getrennt", () => {
  const flash=guideInterface({title:"Steuergerät flashen",source:"research",category:"Umbauten",vehicleYear:2018});
  assert.equal(flash.label,"VCP / ODIS Engineering");
  const remote=guideInterface({title:"360° Kamera nachrüsten",note:"Remote-Erstinbetriebnahme erforderlich",
    source:"research",category:"Nachrüstungen",vehicleYear:2025});
  assert.equal(remote.label,"Anbieter-Remote-Service");
  const parameter=guideInterface({title:"Steuergerät parametrieren",source:"research",vehicleYear:2018});
  assert.equal(parameter.label,"VCP");
});

test("Betreiber-SFD-Liste: Monatsdaten und Steuergeräte vollständig zugeordnet", async () => {
  const { SFD1_CONTROL_UNITS, SFD_VEHICLES, sfdNoticeForVehicle } =
    await import("../app/lib/sfdProtection.ts");
  assert.deepEqual(SFD1_CONTROL_UNITS.map(x => x.address),
    ["01","03","09","15","16","17","19","23","4B","51","5F","75"]);
  assert.ok(SFD_VEHICLES.length >= 50);
  assert.equal(new Set(SFD_VEHICLES.map(x => x.catalogKey)).size, SFD_VEHICLES.length);
  const cases = [
    ["Volkswagen","Golf 8 (CD)","SFD (1) ab Bj. 2019 · SFD (2) ab Bj. 04/2024"],
    ["Audi","Q7 4M","SFD (2) ab Bj. 08/2023"],
    ["Audi","Q4 e-tron (FZ)","SFD (1) ab Bj. 2021 · SFD (2) ab Bj. 11/2023"],
    ["Audi","A6 / S6 C8","SFD (1) ab Bj. 2022 · SFD (2) ab Bj. 2024"],
    ["Škoda","Octavia 4 NX","SFD (1) ab Bj. 2020 · SFD (2) ab Bj. 03/2024"],
    ["SEAT / CUPRA","SEAT Ibiza KJ","SFD (2) ab Bj. 02/2024"],
    ["SEAT / CUPRA","CUPRA Tavascan (KX)","SFD (1) ab Bj. 2023 · SFD (2) ab Bj. 2025"],
    ["Volkswagen","T-Cross C1","SFD (2) ab Bj. 03/2024"],
    ["Volkswagen","T-Roc A11","SFD (2) ab Bj. 03/2024"],
    ["Škoda","Enyaq 5A","SFD (1) ab Bj. 2020 · SFD (2) ab Bj. 2024"],
  ];
  for(const [vehicleBrand,vehicleModel,label] of cases){
    assert.equal(sfdNoticeForVehicle({vehicleBrand,vehicleModel}),label,vehicleModel);
  }
  assert.equal(sfdNoticeForVehicle({vehicleBrand:"Volkswagen",vehicleModel:"Golf 7 (5G)"}),undefined);
});

test("Die neuen SFD-Baujahre werden auch in Codieranleitungen angewendet", () => {
  const a6 = guideInterface({title:"Spiegelanklappen anpassen",vehicleBrand:"Audi",vehicleModel:"A6 / S6 C8",
    platform:"MLBevo",vehicleYear:2018});
  assert.equal(a6.sfdNotice,"SFD (1) ab Bj. 2022 · SFD (2) ab Bj. 2024");
  const golf = guideInterface({title:"Zeigertest",vehicleBrand:"Volkswagen",vehicleModel:"Golf 8 (CD)",
    platform:"MQBevo",vehicleYear:2019,sfd1From:2019});
  assert.equal(golf.sfdNotice,"SFD (1) ab Bj. 2019 · SFD (2) ab Bj. 04/2024");
});
