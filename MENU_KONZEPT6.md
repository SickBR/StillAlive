# STILLALIVE V3 – Hauptmenü nach Konzept 6

Umsetzung vom 3. Oktober 2026 in der bestehenden V3-Arbeitskopie `.worktrees/v3-step1`, Branch `v3/step-1-floors`. Änderungen bleiben uncommitted. Kein Commit oder Push wurde ausgeführt.

## Änderungen

- Linke Hauptnavigation: ausschließlich Waffenkammer, Talismane und Meisterschaften, mit vorhandenen Pixel-Icons, dunklen Flächen und Goldrahmen bei Hover/Fokus.
- „Dein Build“ und „Grundwerte“ entfallen als separate Navigationseinträge. Alle Vorlagen, Startwaffen, Kartenpools und Meisterschaftsausrüstungen bleiben über „Ausrüstung anpassen“ erreichbar.
- Unter dem zentralen Charakter stehen Leben, Angriffsmultiplikator und Verteidigung. Werte berücksichtigen die gewählte Klasse, permanente Verbesserungen und ausgerüstete Wächter-Meisterschaft. Temporäre und situationsabhängige Kampfboni gehören weiterhin in den Run.
- Das Plus öffnet ein vollständiges Grundwerte-Fenster mit allen sieben vorhandenen Verbesserungen, aktuellen Werten, Stufenanzeige, Werten ohne permanente Stufen, Bonus pro Stufe, nächstem Wert und tatsächlichem Goldpreis. Bestehende Kaufregeln und Stufenlimits bleiben erhalten.
- Käufe aktualisieren Werte und Goldanzeige sofort. Schließen über X, Zurück oder Escape; Fokus kehrt zum passenden Menüknopf zurück.
- Logo links oben, Einstellungen und Ressourcen rechts oben, großer goldener Startknopf unter der Klassenwahl. Die vorhandenen animierten Charaktere, Mond und Steinbogen bleiben als eigenständige Assets erhalten. Das Referenzbild dient der Komposition, wird nicht als Screenshot eingebunden. Keine neue Hintergrundillustration erstellt.
- Bei kleineren Fenstern können Menü und Dialoge vertikal scrollen. Die rechte Seite mit Ausrüstung und Schwierigkeitswahl bleibt auch auf schmalen Bildschirmen erreichbar.

## Betroffene Dateien

| Datei | Änderung |
| --- | --- |
| `src/ui.ts` | Navigation, echte Startwerte, Grundwerte-Fenster, Aktualisierung und Fokus beim Schließen |
| `src/style.css` | Gestaltung und responsive Anordnung des Hauptmenüs und Grundwerte-Fensters |
| `src/main.ts` | Escape nutzt die zentrale Dialog-Schließfunktion |
| `tests/menu-stats.test.ts` | Vergleich der Menüwerte mit echten Engine-Startwerten für alle Klassen, permanente Stufen und aktive/inaktive Meisterschaft |
| `scripts/browser-menu.mjs` | Neuer isolierter Browsertest für das Menü und vorhandene Käufe/Speicherstände |
| `MENU_KONZEPT6.md` | Dieser Änderungs- und Prüfbericht |

Kampfsystem, Balancing, Preise, Speicherformat und Speicher-Schlüssel wurden nicht geändert. Die ursprüngliche V2-Arbeitskopie bleibt unberührt.

## Prüfungen

- TypeScript-Prüfung erfolgreich.
- 149 automatisierte Tests erfolgreich, darunter drei neue Klassenvergleiche für die Menüwerte. Je Klasse wurden Stufen 0, 1, 5 und 10 sowie ausgerüstete und nicht ausgerüstete Meisterschaft geprüft.
- Produktionsbuild erfolgreich.
- Neuer Chromium-Menütest erfolgreich: drei Navigationseinträge; Klassenwechsel; alle sieben permanenten Käufe und Preissteigerungen; Waffenkammer-, Talisman- und Meisterschaftskäufe; Vorlagen bearbeiten/kopieren; Neustart der Browserseite mit erhaltenem Profil; unveränderte V2-Speicherdaten; X/Escape/Fokus; Stufenlimit; Spielstart und Rückkehr; Käufe verändern gespeicherte Runden nicht rückwirkend.
- Layoutprüfung bei 1440×900, 1280×720, 1024×768, 820×900, 390×844 und 320×740: keine horizontale Überbreite, erreichbare Ausrüstung, vollständig im Fenster liegende und vertikal scrollbar bleibende Dialoge. Desktop-, Mobil- und Detailfenster-Screenshots visuell kontrolliert. Zusätzliche Desktopaufnahme bei 1664×936.
- Bestehender Browser-Etagentest erneut erfolgreich: zwei echte 10-Sekunden-Testetagen, Truhenwahl, Etagenwechsel, Pausieren/Speichern/Laden, Niederlage, Neustart, freiwilliges Beenden. Für Levelkarten wurde Test-XP und für die abschließende Niederlage Testschaden gesetzt; keine künstliche Unverwundbarkeit während der Etagen.
- Produktions-Browserprüfung erfolgreich: normaler 3-Minuten-Timer, Bewegung, Pause, keine Entwicklungs-Testschnittstelle und keine externen Anfragen.
- Browserprüfungen liefen mit separaten Testprofilen, ohne die Spielstände des geöffneten Benutzerbrowsers zu verändern. Keine Browserfehler oder fehlgeschlagenen Asset-Anfragen.

## Starten und selbst prüfen

`Spiel starten.bat` in dieser V3-Arbeitskopie öffnen oder im bereits laufenden Spiel `http://127.0.0.1:5183/` neu laden. Alternativ in diesem Ordner:

```sh
npm install
npm run dev
```

Zum Prüfen: Klasse wechseln und die drei Werte vergleichen; Plus anklicken; verfügbare Grundwerte kaufen; Fenster über X/Escape schließen; „Ausrüstung anpassen“ öffnen; gespeicherte Vorlage auswählen; eine Runde starten und über Pause ins Hauptmenü zurückkehren.

Die bestehende Etagen- und Klassenbalance sowie die vorläufigen Einschränkungen von V3-Schritt 1 bleiben erhalten. Dieses Redesign enthält keine späteren Spielsysteme.

Prüfungen erneut ausführen:

```sh
npm test
npm run build
node scripts/browser-menu.mjs
npm run test:browser
npm run test:production
```

Browsertests benötigen lokal vorhandenes Chromium (alternativ `CHROME_PATH`). Menü- und Etagentest verwenden den laufenden Entwicklungsserver auf 5183; Produktionstest die laufende Vorschau auf 4183. Berichte und Screenshots stehen unter `reports/` und werden nicht versioniert.
