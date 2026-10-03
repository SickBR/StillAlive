# Qualitätssicherung – Endless Edition 2.1

Stand: 3. Oktober 2026. Dateien mit `v21` gehören zu diesem Stand; ältere Berichte bleiben als Vergleich erhalten.

## Technische Prüfungen

- TypeScript-Prüfung und Produktionsbuild erfolgreich.
- **135 automatisierte Kernprüfungen bestanden.** Alle 26 Waffen auf 1/3/5/8, Passives und Meisterschaften, Stufen-/Slotgrenzen, Schaden/DEF/Krit/Status/Heilbudgets, Projektil-/Orbitkontakte, Klassen, Gegnerkontakt, Bosse und Belohnungen, Pause/Bewegung/Dash/Tod/Beenden, Speicherfehler, identische Wiederaufnahme und idempotente Gutschriften.
- Neu geprüft: XP-Aufbewahrung bei mindestens 20 Sekunden Kartenabstand, Pause zählt nicht mit, gemischte Kartenkategorien, acht Waffenstufen mit gleichem Endwert, zwölf-zu-acht-Migration ohne Ressourcenverlust, Ersetzen alter inzwischen voller Upgrade-Angebote, Kaufgrenzen/Preistreppen/Bossfragmente, sichere Spawnpunkte an allen Rändern/Ecken und stetige Populationskurve.
- **Chromium-UI-Prüfung bestanden:** alle Menüs einschließlich Talismane/Preisübersicht, zentrale Klassenwahl, Einstellungen, Vorlagen bearbeiten/kopieren, echte Waffen-/Talisman-/Meisterschafts-/Grundwertkäufe, Schwierigkeitssperren, Tastaturbewegung, Dash, Pause, Speichern → Neuladen → Fortsetzen, Levelkarten, Bosswarnung/Belohnung, weiterlaufende Runde, Niederlage, Beenden und fünf Neustarts. Keine JavaScript-Fehler oder fehlenden Dateien.
- **Produktionsprüfung bestanden:** echtes Spielstart-Menü, etwa 15 Sekunden Tastaturbewegung, Pause; Entwicklungszugriff fehlt, keine externen Laufzeitanfragen, keine JavaScript-Fehler.
- Menü-Screenshots bei 1440 × 900, 1024 × 768 und 390 × 844. Desktopansichten visuell geprüft; bei schmaler Ansicht bleibt die Arena über den Fußbereich erreichbar. Das Spiel benötigt weiterhin Tastatur/Maus.

Quellen: `reports/core-tests-v21.txt`, `reports/browser-v21.json`, `reports/production-v21.json`, `reports/screenshots/v21-*.png`.

Späte Boss-, Währungs- und Lastzustände werden im Entwicklungsbrowser teilweise gezielt gesetzt. Das prüft Funktionen, belegt aber kein reguläres Erspielen dieser Zustände.

## Kampfsimulationen und Wirtschaft

27 Läufe mit frischen Profilen, 20 Hz, drei Klassen × drei Seeds × drei Strategien. Keine künstlichen Boni. Kartenzeiten, Level/Gold pro Minute, Kills, Bosskills und Überlebensdauer protokolliert. Vollständige Ergebnisse und kritische Auswertung in **BALANCING_2_1.md**. Magier-/Jäger-Bots sterben weiter früher als Krieger; kein Nachweis gleicher Klassenschwierigkeit oder perfekten Goldtempos.

## Drei Stunden pro Klasse: Stabilität

Drei Läufe mit je 10.800 Simulationssekunden, maximalen Builds und absichtlich künstlichem Leben/Unverwundbarkeit. Das ist ein technischer Belastungstest, kein legitimer Überlebensnachweis.

| Klasse | Sekunden | Max. Gegner | Max. Geschosse | Max. Beute | Checkpoints |
| --- | --- | --- | --- | --- | --- |
| warrior | 10800 | 300 | 0 | 246 | 18 |
| mage | 10800 | 83 | 45 | 380 | 18 |
| archer | 10800 | 82 | 138 | 380 | 18 |

Kein Simulationsabbruch, keine ungültigen Schadenswerte; alle 54 Checkpoints wiederherstellbar. Bosswerte und Belohnungen zusätzlich für alle fünf Schwierigkeiten ausgewertet. Bericht: `reports/endurance-v21.json`.

## Browserleistung

Chromium mit SwiftShader-Software-Rendering: Lastaufbau mit 300 Gegnern und acht ausgebauten Waffen. Median 49.9 ms, 95. Perzentil 50.1 ms, ungefähr 20 FPS. Kein Hardware-GPU-Benchmark und keine 60-FPS-Garantie. Beim Messzeitpunkt lebten 269 Gegner; Treffer verändern die Population während der Messung.

Darstellungsobjekte nach fünf Neustarts: 465, 465, 465, 465, 465; kein Wachstum in diesem Test. Kein mehrstündiger Browser-Heap-Test. Gegner-/Beute-/Darstellungslimits und wiederverwendete Objekte sind aktiv.

## Grenzen

Klassenverhältnis, erste Bosskämpfe, Wirtschaft über mehrere Runden, spätere Schwierigkeiten und unterhaltsame Langzeitrunden benötigen menschliches Playtesting. Fünf Umgebungsvarianten teilen dieselbe Arenageometrie. Keine Touchsteuerung, Cloud oder Mehrtab-Synchronisation. Bei abruptem Prozessende können bis zu 15 Spielsekunden seit dem letzten erfolgreichen Autosave fehlen.

Start: `npm install`, `npm run dev`. Produktion: `npm run build`, `npm run preview`. Browserprüfungen benötigen laufenden Server und lokal vorhandenes Chromium oder `CHROME_PATH`.
