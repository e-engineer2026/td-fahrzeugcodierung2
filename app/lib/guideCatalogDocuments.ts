import { AHK_GUIDE_PRODUCTS } from "./ahkGuideProducts";
import { MLBEVO_ASSISTANCE_PRODUCTS } from "./mlbevoAssistanceGuides";
import { codingCatalog, codingsForVehicle, vehicles, type Coding, type Vehicle } from "../data/catalog";
import { referenceIdeasForVehicle } from "../data/referenceIdeas";
import { researchedGuidesForModel, type ResearchCategory } from "../data/guideResearch";
import { codingNameKey, hasDisplayPrice, uniqueByCodingName } from "./codingListCleanup";
import { catalogDocumentSlug } from "./guideCatalogLinks";
import { guidePrice } from "./guidePricing";
import { researchGuideEstimate, referenceIdeaEstimate } from "./researchGuidePricing";
import { GOLF7_VZE_ADMIN_SLUG, vzePdfSlugForModel } from "./vzePdfVehicleLinks";
import { ASSISTANCE_CATEGORIES, assistanceCategoryForCoding } from "./assistanceCategories";
import { displayPdfGuideCoding, isPdfGuideCoding } from "./pdfGuideCoding";
import { MQB_FLA_MODEL_PRODUCTS } from "./mqbFlaModels";
import { MQB_GUIDE_PRODUCTS } from "./mqbGuideProducts";
import { mqbRfkGuideForVehicle } from "./mqbRfkProducts";
import { MQB_TJA_CODING, MQB_TJA_CODING_ID, mqbTjaGuideForVehicle } from "./mqbTjaModels";
import { MQB_TRAILER_CODING, MQB_TRAILER_CODING_ID, mqbTrailerGuideForVehicle } from "./mqbTrailerAssistModels";

export const guideCategories = ["Codierungen", ...ASSISTANCE_CATEGORIES, "Nachrüstungen", "Umbauten"] as const;

export type GuideCategory = (typeof guideCategories)[number];

// Nur ausdrücklich als Nachrüstung oder Umbau bezeichnete Einträge in diese Bereiche einsortieren.
export function guideCategory(coding: Coding): GuideCategory {
  // Der ACC/GRA/Limiter-Moduswechsel wird bei den PDF-Nachrüstungen angeboten.
  if (coding.id === "vcds-acc-mode") return "Nachrüstungen";
  const name = coding.name;
  if (/umbau|umrüst|umbauen|umrüsten|steuergeräte?tausch|steuergeraetetausch|kombiinstrument.*tausch|tacho.*tausch|upgrade/i.test(name)) return "Umbauten";
  // Eine bereits eingebaute Kamera freischalten ist eine Codierung, kein neues Assistenzsystem.
  if (/(?:rückfahrkamera|rear view)/i.test(name) && /(?:aktivieren|freischalten)/i.test(name)) return "Codierungen";
  if (/nachrüst|nachruest|retrofit|nachrüstung|nachruestung/i.test(name)) return "Nachrüstungen";
  return assistanceCategoryForCoding(coding) ?? "Codierungen";
}

export function availableModelCodings(vehicle: Vehicle): Coding[] {
  if (vehicle.diagnosticsOnly || vehicle.startYear >= 2024) return [];
  const ids = new Set(codingsForVehicle(vehicle));
  // Keine 0-Euro-Codierungen in der Anleitungsliste; Duplikate nicht durch
  // Gross-/Kleinschreibung, Umlaute, Satzzeichen oder Leerzeichen mehrfach anzeigen.
  return [...uniqueByCodingName(codingCatalog
    .filter((coding) => ids.has(coding.id) && coding.id !== "diagnose" && coding.uiGroup !== "Diagnose")
    .filter((coding) => hasDisplayPrice(coding.price))
    // Die freigegebene Golf-7-VZE-PDF ersetzt den generischen VZE-Katalogeintrag.
    .filter((coding) => coding.id !== "vcds-vze" || !ids.has("golf7-vze-pdf"))
    .filter(isPdfGuideCoding).map(displayPdfGuideCoding)),
    ...(vehicle.platform === "MQB" && mqbTjaGuideForVehicle(vehicle.model) ? [MQB_TJA_CODING] : []),
    ...(vehicle.platform === "MQB" && mqbTrailerGuideForVehicle(vehicle.model) ? [MQB_TRAILER_CODING] : []),
  ].sort((a, b) => a.name.localeCompare(b.name, "de", { numeric: true }));
}

