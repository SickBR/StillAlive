# STILLALIVE – gemeinsamer Projektstand

Lies zuerst `AGENTS.md` und `PROJECT_STATE.md`. Diese Regeln gelten auch für Claude.

- Repository: `https://github.com/SickBR/StillAlive.git`.
- Gemeinsamer V3-Branch: `v3/step-1-floors`. `master` enthält die ältere V2, auch wenn sein letzter Commit „v3“ heißt: dort wurden nur Startdateien ergänzt.
- Vor jeder Aufgabe Branch, Commit, Git-Status und Unterschiede zum Remote prüfen. Keine Arbeit auf einer veralteten Cloud-Kopie beginnen.
- Aktuelle Klassen: Reaper, Arkanist, Schattenjäger. Hauptmenü: Charaktere, Vermächtnis, Kodex. Keine Shops oder „Dein Build“-Schaltflächen zurückbringen.
- GUI-Aufträge erlauben keine ungefragten Änderungen an Klassen, Kampfwerten, Fähigkeiten, Fortschritt oder Speicherformat.
- Kampf: 180-Sekunden-Etagen. ENDLESS ist derzeit der Menütitel; ein neues 30-Minuten-System ist noch nicht umgesetzt.
- Bei paralleler Arbeit eigene Arbeitskopie und Aufgabenbranch vom aktuellen gemeinsamen V3-Stand benutzen. Keine gleichzeitigen Änderungen derselben Dateien. Integration nur nach Freigabe; keine automatischen Merges oder Resets.
- Commit und Push benötigen die Freigabe für die jeweilige Aufgabe. Eine ältere Freigabe gilt nicht für neue Aufgaben.
- Vor Übergabe mindestens `npm test` und `npm run build`; Browser-/Speichertests ergänzen, wenn betroffen. Branch und vollständigen Commit-Hash berichten.
- Bei Screenshots Quelle, Branch und Commit nennen; Cloud-Bilder sind kein Beleg für eine andere lokale Version.

Eine frische Cloud-Kopie erhält diesen Stand beispielsweise mit:

```sh
git clone --branch v3/step-1-floors --single-branch https://github.com/SickBR/StillAlive.git StillAlive-v3
cd StillAlive-v3
npm install
npm test
npm run build
npm run dev -- --port 5183 --strictPort
```

Eine bereits veränderte Arbeitskopie nicht dafür zurücksetzen oder überschreiben. Stattdessen eine frische separate Kopie anlegen.
