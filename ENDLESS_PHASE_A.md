# STILLALIVE: ENDLESS – Phase A

Stand: 3. Oktober 2026. Ausschließlich Hauptmenü und Charakterauswahl umgesetzt. B–D sind unten geplant und benötigen jeweils Freigabe. Kein Commit, Merge oder Push.

## Ausgangslage und Schutz

Der tatsächliche Stand ist die V3-Arbeitskopie auf `v3/step-1-floors` unter `.worktrees/v3-step1`, nicht die ältere Endless-Fassung in den V2-Dokumenten. V3 hat weiterhin drei spielbare Klassen, 26 Waffen, 13 Passives, Gold/Seelenfragmente, vorhandene Meisterschaften und permanenten Fortschritt. Eine Etage dauert 180 aktive Sekunden, endet mit einer Truhenwahl und setzt den Build auf der Folgeetage fort. Automatische Bosse und das alte Zeit-Freischalten bleiben ausgesetzt.

Die ältere V2-Dokumentation und `BALANCING_2_1.md` wurden mit dem Code abgeglichen: Die fünf Arenen hängen derzeit an den fünf Schwierigkeiten. Vorhandene Bodenvarianten und Dekorationen werden bereits verwendet, aber Map und Schwierigkeit sind noch nicht unabhängig auswählbar.

Die nicht committeten Änderungen des vorigen Menü-Redesigns bleiben erhalten. Vor Phase A wurden `ui.ts`, `style.css` und `main.ts` zusätzlich unter dem ignorierten Ordner `reports/phase-a-baseline/` gesichert. Die ursprüngliche V2-Arbeitskopie auf `master` wurde nicht verändert. `src/main.ts`, `tests/menu-stats.test.ts` und `MENU_KONZEPT6.md` gehören weiterhin zum vorherigen Menüauftrag; sie wurden in Phase A nicht geändert.

## Umgesetzt

- Menüuntertitel **ENDLESS**, unveränderte Zuflucht mit animiertem ausgewähltem Charakter, Grundwerteleiste, Startknopf und den drei linken Hauptoptionen.
- Direkte Klassenbuttons unter der Figur entfernt. Ein eigener großer **Charaktere**-Button öffnet das neue Fenster. Der frühere kleine Fußleisten-Einstieg entfällt zugunsten dieses eindeutigen Zugangs.
- Erweiterbarer Präsentationskatalog in `src/characters.ts`: drei echte Klassen, Reaper als vorbereitetes viertes Startcharakterfeld und zehn Zukunftsplätze; insgesamt 14 Karten.
- Karten für die echten Klassen zeigen Pixel-Sprite, Namen, Rolle und tatsächlichen Status: kostenlos verfügbar beziehungsweise ausgewählt.
- Ein Kartenklick zeigt rechts eine Vorschau, ohne Profil oder Rundenspeicher zu verändern. Die Vorschau enthält die tatsächliche Startwaffe der passenden Vorlage, echte Startwerte inklusive permanenter Boni/ausgerüsteter Meisterschaften und die vorhandene Spezialmechanik.
- **Auswählen** verwendet vorhandene Vorlagen, speichert über das bestehende Profil und schließt das Fenster. Ein bereits aktiver eigener Build wird beim Betrachten seiner Klasse nicht durch die Standardvorlage ersetzt. Fehlende Klassenvorlagen werden bei freiem Platz ergänzt.
- Die zehn Zukunftskarten sind dunkel, besitzen ein Schloss und **Bald verfügbar**, sind deaktiviert und haben weder Fähigkeiten noch Werte, Preise oder Käufe.
- Reaper besitzt eine Karte und große Vorschau aus den Benutzerbildern. Der Status ist **In Vorbereitung**, die Auswahlaktion **Gesperrt**. Sense und Seelenernte sind ausdrücklich als geplant gekennzeichnet; es werden keine Kampfwerte behauptet oder berechnet.
- X, Zurück und Escape schließen das Fenster. Der Fokus kehrt zum Charaktere-Button zurück. Es existiert immer höchstens eine Dialogebene; Tastatur-Fokuseinfassung aus dem vorhandenen System bleibt erhalten.
- Auf kleineren Displays stehen zuerst die vier Startkarten, darunter die Vorschau und danach die zehn Zukunftsplätze. Ein Kartenklick scrollt zur zugehörigen Vorschau. Das Fenster bleibt vertikal scrollbar; alle zehn Zukunftskarten und die Bedienelemente sind erreichbar. Die große Charaktere-Schaltfläche eignet sich auch zum Antippen; neue Smartphone-Kampfsteuerung wurde nicht entwickelt.

