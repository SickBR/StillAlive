# STILLALIVE: ENDLESS – Hauptmenü V4

Umsetzung vom 3. Oktober 2026, ausschließlich Hauptbildschirm. Nicht committed oder gepusht. Die bestehende V3-Arbeitskopie bleibt von V2 getrennt.

## Bedienung und Gestaltung

- Eigene Kulisse eines zerstörten Thronsaals mit Mondlicht, Steinbögen, Bannern, Kerzen und Nebel. Keine Referenz-Screenshot-Grafik eingebunden. DOM-Buttons, dynamische Textanzeigen und Fortschrittsbalken liegen unabhängig darüber.
- Links genau Charaktere, Vermächtnis und Kodex. Die bestehende Charakterauswahl mit drei spielbaren Klassen und zehn gesperrten Zukunftsplätzen bleibt erhalten.
- Gold und Seelenfragmente oben rechts sind reine Anzeigen. Das frühere Fenster „Ressourcen & Fortschritt“ wurde entfernt; nur das Zahnrad öffnet die Einstellungen.
- Mitte: bestehender animierter Sprite, Klassenbeschreibung, tatsächliche Startwerte für HP, ATK-Multiplikator und DEF, Spielstart beziehungsweise Fortsetzen.
- Rechts: große atmosphärische Illustration, aktuelle Welt und Nummer, vorhandene Weltenauswahl, gespeicherter Rekord und Freischaltziel. Keine eigenständige Ausrüstungsverwaltung auf dem Hauptbildschirm.
- Mobil: Charakter und Start zuerst, anschließend Navigation/Fortschritt und Welten. Alles bleibt scrollbar. Keine versteckten Weltenbereiche.

## Herkunft der Fortschrittswerte

`src/menu-progress.ts` liest die vorhandenen Registrierungen und Spielstände ohne Mutation:

| Anzeige | Zählregel |
| --- | --- |
| Helden | Spielbare Einträge des vorhandenen Charakterkatalogs / alle vorgesehenen Plätze. Aktuell drei von 13; zehn Zukunftsplätze sind gesperrt. Die Starterintegration ist in `STARTER_CHARACTERS.md` beschrieben. |
| Upgrades | Jede freigeschaltete registrierte Waffen- oder Passive-ID einmal. Keine Stufen, Duplikate, permanenten Grundwerte oder Meisterschaften zusätzlich mitzählen. Aktuell 26 Waffen + 13 Passives im Register. |
| Welten (max) | Derzeit null nachweisbar geschaffte Endless-Welten / fünf vorhandene Welten. `bestFloor`, globale Siege und geerbter Schwierigkeitszugang beweisen keinen 30-Minuten-Erfolg und werden nicht dafür verwendet. |
| Rekord | Je Welt höchster Zeit- und Killwert aus der vorhandenen Chronik. Ohne Eintrag Striche statt erfundener Werte. Die bisherige Speicherung bewahrt nur die letzten 20 Runden; ein dauerhafter Rekord je Welt ist noch kein vorhandenes System. |

Alte Freischaltungen erlauben weiterhin den bisherigen Weltenzugang. Die Anzeige eines vorgesehenen 30-Minuten-Ziels implementiert oder aktiviert diese Bedingung nicht.

## Bewusste Grenzen dieses Schritts

Vermächtnis öffnet direkt die vorhandenen sieben permanenten Grundwert-Upgrades. Der wiederholte Hinweisdialog entfällt. Kein neuer Skillbaum, keine neuen Preise oder Käufe.

Kodex bietet lediglich eine lesbare Übersicht aller registrierten Waffen und Passives mit vorhandener Freischaltung/Gesperrt-Kennzeichnung. Ein eigener Entdeckungsstatus wird bisher nicht gespeichert; Detailseiten, neue Upgrade-Pools und vollständiger Kodex folgen später.

Weltenillustrationen verwenden dieselbe eigene Umgebung mit Farbvarianten. Es wurden keine neuen Spielkarten implementiert. Die bestehenden drei Minuten pro Etage, Waffen, Gegner, Belohnungen und Speicherschemata bleiben unverändert. Aktive Vorlagen bleiben im Profil und werden beim Spielstart verwendet.

## Starten und selbst prüfen

In dieser V3-Arbeitskopie `Spiel starten.bat` öffnen oder:

```sh
npm install
npm run dev
```

Spiel: http://127.0.0.1:5183/. Bei einer bereits geöffneten Seite neu laden.

Charakter wechseln und HP/ATK/DEF vergleichen; Vermächtnis und Kodex öffnen; Weltenauswahl aufrufen und gesperrte Welten prüfen; Runde starten, pausieren, speichern und fortsetzen. Auf schmalem Fenster zum Weltenbereich hinunterscrollen. Bestehende Daten und Freischaltungen sollen dabei erhalten bleiben.

Automatisiert: `npm test`, `npm run build`, `node scripts/browser-menu.mjs`, `node scripts/browser-characters.mjs`, `node scripts/production-smoke.mjs`. Browserprüfungen nutzen isolierte Testprofile, keine echten Benutzerspielstände. Ergebnisse liegen lokal in `reports/`.

Ausgeführt und bestanden: 158 automatisierte Tests, TypeScript-Prüfung und Produktionsbuild. Menüprüfung auf sieben Bildschirmgrößen (1664, 1440, 1280, 1024, 820, 390 und 320 Pixel Breite), einschließlich Dialoggrenzen, Header/Footer, Start/Pause/Fortsetzen, vorhandener Gold-Upgrades, Weltwahl und Speicherschutz. Charakterauswahl auf sechs Bildschirmgrößen und 30 Öffnen/Vorschau/Schließen-Zyklen mit unveränderter DOM-Anzahl und ohne angesammelte Dialoge. Produktionsprüfung: echter Start, Tastaturspiel, Pause und mobile Charakterauswahl; keine Browserfehler oder externen Laufzeitanfragen. Das ist ein UI-Regressionstest, kein vollständiges Langzeit-Playtesting oder neues Balancing.

## Kulisse und Erzeugung

Asset: `public/assets/sanctuary-v4.png`. Erzeugt mit dem eingebauten Imagegen-Werkzeug, ohne API-Schlüssel oder Laufzeitdienst. Keine vorhandenen Assets überschrieben. Die Benutzerreferenz diente als Gestaltungsvorgabe und wurde nicht in das Spiel kopiert.

Verwendeter vollständiger Prompt:

> Use case: stylized-concept. Asset type: decorative environment background for a real HTML game menu, widescreen 16:9. Create an original high quality crisp pixel-art ruined medieval throne sanctuary at night. Dark blue stone arches frame a central large luminous crescent moon and distant gothic ruined towers. Torn dark banners flank the central opening, warm candles and braziers light cracked stone steps, ivy and subtle ground mist. A low EMPTY stone altar is centered at x50%, y62% for a separately rendered pixel character. Left and right thirds have darker quieter architectural detail behind real menu panels. Strong atmosphere, finely textured pixel clusters, limited midnight navy and muted gold palette. NO character, NO UI, NO panels, NO borders, NO writing, NO logo, NO icons, NO buttons. Only the environmental art, no screenshot. Keep central moon at x50% y23%, altar y62%, foreground rubble mostly bottom and outer corners. Original composition, not from any existing game.
