# TD Fahrzeugcodierung: PayPal.Me → Gmail → PDF-Freigabe (ohne PayPal-Live-API)

## Ablauf
Der angemeldete Kunde erhält die Bestellnummer `TDG7-XXXXXXXX` und trägt
sie als **Nachricht zur Zahlung** bei PayPal.Me/TiDrechsler ein. Die Zahlung
bleibt unverändert bei PayPal.Me. Ein Google Apps Script kontrolliert im
Gmail-Konto **timo.drechsler@gmail.com** alle 15 Minuten neue
PayPal-Zahlungseingangsbestätigungen.

Nur wenn die Nachricht eine einzige gültige TDG7-Referenz, eine
Transaktionsnummer und **13,99 EUR als tatsächlich erhaltenen Betrag**
ausweist, meldet das Skript sie über eine mit HMAC signierte Anfrage an die
Website. Die Website ordnet sie einer einzigen offenen Clerk-Bestellung zu
und schaltet genau diese Golf-7-VZE-PDF frei. Derselbe PayPal-Code ist für
Kundenkonto-Freigaben einmalig nutzbar. Bei fehlenden Angaben bleibt die
Bestellung offen.

**Keine PayPal-REST-API / kein PayPal-Live-Checkout erforderlich.**
Eine authentifizierte PayPal-E-Mail ist aber kein gleichwertiger Beweis für
einen endgültig gebuchten, nicht zurückgezahlten Zahlungseingang.
**Restgefahr:** verzögerte Zahlungen, Rückerstattungen, Streitfälle,
manipulierte Benutzer-Nachrichten und Veränderungen der PayPal-Mailvorlage.
Der E-Mail-basierte Weg ist ausdrücklich weniger sicher. Das System führt
keine automatische Rückerstattungsprüfung aus.

## Einmalige Einrichtung (noch ausstehend)

1. Bei Vercel im Projekt **td-fahrzeugcodierung → Environment Variables**
   nur für **Production** einrichten:
   - `TD_PAYPALME_GMAIL_SECRET` = langes, zufällig generiertes Geheimnis
     (mindestens 32 Zeichen, nur in sicheren Einstellungen speichern).
   - `TD_PAYPALME_EMAIL_AUTO_RELEASE=enabled`
   - **Keine PayPal-Live-Variablen** erforderlich. `TD_GUIDE_SHOP_MODE`
     bleibt unverändert/off, damit weiter PayPal.Me verwendet wird.
2. Unter [script.google.com](https://script.google.com) im Google-Konto
   **timo.drechsler@gmail.com** neues Apps-Script-Projekt erstellen.
   Datei `integrations/paypalme-gmail/Code.gs` einfügen.
3. Unter **Projekteinstellungen → Skripteigenschaften** hinzufügen:
   - `RELEASE_URL=https://td-fahrzeugcodierung.de/api/guide-shop/automations/paypalme-email`
   - `RELEASE_SECRET` = **genau dasselbe Geheimnis** wie in Vercel.
4. Im Apps Script die Funktion `installTrigger` einmal ausführen und
   die Berechtigungen für **Gmail und UrlFetch** erteilen. Das ist
   eine Benutzeraktion im Google-Konto, die ChatGPT nicht stellvertretend
   abschließen kann.
5. Die Pull-Request-Änderung veröffentlichen, ohne den bestehenden
   Kaufablauf zu ändern. Eine neue Produktionsbereitstellung ist nötig,
   damit die Environment Variables aktiv werden.
6. **Vor dem echten Betrieb:** mit einer vollständigen echten PayPal.Me-
   Zahlung über 13,99 EUR samt TDG7-Referenz prüfen, dass Gmail die
   Referenz und Transaktions-ID in der Nachricht ausweist, der Google-
   Empfangskopf DKIM und DMARC `pass` meldet und anschließend nur das
   korrekte Kundenkonto die PDF erhält. Bei fehlendem Test weiterhin
   manuell freigeben.
7. Nach nachgewiesener Funktionsfähigkeit das separate stündliche
   ChatGPT-Zahlungsmonitoring prüfen/deaktivieren, damit keine doppelte
   Bearbeitung entsteht.

## Sicherheitsregeln

- Nur im **authentifizierten Gmail-Konto** direkt empfangene PayPal-Mails,
  Absender `service@paypal.de` oder `service@paypal.com`; Gmail-
  Authentifizierungsheader müssen DKIM und DMARC `pass` für PayPal
  enthalten. Die Prüfung wurde am Format einer echten PayPal-Mail
  abgeglichen; eine TDG7-Mail liegt bislang nicht als Muster vor.
- Nur deutscher bekannter PayPal-Empfangsbeleg mit **zwei** passenden
  Betragsfeldern (»hat dir … gesendet« und »Erhaltener Betrag«),
  beide genau 13,99 EUR. Andere Sprachen oder Belegvorlagen
  werden vorsichtshalber nicht automatisch freigegeben.
- HMAC-SHA256 über Zeitstempel und Nachrichteninhalt schützt die
  Freigabe-Schnittstelle; das Geheimnis bleibt außerhalb von GitHub.
- Die Website prüft Produktionsumgebung, Einmaligkeit, Alter der
  E-Mail, Zeitbezug zur Bestellung, Artikel, Preis, Währung und
  vorhandenes PDF vor der Statusänderung.
- Bei einem Betrag ungleich 13,99 EUR, fehlender/mehrdeutiger
  Bestellnummer, unbekannter Transaktionsnummer oder einem
  unsicheren Beleg erfolgt **keine** Freigabe.
- Keine Automatik für Rückerstattungen oder Streitfälle:
  Freigabe in der vorhandenen Admin-Verwaltung bei Bedarf sperren.
  Bereits heruntergeladene PDFs sind nicht rückrufbar.

## Status
Der GitHub-Entwurf ist noch **nicht live**. Ohne einmalige Google-
Autorisierung, Schlüsselkonfiguration, Veröffentlichung und einen
echten End-to-End-Test wird **keine** automatische Freigabe ausgeführt.
Der bestehende manuelle Ablauf bleibt bis dahin unverändert.
