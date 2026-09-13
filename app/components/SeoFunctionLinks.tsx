import Link from "next/link";

const links = [
  ["Assistenzsysteme codieren", "/assistenzsysteme-codieren-leipzig"],
  ["Steuergeräte-Diagnose Leipzig", "/steuergeraete-diagnose-leipzig"],
  ["SFD1-Freischaltung Leipzig", "/sfd-freischaltung-leipzig"],
  ["Apple CarPlay freischalten", "/carplay-freischalten-leipzig"],
  ["VCDS Codierung Leipzig", "/vcds-codierung-leipzig"],
  ["Remote Fahrzeugcodierung", "/remote-fahrzeugcodierung"],
] as const;

export default function SeoFunctionLinks() {
  return (
    <section className="border-y border-blue-100 bg-slate-50">
      <details className="container-x py-4 sm:py-5">
        <summary className="cursor-pointer text-lg font-bold text-blue-700">Häufig gesuchte Codierungen</summary>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="card p-4 font-bold text-slate-900 transition hover:border-blue-300 hover:text-blue-700">
              {label} →
            </Link>
          ))}
        </div>
      </details>
    </section>
  );
}
