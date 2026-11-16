# PDF-Codieranleitungen: Shop-Umsetzung

## Bereits vorbereitet
- Sichtbarer, geschlossen dargestellter Schloss-Shortcut neben dem Profil in der Startseiten-Kopfzeile.
- Link in der mobilen Navigation.
- Öffentliche Übersicht unter `/codieranleitungen` mit den Kategorien VCDS und VCP.
- Keine Behauptung, dass der Checkout oder Downloads bereits funktionieren. Diese Übersicht wird bis zur Verkaufsfreigabe nicht indexiert.

## Vor Freischaltung eines Kaufs unbedingt umsetzen
1. Eigene, rechtlich nutzbare PDF-Codieranleitungen erstellen. Pro Produkt eindeutige ID, Titel, Tool, Fahrzeug-/Steuergeräte-Kompatibilität, Versionsstand, Preis in Cent und Dateireferenz pflegen. Keine Herstellerunterlagen oder fremden Anleitungen ohne Nutzungsrechte übernehmen.
2. PDF-Dateien in **privatem** Storage ablegen, niemals im öffentlichen Repository, unter `public/` oder hinter einer ungeschützten statischen URL.
3. Bezahl-Checkout (zum Beispiel Stripe Checkout oder eine verifizierbare PayPal-Business-Integration) serverseitig einrichten. Preis und Produkt-ID dürfen ausschließlich aus dem serverseitigen Produktkatalog stammen.
4. Zahlung anhand **signierter** Webhooks auf dem Server prüfen. Nicht aufgrund von `success`-URL, Client-State, PayPal.Me-Link oder Queryparametern eine Lizenz vergeben. Webhooks idempotent verarbeiten.
5. In Neon Entitlements speichern, die **Clerk-User-ID**, Produkt-ID, Provider-Zahlungs-ID und den Zahlungsstatus verknüpfen. Wiederholte Webhook-Zustellungen dürfen keine doppelten Käufe erzeugen.
6. Einen `GET /api/codieranleitungen/[id]/download`-Handler erst nach Implementierung von `auth()` und einer serverseitigen Berechtigungsprüfung anbieten. Nur die gekaufte Datei per kurzlebigem privatem Zugriff ausliefern; `Cache-Control: private, no-store` setzen und Dateipfade niemals aus einer untrusted ID ableiten.
7. Kaufhistorie und „Meine PDF-Anleitungen“ erst bei tatsächlichem Backend-Checkout in `/konto` ergänzen. Rückerstattungen bzw. Widerrufe müssen Lizenzstatus und Downloadberechtigung berücksichtigen.
8. Vor Go-live AGB, Datenschutz, Bestellbestätigung, Preisangaben nach § 19 UStG und EU-Widerrufsprozess für digitale Inhalte gesondert prüfen. Ein vorzeitiges Erlöschen des Widerrufsrechts erfordert die gesetzlich nötige ausdrückliche Zustimmung und Bestätigung; keine vorausgewählten Checkboxen.
9. Checkout, Webhook-Signatur, doppelte Zustellung, Fremdaccount-Zugriff, stornierte Zahlungen, nicht angemeldete Downloads und mobile Darstellung testen.
10. Erst danach Kauf-Buttons, Produktpreise, Downloads und `robots.index: true` freigeben.

**Status:** Nur die Shop-Oberfläche wurde vorbereitet. Es sind noch keine Produkte, Preise, Zahlungswebhooks, Berechtigungen oder echten PDF-Downloads eingerichtet.
