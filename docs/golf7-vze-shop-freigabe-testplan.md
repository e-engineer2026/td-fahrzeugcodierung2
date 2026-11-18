# Golf 7 Verkehrszeichenerkennung - Freigabe und Shop-Testplan

Stand: 18.11.2026. Artikel TD-G7-AS-003, Produkt-ID golf7-vze, Revision 1.3, 3 Seiten, 13,99 EUR.
Status: TD Fahrzeugcodierung hat am 18.11.2026 mehrfach erfolgreiche Fahrzeugtests bestätigt. Fachfreigabe der Anleitung dokumentiert; Shop-Live-Verkauf bleibt bis zum Ende-zu-Ende-Test und zur rechtlichen Abnahme gesperrt.

## 1 Technische Freigabe, bevor die PDF verkauft wird

- [ ] An einem echten Golf 7/7.5 A5, 17 und 5F mit Teilenummern, SW- und HW-Stand dokumentiert
- [ ] VZE-fähige A5-Frontkamera, Navi- und Infotainmentsystem sowie ggf. gültige FEC/SWaP-Lizenz bestätigt
- [ ] Vollständiger Auto-Scan, Originalcodierungen und Anpassungskanäle gesichert
- [ ] A5 Byte 01 Bit 0 ODER Byte 16 Bit 4 exakt anhand der belegten Kameravariante entschieden
- [ ] STG 17 Byte 05 Bit 2 nur bei unterstützter Beschriftung überprüft
- [ ] STG 5F: BAP traffic_sign_recognition_0x21, Message-Bus und Anzeigeoptionen an realer Variante dokumentiert
- [ ] Erforderliche Kalibrierung, VCP-Parametrierung oder Herstellerlizenz gesondert geprüft
- [ ] Kontrollscan ohne neue relevante Fehler und sichere Funktionskontrolle dokumentiert
- [ ] Rückbau anhand der vorher gesicherten Istwerte technisch erprobt
- [ ] Werkstattprotokoll mit Prüffahrzeug, Datum und Fachkraft unterschrieben
- [ ] Nutzungsrechte der eigenen PDF und Ausgangsmaterialien geklärt; keine Originalseiten aus Vorlagen mit "NOT FOR SALE"

Quellen zur Plausibilisierung (kein Ersatz für Fahrzeugtest):
https://mk7hq.co.uk/coding.html
https://www.vag-coding.net/vw/golf-7-5g/golf-7-5g-panel-display-on-odb/

## 2 Entwickelte Funktionen

- Artikel und eigener Preis 13,99 EUR unter /codieranleitungen/golf7-vze
- Verlinkung in der Fahrzeugauswahl Golf 7 > Assistenzsysteme
- Servergebundener PayPal Orders-v2-Checkout; Status nach bestätigtem Capture
- Prüfung auf Produkt, eigener Bestellung, PayPal-ID, Capture-ID, EUR 13.99 und COMPLETED
- Verifizierte Webhook-Signatur und Sperrung bei bekanntem Refund/Dispute
- Kundenkonto mit gekauften PDFs, Download nur bei gespeichertem bezahltem Kauf
- Keine öffentlich zugängliche PDF-Datei: private Neon-Dokumentablage
- Drei separate Einwilligungen im digitalen Bestellprozess
- Bestellbestätigung als Datei, zusätzlicher rechtskonformer Versand vor Live ergänzen
- Maximal 5 Bestellversuche pro Stunde und Konto
- Sandbox- und Live-Gates über Vercel-Servervariablen, standardmäßig OFF

## 3 Sandbox-Konfiguration

In Vercel geschützte Variablen setzen, keine Schlüssel in Quellcode oder Chat kopieren:
TD_GUIDE_SHOP_MODE=sandbox
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=(Sandbox ID)
PAYPAL_CLIENT_SECRET=(Sandbox Secret)
PAYPAL_WEBHOOK_ID=(Sandbox Webhook ID)
TD_GUIDE_SHOP_RETURN_ORIGIN=https://td-fahrzeugcodierung-git-main-e-engineer2026s-projects.vercel.app
Diese Variablen wurden ausschließlich für Preview (ohne die drei PayPal-Zugangsdaten)
vorkonfiguriert; die Produktion erhält keine Sandbox-Zahlungsfreigabe.
Sandbox-Webhook URL: https://td-fahrzeugcodierung-git-main-e-engineer2026s-projects.vercel.app/api/webhooks/paypal
Events: PAYMENT.CAPTURE.REFUNDED, PAYMENT.CAPTURE.REVERSED und ggf. CUSTOMER.DISPUTE.CREATED.
Neon-Dokumenten- und Bestelltabellen werden serverseitig angelegt.

