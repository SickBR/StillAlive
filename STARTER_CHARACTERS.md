# Drei spielbare Starter – Integration vom 3. Oktober 2026

## Übernommene Assets

Die drei gelieferten PNGs wurden unverändert und bytegetreu in die bestehende V3-Arbeitskopie übernommen. Keine Bildgenerierung, keine nachgemalten oder duplizierten Ersatzframes. Die JSON-Beschreibungen aus dem Hauptprojekt wurden zur Nachvollziehbarkeit ebenfalls kopiert.

| Charakter | Datei | Interne ID bleibt | Startwaffe der Standardvorlage | HP / ATK / DEF |
| --- | --- | --- | --- | --- |
| Reaper | `public/assets/reaper-player-v1.png` | `warrior` | Vorhandene Seelensense | 125 / ×1,00 / 14 |
| Schattenjäger | `public/assets/shadow-hunter-v1.png` | `archer` | Vorhandener Jagdbogen | 110 / ×1,00 / 7 |
| Arkanist | `public/assets/arcanist-v1.png` | `mage` | Vorhandener Feuerstab | 98 / ×1,08 / 4 |

Alle Werte und Fähigkeiten stammen aus den bisherigen Klassen. Permanente Verbesserungen und ausgerüstete Meisterschaften werden weiterhin berücksichtigt. Keine neue passive Fähigkeit und keine Balanceänderung an Waffen oder Gegnern.

Alle Sheets sind tatsächlich **1088 × 64 Pixel**, eine Reihe mit **17 unterschiedlichen Frames à 64 × 64 Pixel**, ohne Abstand oder Rand. Echte Transparenz: Alpha 0–255. Kein belegter Pixel liegt außerhalb seiner Zelle. Alle Frames enden an Pixelzeile 54; die Fußposition liegt um x=32. Die stehenden Figuren sind jeweils 42 Pixel hoch. Der breitere Mantel des Schattenjägers erhält keine zusätzliche Vergrößerung.

Die beiden Zwischenablagebilder sind pixelidentisch mit `arcanist-v1.png` beziehungsweise `shadow-hunter-v1.png` im Hauptprojekt. Die Originaldateien im Hauptprojekt wurden nicht verändert. Analysebericht und vergrößerte Sichtprüfung liegen lokal in `reports/starter-assets.json` und `reports/starter-contact.png`.

## Tatsächlich verwendete Animationen

| Zustand | Frames | Geschwindigkeit | Verhalten |
| --- | --- | --- | --- |
| Idle | 0–1 | 3 FPS | Wiederholung; im Menü dieselben beiden echten Frames |
| Laufen | 2–5 | 10 FPS | Wiederholung, horizontal gespiegelt bei Bewegung nach links |
| Treffer | 6 | 8 FPS / 125 ms | Einmalige kurze Trefferpose, danach Bewegung oder Idle |
| Tod | 7–10 | 7 FPS | Einmal vollständig; Frame 10 bleibt stehen |
| Angriff / Cast | 11–16 | 12 FPS | Sense, Bogenschuss beziehungsweise Magie passend zum gelieferten Sheet |

Die Bildfolgen wurden anhand einer beschrifteten Kontaktübersicht visuell geprüft. Phaser registriert alle 15 Klassen-/Zustandsanimationen einmalig. Gemeinsamer Ursprung: (0,5; 54/64), einheitliche Skalierung 1,5 im Gameplay, bestehendes Pixel-Art-Rendering ohne Anti-Aliasing. Keine Texturerstellung im Frame-Loop.

Ein visuelles Angriffsereignis aus der vorhandenen Kampflogik startet die Animation. Schnell aufeinanderfolgende Angriffe setzen eine laufende Bewegung nicht ständig zurück. Treffer haben kurz Vorrang, Tod hat dauerhaft Vorrang. Pausen und Upgradefenster frieren die Animation ein. Das Ergebnisfenster erscheint erst nach der vollständigen Todessequenz. Die vorhandene Schadens- und Projektilberechnung erfolgt weiterhin unmittelbar beim automatischen Angriff; sie wurde nicht auf einen späteren Animationsframe verschoben.

## Speicherkompatibilität und begrenzte Migration

Die IDs `warrior`, `archer` und `mage` sowie der Speicherschlüssel und das Snapshotformat bleiben bestehen. Dadurch sind alte aktive Runden weiterhin ladbar und behalten Startwaffe, Waffenstufen, Gesundheit, Ressourcen und ihren Kampfzustand.

