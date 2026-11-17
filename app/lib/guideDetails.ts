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

const TECHNICAL = /(?:\b(?:PR[\s-]?[A-Z0-9]+|BCM|ABS|CAN|MIB|MMI|AID|SFD\d?|GeKo|SWaP|FEC|SVM|FOD|VCDS|VCP|ODIS|OBD11|ACC|PDC|aLWR|SRA|RDK|DSG)\b|hardware|steuergerät|steuerteil|steuerung|steuerger[aä]te|sensor|kamera|radar|gateway|lenkrad|lenkstock|heizmatte|sitzbez(?:ug|üge)|sitzheizung|klimabedien|climatronic|klimaelektronik|klimasteuer|lichtpaket|leucht|scheinwerfer|spiegel|türgriff|keyless|kessy|kabel|leitun|antenne|lautsprecher|verstärker|schalter|taster|display|navi|infotainment|cockpit|heckklappe|anhänger|schleifring|steckdose|wechselrichter|bedienteil|bremsen|airbag|reinigungsdüse|reifendruck|frontscheibe|sto[ßs]fänger|wischwasser|anschluss|kühlerlüfter|federung|(?:über|unter|ab|bis)\s*\d{1,4}\s*(?:kg|km\/h)|tacho|schlüssel|pin\b|anpassbar|zündung|dwa\b|kombi(?:instrument)?|automatikgetriebe|sitzbelüft|originalteile|steckerbelegung|teilenummer|zugelassen|passend|hardware|software|datensatz|lizenz|freigabe|freischalt|diagnoseaktivier|inbetriebnahme|kalibrier|grundeinstellung|parametrier|codier|modelljahr|baujahr|fahrgestell|fin\b|komponentenschutz|kompatib|geeignet|voraussetz|erforderlich|prüfen|vorhanden|nur bei|nur mit|nur für|nur bis|nur ab|km\/h|nicht bei|nicht für|ab mj|bis mj|vor.?facelift|facelift|linkslenker|rechtslenker|lhd|rhd|motorkennbuchstab|fahrwerk|ausstattungsvariante|pr.code|pr.nummer)/i;

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
  if (/auto.?unlock|automatische entriegel/.test(name)) return "Die Fahrzeugtüren werden bei der vorgesehenen Entriegelungsbedingung automatisch freigegeben.";
  if (/auto.?lock|automatische türverriegel/.test(name)) return "Die Zentralverriegelung kann beim Anfahren automatisch schließen.";
  if (/zeigertest|needle.?sweep|staging/.test(name)) return "Die Zeiger des Kombiinstruments führen beim Start eine kurze Anzeigeanimation aus.";
  if (/coming.?home|leaving.?home/.test(name)) return "Die Außenbeleuchtung wird beim Verlassen oder Annähern an das Fahrzeug zeitgesteuert aktiviert.";
  if (/komfortblinken/.test(name)) return "Die Anzahl der Blinkimpulse beim Antippen des Hebels wird angepasst.";
  if (/regenschließ|regenschliess/.test(name)) return "Die Komfortschließfunktion kann bei erkannten Niederschlägen angestoßen werden.";
  if (/gurtwarn/.test(name)) return "Die optische oder akustische Gurtwarnung wird im vorgesehenen Rahmen angepasst.";
  if (/start.stopp/.test(name)) return "Das Verhalten der Start-Stopp-Funktion wird in den verfügbaren Einstellungen angepasst.";
  if (/öltemperatur|oeltemperatur|nachtankmenge|ganganzeige|laptimer/.test(name)) return "Zusätzliche Fahrzeugwerte können im unterstützten Kombiinstrument angezeigt werden.";
  if (/tagfahrlicht|\btfl\b/.test(name)) return "Die Schaltung vorhandener Tagfahrlicht- und Außenlichtfunktionen wird angepasst.";
  if (/fenster.*komfort|komfortöffnung|komfortschließung/.test(name)) return "Vorhandene Fensterfunktionen lassen sich über die vorgesehenen Komfortbedienelemente steuern.";
  if (/stauassistent|traffic.?jam/.test(name)) return "Die Funktion kombiniert unterstützte Abstands- und Spurhaltefunktionen im zähfließenden Verkehr.";
  if (/acc.*(?:tempo|schritt|intervall|abstandseinstell)/.test(name)) return "Die vorhandene Abstandsregelung wird in ihrem Bedien- oder Regelverhalten angepasst.";
  if (/(?:reifendruck|rdk).*\bhigh\b|direkte reifendruckkontrolle/.test(name)) return "Die direkte Reifendrucküberwachung kann fahrzeugseitige Druckwerte je Rad anzeigen.";
  if (/reifendruck|\brdk\b/.test(name)) return "Reifendruckinformationen werden abhängig vom vorhandenen System ausgewertet und dargestellt.";
  if (/rückfahrkamera|rueckfahrkamera/.test(name)) return "Das Kamerabild unterstützt die Sicht nach hinten beim Rangieren; Hilfslinien hängen vom System ab.";
  if (/360.?|area.?view|umgebungsansicht/.test(name)) return "Mehrere Kameraansichten unterstützen die Orientierung beim Rangieren.";
  if (/multifunktionslenkrad|lenkrad.*(?:mufu|acc.tasten|schaltwippen)|schaltwippen/.test(name)) return "Zusätzliche Bedienelemente am Lenkrad werden in die unterstützten Fahrzeugfunktionen eingebunden.";
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
  return value.split(/;\s*/u).map(normalize).filter(Boolean);
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
    // Produkt-/Fremdanleitungs-Metadaten entfernen, ohne konkrete
    // Software-, PR- oder Hardwareinformationen zu verlieren.
    if (/^(?:anbieter|hersteller) sucht (?:aktuell |derzeit )?(?:probeverbau|testfahrzeug)|^derzeit probeverbau|^keine allgemeine (?:komplettanleitung|verfügbarkeit)|^anbieterleistung|^die ausgewählte Produktseite|^einbau nur beim anbieter|^werkstatteinbau, keine frei verfügbare|^KUFATEC weist ausdrücklich aus/i.test(cleaned)) continue;
    cleaned = cleaned
      .replace(/Einbauanleitung inklusive anschließender Codierung mit\s+(VCDS|VCP|ODIS)/gi, "Codierung mit $1")
      .replace(/(?:\s+und\s+|,\s*)?(?:(?:deutschsprachige|bebilderte|vollständige|öffentliche|freie)\s+)?(?:Einbauanleitung|Einbauvorschau|Anleitungsvorschau|Anschlussanleitung(?:s-Vorschau)?|Montageanleitung)\b[^,;]*/gi, "")
      .replace(/,?\s*(?:vollständige|öffentliche|freie|deutschsprachige|bebilderte)\s+(?:Einbau|Codier)?anleitung\b[^,;]*/gi, "")
      .replace(/,?\s*Anleitung nach Kauf\b[^,;]*/gi, "")
      .replace(/\b(?:bei|vom) Anbieter vor Ort\b/gi, "")
      .replace(/\b(?:laut Anbieter|laut Hersteller|laut Quelle)\s*/gi, "")
      .replace(/^Anbieter (?:nennt|verlangt|bietet|weist aus)\s*(?:für [^,;]+)?[,;:]?\s*/i, "")
      .replace(/\bKUFATEC nennt ausdrücklich den\s*/gi, "")
      .replace(/\bKUFATEC-Mehrmodellfreigabe\b/gi, "Mehrmodellfreigabe")
      .replace(/^KUFATEC weist ausdrücklich aus,?\s*/i, "")
      .replace(/^Keine allgemeine VCDS-Anleitung,?\s*/i, "")
      .replace(/,?\s*keine allgemeine VCDS-Anleitung\b/gi, "")
      .replace(/^Werkstatteinbau,?\s*keine frei verfügbare Komplettanleitung\b/gi, "")
      .replace(/\bAnbieter-Einschränkung\b/gi, "Einschränkung")
      .replace(/\bNICHT den Polo AW\b/g, "nicht Polo AW")
      .replace(/,?\s*keine (?:öffentliche|frei verfügbare|allgemeine) (?:Codier)?anleitung(?:en)?(?: verfügbar)?/gi, "")
      .replace(/,?\s*keine allgemeine Komplettanleitung/gi, "")
      .replace(/,?\s*keine regulär freigegebene Komplettlösung/gi, "")
      .replace(/,?\s*Anbieterleistung\b/gi, "")
      .trim()
      .replace(/(?:\s+(?:mit|und)|,|:)+$/i, "")
      .replace(/^(?:,|;)+\s*/, "")
      .trim();
    if (!cleaned || /^(?:werkstatteinbau|keine anleitung verfügbar)/i.test(cleaned)) continue;
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
