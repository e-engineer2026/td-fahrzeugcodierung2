type Guide = {
  brand: string;
  model: RegExp;
  title: string;
  tool: "VCDS" | "VCP";
  firstYear: number;
  lastYear: number;
  scope: string;
  pdf: string;
};

const a4 = { brand: "Audi", model: /\bA4\b.*\b(?:B9|8W)\b/i };
const guides: Guide[] = [
  { ...a4, firstYear: 2015, lastYear: 2024, tool: "VCDS", title: "Auto-Scan und Anpassungskanäle sichern", scope: "Vorfacelift und Facelift", pdf: "/anleitungen-pdf/A4-8W-VCDS-Auto-Scan.pdf" },
  { ...a4, firstYear: 2015, lastYear: 2024, tool: "VCDS", title: "Zeigertest aktivieren", scope: "Vorfacelift und Facelift · Kombiinstrument mit ausgewiesener Staging-Option", pdf: "/anleitungen-pdf/A4-8W-VCDS-Zeigertest.pdf" },
  { ...a4, firstYear: 2022, lastYear: 2022, tool: "VCDS", title: "Ambientebeleuchtung nachrüsten", scope: "Facelift 2022 · Vergleichscodierung für 09 und 5F. Die Funktion mit dem ONAPXT-Set ist unbestätigt.", pdf: "/anleitungen-pdf/A4-8W-2022-VCDS-Ambientebeleuchtung.pdf" },
];

export function guidesForVehicle(vehicle: { brand: string; model: string; year: number }) {
  return guides.filter((guide) => guide.brand === vehicle.brand && guide.model.test(vehicle.model)
    && vehicle.year >= guide.firstYear && vehicle.year <= guide.lastYear);
}
