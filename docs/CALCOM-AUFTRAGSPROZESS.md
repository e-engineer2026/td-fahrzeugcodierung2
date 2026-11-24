# Cal.com-Terminereignisse in TD Fahrzeugcodierung (Entwurf)

Dieser Zweig erweitert die bereits im Auftrags-PR enthaltene interne Verwaltung. **Nicht produktiv aktiviert.**

## Einrichtung nach erfolgreicher Vorschau und Freigabe

1. In Cal.com einen Webhook für die Ereignisse **Booking Created**, **Booking Rescheduled** und **Booking Cancelled** erstellen. Webhook für deine Terminarten „VAG-Codierung vor Ort“ und „Remote-Codierung“ einrichten. **Standard-Payload** verwenden, keine abweichende Vorlage.
2. Zieladresse: `https://td-fahrzeugcodierung.de/api/webhooks/calcom` (erst nach Produktivfreigabe); für Tests die eigene geschützte Preview-Domain verwenden.
3. Ein **zufälliges Secret mit mindestens 32 Zeichen** in Cal.com eingeben und denselben Wert ausschließlich als Vercel-Serverumgebungsvariable `TD_CAL_WEBHOOK_SECRET` im passenden Environment setzen. Niemals Secret oder Webhook-Logs in Git committen.
4. Optional in beiden Terminarten eine Buchungsfrage mit **Identifier `tdorderid`** anlegen. Der Link aus dem Kundenkonto füllt die Auftrags-UUID als URL-Parameter voraus. Ohne diese Frage erscheinen Buchungen trotzdem im Admin-Eingang, jedoch ohne automatische Zuordnungsempfehlung.
5. Den Ping-Test und eine echte Sandbox-Buchung inklusive Stornierung auf dem Preview-Deployment durchführen. Die Signatur wird anhand des Original-HTTP-Bodys gegen den Header `X-Cal-Signature-256` mit HMAC-SHA256 geprüft. Eine ungültige Signatur liefert HTTP 403.
6. Im internen Bereich `/konto/auftraege` Buchungen sichten. Der Admin bestätigt Zuordnungen ausdrücklich; Buchungs-E-Mails oder frei eingegebene Auftragsnummern sind kein Zahlungsnachweis.

## Schutz und Grenzen

- Webhooks speichern ausschließlich Buchungskennung, Ereignisart, Termin, Teilnehmer-E-Mail und optional die Auftrags-UUID; der Original-Body wird nicht gespeichert.
- Eine Buchung ändert **nicht** automatisch Auftrags- oder PDF-Zahlungsstatus.
- Nur aktuelle, zu Kundendaten und Auftragsnummer passende aktive Buchungen können durch einen verifizierten Administrator zugeordnet werden. Stornierte Buchungen werden zur manuellen Prüfung angezeigt.
- Automatische Stornierung von Kundenaufträgen, Rückzahlungen und Rechnungserstellung sind absichtlich **nicht** Teil dieser Änderung.
- Datenbank-/Integrationsprüfungen mit PostgreSQL und echten Cal.com-Testwebhooks sowie Datenschutz-/Aufbewahrungsregeln vor dem Livegang prüfen.

Quellen: https://cal.com/features/webhooks und https://cal.com/features/booking-questions
