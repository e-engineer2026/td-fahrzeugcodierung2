# Vereinfachte Anmeldung: Google, E-Mail-Code und Google One Tap

Stand: 21. November 2026. Diese Anleitung betrifft die **produktive** Clerk-Anwendung, die `td-fahrzeugcodierung.de` verwendet. Keine API-Keys, Client-Secrets oder Passwörter in GitHub einchecken.

## Bereits im Website-Code vorbereitet

- `/sign-in` und `/sign-up` verwenden die bestehenden Clerk-Komponenten, jetzt einheitlich gestaltet.
- Ohne übergebenes `redirect_url` geht es nach der Anmeldung/Registrierung zu `/konto`; ein vorhandenes legitimes Ziel bleibt beim normalen Clerk-Login erhalten.
- Der Account-Button führt ausgeloggte Besucher direkt zur Anmeldung, eingeloggte zu ihrem Konto.
- Google One Tap kann optional **nur auf Login-/Registrierungsseiten** per `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=true` eingeschaltet werden. Standardmäßig bleibt es aus, damit eine noch nicht eingerichtete Google-Verbindung und Datenschutzfragen keine Anmeldefehler verursachen.
- Zahlungen, gekaufte PDFs, Kundendaten und die Zuordnung per Clerk-Benutzer-ID bleiben unverändert.

## Unbedingt im produktiven Clerk-Dashboard einrichten

1. Unter <https://dashboard.clerk.com> die produktive Instanz wählen, die mit dem `pk_live_`-Schlüssel der Website verbunden ist. Nicht die Development-Instanz verwenden.
2. Unter **SSO connections / Social connections** Google als Anmelde- und Registrierungsmethode aktivieren. Für Produktion die eigenen Google-OAuth-Zugangsdaten (`Use custom credentials`) verwenden.
3. In der [Google Cloud Console](https://console.cloud.google.com/) einen Web-OAuth-Client anlegen, OAuth-Zustimmungsbildschirm und erlaubte Domains korrekt konfigurieren. Die **genaue** Authorized Redirect URI aus der *produktiven* Clerk-Google-Konfiguration übernehmen. Keine URI erraten. Client-ID und Client-Secret ausschließlich in Clerk hinterlegen.
4. Unter **User & authentication / Email, phone, username** Anmeldung/Registrierung mit E-Mail-Adresse aktiv lassen und Einmalcode / E-Mail-Code als passwortlose Option aktivieren. Bestehende Passwortmethoden erst nach erfolgreichem Test mehrerer Bestandskonten deaktivieren.
5. In den Einstellungen für die Authentifizierung sicherstellen, dass vorhandene Konten mit Google nach einer verifizierten identischen E-Mail-Adresse korrekt zugeordnet werden. Keine pauschale Zusammenführung unterschiedlicher Benutzerkonten oder Verschiebung von PDF-Käufen vornehmen.
6. Im Test prüfen: Google-Button ist sichtbar; Google-Login geht zu `/konto`; E-Mail-Code funktioniert; Rücksprung aus `/sign-in?redirect_url=%2Fkonto` funktioniert; Bestandskonten und PDF-Downloads bleiben verfügbar; Logout und erneute Anmeldung funktionieren.
7. **Optional** für One Tap: zuerst Google mit eigenen OAuth-Credentials und Einwilligungs-/Datenschutzkonzept testen. Dann in Vercel in den gewünschten Umgebungen `NEXT_PUBLIC_GOOGLE_ONE_TAP_ENABLED=true` setzen und neu deployen. Wenn One Tap Probleme bereitet, Variable entfernen bzw. auf `false` setzen. Der gewöhnliche Google-Button funktioniert unabhängig davon.

## Sicherheits- und Datenschutz-Hinweise

- Die Kundenanmeldung bleibt bei Clerk. Login via Google ist eine weitere Anmeldemethode und ersetzt keine Berechtigungsprüfung in Shop-APIs.
- Das System ordnet PDF-Käufe nach Clerk-ID zu. Derselbe sichtbare E-Mail-Name allein garantiert **keine** gleiche Clerk-ID. Vor Freischaltung die Bestandskunden-Migration bzw. Account-Verknüpfung testen.
- Für Google One Tap empfiehlt sich eine gesonderte Prüfung des Datenschutz-/Einwilligungsablaufs vor Aktivierung. Es wird absichtlich nicht automatisch auf jeder öffentlichen Website-Seite geladen.
- Google Login benötigt kein Vercel-Google-Client-Secret. Das Secret gehört ausschließlich in die produktive Clerk-Konfiguration.
- Ein Login ohne Kundenkonto bleibt für die schon angebotenen Gastkauf-Flows unabhängig möglich, sofern sie bereits so implementiert wurden.

## Funktionsprüfung nach Deployment

1. `/sign-in` öffnen, Google-Login testen, danach `/konto` prüfen.
2. `/sign-up` mit neuem Testkonto und E-Mail-Code prüfen.
3. Vorhandenes Bestandskonto mit PayPal-PDF-Freigabe anmelden und Berechtigung prüfen.
4. Direkten Zugriff auf die PDF-Download-API ohne Anmeldung sowie mit unberechtigtem Konto testen; Download darf nicht preisgegeben werden.
5. Auf Android/iOS und Desktop kontrollieren, dass die Login-Karte korrekt in den Viewport passt.

Der Google-Button erscheint in Clerks `<SignIn />` und `<SignUp />` **erst nachdem Google in der zugehörigen produktiven Clerk-Instanz aktiviert wurde**.
