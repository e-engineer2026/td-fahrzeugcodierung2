# Neue TD-PDF-Preise ausschließlich nach Codieraufwand

Stand: 17. November 2026. Relevant für die Seite `/codieranleitungen`.

## Abgrenzung

Die Einstufung beschreibt nur den voraussichtlichen Arbeitsumfang der **elektronischen Codier- und Freischaltanleitung**. **Nicht** preisbildend sind der Materialwert, mechanische Ausbau, Montage, Kabelverlegung, Umbau von Scheinwerfern/Sitzen/Lenkrädern oder andere Werkstattarbeiten. Die tatsächliche Machbarkeit ist für ein konkretes Fahrzeug weiterhin gesondert nach Auto-Scan, PR-Codes, Software, Lizenzen und SFD zu prüfen.

Ein gleicher Codierprozess wird grundsätzlich gleich eingestuft, unabhängig davon, ob er in der Liste als Codierung, Assistenzsystem, Nachrüstung oder Umbau bezeichnet ist.

## Preisstufen nach voraussichtlichen Codierschritten

| Codierstufe | Geplanter TD-PDF-Einzelpreis | Beispielhafte elektronische Komplexität |
|---|---:|---|
| 0 | 5,99 € | Einzelne einfache Codierung im Steuergerät, z. B. Zeigertest |
| 1 | 7,99 € | Einfache Leuchten-/Komfortanpassung |
| 2 | 9,99 € | Mehrere Anpassungen oder Aktivierung einer vorhandenen Komfort-/Assistenzoption |
| 3 | 11,99 € | Einbindung mehrerer Steuergeräte, etwa AHK, Rückfahrkamera oder RDK High |
| 4 | 13,99 € | Aufwendigere Lichtsteuerung, Funktionsaktivierung oder Herstellerfreigabe |
| 5 | 15,99 € | Umfangreiche neue Assistenzsystem-Inbetriebnahme über mehrere Steuergeräte |
| 6 | 17,99 € | Zusätzliche Online- oder Remote-Erstinbetriebnahme und lizenzierte Aktivierung |
| 7 | 19,99 € | Wegfahrsperre, Komponentenschutz, Firmware oder Datensatz-/Gateway-Parametrierung |
| **Ohne Codierung** | **0,00 €** | Laut Quelle keine Codierung nötig oder rein mechanische Modifikation |

Die Labels „Leicht“, „Mittel“ und „Schwer“ richten sich weiterhin nach der Codierstufe, **nicht** nach dem mechanischen Umbau. Für codierfreie Einträge wird kein Schwierigkeitsbalken angezeigt.

Die Zahlen sind vorläufige **Preisideen für künftig von TD selbst erstellte Codier-PDFs**, keine freigeschalteten Produkte und keine Preise für Fahrzeugeinbau. Bei unklaren Anforderungen wird zunächst eine niedrige **vorläufige** Stufe angenommen, nicht automatisch eine anspruchsvolle Komplettnachrüstung.

## Stichproben und vollständige Sichtung

Die Berechnungsfunktion wurde über alle **179 recherchierten Nachrüstungen/Umbauten** und **113 eigenständig formulierten PDF-Referenzthemen** ausgeführt (292 Themen insgesamt). Die Altpreise und die Preise für die vorhandenen Codierfunktionen werden zusätzlich zentral über dieselbe elektronische Codieraufwand-Logik neu berechnet.

Beispielhafte Prüffälle:
- USB-Ladehub im Audi A4 8W, hinteres LED-Fußraumlicht Golf 7, Türwarnleuchten A4 8W, Kamera-Reinigungsdüse Formentor sowie Golf-8-USB-Modul und Golf-8-Subwoofer-Modifikation: keine codierrelevanten Schritte, 0,00 €
- Einfache LED-Fußraumlicht-Codierung: 7,99 €, unabhängig von Leitungsverlegung
- ACC-Abstandseinstellung im MMI: 9,99 €, ohne den Preis einer Radar-Nachrüstung
- Schwenkbare AHK mit erforderlicher Steuergeräteintegration: 11,99 € für den Codieranteil
- Matrix-Scheinwerfer mit normaler Steuergeräte-Codierung: 13,99 €, ohne Preis für Scheinwerfer/Aufbau
- Vollständige ACC-Inbetriebnahme: typischerweise 15,99 €; mit nachgewiesener Remote-Parametrierung 17,99 €
- Gateway-Datensatz-Parametrierung und Wegfahrsperren-/Komponentenschutzarbeit: 19,99 €

Die Klassifikation erfolgt aus Titel und Quellenhinweis, **nicht** aus einem individuellen Steuergeräte-Scan. Bei unvollständiger Quelle ist sie nur ein Recherchestand. Die Einbindung der künftigen PDFs und die Zahlungsfreigabe sind hiervon unabhängig.

## Code

- `app/lib/codingEffort.ts`: Gemeinsame, kategorieneutrale elektronische Aufwandseinstufung.
- `app/lib/guidePricing.ts`: Bestehende Codierungen verwenden jetzt diese Funktion.
- `app/lib/researchGuidePricing.ts`: Nachrüstungen, Umbauten und Referenzthemen verwenden dieselbe Funktion.
- `app/components/GuidePriceIndicator.tsx`: Kennzeichnet codierfreie Fälle explizit mit 0,00 € und ohne Schwierigkeitsbalken.
- `app/components/GuideSelector.tsx`: Entfernt „18 Modelle · alphabetisch“ aus der Fahrzeugwahl.
- `scripts/coding-effort.test.mjs`: Regressionstests.
