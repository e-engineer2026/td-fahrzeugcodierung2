/**
 * Kundenansicht der PDF-Themen: Funktionsbeschreibung und tatsächliche
 * Hardware-/Technikvoraussetzungen stehen getrennt, ohne doppelte Textteile.
 * Grundlage sind die hinterlegten Themen und Quellenhinweise. Es werden
 * keine Freischaltungen, Lizenzen oder verbauten Steuergeräte vorausgesetzt.
 */
export type GuideDetails = {
  prerequisites: string | null;
  description: string | null;
};

type GuideDetailsInput = {
  title: string;
  note?: string;
  explicitHardware?: string;
  interfaceInfo?: string;
  activation?: string;
};

const TECHNICAL = /(?:\b(?:PR[\s-]?[A-Z0-9]|BCM|ABS|CAN|MIB|MMI|AID|SFD\d?|GeKo|SWaP|FEC|SVM|FOD|VCDS|VCP|ODIS|OBD11|ACC|PDC|aLWR|SRA|RDK|DSG)\b|hardware|steuergerät|steuerteil|steuerung|steuerger[aä]te|sensor|kamera|radar|gateway|lenkrad|lenkstock|heizmatte|sitzbez(?:ug|üge)|sitzheizung|klimabedien|climatronic|klimaelektronik|klimasteuer|lichtpaket|leucht|scheinwerfer|spiegel|türgriff|keyless|kessy|kabel|leitun|antenne|lautsprecher|verstärker|schalter|taster|display|navi|infotainment|cockpit|heckklappe|anhänger|schleifring|steckdose|wechselrichter|bedienteil|bremsen|airbag|reinigungsdüse|reifendruck|frontscheibe|sto[ßs]fänger|wischwasser|anschluss|tacho|schlüssel|pin\b|anpassbar|zündung|hardware|software|datensatz|lizenz|freigabe|freischalt|kalibrier|grundeinstellung|parametrier|codier|modelljahr|baujahr|fahrgestell|fin\b|komponentenschutz|kompatib|geeignet|voraussetz|erforderlich|prüfen|vorhanden|nur bei|nur mit|nur für|nur bis|nur ab|km\/h|nicht bei|nicht für|ab mj|bis mj|vor.?facelift|facelift|linkslenker|rechtslenker|lhd|rhd|motorkennbuchstab|fahrwerk|ausstattungsvariante|pr.code|pr.nummer)/i;

const NON_REQUIREMENT_META = /(?:\banleitung(?:svorschau|en)?\b|\beinbauanleitung\b|\banschlussanleitung\b|\bvollversion\b|\bkomplettanleitung\b|\bproduktseite\b|\bproduktkauf\b|\bherstellerseite\b|\bquelle\b|\bpraxisbericht\b|\bprobeverbau\b|\btestfahrzeug\b|\böffentlich\b|\bangebot\b|\bkufatec\b)/i;

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\s*[.;]\s*$/, "").trim();
}

