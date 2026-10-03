# STILLALIVE V3 – Schritt 1

Implementiert wurde ausschließlich Schritt 1 auf Basis von V2.1. Nach diesem Stand wird auf Nutzerfeedback gewartet.

## Start

**Spiel starten.bat** in dieser Arbeitskopie doppelklicken. Das Spiel öffnet http://127.0.0.1:5183/. Das Serverfenster offen lassen. Läuft V3 bereits, öffnet die Startdatei die vorhandene Seite. Alternativ mit Node.js ab 22.12:

```sh
npm install
npm run dev
```

Produktion: `npm run build`, danach `npm run preview`; Adresse http://127.0.0.1:4183/. V2 bleibt auf seinen bisherigen Ports 5173/4173 getrennt.

Schnelltest im Entwicklungsserver: http://127.0.0.1:5183/?floorSeconds=10. Eine **neue** Runde verwendet dann zehn Sekunden pro Etage und zeigt SCHNELLTEST. Gespeicherte Runden behalten ihre Dauer. Neue Produktionsrunden ignorieren den Testparameter und verwenden 180 Sekunden.

## Ablauf und erhaltene Systeme

- Klasse und vorhandene Build-Vorlage wählen; WASD/Pfeile bewegen, Leertaste ausweichen, ESC/P pausieren. Waffen greifen automatisch an. Bestehende XP-Levelkarten bleiben erhalten.
- Eine Etage dauert 180 Sekunden aktive Kampfzeit. Pause und Levelkarten halten die Uhren an.
- Am Ende stoppt der Kampf. Gegner, Geschosse, Warnflächen und Loot werden entfernt. Übrige XP-Kristalle werden gutgeschrieben; Heil-Drops werden nicht automatisch konsumiert.
- Die Belohnungstruhe bietet drei zufällige Run-Upgrades aus dem erlaubten Waffen-/Passivpool. Genau eines wird gewählt. Seltene/epische Karten enthalten den vorhandenen zusätzlichen +1/+2-%-Run-Schadensbonus. Bei ausgebautem Pool gelten bestehende Run-Meisterschaften als Fallback.
- Danach startet der Spieler ausdrücklich die nächste Etage. Waffen, passive Stufen, Run-Boni, XP, Level, Gold und Leben bleiben erhalten. Die Figur kehrt in die Arenamitte zurück, Startgegner stehen weit entfernt. Keine kostenlose vollständige Heilung.
- Niederlage, freiwilliges Beenden, Hauptmenü, Speichern und Neustart funktionieren weiter. Ein Neustart setzt Etage und temporäre Boni zurück.

Die vorhandene Arena, Figuren, Waffenmechanik, Gegner-KI, Klassenwahl und V2-Menüs werden wiederverwendet. Die Truhe ist ein Auswahlbildschirm mit bestehenden Karten; keine neue physische Truhenfigur und kein Grafik-Redesign.

## Zentrale Werte

`src/core/floors.ts`: Länge 180 s; pro neuer Etage +15 % Basis-LP, +8 % Basiskontaktschaden und +1 % Basistempo, Tempoaufschlag maximal +20 %. Zielpopulation wächst innerhalb einer Etage von 24 auf 56, plus vier pro weiterer Etage; Zielmaximum 240, globale Grenze 300. Spawnabstand sinkt von 0,80 auf 0,55 s, pro Etage um weitere 0,025 s, mindestens 0,30 s. Bestehende Gegnerfreigaben werden pro Etage um 35 Sekunden vorgezogen, maximal 180 Sekunden.

Formationen verwenden lokale Etagenzeit: zuerst 75 s, danach alle 45 s. Automatische Boss-/Finsterniszyklen und das alte Freischalten nach 30 Minuten sind ausgesetzt. Alte Bosstermine beeinflussen weder Etagenende noch Wiederherstellung.

## Isolation und Spielstände

Der V2.1-Code bestand vor Beginn 135 Tests und die TypeScript-Prüfung. Git hatte keine Commits. V2 wurde gezielt als Basiscommit `9d9f1a3` gesichert; unbeteiligte Archive, Berichte und `stars.gif` wurden nicht übernommen. `v2-preserved` bewahrt die Ausgangsbasis; der Hauptordner bleibt auf V2. Während der V3-Arbeit kamen auf `master` separat die Commits `82740f7` (Projektregeln) und `f2a1c7e` hinzu. Die geprüften Spielcode-Dateien wurden dabei nicht verändert. Diese zusätzlichen Änderungen wurden nicht in V3 übernommen. Die andere Sitzung „Github“ war bei Prüfung inaktiv.

V3 liegt in der regulären Git-Arbeitskopie `.worktrees/v3-step1` auf `v3/step-1-floors`. Die App konnte wegen unterschiedlicher Windows-Dateieigentümer keine verwaltete Arbeitskopie erstellen; die reguläre Arbeitskopie wurde erfolgreich angelegt. Vorhandene Bibliotheken werden über eine nicht versionierte Windows-Verknüpfung verwendet. Pakete wurden nicht geändert; Vite-Caches liegen nur in V3.

V3 schreibt ausschließlich LocalStorage-Schlüssel `stillalive-v3-step1`, Formatversion 3. Die alten Schlüssel `eclipse-survivor-v2` und `eclipse-survivor-v1` bleiben unverändert. Unter derselben Browseradresse zugängliche Einstellungen, Profile und Historie können als Grundlage gelesen werden; inkompatible Endless-Runden werden nicht konvertiert. Da Browser pro Adresse/Port getrennt speichern, beginnt die neue V3-Adresse normalerweise mit einem eigenen Profil. Alte V2-Runden bleiben an ihrer bisherigen Adresse fortsetzbar.

V3 sichert Etage, Uhren, offene Truhenkarten, gewählten Bonus, Build, Gegner, Zufallszustand und Ressourcengutschriften. Fortsetzen einer laufenden Etage beginnt pausiert; offene Levelkarten, Truhe und Bereitschaftsbildschirm bleiben in ihrem Zustand. Autosave alle 15 aktiven Sekunden sowie bei Abschluss, Auswahl, Etagenstart und weiteren wichtigen Übergängen. Keine erneute Bonuswahl oder doppelte Goldgutschrift nach Laden.

## Selbst testen

Zwei Etagen spielen, genau einen Truhenbonus wählen und Waffen/Passives/Leben auf Etage 2 vergleichen. Während des Kampfes, mit offener Truhe und nach der Auswahl „Speichern & Hauptmenü“ nutzen, Seite neu laden und fortsetzen. Danach Niederlage und Neustart prüfen. Rückmeldung zu Schwierigkeit und Etagenrhythmus geben.

## Grenzen und Umfang

Klassen und längere Etagenfolgen sind provisorisch ausbalanciert; der Jäger schneidet bei den einfachen Bots weiterhin schlechter ab. Keine neue Etagenkarte, Ausrüstung, Shops, Echtgeldfunktionen, Crafting, Basis, Idle-Systeme, Klassen oder Waffen. Vorhandene V2-Menüs bleiben nutzbar; es gibt derzeit keine neue Bossfragmentquelle oder V3-Schwierigkeitsfreischaltung. Desktopsteuerung und bisherige Leistungsgrenzen bleiben erhalten.

Prüfergebnisse stehen in **QA_V3_STEP1.md**. **Schritt 2 wurde nicht begonnen.**
