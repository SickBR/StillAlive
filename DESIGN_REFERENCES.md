# ECLIPSE SURVIVOR – Menügestaltung 2.1

Recherche am 3. Oktober 2026. Die folgenden Bilder dienten als Anregung für Anordnung, Blickführung und Atmosphäre. Keine fremden Bilder, Figuren oder UI-Dateien sind im Spiel eingebunden.

- [Death Must Die – offizielle Spielseite](https://store.steampowered.com/app/2334730/DeathMustDie/), dazu [Ansicht der Charakterauswahl](https://thenerdstash.com/death-must-die-character-tier-list/): beleuchteter Aufenthaltsort, erkennbare Charaktere und lesbare Information um die Auswahl herum.
- [Soulstone Survivors – offizielles Pressematerial](https://soulstonesurvivors.com/presskit/): Referenz für die Trennung von Charakterdarstellung und Verwaltungsfunktionen.
- [Children of Morta – Abbildungen der Charakterauswahl](https://troymedia.com/lifestyle/children-of-morta-full-of-fun-even-if-narrative-is-sloppy/): hervorgehobene Spielfigur und darunter angeordnete Startaktion.

## Eigene Umsetzung

Die „letzte Zuflucht“ verwendet eine eigens gezeichnete Pixel-Art-Ruine mit Mondbogen, Laternen, Steinboden und Ritualplattform. Der animierte Charakter bildet die Mitte; direkt darunter stehen Klassenwechsel und Spielstart. Links liegen Arsenal, passive Talismane und Fortschritt. Rechts stehen die aktive Vorlage und Arena. Ressourcen und Einstellungen befinden sich oben rechts. Chronik und Steuerung sind im Fußbereich erreichbar.

Farben: kühles Dunkelblau und gedecktes Steinblau, warme Goldakzente für die Startaktion und die aktuelle Auswahl. Verwendet werden lokale Grafiken und Systemschriften. Die Ansicht wurde bei 1440 × 900 und 1024 × 768 visuell geprüft; kleinere Breiten ordnen die Inhalte um.

Erzeugung der neuen vier Grafiken: `scripts/generate_menu.py` mit Python/Pillow. Reproduzierbarer Zufallswert, keine kostenpflichtigen Dienste. Herkunft und Freigabe stehen in ASSETS.md.

## Interface 3.0 – „Gold & Stein“ (4. Oktober 2026)

Komplette Überarbeitung der Oberfläche in Richtung fertiges Dark-Fantasy-Steam-Spiel. Spiellogik, Speicherstände und Balancewerte sind unverändert.

- **Gestaltungssystem:** Farbtokens in `src/style.css` (`--gold-*`, `--stone-*`, Raritätsfarben), verzierte Rahmen mit Goldecken (inline-SVG), metallische Gold-Buttons mit Lichtkante, Rauten-Ornamente als Trenner. Überschriften in Kapitälchen-Serif (`Cinzel`, falls installiert, sonst Palatino Linotype / Book Antiqua). Eigener goldener Mauszeiger.
- **Auflösungs-Skalierung:** Ab 1440 × 900 wächst die gesamte Oberfläche mit (`--ui-scale`, bis ×1,8), damit 1080p/1440p/4K nicht winzig wirken. Darunter greifen die bisherigen responsiven Regeln.
- **Zuflucht:** Gold-Verlaufslogo, Navigations-Plaketten mit Rauten-Sockeln, Porträt-Sockel für die Klassenwahl, großer Startbutton mit Lichtschimmer. Einblend-Animation nur beim ersten Öffnen, nicht bei jedem Klick.
- **Kampf-HUD:** XP-Leiste über die volle Breite (golden pulsierend, wenn XP gesichert sind und die Wartezeit läuft), Porträt mit Level-Raute, segmentierte LP-Leiste mit nachlaufendem „Schadensschatten“, Uhr-Plakette, Zähler mit Symbolen, Waffen-Sockel mit radialem Cooldown und MAX-Markierung, runder Ausweich-Sockel mit Fortschrittsring, roter Treffer-Blitz und pulsierende Vignette unter 30 % LP, violette Tönung während der Finsternis, große Boss-Leiste mit Ornamenten.
- **Levelaufstieg:** Level-Raute, Lichtstrahlen, Karten mit Raritätsbanner und -rahmen (gewöhnlich/selten/episch), „NEU“-Stempel, Stufen-Rauten, gestaffeltes Austeilen.
- **Pause & Ergebnis:** Gerahmte Panels, Rundenübersicht, hervorgehobene Belohnungen, rot getönter Niederlage- bzw. goldener Rückzugsbildschirm.
- **Schadenszahlen:** Fette Serifenschrift mit dunkler Kontur, kritische Treffer größer, golden und mit kurzem Aufploppen.
- **Leistung:** Keine animierten Vollbild-Filter, keine SVG-Rauschtexturen; Hintergrundanimationen pausieren bei offenem Dialog. `prefers-reduced-motion` schaltet alle Animationen ab.

Vorheriger Stand der drei geänderten Dateien: `archive/ui-v21-before-gold-stone.zip`.
