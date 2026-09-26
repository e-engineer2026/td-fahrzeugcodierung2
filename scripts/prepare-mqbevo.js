const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "app", "components", "BookingConfigurator.tsx");
let source = fs.readFileSync(file, "utf8");

const oldLogic = `function vehicleSpecificCodings(\n  vehicle: Vehicle,\n  year: number,\n  isSfd1: boolean,\n  isSfd2: boolean\n): UnifiedCodingEntry[] {\n  if (isSfd2) return [];\n\n  const ids = new Set(codingsForVehicle(vehicle));\n  const vehicleCatalog = codingCatalog\n    .filter((coding) => ids.has(coding.id))\n    .filter((coding) => {\n      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;\n      if (coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane") return true;\n      return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);\n    });`;

const newLogic = `function vehicleSpecificCodings(\n  vehicle: Vehicle,\n  year: number,\n  isSfd1: boolean,\n  isSfd2: boolean\n): UnifiedCodingEntry[] {\n  const isMqbevoSfd2 = isSfd2 && vehicle.platform === "MQBevo";\n  if (isSfd2 && !isMqbevoSfd2) return [];\n\n  const ids = new Set(codingsForVehicle(vehicle));\n  const vehicleCatalog = codingCatalog\n    .filter((coding) => ids.has(coding.id))\n    .filter((coding) => {\n      if (isMqbevoSfd2) {\n        return coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane";\n      }\n      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;\n      if (coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane") return true;\n      return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);\n    });\n\n  if (isMqbevoSfd2) {\n    return curateCodingEntries(vehicleCatalog.map((coding) => ({\n      id: `vehicle-${coding.id}`,\n      name: coding.name,\n      price: coding.price,\n      uiGroup: coding.uiGroup as PlatformCodingGroup,\n      hardware: coding.hardware ?? coding.requirements,\n      source: "vehicle" as const,\n    })).filter((entry) => yearAllowed(entry.name, year)));\n  }`;

if (!source.includes(oldLogic)) throw new Error("MQB-evo build patch: vehicleSpecificCodings target not found");
source = source.replace(oldLogic, newLogic);

const oldSfd = `  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);\n  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);`;
const newSfd = `  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);\n  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);\n  const isMqbevoSfd2 = isSfd2 && selectedVehicle?.platform === "MQBevo";\n  const showCodings = !isSfd2 || isMqbevoSfd2;`;
if (!source.includes(oldSfd)) throw new Error("MQB-evo build patch: SFD state target not found");
source = source.replace(oldSfd, newSfd);

source = source.replace("const bookingDisabled = !hasVehicle || !year || isSfd2 || selected.length === 0;", "const bookingDisabled = !hasVehicle || !year || (isSfd2 && !isMqbevoSfd2) || selected.length === 0;");
source = source.replace("disabled={!hasVehicle || !year || isSfd2}", "disabled={!hasVehicle || !year || !showCodings}");
source = source.replace("hasVehicle && year && !isSfd2 && popular.length > 0", "hasVehicle && year && showCodings && popular.length > 0");
source = source.replace("hasVehicle && year && !isSfd2 && <div", "hasVehicle && year && showCodings && <div");
source = source.replace(": isSfd2 ? <div className=\"mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700\">Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.</div>", ": isSfd2 && !isMqbevoSfd2 ? <div className=\"mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700\">Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.</div>");

fs.writeFileSync(file, source);
console.log("MQB-evo Spurhalteassistent-Ausnahmen für den Production-Build angewendet.");
