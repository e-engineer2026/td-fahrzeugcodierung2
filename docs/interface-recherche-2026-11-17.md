# Werkzeuge für VAG-Codier-PDFs – Recherche am 17.11.2026

**Geltung:** TD PDF-Codieranleitungen / ausgewählte fahrzeugbezogene Codierungen.  
**Aussage:** Werkzeugangabe bezieht sich auf den *genannten Arbeitsschritt*. Eine komplette Nachrüstung lässt sich ohne FIN, PR-Codes, Teilenummern, Softwarestand, vorhandene Lizenzen, Sensorik und Kalibrierungsbedarf nicht universell freigeben. Fremde Referenzthemen sind keine eigenen geprüften PDF-Anleitungen.

## 11 zuvor ungeklärte Standardfälle

| Funktion | Geeignetes Verfahren | Grenze |
| --- | --- | --- |
| Fahrprofilauswahl erstmals freischalten (VW MQB) | ODIS Service + SWaP; Codierung VCDS/VCP | Originalaktivierung benötigt gültige Lizenz/Funktionsberechtigung. Vorhandene Funktion nur codieren |
| Wireless CarPlay aktivieren | ODIS Service + FEC/SWaP oder autorisiertes OEM-Verfahren; VCDS/VCP nur Einstellungen | Passende 5F-Unit, WLAN-/Bluetooth-Hardware, FEC-Status |
| Anhängerkupplung codieren | VCDS / VCP (Codieranteil) | STG 69, Gateway, BCM, Bremsenelektronik je nach Fahrzeug; bei SFD/Online-Inbetriebnahme separat prüfen |
| Ambientebeleuchtung im Audi MMI aktivieren | VCDS / VCP nur bei vorhandener kompatibler Ausstattung | Neue QQ2-Mehrfarben-Systeme erfordern ggf. BCM-ZDC mit VCP |
| Audi Drive Select aktivieren | VCDS / VCP (unterstützte Codierung) | Fahrzeug- und Steuergerätehardware vorhanden; andere Lizenzmodelle separat |
| Ambientebeleuchtung freischalten | VCDS / VCP für vorhandenes Menü; Audi QQ2-Parametrierung mit VCP | LIN-LED, BCM, MMI und Datensatz müssen passen |
| Startlogo / Tacho-Darstellung anpassen | VCDS / VCP wenn das KI das Layout bereits unterstützt | Für zusätzliche Layouts teils VCP/ODIS oder neue KI-Software |
| S/RS-Sportlayout im Virtual Cockpit | VCDS / VCP bei unterstütztem Gen1-KI; sonst gesondertes VCP/OEM-Verfahren | Nicht jedes KI und jede SW unterstützt S/RS-Ansicht |
| Easy Entry Fahrersitz | VCDS / VCP (Codierung/Anpassung) | Elektrischer Memorysitz / passendes Sitz-STG zwingend |
| Luftfahrwerk Niveau-/Lift-Funktion | VCDS für unterstützte Diagnose/Grundeinstellung; ggf. ODIS | EOL-Parametrierung, genaue Fahrzeug- und Vermessungsdaten prüfen |
| Wireless CarPlay / Android Auto | ODIS Service + originale FEC/SWaP bzw. Audi FoD; VCDS/VCP nur für Menüs/Anpassungen | Erstfreischaltung keine reine VCDS-Codierung |

## Zusätzlich kategorisierte Nachrüstungen

| Technischer Fall | Codieranteil | Zusätzliche Arbeit |
| --- | --- | --- |
| Rückfahrkamera Low | VCDS / VCP, sofern Software unterstützt | Kamera-/Infotainment-Hardware |
| Rückfahrkamera High mit neuem Datensatz | VCP für Kameradatensatz, VCDS/VCP für Codierung | ggf. Kalibrierung |
| ACC, Travel Assist, Side Assist, Area View | VCDS/VCP für unterstützte Codierung | mögliche VCP-Parametrierung, ODIS/CP/Online-Freigabe, ADAS-Kalibrierung |
| Xenon/LED/Matrix-Umbau | VCDS/VCP-Codierung | Parametrierung/ODIS nach Bedarf, LWR und fachgerechte Kalibrierung |
| Multicolor-QQ2 bei Audi A4/A5 B9 | VCP-Datensatz + VCDS/VCP-Codierung | passender BCM-Hardware- und SW-Stand |
| Codierdongle im ausdrücklich benannten Kit | Kit-spezifischer Dongle | SFD-/Online-Freigaben und eventuell Kalibrierung |
| Komponentenschutz / moderne WFS | ODIS Service Online (FAZIT/GeKo) | nur mit Berechtigung; VCDS/VCP ersetzen das nicht |
| SFD1 | VCDS ab 26.9 mit registriertem HEX-V2/HEX-NET und aktivem SFD-Service | SFD1 muss das jeweilige STG wirklich schützen; SFD2 nicht darüber freischaltbar |
| Explizite ZDC-Parametrierung in TD-Anleitungen | VCP | Datensatzpassung prüfen; SVM-/Herstellerprozesse separat |

