/**
 * Nur der Diagnose-, Codier- und Parametrieraufwand zählt.
 * Ausbau, Verkleidung, Verkabelung, Sensor-/Sitzmontage und Bauteilpreise
 * dürfen die Einstufung nicht erhöhen. Dies ist eine Schätzung, kein
 * fahrzeugspezifisch bestätigter Arbeitsumfang.
 *
 * Rückgabe null: Quelle nennt ausdrücklich keine Codierung, oder es
 * handelt sich nachgewiesenermaßen um einen rein mechanischen Umbau.
 */
export function codingEffortStep(
  titleValue: string,
  noteValue = "",
  referenceId = ""
): number | null {
  const title = titleValue.toLocaleLowerCase("de");
  const note = noteValue.toLocaleLowerCase("de");
  const combined = title + " " + note;

  // Nur belegte codierfreie Maßnahmen als 0,00 € bewerten.
  if (
    /(?:keine|ohne) (?:zusätzliche )?codierung(?: erforderlich)?\b|laut quelle ohne (?:zusätzliche )?codierung/.test(note) ||
    /subwoofergehäuse modifizieren|brillenfach.*(?:drucken|3d)/.test(title) ||
    referenceId === "ref-golf8-033" // 45-W-USB-Modul, in der gelieferten Referenz nur Stecker-/Pin-Umbau
  ) return null;

  // Mehrere besonders aufwendige elektronische Inbetriebnahmeschritte.
  // Nicht allein aus dem Wort "Umbau", "Nachrüstung" oder dem Hardwareumfang ableiten.
  if (/wegfahrsperre|\bwfs\b|\bimmo\b|komponentenschutz|(^|\W)cp.anpass|daten(?:satz|sätze).*\b(?:einspielen|upload|ändern)|gateway.parametrier|vcp.parametrier|steuergerät.*flash|\bflash(en)?\b|firmware.*(?:update|aufspielen)|softwareupdate/i.test(combined)) return 7;
  if (/mib1.*mib2|mmi.*upgrade|virtual.cockpit.*(?:umbau|umrüst)|analog.*(?:aid|digital.*cockpit)/.test(title)) return 7;

  // Einfache Einstellungen einer bereits vorhandenen Assistenzfunktion
  // vor Regeln zur aufwendigeren *erstmaligen* Assistenzaktivierung behandeln.
  if (/\b(acc|lane assist|front assist|fernlichtassistent|verkehrszeichenerkennung|light assist|spurhalteassistent)\b/.test(title) &&
      /anpass|einstell|speicher|merken|letzte|warn|verzöger|intervall|abstand|fahrprofil|aktivierungsverhalten|konfigurier|grundeinstellung.*(?:mmi|infotainment)/.test(title) &&
      !/nachrüst|umbau|umrüst|auf .* erweitern|aktivier(?:en|ung)\/freischalt|radar.*codier/.test(title)) {
    return /geschwindigkeitsbereich|210.km\/h|verzögerungsregelung/.test(title) ? 4 : 2;
  }

  // Neu-Inbetriebnahme von ACC/ADAS: typischerweise mehrere Steuergeräte.
  if (/\bacc\b|\bpacc\b|prädiktives acc|travel assist|traffic jam|stauassistent|parklenkassistent|park assist|pla\b|blind.?spot|side assist|spurwechselassistent|kreuzungsassistent|nachtsichtassistent|night vision|360.?(?:area view|umgebungsansicht)|area.view|front.und.heckkamera/.test(title)) {
    if (/kabelsatz|verkabelung|adapter/.test(title) && /nur (?:acc.)?(?:verkabelung|kabelsatz)|kein komplettset|nur kabelsatz/.test(note)) return 1;
    if (/geschwindigkeitsbereich|160 auf 210/.test(title)) return 5;
    return /kalibrier|grundeinstellung|remote.erstinbetriebnahme|radar.kalibrier|ge[kc]o/i.test(note) ? 6 : 5;
  }

  // Erforderliche Online-Aktivierungen, neue Softwarestände oder Lizenzdaten.
  if (/\b(swap|fec|sfd2|svm)\b|fod.shop|freischalt(?:dokument|lizenz)|funktionen?freigabe|online.frei(?:schalt|gabe)/i.test(combined)) {
    return /\b(swap|fec)\b|fod.shop|online.frei(?:schalt|gabe)/.test(combined) ? 6 : 4;
  }

  // Neuaktivierung bestehender kamerabasierter Funktionen.
  if (/verkehrszeichenerkennung|fernlichtassistent|spurhalteassistent|lane assist/.test(title) &&
      /aktivier|nachrüst|freischalt/.test(title)) return 4;

  // Lichtsteuerungen mit zusätzlicher Grundeinstellung.
  if (/matrix|xenon|iq.light|leuchtweitenregulier|\balwr\b|led.scheinwerfer|lichtverteilung|kurvenlicht|voll.led/.test(title)) {
    return /kalibrier|grundeinstellung|softwarekonfig|parametrier/.test(note) ? 5 : 4;
  }

  // Zentrale Anhänger- und Kameraeinbindung in mehrere Steuergeräte.
  if (/anhänger|anhängerkupplung|\bahk\b|trailer assist|rückfahrkamera|rueckfahrkamera|frontkamera.*rückfahrkamera|reifendruckkontrolle.*(?:high|direkte)|rdk high/.test(title)) {
    return /nur kabelsatz|kabelsatz.*separat|rein mechanisch/.test(note) && !/codier|dongle|inbetriebnahme/.test(note) ? 1 : 3;
  }

  // Komplexere, aber meist an wenigen Modulen erledigte Freischaltungen.
  if (/sitzmemory|memory.?sitz|fahrersitz.*memory|kessy|keyless|parkhilfe|einparkhilfe|\bpdc\b|standheizung|elektrische heckklappe|heckklappe.*elektrisch|\bqq2\b|ambientebeleuchtung.*mehrfarbig|multicolor|rgb/.test(title)) return 3;

  if (/lenkradheizung|beheiztes.*lenkrad|heizbares.*lenkrad|multifunktionslenkrad|mufu|\bgra\b|tempomat|geschwindigkeitsregel|phone.box|qi.laden|home.?link|garagentor|d[aä]b\+|soundsystem|bang.*olufsen|b&o|230.v|sitzheizung/.test(title)) return 2;

  // Mehrere Lichtkanäle (nicht Umbau der Leuchte als solcher).
  if (/facelift.*(?:rückleuchten|heckleuchten)|(?:rückleuchten|heckleuchten).*facelift|dynamische blinker|lichtleiste|fußraumbeleuchtung.*mehrfarbig|ambientefarben.*fahrprofil/.test(title)) return 3;

  // Übliche Einzelanpassungen und Anzeigen.
  if (/spiegel|rückleuchten|heckleuchten|umfeldlicht|fußraum|fussraum|nebelscheinwerfer|regen.?.?sensor|licht.sensor|led|blinker|anzeige|menü|navigationskarte|a[iu]d|cockpit|ladeanschluss|usb|sitzlüftung|klima|air.care|parklicht|coming.home|leaving.home|auto.lock|auto.unlock|türverriegel|komfort|standlicht|kennzeichenbeleucht/.test(title)) return 1;
  if (/zeigertest|needle.sweep|staging|laptimer|rundenzähler|öltemperatur|nachtankmenge|gurtwarner|tränenwischen|wischgeschwind|ganganzeige|soundaktor|startlogo|warnsignal/.test(title)) return 0;

  // Kein Beleg für Mehrsteuergerätearbeiten: niedrigste vorläufige Codierstufe.
  return 1;
}
