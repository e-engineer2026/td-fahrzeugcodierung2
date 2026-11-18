# Golf 7 Verkehrszeichenerkennung - Freigabe und Shop-Testplan

Stand: 18.11.2026. Artikel TD-G7-AS-003, Produkt-ID golf7-vze, Revision 1.1, 3 Seiten, 13,99 EUR.
Status: Prüfentwurf; keine Fahrzeugvalidierung und kein Live-Verkauf.

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

Interner PDF-Upload mit PUT /api/guide-shop/admin/document als application/pdf
und Header x-td-guide-storage-key (TD_GUIDE_STORAGE_KEY aus Vercel).
Die Datei bleibt privat in Neon und wird ohne berechtigten Kauf nicht ausgeliefert.

## 4 Tests vor der Freigabe

- [ ] PDF-Upload erfolgreich; SHA256 und Revisionsstand stimmen
- [ ] Ohne Anmeldung: Käufe, Bestellbestätigung, Download = HTTP 401
- [ ] Angemeldet ohne Kauf: Download = HTTP 403
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
