const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'app/components/BookingConfigurator.tsx');
let source = fs.readFileSync(file, 'utf8');

const start = source.indexOf('function vehicleSpecificCodings(');
const end = source.indexOf('\n  const source = codingSources.find((item) => item.platform === vehicle.platform);', start);
if (start < 0 || end < 0) throw new Error('MQB evo SFD2 target boundaries not found');

const vehicleFunction = `function vehicleSpecificCodings(
  vehicle: Vehicle,
  year: number,
  isSfd1: boolean,
  isSfd2: boolean
): UnifiedCodingEntry[] {
  const isMqbevoSfd2 = isSfd2 && vehicle.platform === "MQBevo";
  if (isSfd2 && !isMqbevoSfd2) return [];

  const ids = new Set(codingsForVehicle(vehicle));
  const vehicleCatalog = codingCatalog
    .filter((coding) => ids.has(coding.id))
    .filter((coding) => {
      if (isMqbevoSfd2) return coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane";
      if (!isSfd1 || coding.category !== "Assistenzsysteme") return true;
      if (coding.id === "mqbevo-lane-onstate" || coding.id === "mqbevo-adaptive-lane") return true;
      return !/(aktivieren|freischalten|codieren|parametrieren)/i.test(coding.name);
    });

  const vehicleEntries: UnifiedCodingEntry[] = vehicleCatalog.map((coding) => ({
    id: \`vehicle-\${coding.id}\`,
    name: coding.name,
    price: coding.price,
    uiGroup: coding.uiGroup as PlatformCodingGroup,
    hardware: coding.hardware ?? coding.requirements,
    source: "vehicle",
  }));

  if (isMqbevoSfd2) {
    return curateCodingEntries(vehicleEntries.filter((entry) => yearAllowed(entry.name, year)));
  }
`;
source = source.slice(0, start) + vehicleFunction + source.slice(end + 1);

const oldState = `  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);\n  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);`;
const newState = `  const isSfd1 = Boolean(selectedVehicle?.sfd1From && year >= selectedVehicle.sfd1From && year < 2024);\n  const isSfd2 = Boolean(selectedVehicle?.sfd1From && year >= 2024);\n  const isMqbevoSfd2 = isSfd2 && selectedVehicle?.platform === "MQBevo";\n  const showCodings = !isSfd2 || isMqbevoSfd2;`;
if (!source.includes('const showCodings = !isSfd2 || isMqbevoSfd2;')) {
  if (!source.includes(oldState)) throw new Error('MQB evo SFD2 state target not found');
  source = source.replace(oldState, newState);
}

source = source.replace('const bookingDisabled = !hasVehicle || !year || isSfd2 || selected.length === 0;', 'const bookingDisabled = !hasVehicle || !year || (isSfd2 && !isMqbevoSfd2) || selected.length === 0;');
source = source.replace('disabled={!hasVehicle || !year || isSfd2}', 'disabled={!hasVehicle || !year || !showCodings}');
source = source.replace('hasVehicle && year && !isSfd2 && popular.length > 0', 'hasVehicle && year && showCodings && popular.length > 0');
source = source.replace('hasVehicle && year && !isSfd2 && <div', 'hasVehicle && year && showCodings && <div');
source = source.replace(': isSfd2 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.</div>', ': isSfd2 && !isMqbevoSfd2 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">Für dieses Fahrzeug und Baujahr wird die Codierauswahl aktuell nicht freigegeben.</div>');

fs.writeFileSync(file, source);
console.log('MQB evo SFD2 Spurhalteassistent-Optionen in den Production-Build integriert.');
