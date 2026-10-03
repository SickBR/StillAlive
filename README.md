# STILLALIVE V3 – Schritt 1

Diese getrennte Arbeitskopie enthält ausschließlich das neue Etagensystem: drei Minuten Kampf, eine von drei Truhenbelohnungen und manuell gestartete Folgeetagen mit erhaltenem Build. Waffen, KI, Klassenwahl und vorhandene Menüs stammen aus V2.1.

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

Prüfungen: `npm test`, `npm run build`, `npm run simulate`. Browser: `npm run test:browser` mit laufendem Devserver; `npm run test:production` mit laufender Produktionsvorschau. Lokal vorhandenes Chromium oder `CHROME_PATH` erforderlich. Berichte liegen in `reports/`.

Zentrale Etagenwerte: `src/core/floors.ts`. Kampf: `engine.ts`, Speicherung: `storage.ts`, Oberfläche: `ui.ts`, Anbindung: `main.ts`. Provisorische Klassen-/Etagenbalance braucht menschliches Playtesting. Automatische Bosse, Finsternis und das alte Zeit-Freischalten sind ausgesetzt. Keine neuen Systeme aus Schritt 2–6.

**Nach Schritt 1 wird gestoppt und auf ausdrückliche Freigabe gewartet.**
