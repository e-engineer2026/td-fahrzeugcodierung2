const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'app/components/BookingConfigurator.tsx');
let source = fs.readFileSync(file, 'utf8');

const start = source.indexOf('function vehicleSpecificCodings(');
const end = source.indexOf('\n  const source = codingSources.find((item) => item.platform === vehicle.platform);', start);
if (start < 0 || end < 0) throw new Error('BookingConfigurator target boundaries not found');

const vehicleFunction = `function vehicleSpecificCodings(
  vehicle: Vehicle,
  year: number,
  isSfd1: boolean,
  isSfd2: boolean
): UnifiedCodingEntry[] {
  // SFD2 / UNECE: keinerlei Codierungsangebote.
  if (isSfd2) return [];

  const ids = new Set(codingsForVehicle(vehicle));
  const vehicleCatalog = codingCatalog
    .filter((coding) => ids.has(coding.id))
    .filter((coding) => {
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
    source: "vehicle" as const,
  }));
`;

source = source.slice(0, start) + vehicleFunction + source.slice(end + 1);

// Safety net: any old SFD2 exception from a previous build patch is removed.
source = source.replace(
  /\n  const isMqbevoSfd2 = isSfd2 && selectedVehicle\?\.platform === "MQBevo";\n  const showCodings = !isSfd2 \|\| isMqbevoSfd2;/g,
  ''
);
source = source.replace(
  'const bookingDisabled = !hasVehicle || !year || (isSfd2 && !isMqbevoSfd2) || selected.length === 0;',
  'const bookingDisabled = !hasVehicle || !year || isSfd2 || selected.length === 0;'
);
source = source.replaceAll('disabled={!hasVehicle || !year || !showCodings}', 'disabled={!hasVehicle || !year || isSfd2}');
source = source.replaceAll('hasVehicle && year && showCodings && popular.length > 0', 'hasVehicle && year && !isSfd2 && popular.length > 0');
source = source.replaceAll('hasVehicle && year && showCodings && <div', 'hasVehicle && year && !isSfd2 && <div');
source = source.replace(
  ': isSfd2 && !isMqbevoSfd2 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">SFD2 / UNECE erkannt: Für dieses Fahrzeug werden keine Codierungen angeboten.</div>',
  ': isSfd2 ? <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">SFD2 / UNECE erkannt: Für dieses Fahrzeug werden keine Codierungen angeboten.</div>'
);

fs.writeFileSync(file, source);
console.log('Production-Build: SFD2/UNECE Codierungen vollständig gesperrt.');