export function catalogResearch(vehicle: Vehicle, codings: Coding[]) {
  const seen = new Set(codings.map(coding => guideCategory(coding) + ":" + codingNameKey(coding.name)));
  return (["Nachrüstungen", "Umbauten"] as ResearchCategory[])
    .flatMap(category => researchedGuidesForModel(vehicle.model, category))
    .filter(entry => entry.access !== "Anbieterleistung" && hasDisplayPrice(researchGuideEstimate(entry).price))
    .filter(entry => {
      const key = entry.category + ":" + codingNameKey(entry.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function catalogReferenceIdeas(vehicle: Vehicle, codings: Coding[], research: ReturnType<typeof catalogResearch>) {
  const seen = new Set([
    ...codings.map(coding => guideCategory(coding) + ":" + codingNameKey(coding.name)),
    ...research.map(entry => entry.category + ":" + codingNameKey(entry.title)),
  ]);
  return referenceIdeasForVehicle(vehicle)
    .filter(idea => hasDisplayPrice(referenceIdeaEstimate(idea).price))
    .filter(idea => {
      const category = idea.category === "Nachrüstungen" || idea.category === "Umbauten" ? idea.category : assistanceCategoryForCoding({ name: idea.title, category: idea.category }) ?? "Codierungen";
      const key = category + ":" + codingNameKey(idea.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function catalogMqbGuide(vehicle: Vehicle, coding: Coding) {
  if (vehicle.platform !== "MQB" && vehicle.platform !== "MQB-A0") return undefined;
  if (coding.id === MQB_TJA_CODING_ID) return mqbTjaGuideForVehicle(vehicle.model);
  if (coding.id === MQB_TRAILER_CODING_ID) return mqbTrailerGuideForVehicle(vehicle.model);
  const model = vehicle.model === "Golf 7 (5G)" ? "vw-golf-7-5g" : vzePdfSlugForModel(vehicle.model);
  const specific = model && (coding.id === "vcds-fla" || coding.id === "tcross-fla")
    ? MQB_FLA_MODEL_PRODUCTS.find(product => product.slug === "mqb-fla-" + model) : undefined;
  return specific ?? MQB_GUIDE_PRODUCTS.find(product => product.codingIds.some(id => id === coding.id));
}

export function codingDocumentSlug(vehicle: Vehicle, coding: Coding): string | undefined {
  const mqb = catalogMqbGuide(vehicle, coding);
  if (mqb) return mqb.slug;
  if (coding.id === "golf7-vze-pdf") return GOLF7_VZE_ADMIN_SLUG;
  if (/\bverkehrszeichenerkennung\s+(?:aktivieren|freischalten)\b|\bvze\s+(?:aktivieren|freischalten)\b/i.test(coding.name))
    return vzePdfSlugForModel(vehicle.model);
}

export function catalogGuideProduct(slug: string) {
  const registeredProduct = MLBEVO_ASSISTANCE_PRODUCTS.find(product => product.slug === slug)
    ?? AHK_GUIDE_PRODUCTS.find(product => product.slug === slug);
  if (registeredProduct) return registeredProduct;
  const [namespace, encodedModel, encodedRow, extra] = slug.split(":");
  if (namespace !== "catalog" || !encodedModel || !encodedRow || extra !== undefined || slug.length > 800) return null;
  let model: string, rowId: string;
  try {
    model = decodeURIComponent(encodedModel);
    rowId = decodeURIComponent(encodedRow);
  } catch { return null; }

  const vehicle = vehicles.find(item => item.model === model);
  if (!vehicle || catalogDocumentSlug(model, rowId) !== slug) return null;
  if (rowId === "reference-mqb-rfk") return mqbRfkGuideForVehicle(model) ?? null;
  const codings = availableModelCodings(vehicle);
  let label: string | undefined, price: number | undefined, category: GuideCategory = "Codierungen";
  if (rowId.startsWith("coding-")) {
    const coding = codings.find(item => "coding-" + item.id === rowId);
    if (coding && !codingDocumentSlug(vehicle, coding)) {
      label = coding.name;
      category = guideCategory(coding);
      price = guidePrice(coding);
    }
  } else if (rowId.startsWith("research-")) {
    const guide = catalogResearch(vehicle, codings).find(item => "research-" + item.id === rowId);
    if (guide) {
      label = guide.title;
      category = guide.category;
      price = researchGuideEstimate(guide).price;
    }
  } else if (rowId.startsWith("reference-")) {
    const ideas = catalogReferenceIdeas(vehicle, codings, catalogResearch(vehicle, codings));
    const idea = ideas.find(item => "reference-" + item.id === rowId);
    if (idea) {
      label = idea.title;
      category = idea.category === "Nachrüstungen" || idea.category === "Umbauten" ? idea.category : assistanceCategoryForCoding({ name: idea.title, category: idea.category }) ?? "Codierungen";
      price = referenceIdeaEstimate(idea).price;
    }
  }
  if (!label || !price || !hasDisplayPrice(price)) return null;
  return {
    id: slug, slug, name: label, title: label + " · " + model, model, category,
    priceCents: Math.round(price * 100), sha256: "", revision: "1.0", sku: "TD-PDF",
    filename: "TD-Codieranleitung.pdf",
  };
}
