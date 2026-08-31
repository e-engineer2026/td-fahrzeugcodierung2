import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">← Zurück zur Startseite</Link>
      <div className="card mt-6 p-6 sm:p-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-700">

          <section><h2 className="text-xl font-bold text-slate-900">1. Geltungsbereich</h2>
          <p className="mt-2">Diese AGB gelten für Dienstleistungen von TD Fahrzeugcodierung, Inhaber Timo Drechsler, insbesondere Fahrzeugdiagnose, Codierungen, Anpassungen und vereinbarte Remote-Dienstleistungen an unterstützten Fahrzeugen.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">2. Vertrag und Leistungsumfang</h2>
          <p className="mt-2">Der konkrete Leistungsumfang ergibt sich aus der Buchung beziehungsweise individuellen Vereinbarung. Die technische Durchführbarkeit hängt von Fahrzeug, Steuergeräteversion, Softwarestand, Ausstattung, Diagnosezugang und vorhandener Hardware ab. Eine auf der Website dargestellte Funktion stellt keine Garantie dar, dass sie bei jedem Fahrzeug technisch verfügbar ist.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">3. Buchung und Terminbestätigung</h2>
          <p className="mt-2">Die Terminauswahl erfolgt über Cal.com. Bei Remote-Aufträgen wird der ausgewählte Termin erst nach Eingang der vereinbarten 70-%-Vorauszahlung verbindlich bestätigt. Die reine Auswahl beziehungsweise Buchung eines Zeitfensters ohne erforderliche Vorauszahlung begründet noch keine verbindliche Terminbestätigung durch TD Fahrzeugcodierung.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">4. Mitwirkung des Kunden</h2>
          <p className="mt-2">Der Kunde stellt richtige Fahrzeugdaten bereit und sorgt bei Remote-Terminen für einen geeigneten Windows-PC/Laptop, stabile Internetverbindung, ein kompatibles Diagnoseinterface und die vereinbarte Remote-Software. Das Fahrzeug muss sich in einem technisch geeigneten Zustand befinden. Bei Diagnose-, Codier- oder Programmiervorgängen kann eine geeignete Spannungsversorgung erforderlich sein.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">5. Preise und Zahlung</h2>
          <p className="mt-2">Es gelten die bei der Buchung angezeigten beziehungsweise individuell vereinbarten Preise. TD Fahrzeugcodierung ist Kleinunternehmer gemäß § 19 UStG; Umsatzsteuer wird nicht gesondert ausgewiesen. Bei Remote-Aufträgen sind grundsätzlich 70 % des vereinbarten Gesamtpreises vor dem Termin und 30 % nach Durchführung fällig, sofern nichts anderes vereinbart wurde. Die Website stellt hierfür getrennte PayPal-Zahlungslinks bereit. Vor-Ort-Leistungen können entsprechend der Buchung bar oder per PayPal bezahlt werden.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">6. Technische Undurchführbarkeit</h2>
          <p className="mt-2">Stellt sich vor oder während der Durchführung heraus, dass eine gewünschte Funktion technisch nicht möglich oder mit den vorhandenen Voraussetzungen nicht sicher durchführbar ist, kann die betreffende Leistung abgebrochen oder nicht durchgeführt werden. Bereits erbrachte Diagnose-, Prüf- oder Vorbereitungsleistungen können entsprechend der vorherigen Vereinbarung berechnet werden. Gesetzliche Ansprüche des Kunden bleiben unberührt.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">7. Remote-Dienstleistungen</h2>
          <p className="mt-2">Bei Remote-Arbeiten ermöglicht der Kunde den erforderlichen Zugriff auf seinen Computer und das angeschlossene Diagnoseinterface. Der Kunde bleibt für die physische Sicherung des Fahrzeugs verantwortlich und hat während der Arbeiten Anweisungen zu Zündung, Motor, Spannungsversorgung und Bedienung zu beachten. Die Remote-Verbindung darf während laufender Arbeiten nicht ohne Abstimmung beendet werden.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">8. Haftung</h2>
          <p className="mt-2">Es gelten die gesetzlichen Haftungsregeln. Der Kunde hat vor Änderungen auf Besonderheiten, bereits vorhandene Codierungen, Umbauten, Fehlfunktionen oder nicht serienmäßige Steuergeräte hinzuweisen. Zwingende gesetzliche Haftungstatbestände bleiben unberührt.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">9. Widerrufsrecht für Verbraucher</h2>
          <p className="mt-2">Für Verbraucher gelten die gesetzlichen Widerrufsrechte. Einzelheiten, einschließlich der Folgen eines ausdrücklich verlangten Leistungsbeginns vor Ablauf der Widerrufsfrist, ergeben sich aus der gesonderten Widerrufsbelehrung.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">10. Verbraucherstreitbeilegung</h2>
          <p className="mt-2">Wir sind nicht verpflichtet und derzeit nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">11. Schlussbestimmungen</h2>
          <p className="mt-2">Es gilt deutsches Recht unter Beachtung zwingender Verbraucherschutzvorschriften. Gesetzliche Gerichtsstände bleiben unberührt. Stand: August 2026.</p></section>

        </div>
      </div>
    </main>
  );
}
