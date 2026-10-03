# ECLIPSE SURVIVOR – Menügestaltung 2.1

Recherche am 3. Oktober 2026. Die folgenden Bilder dienten als Anregung für Anordnung, Blickführung und Atmosphäre. Keine fremden Bilder, Figuren oder UI-Dateien sind im Spiel eingebunden.

- [Death Must Die – offizielle Spielseite](https://store.steampowered.com/app/2334730/DeathMustDie/), dazu [Ansicht der Charakterauswahl](https://thenerdstash.com/death-must-die-character-tier-list/): beleuchteter Aufenthaltsort, erkennbare Charaktere und lesbare Information um die Auswahl herum.
- [Soulstone Survivors – offizielles Pressematerial](https://soulstonesurvivors.com/presskit/): Referenz für die Trennung von Charakterdarstellung und Verwaltungsfunktionen.
- [Children of Morta – Abbildungen der Charakterauswahl](https://troymedia.com/lifestyle/children-of-morta-full-of-fun-even-if-narrative-is-sloppy/): hervorgehobene Spielfigur und darunter angeordnete Startaktion.

## Eigene Umsetzung

Die „letzte Zuflucht“ verwendet eine eigens gezeichnete Pixel-Art-Ruine mit Mondbogen, Laternen, Steinboden und Ritualplattform. Der animierte Charakter bildet die Mitte; direkt darunter stehen Klassenwechsel und Spielstart. Links liegen Arsenal, passive Talismane und Fortschritt. Rechts stehen die aktive Vorlage und Arena. Ressourcen und Einstellungen befinden sich oben rechts. Chronik und Steuerung sind im Fußbereich erreichbar.

Farben: kühles Dunkelblau und gedecktes Steinblau, warme Goldakzente für die Startaktion und die aktuelle Auswahl. Verwendet werden lokale Grafiken und Systemschriften. Die Ansicht wurde bei 1440 × 900 und 1024 × 768 visuell geprüft; kleinere Breiten ordnen die Inhalte um.

Erzeugung der neuen vier Grafiken: `scripts/generate_menu.py` mit Python/Pillow. Reproduzierbarer Zufallswert, keine kostenpflichtigen Dienste. Herkunft und Freigabe stehen in ASSETS.md.
