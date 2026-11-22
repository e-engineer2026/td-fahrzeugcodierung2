# TD Fahrzeugcodierung – verbindlicher PDF-Designstandard

**Referenz:** `TD_Golf7_VZE_Entwurf_Nummerierung_korrigiert.pdf` (4 Seiten, Stand 22.11.2026). Die korrigierte Fassung ist die maßgebliche visuelle Vorlage für weitere technische PDF-Codieranleitungen. Die Quelldatei wurde im Chat als `TD_PDF_Referenzdesign.pdf` bereitgestellt.

## Aktuelles Markenlogo und QR-Code (Ergänzung 22.11.2026)

- **Offizielle Logo-Datei:** `public/td-logo-icon.png` im selben Repository. Für jede künftig erzeugte PDF **dieses Originalasset laden und unverändert einbetten**; keine generisch erzeugten TD-Quadrate und keine frei nachempfundenen Ersatzlogos.
- **Platzierung:** Kompaktes TD-Logo links oben in der wiederkehrenden Kopfzeile, direkt gefolgt von „FAHRZEUGCODIERUNG“. Seitenkennung bleibt rechts. Seitenüberschriften, Kapitel und Tabellenspalten dürfen nicht verrutschen.
- **QR-Code:** auf der Titelseite oben rechts in der dunkelblauen Titelkarte, mit weißer Ruhezone, ausreichend groß zum Scannen und mit Linkziel `https://td-fahrzeugcodierung.de/`. Optional zusätzlichen klickbaren URL-Text in der Fußzone der letzten Seite.
- **Drucktauglichkeit:** QR-Code in Schwarz/Dunkelblau auf Weiß mit ausreichend quiet zone und mind. Fehlerkorrekturstufe Q, bei PDF-Export in möglichst hoher Auflösung; mit echtem Scanner und aus dem gerenderten PDF testen.
- **Neue Standardversion:** `TD_PDF_Referenzdesign_Logo_QR.pdf` aus dem Chat ist eine visuelle Entwurfsfassung. Für die Website-PDF-Erzeugung ist das oben genannte Original-Logoasset verbindlich. Die Ausgabe darf erst nach visuellem Vergleich als finale Produktionsvorlage gelten.

## Geltung

Dieser Standard gilt für neu erstellte TD-PDF-Anleitungen (Codierung, Diagnose, Assistenzsysteme, Nachrüstung). Bei der Erstellung bestehender neuer Anleitungen denselben Aufbau und dieselbe Anordnung verwenden, bis eine neue Referenz ausdrücklich freigegeben wird. Dieses Dokument allein veröffentlicht keine PDF und ändert keine Downloadzuweisung.

## Gestaltung

- **Format:** DIN A4 hochkant, weiße Seiten, großzügiger Rand ca. 43 pt (15 mm).
- **Farbe:** Dunkelblau `#11213A` für Titelkarten und Hauptüberschriften, Blau `#1769D2` für Nummern und Akzente, Akzentflächen Hellblau `#EAF3FF`, Tabellenzeilen `#F4F8FD`, Linien `#D9E4F2`. **Keine gelben Bereiche.**
- **Schrift:** klare serifenlose Schrift (Referenz DejaVu Sans), Titel/Überschriften fett, Erklärungstext gut lesbar, keine unnötigen Textblöcke.
- **Kopf:** originales TD-Markenzeichen aus `public/td-logo-icon.png` und „FAHRZEUGCODIERUNG“ links; kurze fachliche Seitenkennung rechts; feine horizontale Linie.
- **Titelseite:** dunkelblaue Titelkarte mit Fahrzeug-/Plattformzeile, großem Funktionstitel, Fachbezeichnung und kurzer Einordnung.
- **Metadaten:** darunter 2 gleich breite hellblaue Karten: „Fahrzeug / Plattform“ und „Diagnoseinterface“ (je nach Thema ggf. abweichende fachliche Metadaten).
- **Kapitel:** zweistellige Nummern-Kapsel `01`, `02`, ... links vor dem Abschnittstitel; **fortlaufend ohne Sprünge**. Nach Umstellen von Abschnitten neu nummerieren.
- **Inhalte:** weiß/hellblau wechselnde Tabellenzeilen mit dunkelblauer Kopfzeile; Karten für Varianten; dezente hellblaue Hinweisleisten; Ablaufschritte als abgerundete Zeilenkarten; sachliche Checklisten und Protokolltabelle.
- **Fuß:** „TD FAHRZEUGCODIERUNG / [FAHRZEUG ODER THEMA]“, dünne Linie, Seitenzahl `01`, `02`, ... rechts.
- **Verboten:** gelb hinterlegte Blöcke; Feld oder Kopftext „Dokument / Revision“; alte Dokumentnummern-/Revisionsverweise im Layout; isolierte Quellen-/Revisionsrubriken aus der alten VZE-PDF.

## Reihenfolge der Inhalte (fachlich auf das Thema anpassen)

1. **Technische Voraussetzungen**: Fahrzeug, Steuergeräte, notwendige Hardware/Software, Freigaben, Interface.
2. **Varianten oder Ausstattungsfälle**: Kompatibilität und Ausnahmen, keine pauschalen Werte.
3. **Variantenprüfung vor der Codierung**: Entscheidungspfad und Voraussetzungen der jeweiligen Variante. Dieser Abschnitt stammt in der Referenz aus dem ehemals nachgelagerten Abschnitt 08 und **steht vor** den Steuergeräte-Codierungen.
4. **Steuergeräte und Codier-/Anpassungspositionen**: tabellarisch mit Bedingung je Schritt.
5. **Durchführung und Funktionskontrolle**: separat nummerierte Arbeitsschritte und technische Prüfung.
6. **Abnahmeprüfungen**: Checkboxen, Rückbaubedingungen und Diagnosenachweise.
7. **Werkstattprotokoll**: Eingabefelder zur Fahrzeug- und Änderungsdokumentation.

Die frühere Rubrik **„07 Technische Quellen und Grenzen“** wird nicht übernommen. Die Nummerierung nach dem Umstellen läuft in der Referenz **01 bis 07**, ohne dass die alte Ziffer `08` angezeigt wird. Fachliche Quellen können bei der Erstellung intern dokumentiert werden und sollen nicht unbesehen als pauschale fahrzeugspezifische Freigabe ausgegeben werden.

## Fachliche Regeln

- Der Standard bestimmt **nur Gestaltung und Reihenfolge**, nicht die fachliche Richtigkeit von Byte-/Bit-Werten.
- Für jede neue Anleitung technische Voraussetzungen, Hardware, Steuergerätevarianten, Softwarestände, Lizenzlage und Codierkanäle **separat prüfen**. Keine Golf-7-VZE-Werte blind auf andere Modelle oder Funktionen übertragen.
- Bei Bedarf können Seiten und Kapitel unter Beibehaltung des Layouts erweitert oder reduziert werden.
- Keine Veröffentlichung, Preisänderung oder Zuordnung eines Downloads allein durch Erstellen eines neuen Dokuments. Dafür sind die jeweiligen Website-Verwaltungsschritte erforderlich.

## Qualitätskontrolle vor Freigabe

PDF erstellen, alle Seiten rendern und visuell kontrollieren; korrekte Kapitelreihenfolge und fortlaufende Nummerierung prüfen; keine abgeschnittenen Texte/überlaufenden Tabellen; Kopf-/Fußbereich auf jeder Seite identisch; keine gelben Bereiche oder „Dokument / Revision“; erst dann in der internen PDF-Verwaltung zur Vorschau und Veröffentlichung anbieten.
