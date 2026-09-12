import type { PlatformCodingGroup } from "../data/platformCodingPricing";

export type UnifiedCodingEntry = {
  id: string;
  name: string;
  price: number;
  uiGroup: PlatformCodingGroup;
  hardware?: string;
  requirements?: string;
  sfd?: "Ja" | "Nein" | "Unklar";
  source: "vehicle" | "platform";
};

type CuratedAssistRule = {
  name: string;
  price: number;
  match: RegExp;
};

const curatedAssistRules: CuratedAssistRule[] = [
  // Freischaltungen / Aktivierungen zuerst
  { name: "Klassischen Tempomat freischalten", price: 25, match: /(klassisch.*tempomat|tempomat.*keine abstandsregelung|tempomat.*ohne abstandsregelung)/i },
  { name: "Geschwindigkeitsbegrenzer freischalten", price: 25, match: /(geschwindigkeits.?begrenzer|geschwindigkeits.?limiter|speed.?limiter)/i },
  { name: "Lane Assist – Freischaltung", price: 65, match: /(lane assist|spurhalteassistent).*(freischalt|aktivier)/i },
  { name: "Traffic Jam Assist freischalten", price: 85, match: /(traffic jam assist|stauassistent)/i },
  { name: "Emergency Assist freischalten", price: 85, match: /emergency assist/i },
  { name: "Verkehrszeichenerkennung freischalten", price: 55, match: /verkehrszeichenerkennung/i },
  { name: "Fernlichtassistent freischalten", price: 55, match: /(?=.*(fernlichtassistent|light assist|\bhba\b))(?=.*(freischalt|aktivier))(?!.*(dynamic|dynamisch|\bdla\b|matrix))/i },
  { name: "Dynamisches Fernlicht / DLA freischalten", price: 75, match: /(dynamic light assist|dynamisches fernlicht|dynamischer lichtassistent|\bdla\b|matrix.?licht|matrix led)/i },
  { name: "Trailer Assist freischalten", price: 55, match: /(anhängerrangierassistent|anhaengerrangierassistent|trailer assist)/i },
  { name: "Park Assist freischalten", price: 55, match: /(intelligenter park assist|park assist|einparkassistent|parklenkassistent|\bipa\b)/i },
  { name: "Manövrierassistent freischalten", price: 55, match: /(manövrierassistent|manoevrierassistent)/i },
  { name: "Rückfahrkamera freischalten", price: 45, match: /(?=.*(rückfahrkamera|rueckfahrkamera|rear view))(?=.*(freischalt|aktivier|nachrüstung|nachruestung))/i },
  { name: "Bergabfahrassistent freischalten", price: 35, match: /bergabfahrassistent/i },
  { name: "Prädiktiven Effizienzassistenten aktivieren", price: 35, match: /(prädiktiv.*effizienz|praediktiv.*effizienz|effizienzassistent)/i },
  { name: "Gespannstabilisierung aktivieren", price: 25, match: /gespannstabilisierung/i },

  // Danach reine Einstellungen / Anpassungen
  { name: "ACC Abstandseinstellung anpassen", price: 20, match: /acc.*abstandseinstellung/i },
  { name: "ACC Fahrprofilauswahl aktivieren", price: 35, match: /acc.*fahrprofil/i },
  { name: "ACC Schritteinstellung auf 1 km/h ändern", price: 25, match: /acc.*(schritteinstellung|1\s*km\/h|1km\/h)/i },
  { name: "ACC Rechtsüberholsperre anpassen", price: 20, match: /(acc.*rechts.*überhol|rechtsüberholen.*acc)/i },
  { name: "Lane Assist – Einstellungen anpassen", price: 20, match: /(?=.*(lane assist|spurhalteassistent))(?=.*(einstell|eingriff|warn|vibration|lenkunterstützung|lenkunterstuetzung|empfindlichkeit|fahrerinaktivität|fahrerinaktivitaet|speicher|inaktiv))(?!.*(freischalt|aktivier))/i },
  { name: "Travel Assist Einstellungen anpassen", price: 55, match: /travel assist/i },
  { name: "Front Assist Vorwarnung anpassen", price: 20, match: /front assist.*vorwarn/i },
  { name: "Fernlichtassistent Einstellungen anpassen", price: 20, match: /(?=.*(fernlichtassistent|light assist|\bhba\b))(?=.*(einstell|reset|stadt|einschalt|ausschalt|speicher))(?!.*(dynamic|dynamisch|\bdla\b|matrix|freischalt|aktivier))/i },
  { name: "Einparkhilfe automatisch aktivieren", price: 20, match: /einparkhilfe.*automatische aktivierung/i },
  { name: "Einparkhilfe Abschaltgeschwindigkeit anpassen", price: 20, match: /einparkhilfe.*abschaltgeschwindigkeit/i },
  { name: "Einparkhilfe Bordsteinabstand anpassen", price: 20, match: /einparkhilfe.*bordsteinabstand/i },
  { name: "Einparkhilfe Anzeige anpassen", price: 20, match: /einparkhilfe.*(darstellung|anzeige|hilfslinien)/i },
  { name: "Area View / Surround View Dual View aktivieren", price: 55, match: /(dual.*(area view|surround)|area view.*dual|surround.*dual)/i },
  { name: "Rückfahrkamera Abschaltverhalten anpassen", price: 45, match: /(?=.*(rückfahrkamera|rueckfahrkamera|rear view))(?=.*(deaktivierung|abschalt|geschwindigkeit|heckklappe|waschfunktion))(?!.*(freischalt|aktivier|nachrüstung|nachruestung))/i },
  { name: "Berganfahrassistent anpassen", price: 25, match: /berganfahrassistent/i },
  { name: "Auto Hold anpassen", price: 20, match: /auto[ -]?hold/i },
];