Der neue private Admin-Upload ist unter /konto/pdf-verwaltung erreichbar, nach Anmeldung
mit einem freigegebenen und verifizierten Clerk-Administratorkonto.
Zugelassen ist nur die zugeordnete Prüffassung TD_Golf7_03_Verkehrszeichenerkennung_Rev13_Fachfreigabe_optimiert.pdf
(SHA256 12a210529950df7dd0b5bc5c89c231de39854b2850dc4515ac8db4cc2c950ac6).
Der Server verifiziert die PDF-Datei und den Hash, speichert den Inhalt privat in Neon
und stellt ihn nur nach gültiger Zahlung für das angemeldete Käuferkonto bereit.
Der ältere interne PUT-/api/guide-shop/admin/document-Endpunkt erfordert weiterhin
den geheimen Header x-td-guide-storage-key und akzeptiert denselben Hash.

## 4 Tests vor der Freigabe

- [ ] PDF-Upload erfolgreich; SHA256 und Revisionsstand stimmen
- [ ] Gast ohne Kundenkonto: Bestellung nach drei Einwilligungen möglich (nur Sandbox)
- [x] Ohne Gast-Cookie / ohne Zahlung: Download = HTTP 403 (Live-Abruf 18.11.)
- [x] Ohne Gast-Cookie: Bestellbestätigung = HTTP 403 (Live-Abruf 18.11.)
- [x] Ohne Gast-Cookie: Kaufstatus = HTTP 200, paid=false (Live-Abruf 18.11.)
- [ ] Nach Testkauf: Download = HTTP 200 ausschließlich im berechtigten Browser
- [ ] Ohne Einwilligungen: Bestellung = HTTP 400
- [ ] Sandbox-PayPal: richtige Testsumme, keine echte Abbuchung
- [ ] PayPal-Abbruch: kein Download
- [ ] PayPal-Capture: Status, Währung, Preis und Eigentümer stimmen
- [ ] Doppelter Capture und erneutes Browserladen: keine Doppelbelastung
- [ ] Fremdes Konto oder fremde PayPal-Bestell-ID: kein Download
- [ ] PDF-Auslieferung nach Kauf mit Content-Disposition und no-store
- [ ] Gefälschter Webhook zurückgewiesen, signierte Rückzahlung sperrt Zugriff
- [ ] Vollständige rechtliche Prüfung für digitale Inhalte, Zahlungsbutton und Rechnungsstellung
- [ ] Vertrags-/Bestellbestätigung auf dauerhaftem Datenträger automatisch bereitgestellt

## 5 Live-Freigabe

Zusätzlich zu PayPal-Live-Zugangsdaten und PAYPAL_ENV=live nur mit diesen Freigaben:
TD_GUIDE_SHOP_MODE=live
TD_G7_VZE_TECH_APPROVED=true
TD_GUIDE_LEGAL_APPROVED=true
TD_GUIDE_CONFIRMATION_EMAIL_READY=true

Keine echte PayPal-Zahlung, kein öffentlicher PDF-Verkauf und keine pauschale technische
Freigabe, bevor die offenen Prüfungen abgeschlossen sind.


