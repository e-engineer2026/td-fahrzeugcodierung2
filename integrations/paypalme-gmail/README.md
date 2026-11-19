# PayPal.Me → Gmail → automatische Golf-7-VZE-PDF-Freigabe

## Zweck

Die Zahlung bleibt bei **PayPal.Me/TiDrechsler**. Der Kunde trägt die auf der
Website angezeigte Bestellnummer `TDG7-XXXXXXXX` als PayPal-Nachricht ein.
Eine echte PayPal-Eingangs-E-Mail im Gmail-Postfach liefert die Bestellnummer
und die PayPal-Transaktionsnummer. Ein Google Apps Script kontrolliert diese
E-Mail und sendet **signiert** eine Freigabeanfrage an die Website.

**Wichtig:** Nur eine E-Mail genügt nicht für die Freigabe. Der Server fragt
PayPals Transaction Search API nach einer tatsächlich **erfolgreichen
Eingangszahlung über genau 13,99 EUR** ab und gibt ausschließlich die eine
passende offene Clerk-Kundenbestellung frei. Dieselbe Transaktionsnummer
kann nicht mehrfach für Kundenkonten freigegeben werden.

## Einmalige Einrichtung (noch NICHT ausgeführt)

1. In der [PayPal-Developer-Konsole](https://developer.paypal.com/dashboard/applications/live)
   Live-REST-Zugangsdaten **des empfangenden PayPal-Kontos** einrichten. Für
   die Prüfung der bestehenden PayPal.Me-Zahlungen muss Transaction Search
   für dieses Konto verfügbar und berechtigt sein. Der automatische PayPal-
   Checkout der Website bleibt ausgeschaltet.
2. Auf Vercel in **Production** setzen:
   - `PAYPAL_ENV=live`
   - `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` mit PayPal Live-Zugangsdaten
   - `TD_PAYPALME_GMAIL_SECRET` auf einen zufälligen geheimen Wert mit mindestens
     32 Zeichen (nicht im Repository speichern).
   - **Nicht** `TD_GUIDE_SHOP_MODE=live` aktivieren. Der normale
     PayPal.Me-Kauf bleibt unverändert.
3. In **timo.drechsler@gmail.com** unter [script.google.com](https://script.google.com)
   ein neues Google Apps Script erstellen. Inhalt von
   `integrations/paypalme-gmail/Code.gs` einfügen.
4. Bei **Projekteinstellungen → Skripteigenschaften** setzen:
   - `RELEASE_URL=https://td-fahrzeugcodierung.de/api/guide-shop/automations/paypalme-email`
   - `RELEASE_SECRET` auf denselben Geheimwert wie bei Vercel.
5. Einmal `installTrigger()` ausführen, Google-Berechtigungen für Gmail und
   externe HTTP-Aufrufe bestätigen. Der Trigger prüft anschließend alle
   **15 Minuten**, ohne dass ChatGPT geöffnet sein muss.
6. Nach Veröffentlichung mit einem **echten vollständigen Testkauf** den
   gesamten Ablauf prüfen. Vorher nicht auf automatische Freigaben verlassen.
   Die Bestellnummer muss **tatsächlich im lesbaren E-Mail-Text** auftauchen.
   Authentifizierungsheader müssen DKIM- und DMARC-Prüfungen bestehen.
7. Falls das aktuelle stündliche ChatGPT-Zahlungsmonitoring parallel läuft,
   nach erfolgreichem Live-Test deaktivieren, um doppelte Meldungen zu vermeiden.

## Technisches Verhalten

- Gmail-Nachrichten werden nur verarbeitet, wenn Absender und Gmail-
  Authentifizierung zu PayPal passen und **genau eine** TDG7-Referenz sowie
  eine plausibel formatierte PayPal-Transaktions-ID enthalten sind.
- Apps Script signiert die Anfrage per HMAC-SHA256. Die Website akzeptiert
  sie nur mit gültiger Signatur und frischem Zeitstempel.
- PayPal Transaction Search muss die identische ID, erfolgreichen
  Eingangsstatus, positiven Betrag, die richtige Währung und eine zur
  Bestellung zeitlich passende Zahlung melden. Verzögerte Meldungen werden
  beim nächsten Lauf erneut geprüft. Bei fehlender API-Berechtigung wird
  **keine** Freigabe vorgenommen.
- Die bestehende manuelle Freigabe bleibt als Rückfallebene verfügbar.
  Für Rückzahlungen oder Konfliktfälle ist die bestehende Sperrfunktion
  in der PDF-Verwaltung zu verwenden, bis eine automatische
  Rückzahlungsüberwachung separat implementiert ist.
- Es werden **keine** Passwörter, Live-Geheimnisse, PayPal-Token oder
  PDFs an Google Apps Script übermittelt.
- Das Ergebnis ist eine Freigabe im **registrierten Kundenkonto**, keine
  Versand-E-Mail. Die bisherige Bestellbestätigung per E-Mail wird
  durch diese Integration nicht nachgerüstet.

## Grenzen

Bei älteren PayPal-Zahlungen (älter als 29 Tage), fehlender
Bestellnummer, nicht verifizierbarer E-Mail, nicht verfügbaren PayPal-
Reporting-APIs oder mehrdeutigen Bestellungen erfolgt niemals eine
automatische Freigabe. PayPal.Me erhält **keine automatische
Bestellnummer aus der Website**; der Kunde muss sie wie bisher als
Nachricht eintippen.

Diese Änderung ist zur technischen Prüfung vorbereitet und **nicht**
vollständig eingerichtet, solange die oben genannten Google- und
Vercel-Schritte nicht abgeschlossen und mit einer realen Zahlung
verifiziert wurden.
