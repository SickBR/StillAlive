# STILLALIVE: GitHub und Abschluss von Entwicklungsphasen

## Repository und Branches

- Das GitHub-Repository dieses Projekts ist `SickBR/StillAlive`.
- `origin` muss auf `https://github.com/SickBR/StillAlive.git` oder die entsprechende SSH-Adresse dieses Repositorys zeigen. Vor jedem Push prüfen.
- Im Branch der jeweiligen Entwicklungsphase arbeiten und genau diesen Branch pushen. Einen vorhandenen Upstream verwenden und dessen Ziel prüfen. Fehlt ein Upstream, den aktuellen, ausdrücklich für diese Phase vorgesehenen Branch mit `git push -u origin <branch>` verbinden.
- Bestehende Branches und Historie erhalten. Kein Force-Push, kein automatischer Reset, kein automatischer Wechsel oder Merge in `master`/`main`.

## Commit und Push nach Freigabe

- Nach jeder vom Benutzer ausdrücklich freigegebenen und erfolgreich getesteten Entwicklungsphase die zugehörigen Änderungen committen und auf den richtigen GitHub-Branch pushen. Die Freigabe muss sich auf diese Phase beziehen; aus der Freigabe nicht die nächste Phase ableiten.
- Vorher Git-Status, aktiven Branch, Upstream, Remote-Historie und parallele Codex-Arbeiten prüfen. Nur Änderungen der eigenen Phase aufnehmen; kein pauschales `git add .`, wenn unbeteiligte Dateien vorhanden sind.
- Relevante Tests ausführen und Ergebnisse berichten. Für Änderungen am Spiel mindestens die automatisierten Tests und den Produktionsbuild prüfen; Browser- und Speicherungstests ergänzen, wenn die Änderung sie betrifft.
- Bei fehlgeschlagenen Tests, ungeklärten Änderungen, Konflikten, abweichender Remote-Historie oder ungesicherten parallelen Arbeiten zuerst nachfragen. Andere Codex-Aufgaben nicht unterbrechen und ihre Arbeitskopien nicht verändern.
- Keine Zugangsdaten, Tokens, privaten Schlüssel, privaten Spielstände, `.env`-Konfigurationen, virtuellen Umgebungen, Abhängigkeiten, Build-Ausgaben oder verschachtelten Worktrees hochladen. `.gitignore` und die tatsächlich vorgemerkten Inhalte prüfen; Ignore-Regeln schützen bereits versionierte Dateien nicht.
- Vor jedem Commit die vorgemerkten Änderungen kontrollieren und eine aussagekräftige Commit-Nachricht verwenden.
- Nach dem Push den Commit-Hash des lokalen Branchs mit dem entsprechenden Remote-Branch vergleichen. Erfolg oder verbleibende Hindernisse kurz mitteilen.
- Wenn Anmeldung oder Netzwerkzugriff fehlen, keine erfolgreiche Sicherung auf GitHub behaupten und keine Zugangsdaten in Dateien speichern.

## Erhalt vorhandener Daten

- Bestehende Dateien, Spielstände, Archive, Branches und Historie weder löschen noch überschreiben.
- Archive und Testberichte nur gezielt aufnehmen, nachdem Inhalt, Datenschutz und Zugehörigkeit zur Phase geprüft wurden.
- Bei separaten Worktrees diese Projektregeln auch in der jeweiligen Arbeitskopie berücksichtigen. Eine neu hinzugefügte Anweisung im Hauptordner wird nicht automatisch in bestehende Worktrees übertragen.
