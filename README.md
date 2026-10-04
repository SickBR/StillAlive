# STILLALIVE: ENDLESS – Hauptmenü V4

**Gemeinsamer Stand für Codex und Claude:** GitHub-Branch `v3/step-1-floors`. `master` enthält weiterhin die ältere V2. Vor Änderungen [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md) und [PROJECT_STATE.md](PROJECT_STATE.md) lesen. Der aktuelle Code in diesem Branch hat Vorrang vor historischen Konzeptbeschreibungen. Synchronisation und Freigabe übertragen keine privaten Browser-Spielstände.

**Aktueller Hauptbildschirm:** Neue eigene Thronsaal-Kulisse, links Charaktere/Vermächtnis/Kodex und dynamischer Fortschritt, zentral Charakter/Startwerte/Spielstart, rechts Weltenauswahl und gespeicherte Rekorde. Shops und eigenständige Ausrüstungsverwaltung sind vom Hauptbildschirm entfernt. Bestehende Freischaltungen, Builds und Grundwerte bleiben erhalten. Skillbaum und vollständiger Kodex folgen später; die jetzigen Ansichten grenzen diesen Umfang ausdrücklich ab. Details und Grenzen: `MENU_V4.md`.

Aktuell umgesetzt: das bestehende V3-Etagensystem, das neue Hauptmenü V4 und Phase A der ENDLESS-Erweiterung. Der Menüpunkt „Charaktere“ öffnet den Katalog: Reaper, Schattenjäger und Arkanist als drei kostenlose, vollständig animierte Starter sowie zehn ausdrücklich zukünftige Plätze. Die direkten Klassenbuttons unter der Spielfigur entfallen. Auswahl und bestehende Vorlagen werden weiter über das vorhandene Profil gespeichert.

**ENDLESS ist zunächst die neue Menübezeichnung.** Der Kampf bleibt in Phase A bei drei Minuten je Etage mit Truhenwahl und manuell gestarteten Folgeetagen. Die drei neuen Starter verwenden die bestehende Kampflogik und kompatible Klassen-IDs. Getrennte Map-Freischaltungen und der Endless-Game-Loop kommen erst nach ausdrücklicher Freigabe. Details zur aktuellen Integration und Speicherkompatibilität: `STARTER_CHARACTERS.md`.

`ENDLESS_PHASE_A.md` dokumentiert die frühere Umsetzung, Tests, Bildprüfung und den Plan für B–D. `MENU_KONZEPT6.md`, `STILLALIVE_V3_STEP1.md` und `QA_V3_STEP1.md` dokumentieren die vorherigen Schritte.

Windows: **Spiel starten.bat** in diesem Ordner doppelklicken. Adresse: http://127.0.0.1:5183/. Alternativ mit Node.js ab 22.12:

```sh
npm install
npm run dev
```

Produktion: `npm run build`, dann `npm run preview`; http://127.0.0.1:4183/.

Schnelltest im Entwicklungsserver: http://127.0.0.1:5183/?floorSeconds=10, danach eine neue Runde starten. Gespeicherte Runden behalten ihre ursprüngliche Dauer. Normale Etagen dauern 180 Sekunden aktive Kampfzeit.

WASD/Pfeile bewegen, Leertaste ausweichen, ESC/P pausieren, Maus oder 1–3 für Level- und Truhenkarten. Nach der Truhenwahl startet „Nächste Etage“ den nächsten Kampf. Speichern & Hauptmenü bewahrt auch offene Truhen und bereits gewählte Belohnungen.

**V2 bleibt geschützt:** ursprünglicher Ordner auf `master`/`v2-preserved`, Commit `9d9f1a3`. V3 auf `v3/step-1-floors` in `.worktrees/v3-step1`. Eigener Speicher-Schlüssel `stillalive-v3-step1`; V2-Runden werden nicht konvertiert oder überschrieben. Ports besitzen getrennte Browserspeicher.

**STILLALIVE_V3_STEP1.md** erklärt Ablauf, Werte, Start, Speicherschutz, Selbsttests und Grenzen. **QA_V3_STEP1.md** dokumentiert 146 Tests, Browserprüfung und reguläre Simulationen. Die vorhandenen V2-Beschreibungen und `QA.md` bleiben historische Referenzen.

Prüfungen: `npm test`, `npm run build`, `npm run simulate`. Charakterfenster: `node scripts/browser-characters.mjs`. Menü und Käufe: `node scripts/browser-menu.mjs`. Etagen: `npm run test:browser` mit laufendem Devserver; `npm run test:production` mit laufender Produktionsvorschau. Lokal vorhandenes Chromium oder `CHROME_PATH` erforderlich. Berichte liegen in `reports/`.

Zentrale Etagenwerte: `src/core/floors.ts`. Kampf: `engine.ts`, Speicherung: `storage.ts`, Oberfläche: `ui.ts`, Anbindung: `main.ts`. Provisorische Klassen-/Etagenbalance braucht menschliches Playtesting. Automatische Bosse, Finsternis und das alte Zeit-Freischalten sind ausgesetzt. Keine neuen Systeme aus Schritt 2–6.

**Nach Phase A wird gestoppt. Phase B–D benötigen jeweils ausdrückliche Freigabe. Kein Commit, Merge oder Push ohne Freigabe.**
