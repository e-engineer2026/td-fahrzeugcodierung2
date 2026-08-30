import { codingsForVehicle, vehicles, type Vehicle } from "../data/catalog";

const brandSlugs: Record<string, string> = {
  Volkswagen: "vw",
  Audi: "audi",
  "Škoda": "skoda",
  "SEAT / CUPRA": "seat-cupra",
};

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " und ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function vehicleBrandSlug(vehicle: Vehicle): string {
  return brandSlugs[vehicle.brand] || slugify(vehicle.brand);
}

export function vehicleModelSlug(vehicle: Vehicle): string {
  return `${slugify(vehicle.model)}-codierung`;
}

export function vehiclePath(vehicle: Vehicle): string {
  return `/fahrzeuge/${vehicleBrandSlug(vehicle)}/${vehicleModelSlug(vehicle)}`;
}

export const seoVehicles = vehicles.filter((vehicle) =>
  codingsForVehicle(vehicle).some((id) => id !== "diagnose")
);

export function findVehicleBySlugs(brand: string, model: string): Vehicle | undefined {
  return seoVehicles.find(
    (vehicle) => vehicleBrandSlug(vehicle) === brand && vehicleModelSlug(vehicle) === model
  );
}