Die Regeln für die dokumentierten Fälle stehen in `app/lib/guideInterface.ts`. Reine Referenzideen werden als modellabhängige Kandidaten gekennzeichnet, nicht als verifiziert funktionsfähig. Als unbekannt bleiben individuelle Datensatzversionen, noch nicht belegte Sonderfunktionen, nicht unterstützte Hardware und Hersteller-Online-Prozesse ohne passende Berechtigung. Damit sind alle Tabelleneinträge mit einem Werkzeugweg oder einer bewusst sichtbaren Prüfung versehen; das ist **keine Aussage, dass jede Funktion technisch einzeln erprobt wurde**.

## Online-Quellen (mit Einschränkungen)

1. Ross-Tech: Anhängersteuergerät / Gateway-Codierung mit VCDS, [AHK-Retrofit 1K](https://wiki.ross-tech.com/wiki/index.php/Trailer_Hitch_Retrofitting_%281K%29) und [Q7 4M](https://wiki.ross-tech.com/wiki/index.php/Trailer_Hitch_Retrofitting_for_Audi_Q7_%284M%29).
2. Ross-Tech: [Leuchtweiten-/Luftfahrwerkskalibrierung](https://wiki.ross-tech.com/wiki/index.php/Level_Control%2C_UDS_%28LUFE-DAEMPFER%29), [Fehler B2013 / ODIS-Fall](https://wiki.ross-tech.com/wiki/index.php/B2013).
3. Ross-Tech: [SFD-Online mit VCDS](https://www.ross-tech.com/vcds/tour/sfd-online.php), [SFD-Wiki](https://wiki.ross-tech.com/wiki/index.php/SFD).
4. Volkswagen Original Zubehör: [Aktivierungsdokumente SWaP](https://www.volkswagen-genuine-accessories.com/de/de/c/kommunikation/aktivierungsdokumente-swap/160988445/) und [AppConnect-Freischaltung über ODIS](https://www.volkswagen.de/de/besitzer-und-service/volkswagen-online-shop.html/__app/offers/2K7-054-830-A/aktivierungsdokument-app-connect-optionsinfotainment/dealer/62979/Autohaus%20Lindacher%20GmbH%20%26%20Co.%20KG.app?myDealerId=62979).
5. Audi: [Functions on Demand](https://www.audi.de/de/service-zubehoer/audi-digital-services/functions-on-demand/), insbesondere Smartphone-Interface und Fahrerassistenz.
6. AudiWorld (Anwenderbericht, **kein offizieller Herstellernachweis**): [QQ2-Parametrierung zusätzlich zur MMI-Codierung](https://www.audiworld.com/forums/a4-b9-platform-discussion-212/retrofitted-ambient-lightning-just-like-extended-led-interior-lighting-pack-2905608/page11/).
7. Golf7GTI-Forum (Anwenderbericht): [RFK High: ODX/ZDC- und 6C-Parametrierung](https://golf7gti.com/topic.php?page=2&t=8985).
8. BRISKODA (Anwenderbericht): [Easy Entry mit Memorysitz](https://www.briskoda.net/forums/topic/505506-easy-entryconvenient-entry-function-coding/).
9. VAG Coding / Audi-Community: [Audi B9 High Beam Assist mit VCDS](https://www.vag-coding.net/audi/a4-b9/a4-b9-high-beam-assist-activation/) und [unterstützte VC-Layout-Codierung](https://www.vag-coding.net/audi/a4-b9/a4-b9-meter-display-on-virtual-cockpit/). Kompatibilität hängt von KI-Generation/Softwarestand ab.
10. KUFATEC: [ACC-Optionen und fahrzeugspezifische Inbetriebnahme](https://kufatec.com/en/kufatec-acc-option-predictive-control-for-mqb/44365-m), [Kalibrierungs-/Werkstattservice](https://kufatec.com/en/support-service/installation-service/).

**Redaktionelle Grenze:** Kein Beleg allein aus einem Funktionstitel beweist die komplette Durchführung. Konkrete PDF-Verkaufsanleitungen erst nach einem validierten Ablauf mit nachprüfbarer Fahrzeug- und Steuergerätevariante veröffentlichen.
