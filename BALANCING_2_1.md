# Balancing und Spielfluss – Version 2.1

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

| Neue Stufe | Gold |
| --- | --- |
| 1 | 75 |
| 2 | 150 |
| 3 | 255 |
| 4 | 390 |
| 5 | 555 |
| 6 | 750 |
| 7 | 975 |
| 8 | 1230 |
| 9 | 1515 |
| 10 | 1830 |

Insgesamt 7725 Gold pro voll ausgebautem Grundwert. Die günstigen ersten Stufen ermöglichen früh eine Entscheidung; späte Stufen wachsen quadratisch im Preis. Schwierigkeit multipliziert Belohnungen mit 1 / 1,4 / 1,9 / 2,6 / 3,5. Fragmente werden je Boss abgerundet; Gold wird im Run mit Nachkommastellen gesammelt und als ganze Einheiten gesichert.

## Messungen und Grenzen

27 Läufe mit frischen Profilen, drei Klassen, drei Seeds und drei Strategien; keine künstlichen Lebenspunkte oder Unverwundbarkeit. Die einfache Steuerung läuft überwiegend im Kreis und sammelt nur nahe Kristalle. „Defensiv“ bevorzugt zusätzlich Schutz/Heilung und versucht Ansturmlinien zu verlassen.

| Strategie | Klasse | Überlebenszeit | Endlevel | Erste Wahl: Median s | Gold pro Lauf | Bosse gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| Klassenwaffen | warrior | 5:22–12:30 | 10–11 | 47.8 | 424–641 | 1 |
| Klassenwaffen | mage | 1:52–2:26 | 6–8 | 18.5 | 261–405 | 0 |
| Klassenwaffen | archer | 2:25–3:21 | 7–10 | 29.4 | 504–778 | 0 |
| Universell | warrior | 5:39–28:34 | 7–12 | 47.8 | 192–1197 | 4 |
| Universell | mage | 2:09–2:38 | 7–8 | 18.5 | 318–479 | 0 |
| Universell | archer | 2:01–2:55 | 6–9 | 29.4 | 323–686 | 0 |
| Defensiv | warrior | 6:43–23:53 | 6–11 | 47.8 | 173–764 | 2 |
| Defensiv | mage | 1:52–4:14 | 6–10 | 18.5 | 261–556 | 0 |
| Defensiv | archer | 2:42–4:07 | 8–11 | 29.4 | 431–747 | 0 |

In keinem Vergleichslauf liegen zwei Kartenwahlen weniger als 20 Sekunden auseinander (mit numerischer Rundungstoleranz). Das ist eine technische Garantie, keine Aussage darüber, ob sich 20 Sekunden für jeden Spieler gut anfühlen. Erste Karten und Goldtempo unterscheiden sich weiter zwischen Klassen und Spielweisen.

**Offener Befund:** Die Kreis-Bots sterben als Magier und Jäger meist deutlich früher als als Krieger; sie besiegen in dieser Messreihe keinen Boss. Trotz höherer Kills und Goldeinnahmen sind ihre Überlebenszeiten nicht gleichwertig. Defensive Auswahl allein beseitigt das nicht. Deshalb sind Klassenbalance und Boss-Erreichbarkeit ausdrücklich nicht als gelöst bewertet. Die Ergebnisse werden nicht durch künstliche Unverwundbarkeit geschönt.

Nächster menschlicher Playtest: je Klasse drei frische Läufe; erste Wahl, Zahl der Karten bis Minute 4, Schadensquellen, erster Boss und erste sinnvolle Shopentscheidung notieren. Dabei besonders prüfen, ob die Karte alle 20 Sekunden noch zu häufig ist und ob defensive Karten rechtzeitig angeboten werden. Preisänderungen getrennt von Kampfwerten bewerten.

Reproduktion: `npm run simulate`, `npm run simulate -- --universal`, `npm run simulate -- --defensive`. Detaildaten inklusive Minutenständen und Kartenzeiten: `reports/simulation-native-v21.json`, `reports/simulation-v21.json`, `reports/simulation-defensive-v21.json`. Technische QA: QA.md.
