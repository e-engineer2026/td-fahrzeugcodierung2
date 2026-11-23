"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { homeVehicleReadyEvent, homeVehicleSelectedEvent, homeVehicleUpdatedEvent, resolveHomeVehicleSelection, type HomeVehicleSelection } from "../lib/homeVehicleSelection";
import type { UnifiedCodingEntry } from "../lib/codingDisplay";
import { vehicleSpecificCodings, needsProtectionReview, protectionReviewMessage } from "../lib/vehicleCodings";
import { downloadQuotePdf } from "../lib/quotePdf";
import { sideProfiles } from "../lib/sideProfiles";
import { vehicleHeroImage } from "../lib/vehicleHero";
import { ChevronDown, Laptop, MapPin, FileDown, Sparkles } from "lucide-react";
import ConfiguratorLiveActions from "./ConfiguratorLiveActions";
import SaveVehicleCard from "./SaveVehicleCard";
import FunctionExample, { hasFunctionExample } from "./FunctionExample";
import { brands, vehicles } from "../data/catalog";
import { platformCodingGroups, type PlatformCodingGroup } from "../data/platformCodingPricing";
import { ASSISTANCE_CATEGORIES, assistanceCategoryForCoding, type AssistanceCategory } from "../lib/assistanceCategories";

type DisplayCodingGroup = Exclude<PlatformCodingGroup, "Assistenz"> | AssistanceCategory;
const displayCodingGroups: DisplayCodingGroup[] = platformCodingGroups.flatMap(group =>
  group === "Assistenz" ? [...ASSISTANCE_CATEGORIES] : [group]);
function displayCodingGroup(entry: Pick<UnifiedCodingEntry, "uiGroup" | "name">): DisplayCodingGroup {
  // Auch ältere Katalogeinträge unter Komfort/Fahrdynamik richtig einsortieren.
  const assistanceCategory = assistanceCategoryForCoding(entry);
  if (assistanceCategory) return assistanceCategory;
  return entry.uiGroup === "Assistenz" ? "Assistenzsysteme" : entry.uiGroup;
}

