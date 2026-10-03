# Herkunft und Lizenzen

Es werden keine fremden Sprite-Pakete, keine heruntergeladenen Spielgrafiken, keine externen Webfonts und keine fremden Tonaufnahmen verwendet.

## Eigene Grafiken

Die 70 PNG-Dateien in `public/assets/` wurden für dieses Projekt mit `scripts/generate_assets.py` (66 Dateien) und `scripts/generate_menu.py` (vier Dateien) aus Pixeln, Linien, Polygonen und deterministischen Zufallswerten erzeugt. Es gibt keine eingebetteten Drittanbieter-Bilder.

| Dateien | Verwendung | Herkunft | Lizenz |
| --- | --- | --- | --- |
| `knight.png`, `mage.png`, `archer.png` | 11 Frames: Idle 0–1, Laufen 2–5, Treffer 6, Tod 7–10 | Eigene programmatische Pixel-Art | CC0-1.0 |
| `hollow.png`, `crawler.png`, `brute.png`, `seer.png`, `reaper.png`, `armored.png`, `charger.png`, `boss.png`, `matriarch.png`, `executioner.png` | Animierte Gegner, je 11 Frames, 64 × 64 Pixel pro Frame | Eigene programmatische Pixel-Art | CC0-1.0 |
| `ground.png`, `ground1.png` bis `ground4.png` | Fünf wiederholbare Umgebungsböden | Eigene programmatische Pixel-Art | CC0-1.0 |
| `pillar.png`, `grave.png`, `tree.png` | Dekorative, nicht blockierende Umgebung | Eigene programmatische Pixel-Art | CC0-1.0 |
| `vista.png` | Historische Klosterkulisse | Eigene programmatische Pixel-Art, 800 × 500 auf 1600 × 1000 skaliert | CC0-1.0 |
| `sanctuary.png` | Neue Zuflucht im Hauptmenü | Eigene programmatische Pixel-Art, 640 × 400 auf 1280 × 800 skaliert | CC0-1.0 |
| `portrait.png`, `icon.png` | Charakterporträt, Projektlogo/Favicon | Eigene programmatische Pixel-Art | CC0-1.0 |
| `icon-*.png` (44 Dateien) | Waffen, Passives, XP, Heilung, Gold, Fragmente und Einstellungen | Eigene programmatische Pixel-Art | CC0-1.0 |
| `light.png` | Weiche additive Umgebungsbeleuchtung | Eigener mathematischer Verlauf | CC0-1.0 |

Diese für das Projekt erzeugten Grafikdateien werden, soweit Rechte daran bestehen, unter **Creative Commons Zero 1.0 Universal** zur freien Verwendung bereitgestellt. Lizenztext: https://creativecommons.org/publicdomain/zero/1.0/legalcode . Keine Namensnennung erforderlich.

## Klänge

`src/audio.ts` erzeugt sämtliche Klänge mit Oszillatoren und Lautstärke-/Frequenzhüllkurven im Browser. Keine Samples, keine Musikdateien und keine fremden Melodien. Die erzeugten Klänge werden ebenfalls unter CC0-1.0 bereitgestellt.

## Bibliotheken und Schriften

- Phaser 3.90.0: MIT, Copyright (c) 2024 Richard Davey, Phaser Studio Inc.; Lizenz in `node_modules/phaser/LICENSE.md`.
- EventEmitter3: MIT, Copyright (c) 2014 Arnout Kazemier; Laufzeitabhängigkeit von Phaser.
- Vite und TypeScript: Entwicklungswerkzeuge, MIT beziehungsweise Apache-2.0; vollständige Hinweise liegen in den installierten Paketen.
- Playwright, tsx und Node-Typen: ausschließlich Entwicklungs-/Testwerkzeuge, jeweils mit ihren Paketlizenzen.
- Schrift: lokal vorhandene Systemschriften (Palatino/Georgia und Arial/Helvetica). Keine Font-Dateien werden verteilt oder nachgeladen.

Die jeweiligen Bibliothekslizenzen gelten unabhängig von der CC0-Freigabe der eigenen Grafik- und Klanginhalte.

Die vollständigen MIT-Hinweise für die verteilten Laufzeitbibliotheken werden in `public/THIRD_PARTY_LICENSES.txt` mitgeliefert und in den Produktionsbuild kopiert.


## Zuflucht-Menü, Version 2.1

Vier weitere eigene PNG-Dateien aus `scripts/generate_menu.py`: `sanctuary.png`, `icon-gold.png`, `icon-soul.png`, `icon-settings.png`. Deterministische Pixel-Art mit Python/Pillow; insgesamt 70 PNGs. Gleiche CC0-Freigabe wie die übrigen eigenen Assets. Fremde Screenshots wurden nur zur Kompositionsrecherche betrachtet, nicht kopiert oder eingebunden. Quellen: DESIGN_REFERENCES.md.
