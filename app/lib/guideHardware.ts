import type { Coding } from "../data/catalog";

/**
 * Zeigt ausschließlich belegte Hardware-/Ausstattungsvoraussetzungen.
 * Quellenangaben, Montagearbeiten, Softwarefreigaben und Codieraufwand
 * sind keine Hardwarevoraussetzungen und werden hier nicht ergänzt.
 *
 * Die vorhandene Originalnotiz bleibt als aufklappbare Beschreibung
 * separat erhalten. "Nicht angegeben" bedeutet NICHT "nicht nötig".
 */
const hardwareTerms =
  /steuerger[aä]t|bordnetz|gateway|bcm|(?:^|\W)abs(?:\W|$)|climatronic|klimabedien|klimaelektronik|sitzheizung|sitzbezug|sitzmatte|heizmatte|heizbares|beheizbare|lenkrad|schleifring|lenksäul|frontkamera|rückfahrkamera|umfeldkamera|kamera\b|radarsensor|radar\b|park.sensor|pdc\b|einparkhilfe|licht.regen.sensor|regensensor|feuchtigkeitssensor|lichtsensor|scheinwerfer|rückleuchten|heckleuchten|led\b|scheinwerferreinig|aLWR|leuchtweitenregulier|spiegel|türgriff|keyless|kessy|infotainment|navigationsgerät|(?:^|\W)navi(?:\W|$)|mmi\b|mib[123]|radio\b|display|cockpit|tacho\b|kombiinstrument|ahk|anhängerkupplung|kabelsatz|verkabelung|adapter|stecker|lautsprecher|subwoofer|verstärker|soundpaket|lichtpaket|schnittstelle|usb|ladehub|lademodul|phone.?box|antenne|wechs(e|l)richter|steckdose|motorsteuergerät|bremsenelektronik|dsg\b|automatikgetriebe|bremsassistent|kupplung|sitzmemory|türsteuer|radsensor|highline|lenkstock|hebel|schalter|taster|motor\b|pr[-\s]?[0-9A-Z]{2,5}/i;

const informationOnly =
  /^(?:keine|ohne) (?:zusätzliche )?(?:hardware.?nachrüstung|codierung)|keine(?: frei verfügbare)? (?:anleitung|freischaltung)|(?:^|\W)(?:sfd[12]?|ge[ck]o|codier(?:ung|hilfe|dongle)|inbetriebnahme|kalibrierung|freischalt(?:ung|ungssatz)|firmware|softwareupdate)(?:\W|$)/i;

/** Wörtliche Hardwareklauseln aus den bestehenden technischen Notizen. */
export function hardwareFromNote(note: string): string {
  const fragments = note
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => hardwareTerms.test(part))
    .filter((part) => !informationOnly.test(part));

  return fragments.length ? fragments.join(" · ") : "Nicht angegeben";
}

/** Explizite Hardwarevoraussetzungen haben Vorrang vor Heuristiken. */
export function hardwareForCoding(coding: Pick<Coding, "hardware" | "requirements">): string {
  const direct = coding.hardware?.trim();
  if (direct) return direct;
  return hardwareFromNote(coding.requirements ?? "");
}