## Import und Abnahme 18.11.2026
- [x] TD-G7-AS-003, freigegebene PDF Rev 1.3 mit 143340 Bytes in privater Neon-Datenbank hinterlegt.
- [x] Hash geprüft: 12a210529950df7dd0b5bc5c89c231de39854b2850dc4515ac8db4cc2c950ac6.
- [x] Vercel Preview: geschützter Import via temporärem Token, HTTP 200, Ergebnis stored=true.
- [x] Temporären Import-Zugang nach Übertragung aus dem Programm entfernt.
- [x] PayPal-Sandbox-OAuth erfolgreich: neuer Preview-Build mit `paypalAuthVerified=true`, HTTP 200, `readyForSandboxCheckout=true` (18.11.2026, 14:28 Uhr Europe/Berlin).
- [ ] Sandbox-Testkauf mit virtuellem Geld, Zahlungsbestätigung und Download tatsächlich durchspielen.
- [ ] Rechtskonforme dauerhafte Kaufbestätigung (automatischer E-Mail-Versand) vor Live-Verkauf einrichten.
- [ ] Live-PayPal-Zugangsdaten und Webhook erst nach vollständig erfolgreicher Abnahme in Production hinterlegen.


## Nachprüfung der Veröffentlichung am 18.11.2026 (13:40 Uhr, Europe/Berlin)

- [x] `/codieranleitungen`: HTTP 200 auf der offiziellen Domain.
- [x] `/codieranleitungen/golf7-vze`: HTTP 200 auf der offiziellen Domain; Artikel TD-G7-AS-003, Rev 1.3, 13,99 EUR öffentlich angezeigt.
- [x] `/api/guide-shop/download/golf7-vze`: ohne Zahlung HTTP 403, PDF nicht offen zugänglich.
- [x] `/api/guide-shop/guest/status`: ohne Kauf HTTP 200, `paid=false`.
- [x] `/api/guide-shop/guest/confirmation`: ohne Kauf HTTP 403.
- [x] Produktionspfad `/api/guide-shop/sandbox/check`: HTTP 404; Sandbox-Diagnose nicht öffentlich in Production verfügbar.
- [x] Separate geschützte Vercel-Preview: Neon erreichbar, `pdfStored=true`, Dokumentrevision 1.3.
- [!] PayPal-Sandbox in der Preview: OAuth-HTTP 401, `paypalDiagnostic=credentials_rejected`. Sandbox Client-ID/Secret im PayPal-Developer-Dashboard neu kontrollieren und nur in Vercel Preview korrigieren. Keine Schlüssel in GitHub oder Support-Chats kopieren.
- [ ] End-to-End-Sandbox-Testkauf mit virtuellem Geld, Capture-Prüfung, Webhook, PDF und Bestellbestätigung nach gültigen Zugangsdaten noch ausstehend.
- [ ] Vor Live-Verkauf: E-Mail-Bestellbestätigung auf dauerhaftem Datenträger, Rechtsfreigabe, PayPal-Live-Konfiguration und Webhook testen.
- [x] Sichere öffentliche Aktualisierung `bd90ff549aeef494275e37830385f06160eb9520`: irreführenden Hinweis auf fehlende technische Prüfung entfernt, Checkout weiter gesperrt.

Hinweis: Eine bestehende PayPal-Freigabe wird durch HTTP 401 **nicht** bestätigt. Ein Vercel-Build mit Status READY ersetzt keinen echten Zahlungstest. Die Sandbox-Rückleitungsdomain muss auf eine tatsächliche Preview zeigen, nicht auf eine Production-Alias-Domain.


## Status nach Sandbox-Test 18.11.2026 (14:35 Uhr, Europe/Berlin)

- [x] Technisch validierte Sandbox-Bereitschaft: OAuth HTTP 200, PDF Rev. 1.3 vorhanden, `readyForSandboxCheckout=true`.
- [x] Nutzer meldet nach manuell begonnenem PayPal-Sandbox-Test: **„test ok“**. Dies ist eine Nutzerrückmeldung, **keine** serverseitige Bestätigung einer kompletten Capture-/Download-/Webhook-Kette.
- [x] Unberechtigter PDF-Zugriff ohne Gast-Cookie bleibt HTTP 403.
- [ ] Serverseitige Belege für den konkreten Sandbox-Capture, Download nach Zahlung, Rückleitung und Webhook-Event fehlen weiterhin; im überprüften Vercel-Preview-Laufzeitprotokoll waren nur Sandbox-Diagnoseaufrufe ersichtlich. Nicht als vollständig abgenommen markieren.
- [ ] E-Mail-Bestellbestätigung, rechtliche Prüfung und signierte Webhook-Abläufe bleiben Freigabevoraussetzungen für Live.
- [x] PayPal-Zugangsdaten auf `preview` begrenzt; kein Live-Checkout aktiviert.