function curateAssistEntries(entries: UnifiedCodingEntry[]): UnifiedCodingEntry[] {
  const assistCandidate = (entry: UnifiedCodingEntry) =>
    entry.uiGroup === "Assistenz" ||
    /(tempomat|speed.?limiter|geschwindigkeits.?begrenzer|geschwindigkeits.?limiter|bergabfahrassistent|berganfahrassistent|auto[ -]?hold|gespannstabilisierung|manövrierassistent|manoevrierassistent|anhängerrangierassistent|anhaengerrangierassistent)/i.test(entry.name);

  const candidates = entries.filter(assistCandidate);
  const otherEntries = entries.filter((entry) =>
  !assistCandidate(entry) &&
  !/(ausstiegswarnung|front.*kamera.*kalibrier|vorfeldkamera.*kalibrier)/i.test(entry.name)
);

  const curated = curatedAssistRules.flatMap((rule, index) => {
    const matches = candidates.filter((entry) => rule.match.test(entry.name));
    if (!matches.length) return [];

    const source = matches[0];
    const sfd = matches.some((entry) => entry.sfd === "Ja")
      ? "Ja" as const
      : matches.some((entry) => entry.sfd === "Unklar")
        ? "Unklar" as const
        : matches.some((entry) => entry.sfd === "Nein")
          ? "Nein" as const
          : undefined;

    return [{
      ...source,
      id: `assist-curated-${index}`,
      name: rule.name,
      price: rule.price,
      uiGroup: "Assistenz" as const,
      sfd,
    }];
  });

  return [...otherEntries, ...curated];
}

type CuratedComfortRule = {
  name: string;
  price: number;
  match: RegExp;
};

