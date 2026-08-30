export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <a href="/" className="text-sm font-semibold text-blue-600 hover:underline">← Zurück zur Startseite</a>
      <div className="card mt-6 p-6 sm:p-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Datenschutzerklärung</h1>
        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-700">

          <section><h2 className="text-xl font-bold text-slate-900">1. Verantwortlicher</h2>
          <p className="mt-2">Timo Drechsler · TD Fahrzeugcodierung<br/>Schenkendorfstraße 33, 04275 Leipzig, Deutschland<br/>E-Mail: elektronikermeister@gmail.com<br/>Telefon: 01556 3047044</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">2. Allgemeine Hinweise und Rechtsgrundlagen</h2>
          <p className="mt-2">Personenbezogene Daten werden nur verarbeitet, soweit dies zur Bereitstellung der Website, zur Bearbeitung von Anfragen, zur Terminvereinbarung, Zahlungsabwicklung sowie zur Anbahnung und Durchführung unserer Dienstleistungen erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. b, c und f DSGVO.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">3. Hosting über Vercel</h2>
          <p className="mt-2">Diese Website wird über Vercel bereitgestellt. Beim Aufruf der Website können technisch erforderliche Verbindungs- und Protokolldaten verarbeitet werden, insbesondere IP-Adresse, Zeitpunkt des Zugriffs, angeforderte Seite, Browser- und Geräteinformationen. Die Verarbeitung dient der sicheren und zuverlässigen Bereitstellung der Website.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">4. Vercel Web Analytics</h2>
          <p className="mt-2">Zur technischen Auswertung der Nutzung dieser Website wird Vercel Web Analytics eingesetzt. Dabei werden insbesondere Seitenaufrufe und aggregierte Nutzungsinformationen erfasst. Nach Angaben von Vercel arbeitet Web Analytics ohne Drittanbieter-Cookies und stellt die Daten in anonymisierter beziehungsweise aggregierter Form bereit. Es werden von uns über Web Analytics keine FIN, Kontaktangaben oder Inhalte aus Formularfeldern als Analyseereignisse übermittelt.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">5. Kontaktaufnahme</h2>
          <p className="mt-2">Bei Kontakt per E-Mail, Telefon, WhatsApp oder Kontaktformular verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung Ihrer Anfrage. Dazu können Name, Kontaktdaten, Fahrzeugdaten, FIN und Angaben zur gewünschten Codierung gehören. Die Daten werden gelöscht, wenn sie für den jeweiligen Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">6. WhatsApp</h2>
          <p className="mt-2">Wenn Sie den angebotenen WhatsApp-Link verwenden, verlassen Sie unsere Website und kommunizieren über WhatsApp. Dabei verarbeitet der Anbieter des Dienstes die für die Kommunikation erforderlichen Daten. Die Nutzung von WhatsApp ist freiwillig; alternativ können Sie uns per E-Mail oder Telefon kontaktieren.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">7. Terminbuchung über Cal.com</h2>
          <p className="mt-2">Für Terminbuchungen verwenden wir Cal.com. Beim Öffnen des Buchungslinks können von Ihnen zuvor ausgewählte oder eingegebene Auftragsdaten als URL-Parameter an Cal.com übermittelt werden, insbesondere Fahrzeug, Baujahr, FIN, Codierungen, Preis und Zahlungsart. Cal.com verarbeitet zusätzlich die dort von Ihnen eingegebenen Kontaktdaten. Für die weitere Verarbeitung gelten die Datenschutzinformationen von Cal.com.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">8. Lokaler Buchungsspeicher im Browser</h2>
          <p className="mt-2">Für den Remote-Buchungsablauf werden die ausgewählten Auftragsdaten vorübergehend im lokalen Speicher Ihres Browsers (Local Storage) abgelegt. Dies dient dazu, Fahrzeug, Codierungen sowie 70-%-Vorauszahlung und 30-%-Restbetrag auf der Zahlungsseite anzuzeigen. Die Daten verbleiben grundsätzlich auf dem verwendeten Endgerät und werden nicht allein durch diese Speicherung an unseren Server übertragen. Sie können den lokalen Speicher jederzeit über die Browser-Einstellungen löschen.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">9. Zahlung über PayPal</h2>
          <p className="mt-2">Bei Nutzung der PayPal-Zahlungslinks werden Sie zu PayPal weitergeleitet. PayPal verarbeitet die für die Zahlung erforderlichen Daten in eigener Verantwortung. Für diese Verarbeitung gelten ergänzend die Datenschutzbestimmungen von PayPal.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">10. Remote-Zugriff</h2>
          <p className="mt-2">Bei Remote-Dienstleistungen kann nach Vereinbarung Fernwartungssoftware eingesetzt werden. Der Zugriff erfolgt nur zur Durchführung des vereinbarten Auftrags. Der Kunde muss die Remote-Verbindung aktiv freigeben und kann sie beenden. Zugangsdaten sollten nicht dauerhaft gespeichert oder weitergegeben werden.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">11. Speicherdauer</h2>
          <p className="mt-2">Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist. Gesetzliche handels- und steuerrechtliche Aufbewahrungspflichten bleiben unberührt.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">12. Ihre Rechte</h2>
          <p className="mt-2">Sie haben nach Maßgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zudem besteht ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde.</p></section>

          <section><h2 className="text-xl font-bold text-slate-900">13. Stand</h2><p className="mt-2">Stand: August 2026.</p></section>

        </div>
      </div>
    </main>
  );
}
