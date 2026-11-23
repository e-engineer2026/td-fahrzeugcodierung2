import { test } from "node:test";
import { strict as assert } from "node:assert";
import { assistanceCategoryForName, assistanceCategoryForCoding, ASSISTANCE_CATEGORIES } from "../app/lib/assistanceCategories.ts";

test("Assistenz-Aktivierungen und Anpassungen sind eigene Kategorien", () => {
  assert.deepEqual([...ASSISTANCE_CATEGORIES], ["Assistenzsysteme", "Anpassungen für Assistenzsysteme"]);
});

test("Neue Assistenzsysteme und Freischaltungen bleiben bei Assistenzsysteme", () => {
  const activation = [
    "Lane Assist – Freischaltung",
    "Verkehrszeichenerkennung freischalten",
    "Verkehrszeichenerkennung (VZE / Sign Assist) aktivieren",
    "Fernlichtassistent freischalten",
    "Fernlichtassistent (FLA inkl. DLA) · Volkswagen Golf 7",
    "Dynamisches Fernlicht / DLA freischalten",
    "Adaptive Spurführung aktivieren (bis 2023)",
    "Traffic Jam Assist freischalten",
    "Emergency Assist freischalten",
    "Rückfahrkamera nach Nachrüstung aktivieren",
    "Gespannstabilisierung aktivieren",
  ];
  for (const name of activation) {
    assert.equal(assistanceCategoryForName(name), "Assistenzsysteme", name);
  }
});

test("Einstellungen an vorhandenen Assistenten landen bei Anpassungen", () => {
  const adjustments = [
    "ACC Abstandseinstellung anpassen",
    "ACC Fahrprofilauswahl aktivieren",
    "ACC Schritteinstellung auf 1 km/h ändern",
    "ACC Rechtsüberholsperre anpassen",
    "ACC: RES-Taste zur Beschleunigung nutzen",
    "ACC Grundeinstellung über MMI auswählen",
    "Lane Assist – Einstellungen anpassen",
    "Lane Assist – letzte Einstellung speichern",
    "Lane Assist – Warnung, Lenkeingriff und Vibration anpassen",
    "Spurhalteassistent / Spurverlassenwarnung – Einschaltzustand anpassen (bis 2023)",
    "Front Assist Vorwarnung anpassen",
    "Fernlichtassistent – letzte Einstellung speichern",
    "Light Assist – letzte Einstellung speichern",
    "Rückfahrkamera über Parktaste anzeigen",
    "Rückfahrkamera Abschaltverhalten anpassen",
    "Einparkhilfe automatisch aktivieren",
    "Einparkhilfe Abschaltgeschwindigkeit anpassen",
    "Area View / Surround View Dual View aktivieren",
    "Berganfahrassistent anpassen",
    "Auto Hold anpassen",
  ];
  for (const name of adjustments) {
    assert.equal(assistanceCategoryForName(name), "Anpassungen für Assistenzsysteme", name);
  }
});

test("Altbestand: Anpassungen aus Komfort, Fahrdynamik und allgemeinen Codierungen verschieben", () => {
  const examples = [
    { name: "Einparkhilfe: Audioabsenkung während Parkmanöver ändern", uiGroup: "Komfort" },
    { name: "Aktivierungston der Einparkhilfe anpassen", uiGroup: "Komfort" },
    { name: "Einparkhilfe – Hilfslinien aktivieren/deaktivieren", uiGroup: "Komfort" },
    { name: "Parkhilfe bei niedriger Vorwärtsgeschwindigkeit automatisch aktivieren", uiGroup: "Komfort" },
    { name: "Abschaltgeschwindigkeit für PDC / Rückfahrkamera anpassen", uiGroup: "Komfort" },
    { name: "Berganfahrassistent anpassen", uiGroup: "Fahrdynamik" },
    { name: "ACC-Tempo in 1-km/h-Schritten einstellen", category: "Codierungen" },
    { name: "Front Assist: gewählte Vorwarnstufe beim Start behalten", category: "Assistenzsysteme" },
    { name: "Fernlichtassistent: Stadterkennung individuell konfigurieren", category: "Assistenzsysteme" },
    { name: "Rückfahrkamera über Parktaste anzeigen", category: "Assistenzsysteme" },
  ];
  for (const entry of examples) {
    assert.equal(assistanceCategoryForCoding(entry), "Anpassungen für Assistenzsysteme", entry.name);
  }
});

test("Neue Assistenten bleiben in Assistenzsysteme, Standardfunktionen in der Ursprungsgruppe", () => {
  assert.equal(assistanceCategoryForCoding({name:"Fernlichtassistent freischalten",uiGroup:"Assistenz"}),"Assistenzsysteme");
  assert.equal(assistanceCategoryForCoding({name:"Spurhalteassistent aktivieren",uiGroup:"Assistenz"}),"Assistenzsysteme");
  assert.equal(assistanceCategoryForCoding({name:"Verkehrszeichenerkennung aktivieren",category:"Assistenzsysteme"}),"Assistenzsysteme");
  assert.equal(assistanceCategoryForCoding({name:"Komfortblinken anpassen",uiGroup:"Komfort"}),null);
  assert.equal(assistanceCategoryForCoding({name:"Coming Home anpassen",uiGroup:"Licht"}),null);
});
