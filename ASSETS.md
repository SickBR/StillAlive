# Herkunft und Lizenzen

## Drei Starter – vom Benutzer bereitgestellte Spritesheets

`reaper-player-v1.png`, `arcanist-v1.png`, `shadow-hunter-v1.png` und die gleichnamigen JSON-Beschreibungen wurden unverändert aus dem Hauptprojekt in diese V3-Arbeitskopie kopiert. Die PNGs sind jeweils 1088 × 64 Pixel mit 17 unterschiedlichen transparenten 64×64-Frames. Arkanist und Schattenjäger stimmen pixelgenau mit den beigefügten Zwischenablagebildern überein. Herkunft: Benutzerauftrag vom 3. Oktober 2026. Keine zusätzliche Lizenz angegeben; die CC0-Erklärung für selbst erzeugte Projektgrafiken wird auf diese gelieferten Assets nicht übertragen. Details: `STARTER_CHARACTERS.md`.

## Hauptmenü V4

`public/assets/sanctuary-v4.png`: eigene, für dieses Projekt mit dem eingebauten Imagegen-Werkzeug erzeugte Pixel-Art-Umgebung. Enthält ausschließlich Architektur und Atmosphäre, keine Figur, Texte oder UI. Verwendung als dekorative Kulisse sowie Weltenillustration mit Farbvarianten. Keine fremde Spielgrafik und kein Referenz-Screenshot kopiert. Herkunft und vollständiger Erzeugungsprompt: `MENU_V4.md`. Soweit Rechte an diesem eigenen Projektasset bestehen, gilt ebenfalls die unten genannte CC0-Freigabe. Die bisherigen programmatisch erzeugten Assets und Benutzer-Reaperdateien bleiben unverändert.

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

## Reaper-Vorschau – Charakterauswahl Phase A

Zwei zusätzlich vom Benutzer für dieses Projekt bereitgestellte Dateien wurden unverändert lokal übernommen:

| Projektdatei | Ursprünglicher Anhang | Tatsächliches Format | Verwendung |
| --- | --- | --- | --- |
| `public/assets/reaper-character-portrait.png` | `codex-clipboard-5c54722f-3042-462d-82a7-c41697b73002.png` | 64 × 64, RGBA, ein Einzelbild | Reaper-Karte im Charakterfenster |
| `public/assets/reaper-character-preview.png` | `codex-clipboard-e728ae10-8895-4cec-9ccf-f9d10781563b.png` | 96 × 96, RGBA, ein Einzelbild | Große Reaper-Vorschau |

Beide haben echte Transparenz (Alpha 0–255). Sichtbare Begrenzungen: `(0, 3, 64, 61)` beziehungsweise `(0, 4, 96, 91)`. Sie sind keine 64×96-Animations-Spritesheets und liefern keine vollständigen Idle-, Lauf-, Treffer-, Angriffs- oder Todessequenzen. Phase A animiert diese Einzelbilder nicht. Die bestehende Gegnerdatei `reaper.png` bleibt unverändert.

Herkunft: Benutzeranhänge vom 3. Oktober 2026, ausdrücklich zur Verwendung im Spiel bereitgestellt. Keine zusätzliche Lizenz wurde angegeben; die CC0-Erklärung für die eigenen generierten Grafiken wird auf diese Dateien nicht übertragen.

## Aktiver spielbarer Reaper: getrennte Assets

`reaper_gameplay.png` und `reaper_menu_hero.png` sind zwei weitere unverändert übernommene Benutzeranhänge (je 1448 × 1086, RGBA). Das erste verwendet einen lokal beschriebenen Atlas für fünf Kampfzustände, das zweite ausschließlich Menü und Charakterauswahl. Herkunft, Zuordnung, Framebereiche und Grenzen des dicht gepackten Sheets: [REAPER_ASSETS.md](REAPER_ASSETS.md). Keine zusätzliche Lizenz angegeben; die allgemeine CC0-Erklärung gilt nicht für diese Benutzerbilder. Die oben beschriebenen älteren Vorschau-Dateien bleiben erhalten und sind für den aktiven Starter ersetzt.
