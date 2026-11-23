"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, LockKeyhole, Search } from "lucide-react";
import { GOLF7_VZE_ADMIN_SLUG, vzePdfSlugForModel } from "../lib/vzePdfVehicleLinks";
import { catalogDocumentHref, catalogDocumentSlug } from "../lib/guideCatalogLinks";
import { MQB_GUIDE_PRODUCTS } from "../lib/mqbGuideProducts";
import { mqbRfkGuideForVehicle } from "../lib/mqbRfkProducts";
import { MQB_FLA_MODEL_PRODUCTS } from "../lib/mqbFlaModels";
import { MQB_LANE_CODING, MQB_LANE_CODING_ID, mqbLaneGuideForVehicle } from "../lib/mqbLaneAssistModels";
import { MQB_TJA_CODING, MQB_TJA_CODING_ID, mqbTjaGuideForVehicle } from "../lib/mqbTjaModels";
import { MQB_TRAILER_CODING, MQB_TRAILER_CODING_ID, mqbTrailerGuideForVehicle } from "../lib/mqbTrailerAssistModels";
import { ASSISTANCE_CATEGORIES, assistanceCategoryForCoding } from "../lib/assistanceCategories";
import { codingCatalog, codingsForVehicle, vehicles, type Coding, type Vehicle } from "../data/catalog";
import { guideDifficultyLevel, guideDifficultyStep, guidePrice } from "../lib/guidePricing";
import { hasDisplayPrice, uniqueByCodingName } from "../lib/codingListCleanup";
import { displayPdfGuideCoding, isPdfGuideCoding, pdfGuideFunctionKey, uniquePdfGuideCodings } from "../lib/pdfGuideCoding";
import { matchesCodingSearch } from "../lib/codingSearch";
import GuideTable, { type GuideTableRow, type RenderDocumentActions } from "./GuideTable";
import { guideDetails } from "../lib/guideDetails";
import { guideInterface } from "../lib/guideInterface";
import { guideVehicleRequirements } from "../lib/guideVehicleRequirements";
import { researchGuideEstimate, referenceIdeaEstimate } from "../lib/researchGuidePricing";
import { retrofitFocusFor } from "../lib/retrofitFocus";
import { referenceIdeasForVehicle, type ReferenceIdea } from "../data/referenceIdeas";
import { researchedGuidesForModel, type ResearchCategory } from "../data/guideResearch";

const manufacturers = ["Volkswagen", "Audi", "Škoda", "SEAT / CUPRA"] as const;
type Manufacturer = (typeof manufacturers)[number];
const guideCategories = ["Codierungen", ...ASSISTANCE_CATEGORIES, "Nachrüstungen", "Umbauten"] as const;

/** Link only to an actual, model-specific VZE release. The download itself remains paywalled. */
function vzeProductHref(title: string, slug?: string): string | undefined {
  if (!slug || !/\bverkehrszeichenerkennung\s+(?:aktivieren|freischalten)\b|\bvze\s+(?:aktivieren|freischalten)\b/i.test(title)) return undefined;
  return "/api/guide-shop/download/vze/" + slug + "?liste=1";
}

type GuideCategory = (typeof guideCategories)[number];

function manufacturerOf(vehicle: Vehicle): Manufacturer {
  return vehicle.brand as Manufacturer;
}

// Nur ausdrücklich als Nachrüstung oder Umbau bezeichnete Einträge in diese Bereiche einsortieren.
function guideCategory(coding: Coding): GuideCategory {
  if (coding.id === "vcds-acc-mode") return "Nachrüstungen";
  const name = coding.name;
  if (/umbau|umrüst|umbauen|umrüsten|steuergeräte?tausch|steuergeraetetausch|kombiinstrument.*tausch|tacho.*tausch|upgrade/i.test(name)) return "Umbauten";
  // Die reine Aktivierung einer bereits verbauten RFK ist keine neue Fahrerassistenz.
  if (/(?:rückfahrkamera|rear view)/i.test(name) && /(?:aktivieren|freischalten)/i.test(name)) return "Codierungen";
  if (/nachrüst|nachruest|retrofit|nachrüstung|nachruestung/i.test(name)) return "Nachrüstungen";
  return assistanceCategoryForCoding(coding) ?? "Codierungen";
}

