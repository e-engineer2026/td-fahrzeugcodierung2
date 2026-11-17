/**
 * Vom Betreiber vorgegebene SFD-Übersicht für die professionellen PDF-Anleitungen.
 * Ein Startdatum bezieht sich auf die Baureihe/Variante, nicht automatisch auf
 * jedes Steuergerät oder jeden Diagnosekanal des einzelnen Fahrzeugs.
 * Angabe 03/2024 etc. = Monat/Jahr, reine Jahreszahl = ab Modelljahr.
 */
export type SfdVehicle = {
  brand: "Volkswagen" | "Audi" | "Škoda" | "SEAT" | "CUPRA" | "Ford";
  name: string;
  /** Entspricht dem exakten Marken-/Modellschlüssel des Konfigurators. */
  catalogKey: string;
  sfd1?: string;
  sfd2?: string;
};

export const SFD1_CONTROL_UNITS = [
  { address: "01", name: "Motorelektronik" },
  { address: "03", name: "Bremsenelektronik" },
  { address: "09", name: "Zentralelektrik" },
  { address: "15", name: "Airbag" },
  { address: "16", name: "Lenkradelektronik" },
  { address: "17", name: "Schalttafeleinsatz" },
  { address: "19", name: "Diagnoseinterface" },
  { address: "23", name: "Bremskraftverstärker" },
  { address: "4B", name: "Multifunktionssteuergerät" },
  { address: "51", name: "Elektroantrieb" },
  { address: "5F", name: "Informationselektronik" },
  { address: "75", name: "Telematik" },
] as const;

export const SFD1_ENGINE_EXCEPTION =
  "Bei STG 01 (Motorelektronik) kann der SFD1-Schutz abhängig vom höheren Softwarestand wieder entfallen.";

