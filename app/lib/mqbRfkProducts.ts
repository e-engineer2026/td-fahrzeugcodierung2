import { catalogDocumentSlug } from "./guideCatalogLinks";

/**
 * Model-specific MQB reverse-camera PDF downloads.
 * Match uploaded PDF basenames EXACTLY to avoid accidental cross-model assignments.
 * Every file contains the documented Low/High and MIB2/MIB3 chapters;
 * not all combinations are supported on every vehicle.
 */
const filesByModel = [
  [
    "Polo AW",
    "VW_Polo_AW"
  ],
  [
    "Golf 7 (5G)",
    "VW_Golf_7_5G_Golf_7_5"
  ],
  [
    "Passat B8 (3G)",
    "VW_Passat_B8_3G"
  ],
  [
    "T-Roc A11",
    "VW_T_Roc_A11"
  ],
  [
    "Arteon 3H",
    "VW_Arteon_3H"
  ],
  [
    "Tiguan II (AD/BW)",
    "VW_Tiguan_II_AD_BW"
  ],
  [
    "Touran 5T",
    "VW_Touran_5T"
  ],
  [
    "Golf Sportsvan AM1",
    "VW_Golf_Sportsvan_AM1"
  ],
  [
    "T-Cross C1",
    "VW_T_Cross_C1"
  ],
  [
    "Taigo CS",
    "VW_Taigo_CS"
  ],
  [
    "Golf 8 (CD)",
    "VW_Golf_8_CD"
  ],
  [
    "Passat B9",
    "VW_Passat_B9"
  ],
  [
    "Tayron II (R4)",
    "VW_Tayron_II_R4"
  ],
  [
    "Caddy V (SB)",
    "VW_Caddy_V_SB"
  ],
  [
    "A1 GB",
    "Audi_A1_GB"
  ],
  [
    "A3 / S3 8V",
    "Audi_A3_S3_8V"
  ],
  [
    "A3 / S3 8Y",
    "Audi_A3_S3_8Y"
  ],
  [
    "TT 8S",
    "Audi_TT_8S"
  ],
  [
    "Q2 GA",
    "Audi_Q2_GA"
  ],
  [
    "Q3 F3",
    "Audi_Q3_F3"
  ],
  [
    "Octavia 3 5E",
    "Skoda_Octavia_3_5E"
  ],
  [
    "Octavia 3 5E Facelift",
    "Skoda_Octavia_3_5E_Facelift"
  ],
  [
    "Octavia 4 NX",
    "Skoda_Octavia_4_NX"
  ],
  [
    "Superb 3V",
    "Skoda_Superb_3V"
  ],
  [
    "Kodiaq NS",
    "Skoda_Kodiaq_NS"
  ],
  [
    "Karoq NU",
    "Skoda_Karoq_NU"
  ],
  [
    "Scala NW",
    "Skoda_Scala_NW"
  ],
  [
    "Kodiaq II (PS)",
    "Skoda_Kodiaq_II_PS"
  ],
  [
    "Kamiq NW",
    "Skoda_Kamiq_NW"
  ],
  [
    "SEAT Leon 5F",
    "SEAT_Leon_5F"
  ],
  [
    "SEAT Ateca KH7",
    "SEAT_Ateca_KH7"
  ],
  [
    "SEAT Ibiza KJ",
    "SEAT_Ibiza_KJ"
  ],
  [
    "SEAT Arona KJ7",
    "SEAT_Arona_KJ7"
  ],
  [
    "SEAT Tarraco KN2",
    "SEAT_Tarraco_KN2"
  ],
  [
    "CUPRA Ateca KH7",
    "CUPRA_Ateca_KH7"
  ],
  [
    "SEAT Leon KL",
    "SEAT_Leon_KL"
  ],
  [
    "CUPRA Leon KL",
    "CUPRA_Leon_KL"
  ],
  [
    "CUPRA Formentor KM",
    "CUPRA_Formentor_KM"
  ]
] as const;

export const MQB_RFK_PDF_PRODUCTS = filesByModel.map(([model, fileStem]) => {
  const slug = catalogDocumentSlug(model, "reference-mqb-rfk");
  return {
    id: slug,
    productId: slug,
    slug,
    model,
    name: "Rückfahrkamera nachrüsten (Low/High, MIB2/MIB3)",
    title: "Rückfahrkamera nachrüsten (Low/High, MIB2/MIB3) · " + model,
    category: "Nachrüstungen" as const,
    sku: "TD-MQB-RFK",
    filename: "TD_" + fileStem + "_RFK_Low_High_MIB2_MIB3.pdf",
    priceCents: 1199,
    revision: "1.0",
    sha256: "",
  };
});

export function mqbRfkGuideForVehicle(model: string) {
  return MQB_RFK_PDF_PRODUCTS.find(item => item.model === model);
}
