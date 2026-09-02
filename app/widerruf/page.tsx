import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">← Zurück zur Startseite</Link>
      <div className="card mt-6 p-6 sm:p-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Widerrufsbelehrung</h1>
        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-700">

          <section><h2 className="text-xl font-bold text-slate-900">Widerrufsrecht</h2>
          <p className="mt-2">Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">Ausübung des Widerrufsrechts</h2>
          <p className="mt-2">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns – Timo Drechsler, TD Fahrzeugcodierung, Schenkendorfstraße 33, 04275 Leipzig, Telefon: 01556 3047044, E-Mail: td.fahrzeugcodierung@gmail.com – mittels einer eindeutigen Erklärung, zum Beispiel per Brief oder E-Mail, über Ihren Entschluss informieren. Sie können dafür das unten aufgeführte Muster-Widerrufsformular verwenden; dessen Verwendung ist nicht vorgeschrieben.</p>
          <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">Folgen des Widerrufs</h2>
          <p className="mt-2">Wenn Sie diesen Vertrag widerrufen, erstatten wir alle Zahlungen, die wir von Ihnen erhalten haben, grundsätzlich unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für die Rückzahlung verwenden wir grundsätzlich dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Zahlung eingesetzt haben, sofern nicht ausdrücklich etwas anderes vereinbart wurde.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">Dienstleistungsbeginn vor Ablauf der Widerrufsfrist</h2>
          <p className="mt-2">Verlangen Sie ausdrücklich, dass die Dienstleistung bereits während der Widerrufsfrist beginnt, kann bei einem späteren Widerruf Wertersatz für den bis zum Widerruf bereits erbrachten Teil der vereinbarten Dienstleistung anfallen. Das Widerrufsrecht kann bei vollständiger Erbringung einer kostenpflichtigen Dienstleistung erlöschen, wenn Sie vor Beginn ausdrücklich zugestimmt haben, dass mit der Leistung vor Ablauf der Widerrufsfrist begonnen wird, und Ihre Kenntnis bestätigt haben, dass das Widerrufsrecht bei vollständiger Vertragserfüllung erlischt.</p></section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h2 className="text-xl font-bold text-slate-900">Muster-Widerrufsformular</h2>
          <p className="mt-3">Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden und an uns senden:</p>
          <div className="mt-4 space-y-2">
            <p>An: Timo Drechsler, TD Fahrzeugcodierung, Schenkendorfstraße 33, 04275 Leipzig, E-Mail: td.fahrzeugcodierung@gmail.com</p>
            <p>Hiermit widerrufe ich/wir den von mir/uns abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</p>
            <p>____________________________________________</p>
            <p>Bestellt am / Vertrag geschlossen am: ____________________</p>
            <p>Name des/der Verbraucher(s): _____________________________</p>
            <p>Anschrift des/der Verbraucher(s): _________________________</p>
            <p>Datum: ____________________</p>
            <p>Unterschrift (nur bei Mitteilung auf Papier): ____________________</p>
          </div></section>

          <section><h2 className="text-xl font-bold text-slate-900">Stand</h2><p className="mt-2">August 2026.</p></section>

        </div>
      </div>
    </main>
  );
}