export const SFD_VEHICLES: readonly SfdVehicle[] = [
  // Volkswagen: MQB evo und MEB; weitere SFD2-Modelle.
  { brand: "Volkswagen", name: "Golf 8 (CD)", catalogKey: "Volkswagen|Golf 8 (CD)", sfd1: "2019", sfd2: "04/2024" },
  { brand: "Volkswagen", name: "Caddy (SB)", catalogKey: "Volkswagen|Caddy V (SB)", sfd1: "2020", sfd2: "2025" },
  { brand: "Volkswagen", name: "T7 Multivan (ST)", catalogKey: "Volkswagen|T7 Multivan (ST)", sfd1: "2022", sfd2: "2025" },
  { brand: "Volkswagen", name: "ID.3 (E1)", catalogKey: "Volkswagen|ID.3 (E11)", sfd1: "2019", sfd2: "2025" },
  { brand: "Volkswagen", name: "ID.4 (E2)", catalogKey: "Volkswagen|ID.4 (E21)", sfd1: "2020", sfd2: "01/2024" },
  { brand: "Volkswagen", name: "ID.5 (E3)", catalogKey: "Volkswagen|ID.5 (E39)", sfd1: "2022", sfd2: "01/2024" },
  { brand: "Volkswagen", name: "ID.7 (ED)", catalogKey: "Volkswagen|ID.7 (ED)", sfd1: "2023", sfd2: "01/2024" },
  { brand: "Volkswagen", name: "ID.Buzz (EB)", catalogKey: "Volkswagen|ID.Buzz (EB)", sfd1: "2022", sfd2: "2025" },
  { brand: "Volkswagen", name: "Arteon (3H)", catalogKey: "Volkswagen|Arteon 3H", sfd2: "2024" },
  { brand: "Volkswagen", name: "Crafter (SY)", catalogKey: "Volkswagen|Crafter SY", sfd2: "2025" },
  { brand: "Volkswagen", name: "Passat B9", catalogKey: "Volkswagen|Passat B9", sfd2: "2024" },
  { brand: "Volkswagen", name: "Polo (AW)", catalogKey: "Volkswagen|Polo AW", sfd2: "03/2024" },
  { brand: "Volkswagen", name: "Taigo (CS)", catalogKey: "Volkswagen|Taigo CS", sfd2: "03/2024" },
  { brand: "Volkswagen", name: "Tayron (R4)", catalogKey: "Volkswagen|Tayron II (R4)", sfd2: "2024" },
  { brand: "Volkswagen", name: "T-Cross (C1)", catalogKey: "Volkswagen|T-Cross C1", sfd2: "03/2024" },
  { brand: "Volkswagen", name: "T-Roc (A1)", catalogKey: "Volkswagen|T-Roc A11", sfd2: "03/2024" },
  // Die Eingabe nennt Tiguan (AD) ab 02/2024; nicht rückwirkend dem
  // Tiguan II (AD/BW) bis 2023 zuordnen. Die 2024er Variante separat führen.
  { brand: "Volkswagen", name: "Tiguan (2024er Ausführung)", catalogKey: "Volkswagen|Tiguan (2024)", sfd2: "02/2024" },
  { brand: "Volkswagen", name: "Touareg (CR)", catalogKey: "Volkswagen|Touareg CR", sfd2: "2024" },
  { brand: "Volkswagen", name: "Touran (5T)", catalogKey: "Volkswagen|Touran 5T", sfd2: "03/2024" },

  // Audi: MLB evo, MQB evo und elektrische Modelle.
  { brand: "Audi", name: "A1 (GB)", catalogKey: "Audi|A1 GB", sfd2: "03/2024" },
  { brand: "Audi", name: "A3 (8Y)", catalogKey: "Audi|A3 / S3 8Y", sfd1: "2020", sfd2: "2025" },
  { brand: "Audi", name: "A4 (8W)", catalogKey: "Audi|A4 / S4 B9", sfd2: "2024" },
  { brand: "Audi", name: "A5 (F5)", catalogKey: "Audi|A5 / S5 F5", sfd2: "2024" },
  // A6 C8 wird in Teile-/Baureihenlisten auch mit 4K bezeichnet.
  { brand: "Audi", name: "A6 (C8/4K/4A)", catalogKey: "Audi|A6 / S6 C8", sfd1: "2022", sfd2: "2024" },
  { brand: "Audi", name: "A7 (4K)", catalogKey: "Audi|A7 / S7 4K", sfd2: "2024" },
  { brand: "Audi", name: "A8 (4N)", catalogKey: "Audi|A8 D5 (4N)", sfd2: "2024" },
  { brand: "Audi", name: "e-tron (GE)", catalogKey: "Audi|e-tron GE", sfd2: "2024" },
  { brand: "Audi", name: "e-tron GT (FW)", catalogKey: "Audi|e-tron GT (FW)", sfd2: "2024" },
  { brand: "Audi", name: "Q2 (GA)", catalogKey: "Audi|Q2 GA", sfd2: "03/2024" },
  { brand: "Audi", name: "Q3 (F3)", catalogKey: "Audi|Q3 F3", sfd2: "03/2024" },
  { brand: "Audi", name: "Q4 e-tron (F4)", catalogKey: "Audi|Q4 e-tron (FZ)", sfd1: "2021", sfd2: "11/2023" },
  { brand: "Audi", name: "Q5 (FY)", catalogKey: "Audi|Q5 FY", sfd1: "2022", sfd2: "2024" },
  { brand: "Audi", name: "Q7 (4M)", catalogKey: "Audi|Q7 4M", sfd2: "08/2023" },
  { brand: "Audi", name: "Q8 (4M)", catalogKey: "Audi|Q8 4M", sfd2: "08/2023" },

  // Škoda: Modellnamen im Konfigurator können von Typcodes der Eingabe abweichen.
  { brand: "Škoda", name: "Octavia 4 (NX)", catalogKey: "Škoda|Octavia 4 NX", sfd1: "2020", sfd2: "03/2024" },
  { brand: "Škoda", name: "Enyaq (NY/5A)", catalogKey: "Škoda|Enyaq 5A", sfd1: "2020", sfd2: "2024" },
  { brand: "Škoda", name: "Elroq (NY)", catalogKey: "Škoda|Elroq (NY)", sfd2: "2025" },
  { brand: "Škoda", name: "Fabia (PJ)", catalogKey: "Škoda|Fabia 4 (PJ)", sfd2: "2024" },
  { brand: "Škoda", name: "Kamiq (NW)", catalogKey: "Škoda|Kamiq NW", sfd2: "2024" },
  { brand: "Škoda", name: "Karoq (NU)", catalogKey: "Škoda|Karoq NU", sfd2: "03/2024" },
  { brand: "Škoda", name: "Kodiaq II (NG)", catalogKey: "Škoda|Kodiaq II (PS)", sfd2: "2024" },
  { brand: "Škoda", name: "Scala (NW)", catalogKey: "Škoda|Scala NW", sfd2: "2024" },

  // SEAT/CUPRA stehen im Konfigurator unter der gemeinsamen Marke.
  { brand: "SEAT", name: "Arona (KJ)", catalogKey: "SEAT / CUPRA|SEAT Arona KJ7", sfd2: "02/2024" },
  { brand: "SEAT", name: "Ateca (KH)", catalogKey: "SEAT / CUPRA|SEAT Ateca KH7", sfd2: "02/2024" },
  { brand: "SEAT", name: "Ibiza (6F)", catalogKey: "SEAT / CUPRA|SEAT Ibiza KJ", sfd2: "02/2024" },
  { brand: "SEAT", name: "Leon 4 (KL)", catalogKey: "SEAT / CUPRA|SEAT Leon KL", sfd1: "2020", sfd2: "2025" },
  { brand: "CUPRA", name: "Ateca (5F)", catalogKey: "SEAT / CUPRA|CUPRA Ateca KH7", sfd2: "02/2024" },
  { brand: "CUPRA", name: "Born (K1)", catalogKey: "SEAT / CUPRA|CUPRA Born K11", sfd1: "2021", sfd2: "2025" },
  { brand: "CUPRA", name: "Formentor (KM)", catalogKey: "SEAT / CUPRA|CUPRA Formentor KM", sfd1: "2020", sfd2: "2025" },
  { brand: "CUPRA", name: "Leon (KL)", catalogKey: "SEAT / CUPRA|CUPRA Leon KL", sfd1: "2020", sfd2: "2025" },
  { brand: "CUPRA", name: "Tavascan (VZ/KR)", catalogKey: "SEAT / CUPRA|CUPRA Tavascan (KX)", sfd1: "2023", sfd2: "2025" },

  // Außerhalb des VAG-Fahrzeugkonfigurators, aber in der gelieferten SFD1-Liste.
  { brand: "Ford", name: "Tourneo/Transit Connect", catalogKey: "Ford|Tourneo/Transit Connect", sfd1: "2022" },
];

const SFD_BY_CATALOG_KEY = new Map(SFD_VEHICLES.map((vehicle) => [vehicle.catalogKey, vehicle]));

export function sfdDatesForVehicle(input: {
  vehicleBrand?: string;
  vehicleModel?: string;
  sfd1From?: number;
}): { sfd1?: string; sfd2?: string } {
  const model = SFD_BY_CATALOG_KEY.get(`${input.vehicleBrand ?? ""}|${input.vehicleModel ?? ""}`);
  return {
    sfd1: model?.sfd1 ?? (typeof input.sfd1From === "number" ? String(input.sfd1From) : undefined),
    sfd2: model?.sfd2,
  };
}

export function sfdNoticeForVehicle(input: {
  vehicleBrand?: string;
  vehicleModel?: string;
  sfd1From?: number;
}): string | undefined {
  const dates = sfdDatesForVehicle(input);
  const labels = [
    dates.sfd1 ? `SFD (1) ab Bj. ${dates.sfd1}` : null,
    dates.sfd2 ? `SFD (2) ab Bj. ${dates.sfd2}` : null,
  ].filter(Boolean);
  return labels.length ? labels.join(" · ") : undefined;
}