**Wichtig:** ENDLESS ist in Phase A die Menübezeichnung. Der aktive Kampf bleibt beim bestehenden Etagensystem. Ein kleiner Hinweis im Menü macht dies sichtbar. Reaper-Kampf, neue Bossregeln, Map-Auswahl und 30-Minuten-Freischaltungen wurden nicht vorgezogen.

## Speichern und bestehende Funktionen

Keine Änderung am Speicherformat, Schlüssel `stillalive-v3-step1`, Profil- oder Rundenschema. Daher ist für Phase A keine neue Migration notwendig. Die gewählte Klasse bleibt über die bereits gespeicherte Vorlagenauswahl erhalten. Alle drei vorhandenen Klassen sind kostenlos; es wurde kein zusätzliches Kauf- oder Währungssystem eingeführt.

Vorlagen, Waffenfreischaltungen, permanente Werte, Meisterschaften, Ressourcen, Historie und Einstellungen werden weiterhin durch die vorhandenen Systeme verwaltet. Eine gespeicherte Runde behält ihre ursprüngliche Klasse, Ausrüstung und Run-Upgrades, auch wenn im Menü eine andere Klasse gewählt wird. Die bisherigen atomaren Checkpoints und Ressourcengutschriften wurden nicht verändert.

Sonderfall: Besteht ein älteres Profil ausschließlich aus zwölf Vorlagen anderer Klassen, kann eine fehlende Klassenvorlage nicht zusätzlich angelegt werden. Die Auswahl zeigt dann das erreichte Vorlagenlimit und überschreibt keine Vorlage. Diese seltene Grenze ist getestet; eine Lösung mit mehr Charakteren/Vorlagen muss vor der Reaper-Integration bewusst festgelegt werden.

## Prüfung der Reaper-Dateien

| Datei | Tatsächliche Maße | Format | Frames |
| --- | --- | --- | --- |
| `reaper-character-portrait.png` | 64 × 64 | RGBA, echte Transparenz | 1 |
| `reaper-character-preview.png` | 96 × 96 | RGBA, echte Transparenz | 1 |

Beide Dateien wurden unverändert aus den Anhängen kopiert. Sie sind **keine fertigen 64×96-Spritesheets**. Für Reaper fehlen Lauf-, Treffer-, Angriffs- und Todessequenzen. Phase A erfindet diese nicht und behandelt die Grafiken als statische Vorschauen. Die vorhandene Gegnertextur `reaper.png` wurde nicht verändert. Herkunft und Nutzungsangabe stehen in `ASSETS.md`.

## Geänderte Dateien dieser Phase

| Datei | Inhalt |
| --- | --- |
| `src/characters.ts` | Neuer Präsentationskatalog und sichere Auswahl vorhandener Klassen/Vorlagen |
| `src/ui.ts` | Hauptmenübutton, Charakterraster, Vorschau, Auswahl und Statusanzeigen |
| `src/style.css` | Responsive Gestaltung des Charakterfensters und separaten Buttons |
| `public/assets/reaper-character-portrait.png` | Unverändertes 64×64-Benutzerbild |
| `public/assets/reaper-character-preview.png` | Unverändertes 96×96-Benutzerbild |
| `tests/characters.test.ts` | Sechs Tests zu Katalog, kostenloser Auswahl, Speicherung, Vorlagen und Sperren |
| `scripts/browser-characters.mjs` | Charakter-, Speicher-, Layout- und kurze UI-Leistungsprüfung |
| `scripts/browser-menu.mjs` | Vorhandene Klassenwechselprüfung nutzt den neuen Zugang |
| `scripts/browser-floors.mjs` | Bestehende Etagentests nutzen den neuen Charakterzugang |
| `scripts/production-smoke.mjs` | Produktionsprüfung umfasst jetzt Charakterfenster, Sperren und Auswahl |
| `ASSETS.md`, `README.md`, `ENDLESS_PHASE_A.md` | Bildherkunft, aktueller Stand, Tests und folgender Plan |