## Manueller PayPal.Me-Verkauf mit geschuetztem PDF-Freigabelink (18.11.2026)

- Statt der unvollstaendigen Live-PayPal-API nutzt die Produktions-Artikelseite den bereits bestehenden Link `https://paypal.me/TiDrechsler/13.99EUR`. Empfaengerkonto muss durch TD selbst anhand der PayPal-Anzeige geprueft werden; die Website kann die hinterlegte Kontoadresse nicht nachweisen.
- Kaeufer akzeptiert AGB und Hinweis auf manuelle Lieferung, zahlt ueber PayPal.Me, meldet die PayPal-Transaktionsnummer und seine E-Mail-Adresse per Nachricht an `info@td-fahrzeugcodierung.de`.
- TD kontrolliert im tatsaechlichen PayPal-Empfaengerkonto **Betrag (13,99 EUR), Geldeingang, Verwendungszweck und Transaktionsnummer**. Screenshot und Rueckleitung sind kein sicherer Beweis.
- Nach verifiziertem Zahlungseingang und Clerk-Adminanmeldung im geschuetzten Bereich `/konto/pdf-verwaltung`: Kunden-E-Mail und PayPal-Transaktion eingeben, Zahlungspruefung aktiv bestaetigen und Freigabelink erstellen.
- Transaktionsnummer wird in `td_guide_manual_grants` nur einmal zugelassen; Freigabe-Token mit 256 Bit Entropie liegt in Neon nur als SHA256-Hash vor. Die geheime URL benutzt ein Hash-Fragment statt eines serverseitig protokollierten Query-Parameters.
- TD verschickt den persoenlichen Freigabelink manuell per E-Mail. **Die Anwendung versendet keine E-Mail automatisch.**
- Der Kunde oeffnet die URL innerhalb von 7 Tagen und klickt auf `PDF-Zugriff aktivieren`; ein **POST** loest atomar den Einmallink ein und legt die berechtigte Gastbestellung an. E-Mail-Vorschau-Bots koennen den Schluessel nicht per GET verbrauchen.
- Die bereits bestehende 30-Tage-HttpOnly-Cookie-Abfrage zeigt dann dem berechtigten Kunden im selben Browser den PDF-Download und die Bestellbestaetigung. Der unberechtigte GET-Download bleibt HTTP 403.
- Bei Erstattung, Storno oder Streitfall sperrt der Admin die jeweilige Transaktionsnummer. Bereits eingelöste Bestellungen wechseln auf `refunded` und der Abruf wird deaktiviert. Bereits lokal gespeicherte PDFs koennen nicht zurueckgerufen werden.
- Die Gastbestellbestaetigung zeigt bei PayPal.Me den manuell geprueften Zahlungsweg und die Transaktionsnummer, ohne einen elektronisch erfassten Widerrufsverzicht vorzutäuschen.
- **Wichtig:** Es gibt ohne PayPal-Live-API/geeigneten Webhook keine automatische unmittelbare PDF-Freigabe nach einer PayPal.Me-Zahlung. Keine Freigabe aus Redirects oder vom Kunden eingegebenen Transaktionsnummern. Kein PayPal-Live-Checkout aktiviert.

### Technische Pruefung im Vercel-Preview

- [x] Next.js/TypeScript-Preview-Build erfolgreich, 12 automatisierte Tests bestanden.
- [x] Sandbox-Diagnose HTTP 200, PDF Rev 1.3 in privatem Speicher vorhanden.
- [x] Freigabeseite HTTP 200, als noindex gekennzeichnet.
- [x] Download ohne gueltige Gastberechtigung HTTP 403.
- [ ] Eine echte manuell verifizierte PayPal.Me-Transaktion muss im Adminbereich eingetragen, der Einmallink vom Testkaeufer eingelöst und der anschliessende PDF-Download/Bestellbestaetigung im Browser abgenommen werden.
- [ ] Erstattungssperre mit einem Testdatensatz durchspielen.
- [ ] Versand der Kunden-E-Mail und rechtliche Gestaltung des manuellen Verkaufsprozesses abschliessend abnehmen.
