export const homeVehicleSelectedEvent = "td:home-vehicle-selected";
export const homeVehicleUpdatedEvent = "td:home-vehicle-updated";

export type HomeVehicleSelection = {
  brand: string;
  model: string;
  year: number;
  mode: "onsite" | "remote";
};
