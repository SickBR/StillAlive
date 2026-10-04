# STILLALIVE – aktueller gemeinsamer Stand

Stand: 4. Oktober 2026. Diese Datei beschreibt den tatsächlichen V3-Code. Ältere Konzept- und Phasendokumente bleiben historische Referenzen; ihre früheren Aussagen zu Klassen und Menüs sind keine aktuellen Anforderungen.

## Gemeinsame Quelle

- GitHub: `SickBR/StillAlive`, Integrationsbranch `v3/step-1-floors`.
- Lokale aktive Arbeitskopie: `.worktrees/v3-step1` unter dem ursprünglichen Projektordner.
- `master` bleibt die ältere V2. Keine automatische Umstellung, Zusammenführung oder Löschung.
- Cloud-Modelle sehen nur committeten und gepushten Code, keine lokalen uncommitteten Dateien oder Browser-Spielstände.

## Implementiert

- TypeScript, Phaser 3, Vite; lokale Assets, keine Backendpflicht.
- Drei kostenlose Starter: **Reaper**, **Arkanist**, **Schattenjäger**. Interne IDs `warrior`, `mage`, `archer` bleiben aus Kompatibilitätsgründen. Zehn zusätzliche Katalogplätze sind noch nicht spielbar.
- Standard-Startwaffen: Seelensense (`scythe`), Feuerstab (`firestaff`), Rabenbogen (`hunting`). Eigene Vorlagen und bestehende Runden werden erhalten.
- Grundwerte ohne permanente Verbesserungen oder situationsabhängige Boni:

| Klasse | HP | ATK-Multiplikator | DEF | Bewegung | Krit-Chance |
| --- | ---: | ---: | ---: | ---: | ---: |
| Reaper | 125 | 1,00 | 14 | 166 | 5 % |
| Arkanist | 98 | 1,08 | 4 | 172 | 5 % |
| Schattenjäger | 110 | 1,00 | 7 | 184 | 12 % |

- Automatische Angriffe, WASD/Pfeiltasten, Ausweichschritt mit Leertaste, Gegner-KI, XP, Upgrade-Auswahl, Pause, Niederlage, Rückzug, Neustart und Fortsetzen.
- 180 aktive Kampfsekunden pro Etage. Danach Truhe mit drei temporären Upgrade-Angeboten, eines auswählen, nächste Etage starten. Waffen, Run-Upgrades und verbleibende HP bleiben erhalten; Gegner werden stärker.
- 26 registrierte Waffen, 13 Passives; maximal acht Waffen und acht Passives, jeweils bis Stufe acht. Nicht alle Inhalte sind im frischen Profil freigeschaltet.
- Hauptmenü **Charaktere / Vermächtnis / Kodex**, dynamischer Fortschritt, Weltvorschau, Rekorde, HP/ATK/DEF unter der Figur. Keine Shops oder Build-Schaltfläche im Hauptmenü.
- Vermächtnis öffnet direkt die vorhandenen sieben permanenten Grundwertverbesserungen. Der neue vollständige Skillbaum fehlt noch.
- Kodex zeigt registrierten Pool und tatsächlichen Freischaltstatus. Kein neues Entdeckungs-Speichersystem.
- Reaper-Kampf- und Menübilder sind getrennt: Gameplay-Atlas mit Idle, Walk, Attack, Hit, Death; Menü mit `reaper_menu_hero.png`.
- Ergebnisanzeigen **GEFALLEN / RUNDE BEENDET**, echte Run-Werte, Beute, Build und Details mit Tastaturbedienung. Anzeige zahlt Ressourcen nicht erneut aus.
- GUI-Gestaltung in `src/ui/theme.css`, Ergebnis-Komponenten in `src/ui/design.*` und `src/ui/run-result.ts`; bestehende `src/style.css` bleibt aktiv.
- LocalStorage-Schlüssel `stillalive-v3-step1`. Alte V2-Daten bleiben erhalten. Browserspeicher ist pro Ursprung inklusive Port getrennt und wird nicht zwischen Rechnern oder Modellen synchronisiert.

## Grenzen

- ENDLESS ist der Menütitel. Weiterhin Etagen; keine fertige 30-Minuten-Weltfreischaltung. Etagenabschlüsse zählen nicht als geschaffte Endless-Welten.
- Fünf Welten hängen weiterhin an den Schwierigkeiten; kein neues unabhängiges Map-System.
- Alte automatische Boss-/Zeitregeln sind im Etagensystem ausgesetzt.
- Neuer Skillbaum, neue Klassen/Fähigkeiten, Shops, Crafting und Idle-System sind nicht Teil dieser Sicherung.
- Balance benötigt echtes Playtesting; Tests garantieren keine perfekte Schwierigkeit über 30 Minuten.
- Benutzerbilder haben keine pauschale CC0-Lizenz. Herkunft: `ASSETS.md`, `STARTER_CHARACTERS.md`, `REAPER_ASSETS.md`.

## Start und Prüfung

In einer V3-Kopie: `npm install`, dann `npm run dev -- --port 5183 --strictPort`. Unter Windows die dortige `Spiel starten.bat` verwenden.

- `npm test`: 167 automatisierte Tests zum heutigen Stand.
- `npm run build`: TypeScript und Produktionsbuild.
- Dev-Browserprüfungen: `node scripts/browser-menu.mjs`, `node scripts/browser-starters.mjs`, `node scripts/browser-floors.mjs`, `node scripts/browser-results.mjs`.
- Produktionsprüfung: Preview auf Port 4183, dann `node scripts/production-smoke.mjs`.
- Schnelltest: `http://127.0.0.1:5183/?floorSeconds=10`, neue Runde starten. Produktion ignoriert Testparameter.
- Browserprüfungen verwenden isolierte Testprofile. Chromium über `CHROME_PATH` konfigurierbar; Berichte und Screenshots bleiben lokal unter `reports/`.

## Zusammenarbeit

Bei aufeinanderfolgenden Aufgaben verwenden beide Modelle denselben zuletzt freigegebenen V3-Commit. Vor Beginn synchronisieren, in einer sauberen Kopie nur Fast-Forward erlauben. Bei parallelen Aufgaben eigene Arbeitskopien und Aufgabenbranches verwenden, Zuständigkeiten vereinbaren und Überschneidungen vor Änderungen klären. Freigaben gelten nur für die konkrete Aufgabe.