Kampf-, Gegner-, Waffen-, Economy-, Meta- und Speichercode sowie Paketabhängigkeiten wurden nicht geändert.

## Ausgeführte Tests

- **155 automatisierte Tests bestanden.** Neu: Katalog mit genau zehn Zukunftsplätzen; kostenlose Auswahl/Persistenz aller drei Klassen; Erhalt einer aktiven eigenen Vorlage; sichere Ergänzung fehlender Vorlagen; Verweigerung von Reaper/Zukunftsplätzen/ungültigen IDs; Schutz einer vollen älteren Vorlagensammlung.
- **TypeScript-Prüfung erfolgreich.**
- **Produktionsbuild erfolgreich.**
- Neuer Chromium-Charaktertest: keine direkten Klassenbuttons; ein sichtbarer Charaktere-Zugang; 14 Karten; zehn deaktivierte Zukunftsplätze; echte Reaper-Bildmaße; keine Profiländerung durch Vorschauen; kostenlose Auswahl und Reload; gekaufte Ausrüstung, Gold/Fragmente, permanente Werte und Meisterschaften bleiben erhalten; gespeicherte Runde bleibt nach Klassenwechsel unverändert.
- Layout und Erreichbarkeit geprüft bei **1440×900, 1280×720, 1024×768, 820×900, 390×844 und 320×740**. Dialoggrenzen und horizontale Überbreite geprüft; letzte Zukunftskarte erreichbar; X/Escape/Fokus und keine überlagerten Dialoge. Desktop-, Reaper- und Mobilaufnahmen visuell kontrolliert.
- **30 Öffnen/Vorschau/Schließen-Zyklen:** gleiche Anzahl Menü-DOM-Elemente vor und nach dem Test, keine angesammelten Dialoge. Chromium-Heap vor/nach expliziter Garbage Collection gemessen und auf auffälliges Anwachsen geprüft. Dies ist eine kurze UI-Regressionsprüfung, kein Langzeit-Kampfbenchmark.
- Vorhandener Menütest erneut bestanden: alle drei Shops, alle sieben permanenten Käufe, korrekte Preise, Vorlagenkopie, Speichern/Laden, Grundwerte, Stufenlimit, Spielstart/Rückkehr und Schutz gespeicherter Runden vor späteren Käufen.
- Bestehender Etagentest erneut bestanden: zwei echte Testetagen à zehn aktive Sekunden, Truhe, Folgeetage, Pause, Speichern/Laden, Niederlage und Neustart. Test-XP für die Levelkarte und Testschaden für die abschließende Niederlage; keine künstliche Unverwundbarkeit während der Etagen.
- Produktion in Chromium geprüft: Charakterfenster/14 Karten/zehn Sperren/Reaper-Vorschau, echte Klassenauswahl, normaler 180-Sekunden-Timer, Bewegung und Pause; keine Entwicklungs-Testschnittstelle, externen Anfragen oder JavaScript-Fehler.

Alle Browsertests verwenden eigene Testprofile. Die Spielstände des geöffneten Benutzerbrowsers wurden nicht verändert. Berichte und Screenshots liegen unter dem ignorierten `reports/`.

## Plan für Phase B – nur nach Freigabe

