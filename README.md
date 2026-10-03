# ECLIPSE SURVIVOR – Endless Edition 2.1

Ein eigenständiges Dark-Fantasy-Hordenspiel mit drei Klassen, automatischen Angriffen und dauerhaftem Vermächtnis. TypeScript, Phaser 3 und Vite; keine externen Laufzeitdienste.

## Start

Node.js ab 22.12 mit npm, Desktop-Browser, Tastatur und Maus:

```sh
npm install
npm run dev
```

Die angezeigte lokale Adresse öffnen, normalerweise http://127.0.0.1:5173/.

```sh
npm run build
npm run preview
```

Der Build liegt in `dist/`, die Vorschau normalerweise unter http://127.0.0.1:4173/. Einmalige Paketinstallation braucht Internet; das Spiel lädt anschließend nur lokale Dateien. Nicht über `file://` öffnen.

## Spielen

WASD/Pfeile bewegen, Leertaste weicht aus, Escape/P pausiert. Angriffe erfolgen automatisch. Kristalle einsammeln, drei Levelkarten mit Maus oder 1–3 wählen. Alle vier Minuten erscheint ein Boss; die Runde läuft danach weiter. Beim Tod oder freiwilligen Beenden bleiben verdiente Ressourcen erhalten. „Speichern & Hauptmenü“ hält die ganze Runde zum Fortsetzen fest.

- Drei Klassen mit Wut, Überladung oder Zielmarkierungen; je sieben eigene Waffen.
- Fünf universelle Waffen, 13 Passives, acht Angriffsslots und acht passive Slots.
- Langsamere XP-Kurve, mindestens 20 Sekunden zwischen Kartenwahlen; XP bleiben erhalten.
- Neue Pixel-Art-Zuflucht: Charakter mittig, Start darunter, Einstellungen oben rechts.
- Transparente Preisübersicht und eigener Menüpunkt für passive Talismane.
- Acht Waffenstufen mit mechanischen Meilensteinen, acht passive Stufen, automatische späte Run-Meisterschaft.
- Sieben normale Gegnertypen, drei wiederkehrende Bosse, Anstürme, Beschwörer und Formationen. Keine feindlichen Geschosse.
- Goldshop, begrenzte permanente Werte, neun Klassen-Meisterschaften und bis zu zwölf Build-Vorlagen.
- Fünf Schwierigkeiten mit eigenen Umgebungsvarianten; Freischaltung nach jeweils 30 Minuten.
- Sicherer Startabstand, sanft steigende Gegnerdichte, regelmäßige Finsternisphasen, begrenzte Heilung, DEF mit abnehmendem Nutzen.
- Vollständige Rundenspeicherung, Autosave, Migration der alten Einstellungen/Statistik und Schutz vor doppelter Gutschrift beim Laden.
- 70 eigene Pixel-Art-Dateien, animierte Figuren, Effekte und eigene synthetische Klänge.

## Dokumentation

- **ECLIPSE_SURVIVOR_V2_SPIELBESCHREIBUNG.md**: vollständige Beschreibung mit allen Klassen-, Waffen-, Gegner-, Preis- und Progressionswerten; zur Übergabe an einen Designchat.
- **QA.md**: ausgeführte Tests, Messergebnisse und Grenzen.
- **BALANCING_2_1.md**: neue Kosten, Progression und Vergleichsergebnisse.
- **DESIGN_REFERENCES.md**: visuelle Menüreferenzen und eigene Umsetzung.
- **ASSETS.md**: Herkunft/Lizenzen.
- **archive/eclipse-v1.zip**: gesicherter Stand vor diesem Umbau.
- **ECLIPSE_SURVIVOR_SPIELBESCHREIBUNG.md**: historische Übergabe mit altem Stand und Umbaukonzept.

## Entwicklung und Prüfungen

```sh
npm test
npm run simulate
npm run test:endurance
npm run docs
```

`npm run test:browser` benötigt einen laufenden Devserver; `npm run test:production` eine laufende Produktionsvorschau. Browserprüfung: lokal vorhandenes Chromium oder `CHROME_PATH`; bei Standard-Playwright-Installation kann `npx playwright install chromium` verwendet werden. Die Tests schreiben Screenshots und Berichte in `reports/`.

`src/core/config.ts` enthält Balancewerte und Inhaltskataloge, `economy.ts` Belohnungen, `meta.ts` Profile/Käufe/Vorlagen, `upgrades.ts` Karten, `engine.ts` die reine Kampfsimulation, `storage.ts` validierte Speicherung. Phaser-Darstellung in `src/render`, DOM-Menüs in `src/ui.ts`, Verbindung in `src/main.ts`. Grafiken reproduzieren: `python scripts/generate_assets.py` und `python scripts/generate_menu.py` (Python mit Pillow erforderlich; nicht zum Spielen nötig).

## Ehrliche Grenzen

Kein perfektes Balancing behauptet. Botläufe sind begrenzte Vergleichsszenarien. Dreistündige Stresstests verwenden ausdrücklich künstliche Unverwundbarkeit; sie beweisen keine legitime Überlebensdauer. Klassenverhältnis, spätere Schwierigkeiten, Goldtempo und unterhaltsame Langzeit-Builds brauchen menschliches Playtesting.

Die fünf Umgebungen teilen dieselbe begehbare Arenageometrie. Desktop-Steuerung, keine Touchbedienung/Cloud/Mehrspieler. Unter Software-Rendering sind 300 Gegner deutlich langsamer als 60 FPS. Ein abruptes Ende kann Fortschritt seit dem letzten erfolgreichen Autosave verlieren; alle 15 Spielsekunden sowie bei wichtigen Übergängen wird gespeichert. Mehrere Tabs synchronisieren ihre Profile nicht untereinander.