/** Auch historische Referenzideen dürfen Anpassungen nicht als neue Assistenten anzeigen. */
function guideCategoryForReference(idea: ReferenceIdea): GuideCategory {
  if (idea.category === "Nachrüstungen" || idea.category === "Umbauten") return idea.category;
  return assistanceCategoryForCoding({name: idea.title, category: idea.category}) ?? "Codierungen";
}

function availableModelCodings(vehicle: Vehicle): Coding[] {
  if (vehicle.diagnosticsOnly || vehicle.startYear >= 2024) return [];
  const ids = new Set(codingsForVehicle(vehicle));
  // Keine 0-Euro-Codierungen in der Anleitungsliste; Duplikate nicht durch
  // Gross-/Kleinschreibung, Umlaute, Satzzeichen oder Leerzeichen mehrfach anzeigen.
  const standard = uniqueByCodingName(codingCatalog
    .filter((coding) => ids.has(coding.id) && coding.id !== "diagnose" && coding.uiGroup !== "Diagnose")
    .filter((coding) => hasDisplayPrice(coding.price))
    // Die freigegebene Golf-7-VZE-PDF ersetzt den generischen VZE-Katalogeintrag.
    .filter((coding) => coding.id !== "vcds-vze" || !ids.has("golf7-vze-pdf"))
    .filter(isPdfGuideCoding)
    .map(displayPdfGuideCoding));
  // Modellbezogene Freischaltungs-PDFs haben Vorrang vor historischen generischen
  // Varianten wie „Lane Assist / Spurhalteassistent aktivieren“.
  return uniquePdfGuideCodings([
    ...((vehicle.platform === "MQB" || vehicle.platform === "MQB-A0") && mqbLaneGuideForVehicle(vehicle.model) ? [MQB_LANE_CODING] : []),
    ...(vehicle.platform === "MQB" && mqbTjaGuideForVehicle(vehicle.model) ? [MQB_TJA_CODING] : []),
    ...(vehicle.platform === "MQB" && mqbTrailerGuideForVehicle(vehicle.model) ? [MQB_TRAILER_CODING] : []),
    ...standard,
  ]).sort((a, b) => a.name.localeCompare(b.name, "de", { numeric: true }));
}

/** Liefert für jeden angezeigten Eintrag die echte Download-ID. */
function codingDocumentSlugForVehicle(vehicle: Vehicle, coding: Coding): string {
  const mqbPlatform = vehicle.platform === "MQB" || vehicle.platform === "MQB-A0";
  const modelPdfSlug = vehicle.model === "Golf 7 (5G)"
    ? "vw-golf-7-5g" : vzePdfSlugForModel(vehicle.model);
  const modelFla = mqbPlatform && modelPdfSlug &&
    (coding.id === "vcds-fla" || coding.id === "tcross-fla")
    ? MQB_FLA_MODEL_PRODUCTS.find(product => product.slug === "mqb-fla-" + modelPdfSlug)
    : undefined;
  const mqbGuide = (mqbPlatform && coding.id === MQB_LANE_CODING_ID
      ? mqbLaneGuideForVehicle(vehicle.model) : undefined)
    ?? (mqbPlatform && coding.id === MQB_TRAILER_CODING_ID
      ? mqbTrailerGuideForVehicle(vehicle.model) : undefined)
    ?? (mqbPlatform && coding.id === MQB_TJA_CODING_ID
      ? mqbTjaGuideForVehicle(vehicle.model) : undefined)
    ?? modelFla
    ?? (mqbPlatform
      ? MQB_GUIDE_PRODUCTS.find(product => product.codingIds.some(id => id === coding.id))
      : undefined);
  if (mqbGuide) return mqbGuide.slug;
  if (coding.id === "golf7-vze-pdf") return GOLF7_VZE_ADMIN_SLUG;
  if (vzeProductHref(coding.name, vzePdfSlugForModel(vehicle.model)))
    return vzePdfSlugForModel(vehicle.model)!;
  return catalogDocumentSlug(vehicle.model, "coding-" + coding.id);
}