1. Reaper als echte vierte Klasse ergänzen; UI-Katalogstatus von vorbereitet zu spielbar wechseln und freie Startauswahl dauerhaft speichern. Ältere Profile, Vorlagen und Rundenspeicher kompatibel erweitern. Vorlagenlimit mit vier und später mehr Klassen klären.
2. Eigene kostenlose Start-Sense und begrenzte Seelenernte aus vorhandenen Angriffssystemen entwickeln. Schwelle, Cooldown und Schaden zentral konfigurieren und anhand echter Tests festlegen. Zusätzliche Angriffe dürfen nicht unbegrenzt sich selbst auslösen; Folgeeffekte müssen begrenzt bleiben.
3. Metadaten pro Charaktertextur nutzen, damit Darstellung und Kollisionsradius unabhängig sind und höhere Sprites bestehende Gegnertexturen nicht beeinflussen. Die beiden gelieferten Einzelbilder nicht ungeprüft als Animationsframes behandeln. Fehlende Animationen ausdrücklich dokumentieren; keine nicht vorhandenen Frames behaupten.
4. Alle vier Klassen, Startwaffen, Passive, Speichern/Laden und Tod prüfen. Simulationsvergleiche ohne künstliche Unverwundbarkeit plus menschliches Playtesting; keine Behauptung perfekter Balance.

## Plan für Phase C – nur nach Freigabe

1. Eigenständige Map-IDs/-Metadaten von Schwierigkeit trennen; vorhandene fünf Arenen, Bodenvarianten und Dekorationen wiederverwenden. Eigenes Map-Fenster mit Voraussetzungen und permanentem Freischaltstatus.
2. Bestehende `unlockedDifficulty`-Fortschritte erhalten und nachvollziehbar auf bereits zugängliche Maps übertragen, ohne alte Schwierigkeiten oder Freischaltungen zurückzusetzen. Mapwahl und Schwierigkeitswahl sollen künftig unabhängig sein.
3. Die nächste Map beim Erreichen von 1800 **aktiven Simulationssekunden auf der jeweiligen Map in einer Runde** freischalten. Pause, Kartenfenster und inaktiver Browser zählen nicht; der Run wird dabei nicht beendet. Erfolg sofort dauerhaft sichern.
4. Grenzwerte 1799/1800 Sekunden, unterschiedliche Maps, aktive/inaktive Zeiten, erneutes Laden und Freischaltung ohne Tod automatisiert und im Browser prüfen.

## Plan für Phase D – nur nach Freigabe

1. Neue Runden vom Etagenmodus zum tatsächlichen Endless-Loop überführen. Wiederkehrende Bosse und deren Fragmentbelohnungen kontrolliert wieder aktivieren. Bestehende Etagenspeicher nicht still als andere Rundentypen interpretieren oder verwerfen; kompatible Übergangsstrategie vor Umsetzung festlegen.
2. Vorhandene Economy, Kill-Belohnungen und Checkpoint-Ledger wiederverwenden; Gold/Fragmente bei Tod, freiwilligem Ende, Fortsetzen und wiederholtem Laden genau einmal gutschreiben.
3. End-to-End-Prüfung aller vier Charaktere, Maps/Schwierigkeiten, Bossfolgen, Upgrades, 30-Minuten-Freischaltungen, Speicherung und Rundenwechsel. Langzeit- und Performanceprüfung sowie reproduzierbare Vergleichssimulationen ergänzen, soweit sinnvoll.

## Start und eigenes Feedback

`Spiel starten.bat` in dieser V3-Arbeitskopie öffnen oder `http://127.0.0.1:5183/` neu laden. Alternativ im V3-Ordner:

```sh
npm install
npm run dev
```

Selbst prüfen: **Charaktere** öffnen, Karten und Reaper-Vorschau ansehen, eine vorhandene Klasse auswählen, Seite neu laden, Ausrüstung prüfen und eine Runde starten. Danach Pause → Speichern & Hauptmenü, andere Menüklasse wählen und die gespeicherte Runde fortsetzen: deren ursprünglicher Charakter muss erhalten bleiben.

Reproduktion:

```sh
npm test
npm run build
node scripts/browser-characters.mjs
node scripts/browser-menu.mjs
npm run test:browser
npm run test:production
```

Für Browsertests Chromium lokal oder `CHROME_PATH`; Devserver auf 5183, Produktionsvorschau auf 4183. Nach Phase A wird gestoppt. B–D sind noch nicht implementiert.
