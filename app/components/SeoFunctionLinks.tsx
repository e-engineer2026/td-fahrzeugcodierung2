import Link from "next/link";

const links = [
  ["Assistenzsysteme codieren", "/assistenzsysteme-codieren-leipzig"],
  ["Verkehrszeichenerkennung codieren", "/verkehrszeichenerkennung-codieren-leipzig"],
  ["Lane Assist codieren", "/lane-assist-codieren-leipzig"],
  ["Fernlichtassistent codieren", "/fernlichtassistent-codieren-leipzig"],
  ["Steuergeräte-Diagnose Leipzig", "/steuergeraete-diagnose-leipzig"],
  ["SFD1-Freischaltung Leipzig", "/sfd-freischaltung-leipzig"],
  ["Apple CarPlay freischalten", "/carplay-freischalten-leipzig"],
  ["VCDS Codierung Leipzig", "/vcds-codierung-leipzig"],
  ["Remote Fahrzeugcodierung", "/remote-fahrzeugcodierung"],
] as const;

export default function SeoFunctionLinks() {
  return (
    <section className="border-y border-blue-100 bg-slate-50">
      <div className="container-x py-10 sm:py-14">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[.16em] text-blue-600 sm:text-sm">Häufig gesuchte Codierungen</div>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Direkt zur gewünschten Funktion.</h2>
          <p className="mt-3 leading-7 text-slate-600">Technische Hinweise, Voraussetzungen und direkte Fahrzeugauswahl für besonders häufig angefragte Leistungen.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="card p-4 font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700">
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
