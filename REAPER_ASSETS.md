# Reaper: getrennte Kampf- und Menügrafik

## Zuordnung der gelieferten Dateien

Die Zuordnung erfolgt nach dem tatsächlichen Bildinhalt, da die Anhänge Clipboard-Namen tragen:

- `codex-clipboard-3ec4e38f-4fb3-447f-92e6-2d8773ae4776.png` → `public/assets/reaper_gameplay.png`: vollständige Animationsreihen.
- `codex-clipboard-6cf40853-f20e-49d1-9190-cff0b42295ef.png` → `public/assets/reaper_menu_hero.png`: acht große Präsentationsposen.

Beide PNGs wurden bytegetreu übernommen. Format: 1448 × 1086, RGBA mit Transparenz. Alte Assets bleiben erhalten. Herkunft: vom Benutzer am 3. Oktober 2026 für dieses Projekt bereitgestellt; keine zusätzliche Lizenz angegeben. Keine CC0-Freigabe für diese gelieferten Bilder behauptet.

## Kampf

`reaper_gameplay.json` beschreibt die ungleichmäßig angeordneten Bildbereiche als Phaser-Atlas. Ein einheitlicher virtueller Rahmen von 400 × 280 Pixeln und ein Fußanker bei (200, 260) verhindern Größenwechsel zwischen den Posen. Darstellung mit Nearest-Neighbor, ohne Antialiasing.

| Zustand | Atlasframes | Anzahl | Bilder pro Sekunde |
| --- | --- | --- | --- |
| Idle | 0–4 | 5 | 5 |
| Walk | 5–12 | 8 | 12 |
| Attack | 13–19 | 7 | 14 |
| Hit | 20–23 | 4 | 16 |
| Death | 24–29 | 6 | 8 |

Idle und Walk wiederholen sich. Attack und Hit laufen einmal und kehren zu Bewegung/Idle zurück. Death hält das letzte Bild; das Ergebnisfenster erscheint nach Abschluss. Pause friert die laufende Animation ein. Spiegelung folgt der Bewegungs- beziehungsweise Angriffsrichtung. Schaden, Reichweiten, Kollisionsradius, Klassenwerte und gespeicherte Builds wurden nicht verändert.

Die Angriffsposen liegen im gelieferten Sheet sehr dicht zusammen. Die Atlasgrenzen schließen Nachbarposen möglichst aus; äußere Magiepartikel können an diesen Grenzen abgeschnitten sein. Ein separat gepacktes Sheet mit Abstand zwischen den Posen würde diese Quelleinschränkung beseitigen. Die Atlas-Zuordnung verändert keine Pixel der Originaldatei.

## Menü und Charakterauswahl

Hauptmenü, Charakterkarte und Charaktervorschau verwenden ausschließlich `reaper_menu_hero.png`. Die ersten beiden Präsentationsposen bilden einen ruhigen Stand-/Blinzelwechsel; die Karte ist statisch. Die übrigen sechs Posen bleiben im Originalsheet für spätere Showcase-Erweiterungen erhalten. Reduzierte Bewegung deaktiviert die Menüanimation. Größen passen sich den vorhandenen Desktop- und Mobilansichten an.

Die Auswahl der UI-Textur ist zentral in `src/player-animation.ts` von der Kampftextur getrennt. Arkanist und Schattenjäger behalten ihre bisherigen Assets.

## Prüfung

- 164 automatisierte Tests, einschließlich Atlasgrenzen, aller Animationsdefinitionen, getrennter Texturen und Speicherkompatibilität.
- TypeScript und Produktionsbuild.
- Browser: alle 30 Reaper-Frames in ihren tatsächlichen Zuständen, echte automatische Angriffe und Schaden, Richtungswechsel, Pause, Tod, Speichern/Laden und Neustart; Regression für beide anderen Starter.
- Hauptmenü auf sieben Bildschirmgrößen; Charakterauswahl auf sechs Größen und 30 Öffnen-/Schließen-Zyklen ohne anwachsende Dialogelemente.
- Produktionsstart, Steuerung, Pause und mobile Charakterauswahl ohne externe Laufzeitanfragen.

Die Browserprüfungen verwenden isolierte Testprofile. Keine Benutzer-Spielstände wurden bearbeitet. Ein paralleler Charakter-Browserlauf hatte ein Zeitlimit; der anschließende einzelne Wiederholungslauf bestand vollständig.

Spiel öffnen: http://127.0.0.1:5183/ und die Seite neu laden. Keine Commits oder Pushes ausgeführt.