const popularTerms = ["zeigertest", "rückleuchten zusätzlich aktiv", "auto-lock", "coming home", "spiegel", "tagfahrlicht", "start-stopp", "regenschließ"];
function popularLabel(name: string) { if (/tagfahrlicht.*rückleuchten zusätzlich aktiv/i.test(name)) return "TFL mit Heckleuchten"; if (/zeigertest|needle sweep|staging/i.test(name)) return "Zeigertest"; return name; }
function discountRate(value: number) { return value >= 200 ? 0.25 : value >= 150 ? 0.2 : value >= 100 ? 0.15 : value >= 50 ? 0.1 : 0; }
function euro(value: number) { return value.toFixed(2).replace(".", ","); }
function nextTier(value: number) { return value < 50 ? 50 : value < 100 ? 100 : value < 150 ? 150 : value < 200 ? 200 : null; }
function track(event: string, params: Record<string, string | number | boolean> = {}) { if (typeof window === "undefined") return; const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag; gtag?.("event", event, params); }
function SfdBadge({ value }: { value?: "Ja" | "Nein" | "Unklar" }) { return value === "Ja" ? <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">SFD (1)</span> : null; }

// Bei Assistenzsystemen gehören Bilder zu neuen Freischaltungen/Nachrüstungen,
// nicht zu reinen Einstellungs- oder Anpassungsfunktionen.
function mayShowAssistExample(entry: Pick<UnifiedCodingEntry, "uiGroup" | "name">): boolean {
  if (assistanceCategoryForCoding(entry) === "Anpassungen für Assistenzsysteme") return false;
  if (entry.uiGroup !== "Assistenz") return true;
  return /(nachrüst|nachruest|freischalt|aktivier)/i.test(entry.name)
    && !/(anpass|einstell|speicher|memory|deaktivier|abschalt|ausschalt|moduswechsel|warnung|vibration)/i.test(entry.name);
}

function codingExplanation(name: string): string | null {
  const rules: Array<[RegExp, string]> = [
    [/spiegel.*anklappen/i, "Klappt vorhandene elektrisch anklappbare Außenspiegel beim Verriegeln ein."],
    [/spiegelabsenkung/i, "Senkt den Beifahrerspiegel beim Rückwärtsfahren ab, sofern die Ausstattung es unterstützt."],
    [/auto.lock|auto.unlock/i, "Passt das automatische Ver- und Entriegeln der Türen an."],
    [/komfortblinken/i, "Passt die Anzahl der Blinkimpulse beim kurzen Antippen des Blinkerhebels an."],
    [/regenschließen/i, "Kann geöffnete Fenster bei erkanntem Regen schließen, wenn die Ausstattung es unterstützt."],
    [/coming.home|leaving.home/i, "Passt die Beleuchtung beim Verlassen oder Öffnen des Fahrzeugs an."],
    [/heckleuchten.*tagfahrlicht|tagfahrlicht.*heckleuchten/i, "Passt an, ob die Heckleuchten zusammen mit dem Tagfahrlicht leuchten."],
    [/zeigertest|staging/i, "Lässt die Instrumentenzeiger beim Start einmal ausschlagen."],
    [/fernlichtassistent/i, "Unterstützt das automatische Auf- und Abblenden des Fernlichts, wenn die Ausstattung es ermöglicht."],
    [/smartphone.navigation.*(aid|cockpit)|navigation.*active info display/i, "Zeigt unterstützte Smartphone-Navigation im digitalen Kombiinstrument an, sofern das Fahrzeug kompatibel ist."],
  ];
  return rules.find(([pattern]) => pattern.test(name))?.[1] ?? null;
}

export default function BookingConfigurator({ integrated = false }: { integrated?: boolean }) {
  const [selectionRequest, setSelectionRequest] = useState(0);
  const [mode, setMode] = useState<"remote" | "onsite">("onsite");
  const [brand, setBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [year, setYear] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [quoteShareMessage, setQuoteShareMessage] = useState("");
  useEffect(() => { setQuoteFile(null); setQuoteShareMessage(""); }, [brand, vehicleModel, year, mode, selected]);
  const [activeGroup, setActiveGroup] = useState<"Alle" | DisplayCodingGroup>("Alle");
  const [expandedGroups, setExpandedGroups] = useState<DisplayCodingGroup[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  useEffect(() => { setShareLink(""); setShareMessage(""); }, [brand, vehicleModel, year, mode, selected]);
  useEffect(() => {
    if (!integrated) return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("auswahl");
    if (!raw || raw.length > 5000) return;
    try {
      const data = JSON.parse(raw);
      const vehicle = vehicles.find((item) => item.brand === data.brand && item.model === data.model);
      const y = Number(data.year);
      if (!vehicle || !Number.isInteger(y) || y < vehicle.startYear || y > vehicle.endYear || !Array.isArray(data.codings)) return;
      const sfd1 = Boolean(vehicle.sfd1From && y >= vehicle.sfd1From && y < 2024);
      const sfd2 = needsProtectionReview(y);
      const ids = new Set(vehicleSpecificCodings(vehicle, y, sfd1, sfd2).filter((entry) => !entry.reviewOnly).map((entry) => entry.id));
      setBrand(vehicle.brand); setVehicleModel(vehicle.model); setYear(y);
      setMode(data.mode === "remote" ? "remote" : "onsite");
      setSelected(data.codings.filter((id: unknown): id is string => typeof id === "string" && ids.has(id)).filter((id: string, i: number, all: string[]) => all.indexOf(id) === i));
    } catch { /* Invalid links leave the configurator untouched. */ }
  }, [integrated]);
  useEffect(() => {
    if (!integrated) return;
    const applySelection = (event: Event) => {
      const selection = resolveHomeVehicleSelection((event as CustomEvent<HomeVehicleSelection>).detail, vehicles);
      if (!selection) return;
      const vehicle = vehicles.find((item) => item.brand === selection?.brand && item.model === selection?.model);
      if (!vehicle) return;
      setBrand(selection.brand);
      setVehicleModel(selection.model);
      setYear(selection.year);
      setMode(selection.mode === "remote" ? "remote" : "onsite");
      if (brand !== selection.brand || vehicleModel !== selection.model || year !== selection.year) {
        setSelected([]);
          setActiveGroup("Alle");
        setExpandedGroups([]);
        setShowSelectedOnly(false);
      }
      setSelectionRequest((request) => request + 1);
      track("vehicle_selected", { brand: vehicle.brand, model: vehicle.model, platform: vehicle.platform });
      if (selection.year) track("vehicle_year_selected", { model: vehicle.model, year: selection.year });
    };
    window.addEventListener(homeVehicleSelectedEvent, applySelection);
    const root = document.getElementById("konfigurator");
    if (root) root.dataset.vehicleReady = "true";
    window.dispatchEvent(new Event(homeVehicleReadyEvent));
    return () => {
      window.removeEventListener(homeVehicleSelectedEvent, applySelection);
      if (root) delete root.dataset.vehicleReady;
    };
  }, [integrated, brand, vehicleModel, year]);

  useEffect(() => {
    if (!integrated) return;
    const detail: HomeVehicleSelection = { brand, model: vehicleModel, year, mode };
    window.dispatchEvent(new CustomEvent(homeVehicleUpdatedEvent, { detail }));
  }, [integrated, brand, vehicleModel, year, mode]);

  useEffect(() => {
    if (!selectionRequest) return;
    if (!year) {
      document.getElementById("fahrzeugauswahl")?.scrollIntoView({ block: "start" });
      document.getElementById("finder-year")?.focus({ preventScroll: true });
      return;
    }
    document.getElementById("buchen")?.focus({ preventScroll: true });
    document.getElementById("buchen")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [selectionRequest, year]);

  const models = brand ? vehicles.filter((vehicle) => vehicle.brand === brand).sort((a, b) => a.model.localeCompare(b.model, "de", { numeric: true, sensitivity: "base" })) : [];
  const selectedVehicle = vehicles.find((vehicle) => vehicle.brand === brand && vehicle.model === vehicleModel);
  const years = selectedVehicle ? Array.from({ length: selectedVehicle.endYear - selectedVehicle.startYear + 1 }, (_, index) => selectedVehicle.endYear - index) : [];
  const hasVehicle = Boolean(selectedVehicle);
  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);
  const requiresProtectionReview = needsProtectionReview(year);
  const available = useMemo<UnifiedCodingEntry[]>(() => { if (!selectedVehicle || !year) return []; return vehicleSpecificCodings(selectedVehicle, year, isSfd1, requiresProtectionReview); }, [isSfd1, requiresProtectionReview, selectedVehicle, year]);
  // Open the first populated category after choosing a different vehicle.
  useEffect(() => {
    const firstGroup = displayCodingGroups.find((group) => available.some((entry) => displayCodingGroup(entry) === group));
    setExpandedGroups(firstGroup ? [firstGroup] : []);
  }, [available]);

  const shown = available.filter((entry) => !showSelectedOnly || selected.includes(entry.id)).filter((entry) => activeGroup === "Alle" || displayCodingGroup(entry) === activeGroup);
  const selectedEntries = available.filter((entry) => !entry.reviewOnly && selected.includes(entry.id));
  const codingSubtotal = selectedEntries.reduce((sum, entry) => sum + entry.price, 0);
  const sfdRequired = isSfd1 && selectedEntries.some((entry) => entry.sfd === "Ja");
  const sfdFee = sfdRequired ? 9 : 0;
  const subtotal = codingSubtotal + sfdFee;
  const rate = discountRate(subtotal);
  const discount = subtotal * rate;
  const total = subtotal - discount;
  const upcomingTier = nextTier(subtotal);
  const chosen = selectedEntries.map((entry) => entry.name).join(", ");
  const totalCents = Math.round(total * 100);
  const prepay = Math.round(totalCents * 0.7) / 100;
  const finalpay = (totalCents - Math.round(totalCents * 0.7)) / 100;
  const bookingDisabled = !hasVehicle || !year || requiresProtectionReview || selectedEntries.length === 0;
  const paypalUrl = `https://paypal.me/TiDrechsler/${prepay.toFixed(2)}EUR`;
  const popular = useMemo(() => { const result: UnifiedCodingEntry[] = []; for (const term of popularTerms) { const hit = available.find((entry) => !entry.reviewOnly && entry.name.toLocaleLowerCase("de").includes(term) && !result.some((item) => item.id === entry.id)); if (hit) result.push(hit); if (result.length >= 4) break; } return result; }, [available]);
  const calBase = mode === "remote" ? "https://cal.com/timo-drechsler-lej6jm/remote-codierung" : "https://cal.com/timo-drechsler-lej6jm/vag-codierung-vor-ort";
  const calParams = new URLSearchParams();
  if (selectedVehicle) { calParams.set("fahrzeug", `${brand} ${selectedVehicle.model}`); calParams.set("baujahr", String(year)); }
  if (chosen) calParams.set("codierungen", chosen);
  calParams.set("gesamtpreis", `${total.toFixed(2)} EUR${sfdFee ? " inkl. SFD (1) (Aktionsrabatt berücksichtigt)" : ""}`);
  calParams.set("zahlung", mode === "remote" ? `PayPal 70% vorab (${prepay.toFixed(2)} EUR) / 30% danach (${finalpay.toFixed(2)} EUR)` : "Im Voraus: PayPal; direkt beim Termin: Bar, PayPal oder Sofortüberweisung");
  const calUrl = `${calBase}?${calParams.toString()}`;
  const resetSelection = () => { setQuoteFile(null); setQuoteShareMessage(""); setSelected([]); setActiveGroup("Alle"); setExpandedGroups([]); setShowSelectedOnly(false); };
  const changeMode = (value: "remote" | "onsite") => { setMode(value); track("booking_mode_selected", { mode: value }); };
  const changeBrand = (value: string) => { setBrand(value); setVehicleModel(""); setYear(0); resetSelection(); };
  const changeModel = (value: string) => { setVehicleModel(value); resetSelection(); const vehicle = vehicles.find((item) => item.brand === brand && item.model === value); setYear(0); if (vehicle) track("vehicle_selected", { brand: vehicle.brand, model: vehicle.model, platform: vehicle.platform }); };
  const changeYear = (value: number) => { setYear(value); resetSelection(); if (selectedVehicle) track("vehicle_year_selected", { model: selectedVehicle.model, year: value }); };
  const makeSelectionUrl = () => { const url = new URL(window.location.origin + window.location.pathname); url.searchParams.set("auswahl", JSON.stringify({ brand, model: vehicleModel, year, mode, codings: selectedEntries.map((entry) => entry.id) })); url.hash = "konfigurator"; return url.toString(); };
  const shareQuoteFile = async () => { if (!quoteFile) return; if (!navigator.share || !navigator.canShare?.({ files: [quoteFile] })) { setQuoteShareMessage("Direktes Teilen wird auf diesem Gerät nicht unterstützt. Bitte die heruntergeladene PDF in deiner App auswählen."); return; } try { await navigator.share({ files: [quoteFile], title: "TD Fahrzeugcodierung" }); setQuoteShareMessage(""); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setQuoteShareMessage("Teilen nicht möglich. Bitte die heruntergeladene PDF in deiner App auswählen."); } };
  const shareSelection = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("auswahl", JSON.stringify({ brand, model: vehicleModel, year, mode, codings: selectedEntries.map((entry) => entry.id) }));
    url.hash = "konfigurator";
    const link = url.toString();
    setShareLink(link);
    try { await navigator.clipboard.writeText(link); setShareMessage("Link kopiert – du kannst ihn jetzt teilen."); }
    catch { setShareMessage("Link zum Kopieren auswählen:"); }
  };
  const toggle = (id: string) => { if (!available.some((entry) => entry.id === id && !entry.reviewOnly)) return; setQuoteFile(null); setQuoteShareMessage(""); if (!selected.includes(id)) window.dispatchEvent(new Event("td-coding-added")); const entry = available.find((item) => item.id === id); const willSelect = !selected.includes(id); setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); if (entry) track(willSelect ? "coding_selected" : "coding_deselected", { coding: entry.name, price: entry.price, group: entry.uiGroup }); };
  const toggleGroup = (group: DisplayCodingGroup) => setExpandedGroups((current) => current.includes(group) ? current.filter((item) => item !== group) : [...current, group]);
  const savePendingBooking = () => { if (typeof window === "undefined" || mode !== "remote" || !selectedVehicle || selected.length === 0) return; try { window.localStorage.setItem("td_pending_booking", JSON.stringify({ vehicle: `${brand} ${selectedVehicle.model}`, year, codings: chosen, total: Number(total.toFixed(2)), prepay: Number(prepay.toFixed(2)), finalpay: Number(finalpay.toFixed(2)), paypalUrl })); } catch { /* Direct payment links remain usable without browser storage. */ } };
  const openBooking = (save: boolean) => { if (save) savePendingBooking(); track("booking_opened", { mode, codings: selected.length, total: Number(total.toFixed(2)), model: selectedVehicle?.model ?? "" }); };
  return <div id="konfigurator" data-integrated={integrated} className="booking-flow scroll-mt-14 space-y-3 sm:scroll-mt-16 sm:space-y-6" data-codings={JSON.stringify(selectedEntries.map((entry) => entry.name))} data-contact-vehicle={selectedVehicle ? `${brand} ${selectedVehicle.model}` : ""} data-contact-year={year || ""} data-booking-mode={mode} data-cal-url={calUrl} data-selection-count={selectedEntries.length} data-subtotal={euro(subtotal)} data-discount={euro(discount)} data-total={euro(total)} data-sfd-fee={euro(sfdFee)} data-discount-rate={Math.round(rate * 100)} data-next-tier={upcomingTier ?? ""} data-next-difference={upcomingTier ? euro(upcomingTier - subtotal) : ""} data-vehicle={selectedVehicle && year ? `${brand} ${selectedVehicle.model} · ${year}` : ""}>
    {!integrated && <><section className="card p-4 sm:p-6"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">1 · Terminart</div><div className="mt-3 grid gap-2 sm:gap-3 md:grid-cols-2"><button type="button" onClick={() => changeMode("onsite")} className={`min-h-[104px] rounded-2xl border p-3 text-left transition sm:min-h-[116px] sm:p-4 ${mode === "onsite" ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}><MapPin className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" /><b className="mt-2 block">Vor Ort in Leipzig-Süd</b><span className="mt-1 block text-sm leading-5 text-slate-600">Schenkendorfstraße 33, 04275 Leipzig</span></button><button type="button" onClick={() => changeMode("remote")} className={`min-h-[104px] rounded-2xl border p-3 text-left transition sm:min-h-[116px] sm:p-4 ${mode === "remote" ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}><Laptop className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" /><b className="mt-2 block">Remote-Codierung</b><span className="mt-1 block text-sm leading-5 text-slate-600">Mit eigenem Diagnoseinterface, PC/Laptop, stabiler Internetverbindung und vereinbarter Remote-Software.</span></button></div>{mode === "remote" && <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-slate-700 sm:p-4"><b>Voraussetzungen für Remote:</b> Eigenes kompatibles Diagnoseinterface (z. B. VCP, VCDS oder OBD11), stabile Internetverbindung, Windows-PC/Laptop am Fahrzeug und vereinbarte Remote-Software. Je nach Funktion kann ein bestimmtes Interface oder eine bestimmte Softwareversion erforderlich sein.
        <div className="mt-4 border-t border-blue-200 pt-4"><b className="text-slate-900">So läuft die Remote-Codierung ab</b><ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-xl bg-white p-3"><span className="font-bold text-blue-700">1 · Anfrage</span><span className="mt-1 block text-sm leading-5">Fahrzeug, Baujahr, Wunschfunktion und Interface angeben.</span></li>
          <li className="rounded-xl bg-white p-3"><span className="font-bold text-blue-700">2 · Hardware</span><span className="mt-1 block text-sm leading-5">Notwendige Ausstattung und passenden Diagnosezugang beachten.</span></li>
          <li className="rounded-xl bg-white p-3"><span className="font-bold text-blue-700">3 · Termin</span><span className="mt-1 block text-sm leading-5">PC am Fahrzeug verbinden und die vereinbarte Remote-Software starten.</span></li>
          <li className="rounded-xl bg-white p-3"><span className="font-bold text-blue-700">4 · Zahlung</span><span className="mt-1 block text-sm leading-5">70 % vor Beginn, die restlichen 30 % nach Durchführung.</span></li>
        </ol><p className="mt-3 text-sm leading-6 text-slate-600">Remote ist nur möglich, wenn Interface, Verbindung und Fahrzeug die gewünschte Arbeit unterstützen. Falls das nicht passt, stimmen wir eine Alternative ab, bevor ein Termin gebucht wird.</p></div></div>}</section>
    <section id={integrated ? "booking-fahrzeugauswahl" : "fahrzeugauswahl"} className="card scroll-mt-20 p-4 sm:scroll-mt-24 sm:p-6"><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">2 · Fahrzeug</div><h3 className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">Marke, Modell und Baujahr</h3><div className="mt-3 grid gap-2 sm:gap-3 md:grid-cols-3"><label><span className="mb-1.5 block text-sm font-semibold sm:mb-2">Marke</span><select value={brand} onChange={(e) => changeBrand(e.target.value)}><option value="">Marke auswählen</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span className="mb-1.5 block text-sm font-semibold sm:mb-2">Modell / Generation</span><select value={vehicleModel} onChange={(e) => changeModel(e.target.value)} disabled={!brand}><option value="">Modell auswählen</option>{models.map((vehicle) => <option key={`${vehicle.brand}-${vehicle.model}`} value={vehicle.model}>{vehicle.model}</option>)}</select></label><label><span className="mb-1.5 block text-sm font-semibold sm:mb-2">Baujahr</span><select value={year || ""} onChange={(e) => changeYear(Number(e.target.value))} disabled={!selectedVehicle}><option value="">Baujahr auswählen</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>{requiresProtectionReview && <div className="mt-3 rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm leading-6 text-slate-700"><b>Technische Vorprüfung:</b> {protectionReviewMessage}</div>}<SaveVehicleCard brand={brand} model={vehicleModel} year={year} codings={selectedEntries.map((entry) => entry.name)} /></section></>}
    
    {integrated && requiresProtectionReview && <p className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-700"><b>Technische Vorprüfung:</b> {protectionReviewMessage}</p>}
    <section className="coding-list-section card p-4 sm:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">3 · Codierungen</div><h3 className="mt-2 text-xl font-black sm:text-2xl">{selectedVehicle && year ? `${brand} ${selectedVehicle.model} · ${year}` : "Fahrzeug auswählen"}</h3></div><button type="button" disabled={!hasVehicle || !year || requiresProtectionReview} onClick={() => downloadQuotePdf({ selectionUrl: makeSelectionUrl(), vehicle: `${brand} ${vehicleModel} · ${year}`, model: vehicleModel, vehicleImage: sideProfiles[vehicleModel] ?? vehicleHeroImage({ brand, model: vehicleModel, year })?.src, entries: available.filter((entry) => !entry.reviewOnly), selected: selectedEntries.map((entry) => entry.id), sfdFee, subtotal, rate, discount, total }).then((file) => { setQuoteFile(file); setQuoteShareMessage(""); }).catch(() => window.alert("Der Kostenvoranschlag konnte nicht erstellt werden. Bitte versuche es erneut."))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"><FileDown className="h-5 w-5" /> {selectedEntries.length ? "Kostenvoranschlag als PDF" : "Codierliste als PDF"}</button></div>{quoteFile && <div className="mt-3"><button type="button" onClick={shareQuoteFile} className="rounded-lg border border-blue-200 px-4 py-2 font-bold text-blue-700">PDF teilen</button>{quoteShareMessage && <p role="status" className="mt-2 text-sm text-slate-600">{quoteShareMessage}</p>}</div>}{selectedEntries.length > 0 && <div className="mt-4 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm text-slate-700"><b>{selectedEntries.length} Codierung(en) gewählt</b> · {euro(subtotal)} € Zwischensumme · {Math.round(rate * 100)} % Rabatt · <b>{euro(total)} € gesamt</b></div><button type="button" aria-pressed={showSelectedOnly} onClick={() => setShowSelectedOnly((value) => !value)} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700">{showSelectedOnly ? "Alle anzeigen" : "Nur ausgewählte anzeigen"}</button></div>}{hasVehicle && year && !requiresProtectionReview && popular.length > 0 && !showSelectedOnly && <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2 text-sm font-black text-slate-800"><Sparkles className="h-4 w-4 text-blue-600" /> Häufig gewählt</div><div className="mt-3 flex flex-wrap gap-2">{popular.map((entry) => { const checked = selected.includes(entry.id); return <button key={entry.id} type="button" aria-pressed={checked} onClick={() => toggle(entry.id)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${checked ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"}`}>{popularLabel(entry.name)} · {entry.price} €</button>; })}</div></div>}{hasVehicle && year && !requiresProtectionReview && <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">{["Alle", ...displayCodingGroups].map((group) => <button type="button" key={group} aria-pressed={activeGroup === group} onClick={() => setActiveGroup(group as "Alle" | DisplayCodingGroup)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${activeGroup === group ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>{group}</button>)}</div>}{!hasVehicle || !year ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Bitte zuerst Marke, Modell und Baujahr auswählen.</div> : requiresProtectionReview ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">{protectionReviewMessage} <Link href="/#kontakt" className="font-semibold underline">Vorprüfung anfragen</Link></div> : shown.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{showSelectedOnly ? "Keine ausgewählte Codierung passt zu diesem Filter." : "Keine passende Codierung in diesem Filter gefunden."}<button type="button" onClick={() => { setActiveGroup("Alle"); setShowSelectedOnly(false); }} className="mt-3 block rounded-lg border border-blue-200 bg-white px-3 py-2 font-semibold text-blue-700">Filter zurücksetzen</button></div> : <div className="mt-5 space-y-2">{displayCodingGroups.map((group) => { const list = shown.filter((entry) => displayCodingGroup(entry) === group); if (!list.length) return null; const selectedInGroup = list.filter((entry) => selected.includes(entry.id)).length; const isExpanded = activeGroup !== "Alle" || showSelectedOnly || expandedGroups.includes(group); return <div key={group} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><button type="button" aria-expanded={isExpanded} onClick={() => toggleGroup(group)} className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50"><span className="font-black text-blue-700">{group} <span className="font-semibold text-slate-400">({list.length})</span></span><span className="flex items-center gap-2">{selectedInGroup > 0 && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">{selectedInGroup} gewählt</span>}<ChevronDown className={`h-4 w-4 text-slate-500 ${isExpanded ? "rotate-180" : ""}`} /></span></button>{isExpanded && <div className="border-t border-slate-200 bg-slate-50/60 p-2 sm:p-3"><div className="grid gap-2 lg:grid-cols-2">{list.map((entry) => { const checked = selected.includes(entry.id); const showExample = mayShowAssistExample(entry) && hasFunctionExample(entry.name); return <div key={entry.id} className={`rounded-lg border px-3 py-2.5 ${checked ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}><label className="flex cursor-pointer items-start justify-between gap-2.5"><span className="flex min-w-0 flex-1 items-start text-sm leading-5"><input className="mr-2.5 mt-0.5 h-4 w-4" type="checkbox" disabled={entry.reviewOnly} checked={checked} onChange={() => toggle(entry.id)} /><span className="font-bold">{entry.name}</span></span><b className="shrink-0 text-sm">{`${entry.price} €`}</b></label>{!showExample && codingExplanation(entry.name) && <p className="mt-2 text-xs leading-5 text-slate-600">{codingExplanation(entry.name)}</p>}{showExample && <FunctionExample functionName={entry.name} />}{entry.hardware && <details className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs"><summary className="cursor-pointer select-none font-semibold text-slate-700">Fahrzeug-Hardware</summary><div className="mt-2 border-t border-slate-200 pt-2 leading-5 text-slate-600">{entry.hardware}</div></details>}{mode === "remote" && entry.interfaceInfo && <div className="mt-2 border-t border-slate-100 pt-2 text-xs leading-5 text-slate-600"><b className="text-slate-700">Diagnosezugang:</b> {entry.interfaceInfo}</div>}{entry.requirements && <details className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-xs"><summary className="cursor-pointer select-none font-semibold text-slate-700">Hinweise</summary><div className="mt-2 border-t border-slate-200 pt-2 leading-5 text-slate-600">{entry.requirements}</div></details>}{isSfd1 && entry.sfd === "Ja" && <div className="mt-2 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2"><SfdBadge value={entry.sfd} /></div>}</div>; })}</div></div>}</div>; })}</div>}
    </section>
    {integrated && selectedVehicle && year > 0 && <SaveVehicleCard brand={brand} model={vehicleModel} year={year} codings={selectedEntries.map((entry) => entry.name)} />}
    {selectedEntries.length > 0 && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><button type="button" onClick={shareSelection} className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800">Auswahl teilen</button><p role="status" className="mt-2 text-sm text-slate-700">{shareMessage}</p>{shareLink && <input aria-label="Link zur Codierungsauswahl" className="mt-2 w-full" readOnly value={shareLink} onFocus={(event) => event.currentTarget.select()} />}</div>}
    
    {!bookingDisabled && <Link href={`/konto?auftrag=${encodeURIComponent(JSON.stringify({
      brand: brand === "SEAT / CUPRA" ? (vehicleModel.startsWith("CUPRA") ? "CUPRA" : "SEAT") : brand,
      model: vehicleModel, year, mode, services: selectedEntries.map(entry => entry.name).join(", "),
    }))}`} className="inline-flex rounded-lg border border-blue-300 bg-white px-4 py-3 text-sm font-bold text-blue-800 hover:bg-blue-50">
      Auswahl als Anfrage im Kundenkonto speichern
    </Link>}
    <ConfiguratorLiveActions snapshot={bookingDisabled ? null : { count: selectedEntries.length, subtotal: euro(subtotal), discount: euro(discount), total: euro(total), sfdFee, rate: Math.round(rate * 100), nextTier: upcomingTier ? String(upcomingTier) : "", nextDifference: upcomingTier ? euro(upcomingTier - subtotal) : "", mode, calUrl, vehicle: `${brand} ${selectedVehicle?.model} · ${year}`, codings: selectedEntries.map((entry) => entry.name), prepay, finalpay }} onBook={() => openBooking(mode === "remote")} onPayment={savePendingBooking} />
  </div>;
}
