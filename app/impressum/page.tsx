import Link from "next/link";

export default function Impressum() {
  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="font-semibold text-blue-700 hover:underline">← Zur Startseite</Link>
        <h1 className="mt-8 text-4xl font-black">Impressum</h1>

        <div className="mt-8 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-bold">Angaben gemäß § 5 DDG</h2>
            <p className="mt-3">
              <strong>TD Fahrzeugcodierung</strong><br />
              Inhaber: Timo Drechsler<br />
              Schenkendorfstraße 33<br />
              04275 Leipzig<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">Kontakt</h2>
            <p className="mt-3">
              Telefon: <a className="text-blue-700 hover:underline" href="tel:+4915563047044">01556 3047044</a><br />
              E-Mail: <a className="text-blue-700 hover:underline" href="mailto:td.codierung@gmail.com">td.codierung@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">Umsatzsteuer</h2>
            <p className="mt-3">Kleinunternehmer gemäß § 19 UStG. Umsatzsteuer wird nicht gesondert ausgewiesen.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">Verbraucherstreitbeilegung</h2>
            <p className="mt-3">Wir sind nicht verpflichtet und derzeit nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">Hinweis zur früheren EU-OS-Plattform</h2>
            <p className="mt-3">Die europäische Plattform zur Online-Streitbeilegung wurde eingestellt; ein Link auf die frühere OS-Plattform wird daher nicht mehr bereitgestellt.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
