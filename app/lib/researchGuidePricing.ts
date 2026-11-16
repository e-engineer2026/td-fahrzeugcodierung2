import type { ResearchGuide } from "../data/guideResearch";
import type { ReferenceIdea } from "../data/referenceIdeas";
import { guideDifficultyLevel, guideDifficultyStep, guidePriceTiers } from "./guidePricing";

/**
 * Preisideen für künftig von TD selbst erstellte PDF-Anleitungen.
 * KEIN Preis für Hardware, Einbau oder Leistungen externer Anbieter.
 * Keine Kauf-/Downloadberechtigung. Einstufung nach voraussichtlichem
 * Dokumentations- und Diagnoseaufwand, ohne geprüfte Fahrzeugfreigabe.
 */
export type GuideEstimate = {
  step: number;
  level: 1 | 2 | 3;
  price: number;
};

type GuideTopic = {
  title: string;
  category: "Codierungen" | "Assistenzsysteme" | "Nachrüstungen" | "Umbauten";
  note?: string;
};

function topicStep(topic: GuideTopic): number {
  const title = topic.title.toLocaleLowerCase("de");
  const note = (topic.note ?? "").toLocaleLowerCase("de");
  const whole = title + " " + note;

  if (topic.category === "Umbauten") {
    // Elektronikgeneration, sicherheitsrelevante Steuergeräte oder Lichtumbau:
    // umfangreicher Leitfaden samt Inbetriebnahme statt einfacher Codierung.
    if (/acc|pacc|radar|sicherheits|matrix|xenon|scheinwerfer|a[iu]d|kombiinstrument|digital.?cockpit|mib[12]|infotainment|wegfahrsperre|parkassistent|lenkrad.*airbag|airbag/.test(whole)) return 7;
    if (/rückleuchten|heckleuchten|lenkrad|schaltwippen|subwoofer|leuch/i.test(title)) return 6;
    if (/allwetterlicht|fußraumleuchten|fussraumleuchten|kabel/i.test(title)) return 4;
    return 7;
  }

  if (topic.category === "Nachrüstungen") {
    if (/radar|acc|pacc|side.assist|blind.?spot|spurwechsel|travel.assist|night.?vision|nachtsicht|kreuzungsassistent|lane.assist|fernlichtassistent|stauassistent|parklenkassistent|area.?view|360[°-]|matrix|xenon|fahrwerk|spurhalte|pdc.*12.?sensor/i.test(title)) return 7;
    if (/sitzheizung|standheizung|kessy|keyless|anhänger|ahk|schwenkbar|elektrische heckklappe|memory.?sitze?|head.up.display|hud|bang.?&.?olufsen|b&o|rückfahrkamera|rueckfahrkamera|front.und.heckkamera|park.assist|parklenk/i.test(title)) return 6;
    if (/reifendruck|rdk|klappbare spiegel|anklappbare spiegel|multifunktionslenkrad|mufu|tempomat|gra\b|auto.?hold|phone.?box|d[aä]b|garagentor|ambientebeleuchtung|komfortschl|soundsystem|230.?v/i.test(title)) return 5;
    if (/licht.regen|regensensor|rückfahr|dynamische linien|elektrische spiegel|spiegel.*heiz/i.test(title)) return 5;
    if (/usb|lademodul|ladehub|led|kennzeichenleuchte|fußraum|fussraum|pfützenlicht|warnleuchten|türbeleuchtung|innenlicht|schalter|taster|brillenfach/i.test(title)) return 3;
    // Bei unklaren Nachrüstungen vorsichtig statt willkürlich leicht.
    return 6;
  }

  if (topic.category === "Assistenzsysteme") {
    if (/stauassistent|traffic.?jam|freischalt|aktivier|verkehrszeichenerkennung|spurhalteassistent|radar/i.test(title) && !/einstell|speicher|warn/i.test(title)) return 6;
    return /einstell|speicher|warn|intervall|abstand|zeitpunkt|reset/i.test(title) ? 3 : 5;
  }

  // Einzel-Codierungen übernehmen dieselbe achtstufige Logik wie im
  // vorhandenen PDF-Konfigurator, mit wenigen deutlichen Aufwandsfällen.
  if (/kalibrier|parametrier|sfd2|steuerger[aä]te?tausch/i.test(title)) return 7;
  if (/multifunktionslenkrad|virtual.cockpit|digital.cockpit|mmi.*menü|infotainment.*menü|harman|lizen/i.test(title)) return 4;
  if (/ambient.*farben|fahrprofil.*farben|iq.light|lichtinszenierung/i.test(title)) return 3;
  return guideDifficultyStep({
    name: topic.title,
    category: "Standard-Codierungen",
    uiGroup: "Komfort"
  });
}

function estimate(topic: GuideTopic): GuideEstimate {
  const step = Math.max(0, Math.min(7, topicStep(topic)));
  return {
    step,
    level: guideDifficultyLevel(step),
    price: guidePriceTiers[step]
  };
}

export function researchGuideEstimate(guide: ResearchGuide): GuideEstimate {
  return estimate({ title: guide.title, category: guide.category, note: guide.note });
}

export function referenceIdeaEstimate(idea: ReferenceIdea): GuideEstimate {
  return estimate({ title: idea.title, category: idea.category, note: idea.note });
}