export default function GuideSelector({ renderDocumentActions, publishedCatalogSlugs = [] }: {
  renderDocumentActions?: RenderDocumentActions;
  publishedCatalogSlugs?: string[];
}) {
  // Der Admin sieht auch fehlende PDFs und Entwürfe; Besucher nur freigegebene Downloads.
  const publicOnly = !renderDocumentActions;
  const [manufacturer, setManufacturer] = useState<Manufacturer | "">("");
  const [model, setModel] = useState("");
  const [showModels, setShowModels] = useState(true);
  const [codingSearch, setCodingSearch] = useState("");
  const searching = codingSearch.trim().length > 0;
  const [activeCategory, setActiveCategory] = useState<GuideCategory>("Codierungen");

  const models = useMemo(
    () => vehicles.filter((vehicle) => manufacturer && manufacturerOf(vehicle) === manufacturer)
      .sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" })),
    [manufacturer]
  );
  const vehicle = models.find((item) => item.model === model);
  const vzePdfSlug = vehicle ? vzePdfSlugForModel(vehicle.model) : undefined;
  const codings = useMemo(() => vehicle ? availableModelCodings(vehicle)
    .filter(coding => !publicOnly ||
      publishedCatalogSlugs.includes(codingDocumentSlugForVehicle(vehicle, coding))) : [],
    [vehicle, publicOnly, publishedCatalogSlugs]);
  const researchEntries = useMemo(() => {
    if (!vehicle) return [];
    const seen = new Set(codings.map((coding) => pdfGuideFunctionKey(coding)));
    return (["Nachrüstungen", "Umbauten"] as ResearchCategory[])
      .flatMap((category) => researchedGuidesForModel(vehicle.model, category))
      .filter((entry) => entry.access !== "Anbieterleistung" && hasDisplayPrice(researchGuideEstimate(entry).price))
      .filter((entry) => !publicOnly ||
        publishedCatalogSlugs.includes(catalogDocumentSlug(vehicle.model, "research-" + entry.id)))
      .filter((entry) => {
        const key = pdfGuideFunctionKey({ name: entry.title });
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [vehicle, codings, publicOnly, publishedCatalogSlugs]);
  const sourceIdeas = useMemo(() => {
    if (!vehicle) return [];
    const seen = new Set([
      ...codings.map((coding) => pdfGuideFunctionKey(coding)),
      ...researchEntries.map((entry) => pdfGuideFunctionKey({ name: entry.title })),
    ]);
    return referenceIdeasForVehicle(vehicle)
      // The combined Low/High camera PDF replaces older partial RFK retrofit entries.
      .filter(idea => !mqbRfkGuideForVehicle(vehicle.model) || !(/rückfahrkamera|rueckfahrkamera|rear view/i.test(idea.title) && /nachrüst|nachruest/i.test(idea.title)))
      .filter((idea) => hasDisplayPrice(referenceIdeaEstimate(idea).price))
      .filter((idea) => !publicOnly ||
        publishedCatalogSlugs.includes(catalogDocumentSlug(vehicle.model, "reference-" + idea.id)))
      .filter((idea) => {
        const key = pdfGuideFunctionKey({ name: idea.title });
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [vehicle, codings, researchEntries, publicOnly, publishedCatalogSlugs]);
  const categoryCounts = useMemo(
    () => guideCategories.map((category) => ({
      category,
      count: codings.filter((coding) => guideCategory(coding) === category).length
        + researchEntries.filter((entry) => entry.category === category).length
        + sourceIdeas.filter((idea) => guideCategoryForReference(idea) === category).length
        + (category === "Nachrüstungen" && vehicle &&
          mqbRfkGuideForVehicle(vehicle.model) &&
          (!publicOnly || publishedCatalogSlugs.includes(mqbRfkGuideForVehicle(vehicle.model)!.slug)) ? 1 : 0),
    })),
    [codings, researchEntries, sourceIdeas, vehicle, publicOnly, publishedCatalogSlugs]
  );
  // Eine Suche durchsucht alle Kategorien. Ohne Suchbegriff bleibt der
  // gewählte Kategorienfilter aktiv.
  const visibleResearch = researchEntries.filter((entry) =>
    (searching || entry.category === activeCategory) &&
    matchesCodingSearch([entry.title, entry.note].join(" "), codingSearch)
  );
  const visibleSourceIdeas = sourceIdeas.filter((idea) =>
    (searching || guideCategoryForReference(idea) === activeCategory) &&
    matchesCodingSearch([idea.title, idea.note].join(" "), codingSearch)
  );
  const visibleCodings = codings.filter((coding) =>
    (searching || guideCategory(coding) === activeCategory) &&
    matchesCodingSearch([coding.name, coding.uiGroup ?? "", coding.requirements ?? ""].join(" "), codingSearch)
  );

  // One combined RFK guide per supported MQB model; its filename is auto-matched by the admin ZIP uploader.
  const rfkProduct = vehicle ? mqbRfkGuideForVehicle(vehicle.model) : undefined;
  const rfkRows: GuideTableRow[] = rfkProduct &&
    (!publicOnly || publishedCatalogSlugs.includes(rfkProduct.slug)) &&
    (searching || activeCategory === "Nachrüstungen") &&
    matchesCodingSearch(rfkProduct.name + " Rückfahrkamera Low High MIB2 MIB3", codingSearch)
    ? [{
      id: "reference-mqb-rfk",
      title: rfkProduct.name,
      description: "Modellbezogene PDF mit den unterscheidbaren Systemvarianten Low/High und MIB2/MIB3.",
      requirements: "Kameratyp, Infotainment, Verkabelung, Steuergeräte und bei High Systemen Datensatz und Kalibrierung fahrzeugspezifisch prüfen. Nicht jede Kombination ist für jedes Modell vorgesehen.",
      diagnosticInterface: guideInterface({
        id: "mqb-rfk", title: rfkProduct.name, category: "Nachrüstungen",
        source: "research", vehicleYear: vehicle?.startYear, vehicleEndYear: vehicle?.endYear,
        sfd1From: vehicle?.sfd1From, vehicleBrand: vehicle?.brand,
        vehicleModel: vehicle?.model, platform: vehicle?.platform,
      }),
      estimate: { step: 4, level: 2, price: rfkProduct.priceCents / 100 },
      documentSlug: rfkProduct.slug,
      productHref: publishedCatalogSlugs.includes(rfkProduct.slug)
        ? catalogDocumentHref(rfkProduct.slug) : undefined,
    }] : [];

  const rows: GuideTableRow[] = [
    ...rfkRows,
    ...visibleCodings.map((coding) => {
      const step = guideDifficultyStep(coding);
      const mqbPlatform = vehicle?.platform === "MQB" || vehicle?.platform === "MQB-A0";
      const modelPdfSlug = vehicle?.model === "Golf 7 (5G)"
        ? "vw-golf-7-5g" : vehicle ? vzePdfSlugForModel(vehicle.model) : undefined;
      // Prefer the matching private FLA model PDF over the historical generic proof PDF.
      const modelFlaGuide = mqbPlatform && modelPdfSlug &&
        (coding.id === "vcds-fla" || coding.id === "tcross-fla")
        ? MQB_FLA_MODEL_PRODUCTS.find(product => product.slug === "mqb-fla-" + modelPdfSlug)
        : undefined;
      const modelLaneGuide = mqbPlatform && coding.id === MQB_LANE_CODING_ID && vehicle
        ? mqbLaneGuideForVehicle(vehicle.model) : undefined;
      const modelTjaGuide = mqbPlatform && coding.id === MQB_TJA_CODING_ID && vehicle
        ? mqbTjaGuideForVehicle(vehicle.model) : undefined;
      const modelTrailerGuide = mqbPlatform && coding.id === MQB_TRAILER_CODING_ID && vehicle
        ? mqbTrailerGuideForVehicle(vehicle.model) : undefined;
      const mqbGuide = modelLaneGuide ?? modelTrailerGuide ?? modelTjaGuide ?? modelFlaGuide ?? (mqbPlatform
        ? MQB_GUIDE_PRODUCTS.find(product => product.codingIds.some(id => id === coding.id))
        : undefined);
      const details = guideDetails({
        title: coding.name,
        note: coding.requirements,
        explicitHardware: coding.hardware
      });
      const diagnosticInterface = guideInterface({
        id: coding.id,
        title: coding.name,
        category: guideCategory(coding),
        source: "catalog",
        note: coding.requirements,
        interfaceInfo: coding.interfaceInfo,
        vehicleYear: vehicle?.startYear,
        vehicleEndYear: vehicle?.endYear,
        sfd1From: vehicle?.sfd1From,
        vehicleBrand: vehicle?.brand,
        vehicleModel: vehicle?.model,
        platform: vehicle?.platform
      });
      const golf7Vze = coding.id === "golf7-vze-pdf";
      const vzeHref = vzeProductHref(coding.name, vzePdfSlug);
      return {
        id: "coding-" + coding.id,
        productHref: mqbGuide ? "/api/guide-shop/download/mqb/" + mqbGuide.slug + "?liste=1"
          : golf7Vze ? "/api/guide-shop/download/golf7-vze?liste=1" : vzeHref,
        documentSlug: mqbGuide?.slug ?? (golf7Vze ? GOLF7_VZE_ADMIN_SLUG : vzeHref ? vzePdfSlug : undefined),
        isProofDocument: !!mqbGuide,
        title: coding.name,
        requirements: guideVehicleRequirements({
          title: coding.name,
          original: details.prerequisites,
          note: coding.requirements
        }),
        diagnosticInterface,
        description: details.description,
        estimate: { step, level: guideDifficultyLevel(step), price: mqbGuide ? mqbGuide.priceCents / 100 : guidePrice(coding) }
      };
    }),
    ...visibleResearch.map((item) => {
      const focus = activeCategory === "Nachrüstungen" ? retrofitFocusFor(item)?.activation : undefined;
      const details = guideDetails({ title: item.title, note: item.note, activation: focus });
      const diagnosticInterface = guideInterface({
        id: item.id,
        title: item.title,
        note: item.note,
        activation: focus,
        category: item.category,
        source: "research",
        vehicleYear: vehicle?.startYear,
        vehicleEndYear: vehicle?.endYear,
        sfd1From: vehicle?.sfd1From,
        vehicleBrand: vehicle?.brand,
        vehicleModel: vehicle?.model,
        platform: vehicle?.platform
      });
      return {
        id: "research-" + item.id,
        title: item.title,
        requirements: guideVehicleRequirements({ title: item.title, original: details.prerequisites, note: item.note }),
        diagnosticInterface,
        description: details.description,
        estimate: researchGuideEstimate(item)
      };
    }),
    ...visibleSourceIdeas.map((idea) => {
      const details = guideDetails({ title: idea.title, note: idea.note });
      const diagnosticInterface = guideInterface({
        id: idea.id,
        title: idea.title,
        note: idea.note,
        category: guideCategoryForReference(idea),
        source: "reference",
        vehicleYear: vehicle?.startYear,
        vehicleEndYear: vehicle?.endYear,
        sfd1From: vehicle?.sfd1From,
        vehicleBrand: vehicle?.brand,
        vehicleModel: vehicle?.model,
        platform: vehicle?.platform
      });
      return {
        id: "reference-" + idea.id,
        title: idea.title,
        requirements: guideVehicleRequirements({ title: idea.title, original: details.prerequisites, note: idea.note }),
        diagnosticInterface,
        description: details.description,
        estimate: referenceIdeaEstimate(idea)
      };
    })
  ];

  const visibleGuideRows = (vehicle ? rows.map(row => {
    if (row.documentSlug) return row;
    const documentSlug = catalogDocumentSlug(vehicle.model, row.id);
    return { ...row, documentSlug, productHref: publishedCatalogSlugs.includes(documentSlug) ? catalogDocumentHref(documentSlug) : undefined };
  }) : rows).filter(row => !publicOnly ||
    (!!row.documentSlug && publishedCatalogSlugs.includes(row.documentSlug)));

  function chooseManufacturer(next: Manufacturer) {
    setManufacturer(next);
    setModel("");
    setShowModels(true);
    setCodingSearch("");
    setActiveCategory("Codierungen");
  }

  function chooseModel(next: Vehicle) {
    setModel(next.model);
    setShowModels(false);
    setCodingSearch("");
    const available = availableModelCodings(next).filter(coding => !publicOnly ||
      publishedCatalogSlugs.includes(codingDocumentSlugForVehicle(next, coding)));
    const hasOwnCodings = guideCategories.some((category) =>
      (category === "Codierungen" || category === "Assistenzsysteme" || category === "Anpassungen für Assistenzsysteme") &&
      available.some((item) => guideCategory(item) === category)
    );
    if (hasOwnCodings) {
      setActiveCategory(guideCategories.find((category) =>
        (category === "Codierungen" || category === "Assistenzsysteme" || category === "Anpassungen für Assistenzsysteme") &&
        available.some((item) => guideCategory(item) === category)
      ) ?? "Codierungen");
    } else {
      const candidates = referenceIdeasForVehicle(next).filter(idea => !publicOnly ||
        publishedCatalogSlugs.includes(catalogDocumentSlug(next.model, "reference-" + idea.id)));
      const hasResearch = (category: ResearchCategory) => researchedGuidesForModel(next.model, category)
        .some(entry => entry.access !== "Anbieterleistung" &&
          (!publicOnly || publishedCatalogSlugs.includes(catalogDocumentSlug(next.model, "research-" + entry.id))));
      const rfk = mqbRfkGuideForVehicle(next.model);
      setActiveCategory(hasResearch("Nachrüstungen") ||
        (rfk && (!publicOnly || publishedCatalogSlugs.includes(rfk.slug))) ? "Nachrüstungen"
        : hasResearch("Umbauten") ? "Umbauten"
        : candidates.some((idea) => guideCategoryForReference(idea) === "Codierungen") ? "Codierungen"
        : candidates.length ? guideCategoryForReference(candidates[0]) : "Codierungen");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600" aria-label="Schritte">
        <span className="rounded-full bg-blue-600 px-3 py-1.5 text-white">1. Fahrzeug</span>
        <span className={vehicle ? "rounded-full bg-blue-100 px-3 py-1.5 text-blue-800" : "rounded-full bg-slate-200 px-3 py-1.5"}>2. Anleitung &amp; Preis</span>
      </div>

      <section aria-labelledby="guide-manufacturer-title">
        <h2 id="guide-manufacturer-title" className="text-lg font-black sm:text-xl">Hersteller wählen</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Hersteller">
          {manufacturers.map((item) => (
            <button key={item} type="button" aria-pressed={manufacturer === item} onClick={() => chooseManufacturer(item)}
              className={"flex min-h-11 items-center justify-center rounded-lg border px-2 py-2 text-sm font-bold transition hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                (manufacturer === item ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-800")}>
              {item}
            </button>
          ))}
        </div>
      </section>

      {manufacturer && (
        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4" aria-labelledby="guide-model-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 id="guide-model-title" className="text-base font-black">
                {vehicle ? vehicle.model : "Fahrzeug wählen"}
              </h2>
              {vehicle && (
                <p className="text-xs text-slate-500">
                  {String(vehicle.startYear) + "–" + String(vehicle.endYear >= 2026 ? "heute" : vehicle.endYear)}
                </p>
              )}
            </div>
            {vehicle && (
              <button type="button" onClick={() => setShowModels((value) => !value)}
                aria-expanded={showModels}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">
                Fahrzeug ändern {showModels ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
              </button>
            )}
          </div>

          {showModels && (
            <>
              <div className="mt-2 grid max-h-[36rem] gap-1.5 overflow-y-auto sm:max-h-[42rem] sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Fahrzeugmodelle">
                {models.map((item) => (
                  <button key={item.model} type="button" aria-pressed={model === item.model} onClick={() => chooseModel(item)}
                    className={"flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left hover:border-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 " +
                      (model === item.model ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white")}>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-5 text-slate-900">{item.model}</span>
                      <span className="block text-xs text-slate-500">{item.startYear}–{item.endYear >= 2026 ? "heute" : item.endYear}</span>
                    </span>
                    {model === item.model && <Check size={17} className="shrink-0 text-blue-700" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {vehicle && (
        <section className="mt-6" aria-label="Fahrzeuganleitungen" aria-live="polite">
          <div className="flex justify-end">
            {(codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && (
              <label className="relative block w-full sm:w-60">
                <span className="sr-only">Anleitungen suchen</span>
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input type="search" value={codingSearch} onChange={(event) => setCodingSearch(event.target.value)}
                  placeholder="Anleitung suchen"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </label>
            )}
          </div>

          {searching ? <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm" role="status">
            <span className="font-semibold text-slate-700">{visibleGuideRows.length} Treffer in allen Kategorien</span>
            <button type="button" onClick={() => setCodingSearch("")}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-bold text-blue-700 hover:bg-blue-50">
              Suche zurücksetzen
            </button>
          </div> : <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5" role="group" aria-label="Anleitungskategorien">
            {categoryCounts.map(({ category, count }) => (
              <button key={category} type="button" aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={"flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-bold transition hover:border-blue-400 " +
                  (activeCategory === category ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700")}>
                <span>{category}</span>
                <span className={activeCategory === category ? "rounded-full bg-white/20 px-2 py-0.5 text-xs" : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"}>{count}</span>
              </button>
            ))}
          </div>}


          <GuideTable rows={visibleGuideRows} renderDocumentActions={renderDocumentActions} />
          {visibleGuideRows.length === 0 && (codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              {codingSearch.trim()
                ? "Keine passenden Anleitungen gefunden."
                : "Für dieses Fahrzeug sind in diesem Bereich noch keine Anleitungen zugeordnet."}
            </p>
          )}
          {codings.length === 0 && researchEntries.length === 0 && sourceIdeas.length === 0 && (
            <p className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              {publicOnly
                ? "Für dieses Fahrzeug sind derzeit keine PDF-Anleitungen zum Download veröffentlicht."
                : "Für dieses Fahrzeug sind derzeit keine ausreichend geprüften Anleitungen hinterlegt."}
              {vehicle.startYear >= 2024 ? " Für neuere Modelle ist vor einer Freigabe insbesondere der SFD-/SFD2-Schutz zu prüfen." : ""}
            </p>
          )}
          {(codings.length > 0 || researchEntries.length > 0 || sourceIdeas.length > 0) && <p className="mt-3 text-xs leading-6 text-slate-500">
            Die konkrete Codierbarkeit hängt von Baujahr, Ausstattung, Steuergerät, Softwarestand und ggf. SFD-Schutz ab.
          </p>}
          {<p className="mt-2 flex items-start gap-2 text-xs leading-6 text-slate-500">
            <LockKeyhole size={15} className="mt-1 shrink-0" aria-hidden="true" />
            Kostenpflichtige PDF-Anleitungen können nach bestätigter Zahlung heruntergeladen werden.
          </p>}
        </section>
      )}
    </div>
  );
}