const curatedComfortRules: CuratedComfortRule[] = [
  { name: "Auto-Lock / Auto-Unlock anpassen", price: 15, match: /(auto[- ]?lock|auto[- ]?unlock)/i },
  { name: "KESSY / Keyless – Funktionen anpassen", price: 25, match: /(kessy|keyless)/i },
  { name: "Automatisches Verriegeln / Entriegeln anpassen", price: 20, match: /(automatisch.*(verriegel|entriegel)|(verriegel|entriegel).*automatisch)/i },
  { name: "Einzeltüröffnung / Safe-Lock anpassen", price: 20, match: /(einzeltüröffnung|einzeltueroeffnung|safe[- ]?lock)/i },
  { name: "Akustische / optische Verriegelungsquittierung", price: 15, match: /(hornquittierung|quittierungston|quittierung.*(verriegel|entriegel)|optische rückmeldung|optischen rückmeld)/i },
  { name: "Diebstahlwarnanlage – Einstellungen anpassen", price: 25, match: /(\bdwa\b|diebstahlwarnanlage)/i },

  { name: "Komfort-Fensterbedienung aktivieren", price: 15, match: /(komfort[- ]?fensterbedienung|komfortbedienung.*fenster|fenster.*komfort)/i },
  { name: "Fensterbedienung bei Zündung / Türöffnung anpassen", price: 20, match: /(fensterbedienung|fensterheber|freigabenachlauf|short[- ]?drop)/i },
  { name: "Regenschließen aktivieren", price: 25, match: /regenschließ|regenschliess/i },
  { name: "Schiebedach – Komfortöffnen / Komfortschließen", price: 20, match: /schiebedach.*komfort(öffnen|oeffnen|schließen|schliessen)/i },
  { name: "Schiebedach – Einstellungen anpassen", price: 20, match: /schiebedach/i },

  { name: "Außenspiegel automatisch anklappen", price: 25, match: /spiegel.*(anklapp|anklap)/i },
  { name: "Beifahrerspiegelabsenkung aktivieren", price: 25, match: /(spiegel.*absenk|beifahrer.*spiegel.*absenk|bordsteinautomatik)/i },
  { name: "Außenspiegel – Einstellungen anpassen", price: 20, match: /spiegel.*(heizung|synchron|einstellung|verstellung)/i },

  { name: "Elektrische Heckklappe – Funktionen anpassen", price: 30, match: /(elektr.*heckklappe|heckklappe \(elektrisch\)|heckklappe.*(taster|ffb|öffnungshöhe|oeffnungshoehe|warnsignal|schlüssel|schluessel|nahbereich))/i },
  { name: "Easy Open / Easy Close anpassen", price: 30, match: /(easy ?open|easy ?close)/i },

  { name: "Heckwischer – Verhalten anpassen", price: 15, match: /(heckwischer|heckscheibenwischer)/i },
  { name: "Tränenwischen Front / Heck aktivieren", price: 15, match: /(tränenwischen|traenenwischen|tropfenwischen)/i },

  { name: "Easy Entry / Komforteinstieg aktivieren", price: 25, match: /(easy entry|komforteinstieg)/i },
  { name: "Sitzheizung – Einstellungen & Speicherfunktion", price: 20, match: /sitzheizung/i },
  { name: "Sitzmemory / Schlüsselzuordnung anpassen", price: 30, match: /(sitzmemory|sitz-memory|sitze.*funkschlüssel|sitze.*funkschluessel|schlüssel.*sitz|schluessel.*sitz)/i },
  { name: "Air Care / Klimaeinstellungen anpassen", price: 20, match: /(air ?care|klimaanlage|klimaeinstellung|gebläse|geblaese|umluft)/i },

  { name: "Komfortblinken anpassen", price: 15, match: /komfortblinken/i },
  { name: "Komfortaktionen per Fernbedienung bei laufendem Motor", price: 20, match: /komfortaktionen.*(ffb|fernbedienung).*(zündung|zuendung|motorlauf|motor)/i },
];

function curateComfortEntries(entries: UnifiedCodingEntry[]): UnifiedCodingEntry[] {
  const candidates = entries.filter((entry) => entry.uiGroup === "Komfort");
  const otherEntries = entries.filter((entry) => entry.uiGroup !== "Komfort");

  const curated = curatedComfortRules.flatMap((rule, index) => {
    const matches = candidates.filter((entry) => rule.match.test(entry.name));
    if (!matches.length) return [];

    const source = matches[0];
    const sfd = matches.some((entry) => entry.sfd === "Ja")
      ? "Ja" as const
      : matches.some((entry) => entry.sfd === "Unklar")
        ? "Unklar" as const
        : matches.some((entry) => entry.sfd === "Nein")
          ? "Nein" as const
          : undefined;

    return [{
      ...source,
      id: `comfort-curated-${index}`,
      name: rule.name,
      price: rule.price,
      uiGroup: "Komfort" as const,
      sfd,
    }];
  });

  return [...otherEntries, ...curated];
}

type CuratedDisplayRule = {
  name: string;
  price: number;
  match: RegExp;
  hardware?: string | null;
};

