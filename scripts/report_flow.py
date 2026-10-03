from pathlib import Path
import json, statistics

root=Path('reports')
scenarios=[('Klassenwaffen','simulation-native-v21'),('Universell','simulation-v21'),('Defensiv','simulation-defensive-v21')]
reports=[(name,json.loads((root/(file+'.json')).read_text(encoding='utf-8'))) for name,file in scenarios]
all_runs=[r for _,data in reports for r in data['results']]
def table(headers,rows):
 return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(map(str,row))+' |' for row in rows)
def time(seconds):return f'{seconds//60:02d}:{seconds%60:02d}'
costs=[75+60*l+15*l*l for l in range(10)]
balance='''# Balancing und Spielfluss – Version 2.1

Stand: 3. Oktober 2026. Umgesetzte Änderungen, keine Behauptung perfekter Balance.

## Entscheidungen

- Waffen haben acht Stufen insgesamt (Freischaltung inklusive). Ihre bisherige maximale Stärke bleibt erhalten; mechanische Meilensteine liegen auf 3, 5 und 8.
- XP-Bedarf je Level: `floor(20 + 8 × Level + 2,4 × Level^1,28)`. Der erste Aufstieg kostet 30 XP statt bisher 13. Zwischen Kartenwahlen liegen mindestens 20 Sekunden **aktive Spielzeit**. Pause beschleunigt das nicht; überschüssige XP werden gespeichert.
- Drei Angebote enthalten eine Waffe und einen passiven Talisman, soweit beide im erlaubten Pool noch verfügbar sind. Das dritte Angebot ist frei. Keine Beschränkung auf nur einen bestimmten Build.
- 13 vorhandene Passives werden im eigenen Talismane-Menü sichtbar. Neun sind kostenlos, einschließlich Obsidianschutz und Seelenruf. Maximal acht gleichzeitig, jeweils bis Stufe 8. Bestehende selbst gewählte Pools bleiben erhalten und sind im Build-Editor anpassbar.
- Start: 18 Gegner in zwei entfernten Gruppen, 850–1030 Weltpixel Abstand. Nachschub ab Sekunde 6. Zufällige Spawns und zurückgeführte Gegner halten auch am Kartenrand mindestens 849 Pixel Abstand. Beschworene Helfer und Formationen haben eigene Regeln.
- Die Zielpopulation steigt stufenlos zwischen 24 bei Start, 30 nach 1 Minute, 56 nach 3, 88 nach 5, 140 nach 8, 175 nach 15, 220 nach 30 und 260 nach 60 Minuten. Die tatsächliche Zahl hängt von Kills und Spawntakt ab; absolute Grenze 300.
- Gefährliche Gegner kommen gestaffelt: Hetzer ab 55 s, Panzerwächter ab 75 s, Koloss ab 100 s, Beschwörer ab 160 s, Rissritter ab 240 s. Erste Formation nach 75 s, Boss nach 240 s.

## Ökonomie auf Anfänger, ohne Glücksboni

| Quelle / Kauf | Gold | Fragmente |
| --- | --- | --- |
| Aschenpilger / Rissläufer | 1 | 0 |
| Hetzer / Wächter / Koloss / Beschwörer / Ritter | 2 / 3 / 4 / 5 / 9 | 0 |
| Erster Boss, innerhalb seines ersten Zeitfensters besiegt | 120 | 3 |
| Beschworene Helfer | 0 | 0 |
| Universelle Kaufwaffe | 120 | 0 |
| Vier kaufbare Klassenwaffen | 180 / 300 / 450 / 650 | 0 |
| Kaufbare Talismane | 120 oder 200 | 0 |
| Meisterschaft, Stufe 1–5 | 0 | 3 / 5 / 8 / 12 / 18 |

Drei Klassenwaffen je Klasse, Shadow Blade und Arcane Orb sind kostenlos. Freischaltungen erweitern die Auswahl; sie kaufen keine Waffenstufen für laufende Runden. Änderungen an permanenten Werten gelten beim nächsten Start.

Der erste Boss finanziert die erste Meisterschaft. Ein kompletter Meisterschaftszweig kostet 46 Fragmente. Später geben Bosse einen gedeckelten Zeitbonus: bis zu +120 Basisgold und bis zu sieben Basisfragmente. Beschwörungen erzeugen keine unendliche Geldquelle.

Kosten pro permanentem Grundwert (je zehn Stufen):

'''+table(['Neue Stufe','Gold'],[(i+1,c) for i,c in enumerate(costs)])+f'''

Insgesamt {sum(costs)} Gold pro voll ausgebautem Grundwert. Die günstigen ersten Stufen ermöglichen früh eine Entscheidung; späte Stufen wachsen quadratisch im Preis. Schwierigkeit multipliziert Belohnungen mit 1 / 1,4 / 1,9 / 2,6 / 3,5. Fragmente werden je Boss abgerundet; Gold wird im Run mit Nachkommastellen gesammelt und als ganze Einheiten gesichert.

## Messungen und Grenzen

27 Läufe mit frischen Profilen, drei Klassen, drei Seeds und drei Strategien; keine künstlichen Lebenspunkte oder Unverwundbarkeit. Die einfache Steuerung läuft überwiegend im Kreis und sammelt nur nahe Kristalle. „Defensiv“ bevorzugt zusätzlich Schutz/Heilung und versucht Ansturmlinien zu verlassen.

'''
rows=[]
for name,data in reports:
 for cls in ['warrior','mage','archer']:
  runs=[r for r in data['results'] if r['classId']==cls]
  starts=[r['choiceTimes'][0] for r in runs if r['choiceTimes']]
  rows.append([name,cls,f"{min(r['time'] for r in runs)//60}:{min(r['time'] for r in runs)%60:02d}–{max(r['time'] for r in runs)//60}:{max(r['time'] for r in runs)%60:02d}",f"{min(r['level'] for r in runs)}–{max(r['level'] for r in runs)}",round(statistics.median(starts),1),f"{min(r['gold'] for r in runs)}–{max(r['gold'] for r in runs)}",sum(r['bosses'] for r in runs)])
