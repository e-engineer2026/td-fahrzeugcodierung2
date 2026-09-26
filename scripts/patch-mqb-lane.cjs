const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'app/components/BookingConfigurator.tsx');
let source = fs.readFileSync(file, 'utf8');

const old = '  if (isSfd2) return [];\n';
const replacement = `  if (isSfd2) {
    if (vehicle.platform !== "MQBevo") return [];
    const sfd2Ids = new Set(["mqbevo-lane-onstate", "mqbevo-adaptive-lane"]);
    const ids = new Set(codingsForVehicle(vehicle));
    return curateCodingEntries(
      codingCatalog
        .filter((coding) => ids.has(coding.id) && sfd2Ids.has(coding.id))
        .map((coding) => ({
          id: \`vehicle-\${coding.id}\`,
          name: coding.name,
          price: coding.price,
          uiGroup: coding.uiGroup,
          hardware: coding.hardware ?? coding.requirements,
          source: "vehicle",
        }))
        .filter((entry) => yearAllowed(entry.name, year))
    );
  }
`;

if (source.includes('const sfd2Ids = new Set(["mqbevo-lane-onstate", "mqbevo-adaptive-lane"]);')) {
  process.exit(0);
}
if (!source.includes(old)) {
  throw new Error('MQB evo SFD2 target not found');
}
source = source.replace(old, replacement);
fs.writeFileSync(file, source);
console.log('Patched MQB evo SFD2 lane options for production build.');