const curatedLightRules: CuratedDisplayRule[] = [
  { name: "Coming Home / Leaving Home aktivieren", price: 30, match: /(?=.*(coming home|leaving home))(?=.*(aktivier|freischalt))/i, hardware: "Entsprechende Leuchten/LED-Module und Verkabelung sowie kompatibles BCM müssen vorhanden sein." },
  { name: "Coming Home / Leaving Home Einstellungen anpassen", price: 15, match: /(?=.*(coming home|leaving home))(?!.*(aktivier|freischalt))/i, hardware: null },
  { name: "Tagfahrlicht mit Heckleuchten aktivieren", price: 15, match: /(?=.*(tagfahrlicht|\btfl\b))(?=.*(heckleucht|rückleucht|rueckleucht))/i },
  { name: "Tagfahrlicht Einstellungen anpassen", price: 15, match: /(?=.*(tagfahrlicht|\btfl\b))(?!.*(heckleucht|rückleucht|rueckleucht|us[- ]))/i },
  { name: "US-Standlicht / US-Tagfahrlicht aktivieren", price: 20, match: /(us[- ]?standlicht|us[- ]?tagfahrlicht)/i },
  { name: "Abbiegelicht über Nebelscheinwerfer aktivieren", price: 20, match: /abbiegelicht/i },
  { name: "Nebelscheinwerfer Funktionen / LED anpassen", price: 20, match: /(?=.*nebelscheinwerfer)(?!.*abbiegelicht)/i },
  { name: "Standlicht / Parklicht anpassen", price: 15, match: /(?=.*(standlicht|parklicht))(?!.*us[- ])/i },
  { name: "Kennzeichenbeleuchtung auf LED anpassen", price: 15, match: /kennzeichenbeleuchtung/i },
  { name: "Ambientebeleuchtung freischalten", price: 35, match: /(?=.*ambient)(?=.*(aktivier|freischalt|nachrüstung|nachruestung))/i },
  { name: "Ambientebeleuchtung Farben / Verhalten anpassen", price: 20, match: /(?=.*ambient)(?!.*(aktivier|freischalt|nachrüstung|nachruestung))/i },
  { name: "Fußraumbeleuchtung freischalten / anpassen", price: 20, match: /(fußraumbeleuchtung|fussraumbeleuchtung)/i },
  { name: "Umfeldbeleuchtung freischalten / anpassen", price: 25, match: /umfeldbeleuchtung/i },
  { name: "Innenbeleuchtung Einstellungen anpassen", price: 15, match: /(innenlicht|innenraum[- ]?licht|innenbeleuchtung)/i },
  { name: "Rücklicht-Inszenierung aktivieren", price: 20, match: /(rücklicht|ruecklicht).*inszenierung/i },
  { name: "Rückleuchten / Heckleuchten Funktionen anpassen", price: 20, match: /(?=.*(rückleucht|rueckleucht|heckleucht))(?!.*(tagfahrlicht|\btfl\b|inszenierung))/i },
  { name: "Licht-/Regensensor Empfindlichkeit anpassen", price: 20, match: /(licht.*regensensor|regensensor.*licht|lichtsensorempfindlichkeit|lichtsensor.*empfindlichkeit)/i },
  { name: "Scheinwerfer Einstellungen / Reisemodus anpassen", price: 20, match: /scheinwerfer.*(reisemodus|einstellung|dauerfahrlicht|lichtschalter|blackout)/i },
  { name: "Scheinwerferreinigungsanlage / SWRA anpassen", price: 20, match: /(scheinwerferreinigungsanlage|\bswra\b)/i },
  { name: "Lichthupe Einstellungen anpassen", price: 15, match: /lichthupe/i },
];