Nur alte Standardnamen werden auf Reaper/Arkanist/Schattenjäger umgestellt. Die bisherige Standardvorlage „Schattenkrieger“ mit Langschwert erhält die existierende Seelensense als Starter. Das Langschwert bleibt in Besitz und Kartenpool erhalten. Die Sense ist als Klassen-Startwaffe erlaubt; es gibt keine zusätzliche globale Waffenfreischaltung, keine Goldabbuchung und keine Änderung am registrierten Upgrade-Pool oder Kodex.

**Bewusst erhalten:** Individuell benannte alte Builds behalten ihre bisherige Startwaffe. Auch eine bereits gespeicherte Langschwert-Runde wird nicht nachträglich in einen Sensen-Build umgewandelt. Die Charaktergrafik verwendet trotzdem den neuen Reaper. Dies vermeidet das Überschreiben bestehender Ausrüstungsentscheidungen.

Der Katalog enthält jetzt drei spielbare Starter und die bisherigen zehn Zukunftsplätze (3/13). Der doppelte, bisher nur geplante Reaper-Eintrag entfällt. Seine alten Vorschaugrafiken und sämtliche früheren Klassensprites bleiben als Dateien erhalten.

## Geänderte Dateien dieser Integration

- `src/core/config.ts`: Namen und Texturverweise; Zahlenwerte unverändert.
- `src/core/meta.ts`: Sensen-Standardstarter, Startwaffen-Zulassung und kompatible Standardvorlagennamen.
- `src/core/engine.ts`: visuelles Ereignis beim tatsächlichen automatischen Angriff.
- `src/player-animation.ts`: gemeinsame Framebeschreibung und visuelle Zustandssteuerung.
- `src/render/GameScene.ts`: Sprite-Loading, Phaser-Animationen, Orientierung und Fußanker.
- `src/main.ts`: Ergebnisfenster nach Todesequenz; visuelles Ereignis beeinflusst die Sound-Drosselung nicht.
- `src/characters.ts`, `src/ui.ts`, `src/style.css`: drei Starter in der vorhandenen Auswahl, 17-Frame-Sheets und Menü-Idle.
- `tests/characters.test.ts`, `tests/player-animation.test.ts`: Starter, Zustände und Speicherkompatibilität.
- `scripts/browser-starters.mjs`, `scripts/browser-characters.mjs`, `scripts/browser-menu.mjs`, `scripts/production-smoke.mjs`: aktuelle Browserprüfungen.
- Drei neue PNGs und ihre JSON-Beschreibungen; `ASSETS.md`, `README.md`, diese Dokumentation.

Zusätzliche gewünschte Menüanpassung während der Arbeit: Vermächtnis öffnet direkt die sieben bestehenden permanenten Verbesserungen. Der wiederholte Hinweisdialog entfällt. Kein Skillbaum wurde hinzugefügt.

## Prüfung und eigene Kontrolle

162 automatisierte Tests bestanden, einschließlich Animation-Prioritäten, Wiederaufnahme, idempotenter Migration, erhaltenen alten Rundenspeichern und tatsächlichem Sensen-Schaden. Browserprüfung für jede der drei Klassen: Menü-Idle, Wechsel, Runstart, Laufen/Richtungswechsel, alle sechs Angriffsframes, Schaden, Trefferframe, alle vier Todesframes, Pause, Speichern/Laden und Neustart. Zusätzlich Charakterauswahl auf sechs Bildschirmgrößen, 30 Öffnen-/Schließen-Zyklen und Hauptmenü auf sieben Bildschirmgrößen. Browserberichte liegen in `reports/` und verwenden isolierte Testprofile.

TypeScript-Prüfung und `npm run build` bestanden. npm war nicht im PATH dieser Werkzeugsitzung; das unveränderte Build-Skript wurde mit der vorhandenen lokalen `npm-cli.js` ausgeführt. Produktionsprüfung bestanden: Spielstart, Tastatursteuerung, Pause, mobile Charakterauswahl, keine externen Laufzeitanfragen und keine Browserfehler. Der bestehende Browser-Etagentest durchlief zwei echte verkürzte Testetagen mit Truhenauswahl, Speichern/Laden, Niederlage, Neustart und freiwilligem Beenden; der alte V2-Speicher blieb bytegetreu erhalten.

Start: `Spiel starten.bat` in dieser Arbeitskopie, oder `npm install` und `npm run dev`. Adresse: http://127.0.0.1:5183/. Bereits geöffnete Seite neu laden. Im Hauptmenü jede Klasse auswählen und eine neue Runde beginnen; für eine bereits gespeicherte Runde zunächst fortsetzen oder regulär beenden.

Es wurden keine Commits oder Pushes ausgeführt. Neue Skillbaum-, Economy-, Kodex-, Weltfreischalt- oder zusätzliche Klassenfunktionen sind nicht Teil dieser Integration.