balance+=table(['Strategie','Klasse','Überlebenszeit','Endlevel','Erste Wahl: Median s','Gold pro Lauf','Bosse gesamt'],rows)
balance+='''

In keinem Vergleichslauf liegen zwei Kartenwahlen weniger als 20 Sekunden auseinander (mit numerischer Rundungstoleranz). Das ist eine technische Garantie, keine Aussage darüber, ob sich 20 Sekunden für jeden Spieler gut anfühlen. Erste Karten und Goldtempo unterscheiden sich weiter zwischen Klassen und Spielweisen.

**Offener Befund:** Die Kreis-Bots sterben als Magier und Jäger meist deutlich früher als als Krieger; sie besiegen in dieser Messreihe keinen Boss. Trotz höherer Kills und Goldeinnahmen sind ihre Überlebenszeiten nicht gleichwertig. Defensive Auswahl allein beseitigt das nicht. Deshalb sind Klassenbalance und Boss-Erreichbarkeit ausdrücklich nicht als gelöst bewertet. Die Ergebnisse werden nicht durch künstliche Unverwundbarkeit geschönt.

Nächster menschlicher Playtest: je Klasse drei frische Läufe; erste Wahl, Zahl der Karten bis Minute 4, Schadensquellen, erster Boss und erste sinnvolle Shopentscheidung notieren. Dabei besonders prüfen, ob die Karte alle 20 Sekunden noch zu häufig ist und ob defensive Karten rechtzeitig angeboten werden. Preisänderungen getrennt von Kampfwerten bewerten.

Reproduktion: `npm run simulate`, `npm run simulate -- --universal`, `npm run simulate -- --defensive`. Detaildaten inklusive Minutenständen und Kartenzeiten: `reports/simulation-native-v21.json`, `reports/simulation-v21.json`, `reports/simulation-defensive-v21.json`. Technische QA: QA.md.
'''
Path('BALANCING_2_1.md').write_text(balance,encoding='utf-8')