const curatedInfotainmentRules: CuratedDisplayRule[] = [
  { name: "Apple CarPlay / Android Auto Wireless freischalten", price: 35, match: /(wireless carplay|apple.*carplay|carplay.*aktivier|carplay.*freischalt)/i },
  { name: "Android Auto / Smartphone-Integration anpassen", price: 35, match: /^(?!.*(?:wireless carplay|apple.*carplay|carplay.*android auto))(?=.*(?:android auto|mirrorlink|smartphone.*integration)).*$/i },
  { name: "Bluetooth / Zweites Telefon anpassen", price: 15, match: /(zweites telefon|bluetooth.*telefon|telefon.*bluetooth)/i },
  { name: "Green / Hidden / Developer Menu freischalten", price: 20, match: /(green menu|hidden menu|developer mode|entwicklermenü|entwicklermenu)/i },
  { name: "Sprachbedienung aktivieren", price: 25, match: /sprachbedienung/i },
  { name: "WLAN / Media-Streaming aktivieren", price: 25, match: /(wlan.*stream|media.*stream|streaming)/i },
  { name: "Infotainment Startlogo / Bootanimation anpassen", price: 20, match: /(bootanimation|startlogo|startbildschirm)/i },
  { name: "Infotainment Skin / Darstellung anpassen", price: 20, match: /(infotainment.*skin|discover pro.*skin|darstellung.*infotainment|skin ändern|skin aendern)/i },
  { name: "Begrüßungssound aktivieren", price: 15, match: /(begrüßungssound|begruessungssound|welcome sound)/i },
  { name: "Radiofunktionen anpassen", price: 15, match: /(radio.*am deaktiv|radio-modulation am|hybridradio)/i },
  { name: "Offroad- / Zusatzanzeigen aktivieren", price: 20, match: /(offroadanzeige|offroad-anzeige|g-meter|beschleunigungsanzeige|beschleunigungsmessung)/i },
  { name: "Kombiinstrument Zeigertest aktivieren", price: 15, match: /(zeigertest|needle sweep|staging)/i },
  { name: "Kombiinstrument Zusatzanzeigen aktivieren", price: 15, match: /(öltemperatur|oeltemperatur|laptimer|rundenzähler|rundenzaehler|nachtank|nachzutank|act \/ cod|zylinderabschaltung)/i },
  { name: "Virtual Cockpit / Tacho Darstellung anpassen", price: 20, match: /(virtual cockpit|\bvc\b|\baid\b|\bfpk\b|tachomaximum|skalendarstellung|skaleneinteilung|tacho.*darstellung|kombiinstrument.*skin)/i },
  { name: "Ganganzeige / Fahrdatenanzeige anpassen", price: 15, match: /(ganganzeige|fahrdaten|schaltempfehlung)/i },
  { name: "Navigations- / Kartendarstellung anpassen", price: 20, match: /(kartendarstellung|navigation.*anzeige|karte.*kombiinstrument|kompass)/i },
  { name: "Telefon / Freisprecheinrichtung anpassen", price: 15, match: /(mikrofonempfindlichkeit|freisprecheinrichtung|telefonieren über|telefonieren ueber)/i },
];

function curateDisplayGroup(
  entries: UnifiedCodingEntry[],
  group: "Licht" | "Infotainment",
  rules: CuratedDisplayRule[],
  idPrefix: string
): UnifiedCodingEntry[] {
  const candidates = entries.filter((entry) => entry.uiGroup === group);
  const otherEntries = entries.filter((entry) => entry.uiGroup !== group);

  const curated = rules.flatMap((rule, index) => {
    const matches = candidates.filter((entry) => rule.match.test(entry.name));
    if (!matches.length) return [];

    const source = matches[0];
    const sfd = matches.some((entry) => entry.sfd === "Ja")
      ? "Ja" as const
      : matches.some((entry) => entry.sfd === "Unklar")
        ? "Unklar" as const
        : matches.some((entry) => entry.sfd === "Nein")
          ? "Nein" as const
          : undefined;

    return [{
      ...source,
      id: `${idPrefix}-curated-${index}`,
      name: rule.name,
      price: rule.price,
      uiGroup: group,
      hardware: rule.hardware === null ? undefined : rule.hardware ?? source.hardware,
      sfd,
    }];
  });

  return [...otherEntries, ...curated];
}

function curateLightAndInfotainmentEntries(entries: UnifiedCodingEntry[]): UnifiedCodingEntry[] {
  const light = curateDisplayGroup(entries, "Licht", curatedLightRules, "light");
  return curateDisplayGroup(light, "Infotainment", curatedInfotainmentRules, "infotainment");
}

// Shared by the configurator and every vehicle price page.
export function curateCodingEntries(entries: UnifiedCodingEntry[]): UnifiedCodingEntry[] {
  const normalized = entries.map((entry) => {
    if (!/(coming[ -]home|leaving[ -]home)/i.test(entry.name)) return entry;
    return {
      ...entry,
      name: entry.name.replace(/(coming|leaving)-home/gi, "$1 Home"),
      uiGroup: "Licht" as const,
    };
  });
  return curateLightAndInfotainmentEntries(curateComfortEntries(curateAssistEntries(normalized)));
}
