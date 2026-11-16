# Preiseinstufung aller Codierungen, Nachrüstungen und Umbauten

Stand: 16. November 2026. Gilt nur für die Seite `/codieranleitungen`.

## Was der angezeigte Preis bedeutet

Jeder sichtbare Eintrag erhält eine **vorläufige Preisidee für eine zukünftige, von TD selbst erstellte PDF-Anleitung**, keinen Preis für Einbau oder Codierdienstleistung und keinen Kaufpreis für fremde Unterlagen. Bestehende `Coding`-Angebote verwenden weiter `guideDifficultyStep` und `guidePrice`. Die 179 recherchierten Einträge sowie 113 Themen aus den drei bereitgestellten PDFs werden über `researchGuideEstimate` und `referenceIdeaEstimate` auf derselben Staffel bewertet.

**Es werden keine neuen PDF-Dateien oder PayPal-Downloads angeboten.** Die Nutzeroberfläche zeigt Quelle, Einschränkungen und die bisherige Unterscheidung von bestätigten Codierangeboten und ungeprüften Referenzthemen weiter an.

## Preisstufen (voraussichtlicher Dokumentationsaufwand)

| Stufe | Schwierigkeitsgrad | Geplanter Einzelpreis für eigene TD-PDF |
|---:|---|---:|
| 0 | Leicht | 5,99 € |
| 1 | Leicht | 7,99 € |
| 2 | Leicht | 9,99 € |
| 3 | Mittel | 11,99 € |
| 4 | Mittel | 13,99 € |
| 5 | Schwer | 15,99 € |
| 6 | Schwer | 17,99 € |
| 7 | Schwer | 19,99 € |

Einstufung: einfache Anzeigen/Kleinanpassungen meist leicht; komplexere Menü-/Lichtanpassungen mittel; größere Nachrüstungen, Fahrassistenz, Kamerakalibrierung und Umrüstungen schwer. Mehrere Module, Parametrierung, SFD, besondere Fachkenntnis oder fehlende Fahrzeugdaten können den tatsächlichen Aufwand erhöhen. Ein externer Anbieter kann nur Produktinformationen liefern, keine Anleitung; dieser Eintrag bleibt deshalb weiterhin ein Recherchethema.

## Regeln und Prüfschritte

1. Neuer Titel in `app/data/guideResearch.ts` (Nachrüstung/Umbau) oder `app/data/referenceIdeas.ts` (Funktionen aus PDF-Referenzen) erhält automatisch einen geschätzten Preis und Level durch `app/lib/researchGuidePricing.ts`.
2. Bestehende Codierungen bleiben über `app/lib/guidePricing.ts` angebunden.
3. Modelle werden wie bisher gefiltert; Preis und Level gelten zunächst pro *Thema*, nicht pro fahrzeugspezifische Teile-/Softwareversion.
4. Vor Veröffentlichung einer verkaufbaren Anleitung muss TD die individuelle Funktion, Originalität des Texts, Nutzungsrechte, HW/SW/SFD-Voraussetzungen und gesetzliche Voraussetzungen prüfen. Erst dann kann ein finaler Produktpreis festgelegt werden.
5. Anleitungsseite erlaubt jetzt, alle vier Kategorien nach **Leicht, Mittel, Schwer** zu filtern. Der PDF-Preis ist unabhängig von den Live-Servicepreisen im Fahrzeugkonfigurator.

**Besonders wichtig:** Die Golf-8-Quelle trägt „Not for commercial use“. Ihre Texte, Bilder, Codierwerte und das Original-PDF dürfen nicht einfach in ein eigenes Verkaufsprodukt übernommen werden.