function key(value: string): string {
  return normalize(value).toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function addUnique(list: string[], value: string): void {
  const cleaned = normalize(value);
  const token = key(cleaned);
  if (!token || list.some((existing) => key(existing) === token)) return;
  list.push(cleaned);
}

/** Nur eine kurze Funktionsbeschreibung, kein zweites Mal die Voraussetzung. */
function explanationFromTitle(title: string): string | null {
  const name = title.toLocaleLowerCase("de");
  if (/reifendruck|\brdk\b/.test(name)) return "Reifendruckinformationen werden je nach System direkt oder indirekt im Fahrzeug bereitgestellt.";
  if (/rückfahrkamera|rueckfahrkamera/.test(name)) return "Das Kamerabild unterstützt die Sicht nach hinten beim Rangieren; Hilfslinien hängen vom System ab.";
  if (/360.?|area.?view|umgebungsansicht/.test(name)) return "Mehrere Kameraansichten unterstützen die Orientierung beim Rangieren.";
  if (/side assist|blind.?spot|spurwechsel/.test(name)) return "Das System kann Fahrzeuge im seitlichen Rückraum erkennen und Warnungen anzeigen.";
  if (/lane assist|spurhalte|spurführung/.test(name)) return "Die Funktion unterstützt beim Halten der Fahrspur, soweit die Fahrzeugausstattung dies ermöglicht.";
  if (/verkehrszeichenerkennung|vze\b/.test(name)) return "Unterstützte Verkehrszeichen können im Fahrzeug angezeigt werden.";
  if (/fernlichtassistent|light assist/.test(name)) return "Das Fernlicht wird abhängig von der erkannten Verkehrssituation gesteuert.";
  if (/geschwindigkeitsbereich.*acc|acc.*(?:160|210).?km/.test(name)) return "Der nutzbare Geschwindigkeitsbereich der Abstandsregelung wird angepasst.";
  if (/\bacc\b|\bpacc\b|abstandsregel/.test(name)) return "Die adaptive Geschwindigkeitsregelung passt den Abstand zum vorausfahrenden Verkehr an.";
  if (/parklenk|park assist|einparkhilfe|\bpdc\b/.test(name)) return "Das Einpark- bzw. Parkassistenzsystem stellt unterstützte Rangierfunktionen bereit.";
  if (/anhänger|\bahk\b/.test(name)) return "Die Anhängererkennung wird in die beteiligten Fahrzeugfunktionen eingebunden.";
  if (/matrix|iq.?light|kurvenlicht|xenon|led.scheinwerfer/.test(name)) return "Die vorhandenen Lichtfunktionen werden elektronisch angesteuert und an die Fahrzeugkonfiguration angepasst.";
  if (/ambient|fußraumbeleuchtung|fussraumbeleuchtung/.test(name)) return "Die vorgesehenen Lichtbereiche lassen sich über die Fahrzeugsteuerung anpassen.";
  if (/kessy|keyless/.test(name)) return "Unterstützt schlüssellose Zugangs- oder Startfunktionen, abhängig von der Ausstattung.";
  if (/tempomat|\bgra\b|geschwindigkeitsregel/.test(name)) return "Die Geschwindigkeit lässt sich über die vorgesehene Bedienung regeln.";
  if (/virtual cockpit|active info display|digital cockpit|\baid\b|kombiinstrument/.test(name)) return "Fahrzeug- und Anzeigedaten werden über das Kombiinstrument dargestellt.";
  if (/mib[12]|mmi|infotainment/.test(name)) return "Das Infotainmentsystem wird elektronisch eingebunden bzw. angepasst.";
  if (/sitzheizung/.test(name)) return "Die Sitztemperatur wird über die dazugehörigen Fahrzeugbedienelemente geregelt.";
  if (/standheizung/.test(name)) return "Die Heizfunktion kann über die unterstützten Bedienelemente gesteuert werden.";
  if (/elektrische heckklappe|easy open/.test(name)) return "Die Heckklappenbetätigung wird in die Komfortfunktionen eingebunden.";
  if (/usb|ladehub|lademodul|phone box|qi.laden/.test(name)) return "Die vorhandenen Lade- und Anschlussmöglichkeiten werden erweitert.";
  if (/spiegelabsenk|spiegelanklapp|anklappbare spiegel/.test(name)) return "Die Spiegelbewegung wird mit den Komfortfunktionen verknüpft.";
  if (/licht.?regensensor|regen.?lichtsensor/.test(name)) return "Licht- und Wischerfunktionen können abhängig von den Sensordaten arbeiten.";
  return null;
}

function splitClauses(value?: string): string[] {
  if (!value?.trim()) return [];
  return value.split(/;\s*|\.\s+(?=[A-ZÄÖÜ])/u).map(normalize).filter(Boolean);
}

/** Getrennte, bereinigte Inhalte für die beiden Tabellenspalten. */
export function guideDetails(input: GuideDetailsInput): GuideDetails {
  const prerequisites: string[] = [];
  const descriptions: string[] = [];

  if (input.explicitHardware?.trim()) addUnique(prerequisites, input.explicitHardware);

  for (const clause of [...splitClauses(input.note), ...splitClauses(input.activation)]) {
    // Quellen-/Verkaufstexte sind weder Voraussetzungen noch Funktionsbeschreibung.
    // Technische Angaben im selben Teilsatz werden nicht verworfen.
    if (NON_REQUIREMENT_META.test(clause) && !TECHNICAL.test(clause)) continue;
    let cleaned = clause.replace(/^(?:laut (?:anbieter|quelle|hersteller)\s*[:,]?\s*)/i, "").trim();
    // Metatext vor dem eigentlichen technischen Inhalt entfernen.
    cleaned = cleaned.replace(/^(?:keine geprüfte Komplettanleitung|keine frei verfügbare Anleitung|Anleitungsvorschau|Praxisbericht|Einbauanleitung|vollständige Anleitung)\s*[,;:]\s*/i, "");
    cleaned = cleaned.replace(/^Anleitung (?:und|mit)\s+(?=(?:Software|Hardware|Steuergerät|Freischaltung))/i, "");
    if (!cleaned) continue;
    if (/^(?:keine|ohne) (?:zusätzliche )?codierung(?: erforderlich)?$/i.test(cleaned)) continue;
    if (NON_REQUIREMENT_META.test(cleaned) && /^(?:anleitung|einbauanleitung|anschlussanleitung|vollversion|produkt|praxisbericht|testfahrzeug)/i.test(cleaned)) continue;

    if (TECHNICAL.test(cleaned)) {
      // Werkstatttätigkeiten sind kein technischer Zwang, die nötigen Bauteile schon.
      cleaned = cleaned.replace(/\b(müssen|muss) vom Sattler eingebaut werden\b/gi, "sind erforderlich")
        .replace(/\bvom Reifendienst (?:montieren|montiert werden)\b/gi, "erforderlich");
      addUnique(prerequisites, cleaned);
    } else if (!NON_REQUIREMENT_META.test(cleaned)) {
      addUnique(descriptions, cleaned);
    }
  }

  if (input.interfaceInfo?.trim()) addUnique(prerequisites, input.interfaceInfo);

  const explanation = explanationFromTitle(input.title);
  if (explanation && !descriptions.some((value) => key(value) === key(explanation))) {
    descriptions.unshift(normalize(explanation));
  }

  // Nur sinnvolle Zusatzinformation aufklappbar machen, keine leeren Floskeln.
  return {
    prerequisites: prerequisites.length ? prerequisites.join("; ") : null,
    description: descriptions.length ? descriptions.slice(0, 3).join(". ") + "." : null
  };
}
