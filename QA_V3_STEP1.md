# Qualitätssicherung – V3 Schritt 1

Stand: 3. Oktober 2026.

- V2-Ausgangsbasis: 135 Kernprüfungen und TypeScript-Prüfung bestanden.
- V3: **146 automatisierte Tests bestanden.** Enthalten sind alle 26 Waffen auf Stufen 1/3/5/8 sowie die erhaltenen Prüfungen für Passives, Schaden, Kollision, Steuerung, Käufe und Speicherung. Vier alte Erwartungen wurden gezielt an ausgesetzte Boss-/Freischaltregeln und getrennte V3-Speicherung angepasst.
- Neue Prüfungen: genau 180 aktive Sekunden, Pause, Etagenabschluss vor weiterem Schaden, Entfernung aller Gefahren, XP-Reste, drei Angebote und exakt eine Wahl, notwendige Auswahl vor Start, erhaltener Build/Leben/XP, zwei Etagen je Klasse, höhere Gegnerwerte, vier Etagen trotz alter Bosstermine, Wiederherstellung jenseits von Minute acht, offene und gewählte Truhenbelohnung ohne Wiederholung, fehlerhafte Snapshots, Niederlage/Neustart und bytegenau unveränderter V2-Speicher.
- TypeScript-Prüfung und Produktionsbuild erfolgreich.
- Chromium: zwei zehnsekündige Etagen mit echtem Timer und echten UI-Aktionen durchlaufen. Klassenwahl, Bewegung, Dash, Pause, Speichern/Hauptmenü/Neuladen/Fortsetzen, Levelkarten, offene Truhe, gewählte Belohnung, Etagen 2/3, Niederlage, Neustart und freiwilliges Ende geprüft. Keine JavaScript-Fehler oder fehlenden Dateien. XP wurden zur Levelkartenprüfung gesetzt, Niederlage am Ende gezielt ausgelöst; während der zwei Etagen keine künstliche Unverwundbarkeit oder zusätzliche Lebenspunkte. Separater Testbrowser, keine Änderungen am Spielstand des Nutzers.
- Produktionsbrowser: Start mit regulärem 03:00-Timer trotz Testparameter, etwa 15 Sekunden Bewegung und Pause. Entwicklungszugriff fehlt; ausschließlich lokale Ressourcen; keine JavaScript-Fehler.
- Truhen- und Bereitschaftsbildschirm visuell geprüft.

Berichte im nicht versionierten Ordner `reports/`: `core-v3-step1.txt`, `browser-v3-step1.json`, `production-v3-step1.json`; Screenshots `screenshots/v3-step1-*.png`.

## Reguläre Kampfsimulationen

Neun Läufe, drei Klassen und drei Seeds, frische Profile, einfache Kreisbewegung, echte 180-Sekunden-Etagen. Keine künstlichen Boni. Abbruch nach zwei Etagen oder Niederlage, jeweils erste Truhenkarte gewählt.

| Klasse | Seed | Zeit s | Geschaffte Etagen | Ergebnis |
| --- | --- | --- | --- | --- |
| Krieger | 12 | 306 | 1 | Niederlage |
| Krieger | 71 | 360 | 2 | Zweite Truhe gewählt |
| Krieger | 313 | 325 | 1 | Niederlage |
| Magier | 12 | 305 | 1 | Niederlage |
| Magier | 71 | 288 | 1 | Niederlage |
| Magier | 313 | 119 | 0 | Niederlage |
| Jäger | 12 | 158 | 0 | Niederlage |
| Jäger | 71 | 172 | 0 | Niederlage |
| Jäger | 313 | 129 | 0 | Niederlage |

Zwei reguläre Etagen sind ohne künstliche Boni möglich. Die Bots beweisen keine menschlichen Erfolgsquoten oder ausgewogene Klassen. Jäger und längere Folgen bleiben ein offener Playtest-Befund. Quelle: `reports/simulation-native-v3-step1.json`.

## Reproduktion

`npm test`, `npm run build`, `npm run simulate`. `npm run test:browser` braucht V3-Devserver auf 5183; `npm run test:production` Produktionsvorschau auf 4183. Browserprüfungen benötigen lokal vorhandenes Chromium oder `CHROME_PATH`.

Keine historischen V2-Stresstests als V3-Ergebnisse ausgegeben. Kein breiter GPU-/Browser-Benchmark oder mehrstündiger V3-Heap-Test in Schritt 1. Schritt 1 wird gezielt auf dem eigenen Entwicklungsbranch committed. Die inzwischen hinzugefügten AGENTS.md-Regeln verlangen zusätzlich die Sicherung dieses freigegebenen, getesteten Branchs auf GitHub; eine Veröffentlichung des Spiels oder Weiterentwicklung von Schritt 2 gehört nicht zum Umfang.