browser=json.loads((root/'browser-v21.json').read_text(encoding='utf-8'));endurance=json.loads((root/'endurance-v21.json').read_text(encoding='utf-8'));production=json.loads((root/'production-v21.json').read_text(encoding='utf-8'))
assert not browser['errors'] and not browser['failed'] and not production['errors']
qa='''# Qualitätssicherung – Endless Edition 2.1

Stand: 3. Oktober 2026. Dateien mit `v21` gehören zu diesem Stand; ältere Berichte bleiben als Vergleich erhalten.

## Technische Prüfungen

- TypeScript-Prüfung und Produktionsbuild erfolgreich.
- **135 automatisierte Kernprüfungen bestanden.** Alle 26 Waffen auf 1/3/5/8, Passives und Meisterschaften, Stufen-/Slotgrenzen, Schaden/DEF/Krit/Status/Heilbudgets, Projektil-/Orbitkontakte, Klassen, Gegnerkontakt, Bosse und Belohnungen, Pause/Bewegung/Dash/Tod/Beenden, Speicherfehler, identische Wiederaufnahme und idempotente Gutschriften.
- Neu geprüft: XP-Aufbewahrung bei mindestens 20 Sekunden Kartenabstand, Pause zählt nicht mit, gemischte Kartenkategorien, acht Waffenstufen mit gleichem Endwert, zwölf-zu-acht-Migration ohne Ressourcenverlust, Ersetzen alter inzwischen voller Upgrade-Angebote, Kaufgrenzen/Preistreppen/Bossfragmente, sichere Spawnpunkte an allen Rändern/Ecken und stetige Populationskurve.
- **Chromium-UI-Prüfung bestanden:** alle Menüs einschließlich Talismane/Preisübersicht, zentrale Klassenwahl, Einstellungen, Vorlagen bearbeiten/kopieren, echte Waffen-/Talisman-/Meisterschafts-/Grundwertkäufe, Schwierigkeitssperren, Tastaturbewegung, Dash, Pause, Speichern → Neuladen → Fortsetzen, Levelkarten, Bosswarnung/Belohnung, weiterlaufende Runde, Niederlage, Beenden und fünf Neustarts. Keine JavaScript-Fehler oder fehlenden Dateien.
- **Produktionsprüfung bestanden:** echtes Spielstart-Menü, etwa 15 Sekunden Tastaturbewegung, Pause; Entwicklungszugriff fehlt, keine externen Laufzeitanfragen, keine JavaScript-Fehler.
- Menü-Screenshots bei 1440 × 900, 1024 × 768 und 390 × 844. Desktopansichten visuell geprüft; bei schmaler Ansicht bleibt die Arena über den Fußbereich erreichbar. Das Spiel benötigt weiterhin Tastatur/Maus.

Quellen: `reports/core-tests-v21.txt`, `reports/browser-v21.json`, `reports/production-v21.json`, `reports/screenshots/v21-*.png`.

Späte Boss-, Währungs- und Lastzustände werden im Entwicklungsbrowser teilweise gezielt gesetzt. Das prüft Funktionen, belegt aber kein reguläres Erspielen dieser Zustände.

## Kampfsimulationen und Wirtschaft

27 Läufe mit frischen Profilen, 20 Hz, drei Klassen × drei Seeds × drei Strategien. Keine künstlichen Boni. Kartenzeiten, Level/Gold pro Minute, Kills, Bosskills und Überlebensdauer protokolliert. Vollständige Ergebnisse und kritische Auswertung in **BALANCING_2_1.md**. Magier-/Jäger-Bots sterben weiter früher als Krieger; kein Nachweis gleicher Klassenschwierigkeit oder perfekten Goldtempos.

## Drei Stunden pro Klasse: Stabilität

Drei Läufe mit je 10.800 Simulationssekunden, maximalen Builds und absichtlich künstlichem Leben/Unverwundbarkeit. Das ist ein technischer Belastungstest, kein legitimer Überlebensnachweis.

'''+table(['Klasse','Sekunden','Max. Gegner','Max. Geschosse','Max. Beute','Checkpoints'],[[r['classId'],r['simulatedSeconds'],r['maxEnemies'],r['maxShots'],r['maxLoot'],r['checkpoints']] for r in endurance['results']])
qa+='''

Kein Simulationsabbruch, keine ungültigen Schadenswerte; alle 54 Checkpoints wiederherstellbar. Bosswerte und Belohnungen zusätzlich für alle fünf Schwierigkeiten ausgewertet. Bericht: `reports/endurance-v21.json`.

## Browserleistung

'''+f"Chromium mit SwiftShader-Software-Rendering: Lastaufbau mit 300 Gegnern und acht ausgebauten Waffen. Median {browser['performance']['medianFrameMs']:.1f} ms, 95. Perzentil {browser['performance']['p95FrameMs']:.1f} ms, ungefähr 20 FPS. Kein Hardware-GPU-Benchmark und keine 60-FPS-Garantie. Beim Messzeitpunkt lebten {browser['performance']['enemies']} Gegner; Treffer verändern die Population während der Messung.\n\nDarstellungsobjekte nach fünf Neustarts: {', '.join(map(str,browser['restartObjects']))}; kein Wachstum in diesem Test. Kein mehrstündiger Browser-Heap-Test. Gegner-/Beute-/Darstellungslimits und wiederverwendete Objekte sind aktiv.\n"
qa+='''
## Grenzen

Klassenverhältnis, erste Bosskämpfe, Wirtschaft über mehrere Runden, spätere Schwierigkeiten und unterhaltsame Langzeitrunden benötigen menschliches Playtesting. Fünf Umgebungsvarianten teilen dieselbe Arenageometrie. Keine Touchsteuerung, Cloud oder Mehrtab-Synchronisation. Bei abruptem Prozessende können bis zu 15 Spielsekunden seit dem letzten erfolgreichen Autosave fehlen.

Start: `npm install`, `npm run dev`. Produktion: `npm run build`, `npm run preview`. Browserprüfungen benötigen laufenden Server und lokal vorhandenes Chromium oder `CHROME_PATH`.
'''
Path('QA.md').write_text(qa,encoding='utf-8')
print('Updated balancing and QA reports from measured results.')
