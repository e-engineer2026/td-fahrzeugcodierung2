# PDF-Referenzabgleich für TD Fahrzeugcodierung (16.11.2026)

## Quellen (vom Betreiber bereitgestellt)

1. **Codierliste Golf 8**, n3oka, 9.10.2025, 73 Seiten. Original enthält ausdrücklich „Not for commercial use“.
2. **MQB Codierungen**, Daniel Fuchs, Revision 2020-145, 74 Seiten.
3. **MLBevo Codierungen**, Daniel Fuchs, Revision 2021-2, 29 Seiten.

**Keine dieser PDFs ist Bestandteil des öffentlich zugänglichen Quellcodes oder des Shop-Downloads.** Es wurden weder deren Schritt-für-Schritt-Anleitungen noch lange Codierpassagen, Tabellen, Datenblöcke oder Bilder kopiert. `app/data/referenceIdeas.ts` erfasst 113 redaktionell neu formulierte *Funktionsthemen* samt Quelldokument, Seitenzahl und technischem Prüfhinweis.

## Neue Referenzthemen

| Quelle | Neue Themen | Zuordnung |
|---|---:|---|
| Golf 8 | 46 | nur Golf 8 (CD), je nach Baujahr/BCM/SFD |
| MQB 2020 | 36 | kuratierte MQB-Katalogmodelle, **kein** universeller VCDS-Nachweis |
| MLB evo 2021 | 31 | ausgewählte MLB-evo-Modelle, mit Software-/Hardware-Vorprüfung |
| **Gesamt** | **113** | 73 Codierungen, 11 Assistenzsysteme, 24 Nachrüstungen, 5 Umbauten |

## Integration

Die Referenzeinträge erscheinen in den vier bestehenden Kategorien unterhalb der bisherigen Codier- und Recherchethemen. Sie sind **kein freigegebenes TD-Codierangebot**, zeigen **keine PDF-Einzelpreise** und haben **keinen eigenen Kauf- oder Downloadlink**. Die vorhandenen Preise und Recherchelinks bleiben unverändert.

Quelle/Seitenzahl und Status werden im Modellfilter angezeigt:
- „In der Quelle als getestet“ bedeutet **nicht**, dass TD das bei jedem Baujahr/Steuergerät geprüft hat.
- „Historische Plattformreferenz“ bezeichnet die älteren MQB/MLBevo-Listen, deren Datenstände nicht automatisch für aktuellere Steuergeräte gelten.
- „Quelle enthält teilweise ungetestete Nachrüstungen“ gilt für Golf-8-Nachrüstungskapitel mit ausdrücklich variierendem Teststatus.

## Technische Grenzen

- **Golf 8**: Quelldaten aus 2025. Vor Freigabe Modelljahr und SFD1/SFD2, Steuergerätenummer, Softwarestand und Hardware prüfen.
- **MQB**: Auswahl bewusst auf die klassischen MQB-Fahrzeuge im Website-Katalog beschränkt; generische MQB-Listen sind keine Fahrgestellnummern-Freigabe. VW-eigene Discover-Media-Themen sind nur bei VW sichtbar.
- **MLB evo**: A4/A5/A6/Q5 usw. nutzen je nach Modelljahr unterschiedliche MMI-/Steuergerätegenerationen; ältere VCDS-Werte dürfen nicht ungeprüft übertragen werden.
- **Assistenzsysteme/Nachrüstungen**: Kompatible Sensoren, rechtmäßige FEC/SWaP-/Online-Freigaben, Parametrierung und ADAS-Kalibrierung können Voraussetzung sein. Airbagarbeiten, 230-V-Arbeiten und Umbauten an sicherheitsrelevanten Funktionen sind durch Fachpersonal auszuführen.
- Sicherheitskritische Deaktivierungen (z. B. Gurtwarnung, Video-Freischaltung während der Fahrt, Abschaltung von Stabilitäts-/Assistenzschutzfunktionen) wurden **nicht** als neue PDF-Referenzangebote in die kuratierte Auswahl aufgenommen.

## Weiteres Vorgehen für verkaufbare eigene PDFs

Erst anhand eines **tatsächlichen Fahrzeugs**, einer gesicherten Fahrzeugkonfiguration und eines erfolgreichen Auto-Scans eine neue, eigenständig erstellte und getestete Anleitung verfassen. Vor Verkauf Nutzungsrechte, notwendige Lizenzen, Unterschiede zwischen Vor-Facelift/Facelift und Sicherheitsfolgen prüfen. Die Nutzer-PDFs nicht als Drittanbieter-Downloads anbieten.

### Code

- Neue Datenquelle: `app/data/referenceIdeas.ts`.
- UI-Anzeige: `app/components/GuideSelector.tsx`.
- Seiteneinführung: `app/codieranleitungen/page.tsx`.
