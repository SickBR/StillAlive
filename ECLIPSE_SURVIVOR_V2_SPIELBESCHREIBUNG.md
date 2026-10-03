# ECLIPSE SURVIVOR – Endless Edition 2.1

Vollständige Beschreibung des implementierten Spiels. Stand: 3. Oktober 2026. Diese Datei beschreibt den neuen Stand; die alte 12-Minuten-Fassung befindet sich in archive/eclipse-v1.zip. Werte sind Testwerte, kein Beleg für perfektes Balancing.

## 1. Spielidee und Ablauf

Ein lokales Dark-Fantasy-Hordenspiel mit drei Klassen, automatischen Angriffen, acht Angriffsslots und acht passiven Slots. Eine Runde läuft unbegrenzt weiter. Wiederkehrende Bosse geben Seelenfragmente und beenden die Runde nicht. Tod oder freiwilliges Beenden schließen die Runde ab; verdiente Ressourcen bleiben. Speichern & Hauptmenü bewahrt die ganze Runde zum Fortsetzen.

Hauptschleife: Klasse und Vorlage wählen → Schwierigkeit wählen → kämpfen und XP sammeln → drei Karten vergleichen → Bosse besiegen → Gold/Fragmente ausgeben → andere Startwaffen und Builds ausprobieren. Die erste Schwierigkeit ist frei; jede weitere wird nach 30 Minuten Überleben in der vorherigen freigeschaltet.

WASD/Pfeile: Bewegung; Leertaste: Ausweichschritt; Escape/P: Pause; 1–3 oder Maus: Karte wählen. Desktop-Tastatur und Maus erforderlich. Angriffe zielen automatisch. Es gibt keine gegnerischen Fernkampfprojektile.

## 2. Klassen und Basiswerte

ATK ist ein Multiplikator auf den Basisschaden der jeweiligen Waffe. Bewegung und Reichweite verwenden Weltpixel; Angriffstempo wird über Sekunden beschrieben.

| Klasse | LP | DEF | Tempo | ATK | Krit | Eigene Mechanik |
| --- | --- | --- | --- | --- | --- | --- |
| Schattenkrieger | 125 | 14 | 166 | ×1 | 5 % | Nähe nährt Wut: bis zu +30 % Schaden. Ansturm trifft im Nahbereich. |
| Rissmagier | 98 | 4 | 172 | ×1.08 | 5 % | Jeder sechste Zauber überlädt: +65 % Schaden. Dash entfesselt Frost. |
| Nachtjäger | 110 | 7 | 184 | ×1 | 12 % | Markiere Ziele mit Treffern. Ab dem dritten Treffer +30 % Schaden. |

Alle Figuren haben Idle-, Lauf-, Treffer- und Todesframes sowie Links-/Rechtswechsel. Der Krieger startet standardmäßig mit Langschwert, der Magier mit Feuerstab und der Jäger mit Jagdbogen. Die anderen zwei kostenlosen Klassenwaffen sind sofort im Build-Editor wählbar.

Krieger-Wut steigt bei mindestens drei Gegnern innerhalb von 160 Einheiten um 50 Prozentpunkte pro Sekunde; sonst fällt sie um 24 Punkte. Volle Wut gibt +30 % Schaden, mit Berserker mehr. Magier überladen jede sechste direkte Waffenaktivierung; Orbitkontakte zählen nicht als Zauberaktivierung. Jäger markieren durch direkte Treffer, maximal dreimal; bereits markierte Ziele erhalten +30 % Schaden.

## 3. Schaden, Verteidigung und Heilung

Direkter Schaden = Waffen-ATK × Klassen-ATK × (1 + 0,02 × permanente ATK-Stufe + 0,08 × Pakt-Stufe + 0,01 × Run-Macht) × Wutfaktor × Finsternisfaktor × Kritfaktor × Markierungsfaktor × (1 − gegnerische DEF-Reduktion).

DEF-Reduktion = DEF / (100 + DEF), maximal 70 %. Spieler-DEF setzt sich aus Klassenbasis, permanentem Bonus, Obsidianschutz und Wächter zusammen. Krit-Grundfaktor 1,7; Krit-Chance aus Klasse, Passives, permanenten Werten und Waffenbonus, Basis-Chance maximal 75 %. Präzision fügt gegen markierte Ziele weitere Chance hinzu. Jagdbogen: +5 %, Langbogen: +12 %, Schattenbogen: +8 % Waffen-Krit-Chance.

Nach erlittenem Schaden: 0,55 Sekunden Unverwundbarkeit. Ausweichschritt: 8 Sekunden Cooldown, 0,28 Sekunden Bewegung mit Tempo 560 und 0,43 Sekunden Unverwundbarkeit; 38 Basisschaden im Radius 135 am Ausgangspunkt. Magier verlangsamen dabei zusätzlich für 1,4 Sekunden. Seelenkrieger verkürzt den Cooldown.

Levelaufstiege heilen 1 LP. Lebens-Passives heilen ihren Zuwachs. Normale, nicht beschworene Gegner haben 0,8 % Chance auf einen 10-LP-Drop. Bosse lassen 20 LP fallen. Regeneration und Seelenraub sind begrenzt. Seelenraub benutzt ein gemeinsames Heilbudget: 0,18 LP/s je passiver Stufe, +0,35 LP/s bei mindestens einer heilenden Waffe, +0,3 LP/s bei mindestens einem Orbit auf Stufe 8. Bis zu zwei Sekunden Budget können gespeichert werden. Treffer heilen höchstens 0,4 LP und nur aus diesem Budget.

## 4. Waffen

21 Klassenwaffen und fünf universelle Angriffe. Pro Klasse: sieben eigene Waffen + fünf universelle + 13 Passives = 25 unterschiedliche Optionen. Drei Klassenwaffen sind kostenlos, die übrigen werden mit Gold freigeschaltet. Ein Kauf verstärkt die Waffe nicht automatisch und fügt sie nicht ungewollt einem bestehenden Kartenpool hinzu.

Alle Waffen haben acht Stufen einschließlich Freischaltung. Für Stufe L gilt der interne Skalierungsrang R = 1 + (L − 1) × 11/7. Schaden = Basis × (1 + 0,2 × (R − 1)); Cooldown = Basis / (1 + 0,065 × (R − 1)); Reichweite = Basis × (1 + 0,035 × (R − 1)). Die volle Stärke der früheren zwölf Stufen bleibt erreichbar. Projektile, Orbits und Ketten bekommen auf 3/5/8 jeweils eine zusätzliche Einheit. Alle Angriffe belegen dieselben acht Angriffsslots.

| Waffe | Klasse | ATK | Cooldown s | Reichweite | Startanzahl | Preis Gold | Verhalten |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shadow Blade | Universell | 27 | 1.2 | 108 | 1 | 0 | Breiter Nahkampfhieb |
| Arcane Orb | Universell | 12 | 0.65 | 92 | 1 | 0 | Rotierende Runenklingen |
| Firebolt | Universell | 23 | 1.6 | 480 | 1 | 120 | Automatisch gezielte Geschosse · Verbrennung |
| Frost Nova | Universell | 19 | 3.8 | 150 | 1 | 120 | Flächenwelle um dich · Verlangsamung |
| Lightning Chain | Universell | 22 | 2.5 | 350 | 3 | 120 | Springt zwischen nahen Zielen |
| Langschwert | Schattenkrieger | 29 | 1.05 | 104 | 1 | 0 | Breiter Nahkampfhieb |
| Streitaxt | Schattenkrieger | 47 | 1.65 | 98 | 1 | 0 | Breiter Nahkampfhieb |
| Speer | Schattenkrieger | 26 | 0.85 | 178 | 1 | 0 | Lange, schmale Stoßbahn |
| Kriegshammer | Schattenkrieger | 55 | 2.25 | 110 | 1 | 180 | Flächenwelle um dich |
| Doppelklingen | Schattenkrieger | 16 | 0.48 | 76 | 1 | 300 | Breiter Nahkampfhieb · Blutung |
| Blutklinge | Schattenkrieger | 24 | 1.05 | 100 | 1 | 450 | Breiter Nahkampfhieb · Blutung · heilt bei Treffern (begrenzt) |
| Seelensense | Schattenkrieger | 38 | 1.5 | 150 | 1 | 650 | Breiter Nahkampfhieb |
| Feuerstab | Rissmagier | 28 | 1.25 | 490 | 2 | 0 | Automatisch gezielte Geschosse · Verbrennung · kleine Aufprallexplosion |
| Froststab | Rissmagier | 22 | 1.1 | 480 | 1 | 0 | Automatisch gezielte Geschosse · Verlangsamung |
| Arkanstab | Rissmagier | 25 | 1.55 | 350 | 2 | 0 | Springt zwischen nahen Zielen |
| Blitzstab | Rissmagier | 21 | 1.8 | 390 | 4 | 180 | Springt zwischen nahen Zielen |
| Meteorstab | Rissmagier | 65 | 3.4 | 480 | 1 | 300 | Flächenschlag am Gegner · Verbrennung |
| Schattenstab | Rissmagier | 36 | 2.1 | 160 | 1 | 450 | Flächenwelle um dich |
| Seelenbuch | Rissmagier | 15 | 0.65 | 115 | 2 | 650 | Rotierende Runenklingen · heilt bei Treffern (begrenzt) |
| Jagdbogen | Nachtjäger | 34 | 0.8 | 550 | 1 | 0 | Automatisch gezielte Geschosse |
| Kurzbogen | Nachtjäger | 16 | 0.52 | 410 | 1 | 0 | Automatisch gezielte Geschosse |
| Armbrust | Nachtjäger | 53 | 1.6 | 450 | 1 | 0 | Lange, schmale Stoßbahn |
| Langbogen | Nachtjäger | 47 | 1.65 | 620 | 1 | 180 | Lange, schmale Stoßbahn |
| Giftbogen | Nachtjäger | 17 | 0.95 | 470 | 1 | 300 | Automatisch gezielte Geschosse · Gift |
| Splitterbogen | Nachtjäger | 14 | 1.25 | 390 | 3 | 450 | Automatisch gezielte Geschosse |
| Schattenbogen | Nachtjäger | 27 | 1.2 | 520 | 1 | 650 | Automatisch gezielte Geschosse · heilt bei Treffern (begrenzt) |

### Mechanische Meilensteine

| Angriffsart | Meilensteine |
| --- | --- |
| projectile | 3: +1 Geschoss / Durchschlag · 5: erneut verstärkt · 8: Aufprallexplosion |
| orbit | 3 / 5 / 8: +1 Orbit · 8: Heilbudget +0,3 LP/s |
| chain | 3 / 5 / 8: +1 Sprung · 8: entferntere Sprünge |
| sweep | 3: breiterer Bogen · 5: Rundumschlag · 8: Rückstoß |
| thrust | 3: breitere Bahn · 5: Rüstung ignoriert · 8: Rückstoß |
| nova | 3: 0,4 s Verlangsamung · 5: Rückstoß · 8: +30 % Schaden |
| meteor | 3: größerer Einschlag · 5: Rückstoß · 8: zweiter Einschlag |

Bogenschützen-Projektile durchdringen bereits zu Beginn einen Gegner zusätzlich. Alle Projektile fliegen entlang der beim Abschuss berechneten Richtung; sie sind nicht lenkend. Der Feuerstab hat ab Stufe 1 eine Aufprallexplosion mit Radius 55 und 50 % Zusatzschaden auf weitere Ziele. Auf Stufe 8 wächst ihr Radius auf 85. Andere Projektile erhalten ihre Explosion erst auf Stufe 8, mit 35 % Schaden.

Orbitkontakte werden jeden Simulationsschritt geprüft. Pro Waffe und Ziel gilt ein eigener Treffercooldown. Ketten treffen ein Ziel je Aktivierung höchstens einmal; jeder weitere Sprung verursacht 5 Prozentpunkte weniger Schaden, mindestens 55 %. Meteorstab trifft einen Bereich am Ziel, auf Stufe 8 zwei Bereiche an unterschiedlichen Zielen, falls verfügbar. Speer, Armbrust und Langbogen treffen eine schmale Bahn, keine begrenzte Zielzahl.

## 5. Zustände und Kombinationen

Verbrennung, Blutung und Gift halten drei Sekunden; erneutes Anwenden frischt auf und behält den höheren DPS-Wert. Kein unbegrenztes Stapeln desselben Zustands. Basis-DPS: 20 % Waffenbasis bei Verbrennung/Blutung, 30 % bei Gift, multipliziert mit (1 + 0,15 × Skalierungsrang R), Statusbonus und gegebenenfalls Inferno. Die normale Schadens-/DEF-Formel gilt weiterhin; Statusschaden kritet nicht erneut.

Frost verlangsamt um 40 %, Bosse nur um 15 %, für 1,2 + 0,04 × Skalierungsrang R Sekunden. Wiederholte Treffer können die Verlangsamung auffrischen. Es gibt keinen vollständigen Dauerstun.

Aschenkatalysator lässt brennende Gegner beim Tod im Radius 75 explodieren. Direkte Treffer und laufender Brandschaden dürfen diese Explosion auslösen; erzeugter Explosionsschaden löst keine weitere Generation aus. Projektil-Endstufenexplosionen lösen ebenfalls keine eigenen Folgeketten oder neuen Zustände aus.

## 6. Passive Fähigkeiten

Maximal acht gleichzeitig, jede bis Stufe 8. Beschreibungen gelten pro Stufe.

| Passiv | Wirkung | Freischaltung Gold |
| --- | --- | --- |
| Dunkler Pakt | +8 % Schaden | 0 |
| Rasende Runen | +6 % Angriffstempo | 0 |
| Nebeltritt | +4 % Bewegungstempo | 0 |
| Eisernes Herz | +15 maximale LP, heilt 15 LP | 0 |
| Blutwurzel | +0,18 LP pro Sekunde | 0 |
| Tödlicher Blick | +3 % Krit-Chance | 0 |
| Grenzenlos | +6 % Reichweite | 0 |
| Obsidianschutz | +6 DEF; abnehmende Schadensreduktion | 0 |
| Seelenruf | +18 % Sammelradius, +4 % XP | 0 |
| Henkerzeichen | +12 Prozentpunkte Krit-Schaden | 120 |
| Rissglück | +3 % Gold und bessere Seltenheitschancen | 120 |
| Aschenkatalysator | +12 % Statusschaden; brennende Gegner explodieren beim Tod (ohne Folgeketten) | 200 |
| Seelenraub | Heilt bei Treffern; +0,18 LP/s maximales Heilbudget | 200 |

## 7. Erfahrung und Karten

XP bis zum nächsten Level = floor(20 + 8 × Level + 2,4 × Level^1,28). Kristalle müssen eingesammelt werden. Magnet und Seelenjäger erhöhen den tatsächlichen XP-Ertrag.

Zwischen zwei Kartenwahlen liegen mindestens 20 Sekunden aktive Spielzeit; währenddessen gesammelte XP werden vollständig aufbewahrt. Der HUD zeigt bei vollem Balken die verbleibende Wartezeit. Der erste Levelaufstieg benötigt 30 XP. Bei Levelaufstieg pausiert das Spiel und bietet drei Karten aus dem erlaubten Pool: eine Waffe und ein Passiv, sofern beide Kategorien verfügbar sind, sowie eine freie dritte Wahl. Bereits volle Slots erlauben nur weitere Stufen vorhandener Fähigkeiten. Gewöhnliche Karten geben die angezeigte Stufe; seltene zusätzlich +1 % Run-Schaden, epische +2 %. Grundwahrscheinlichkeit: 8 % episch, weitere 22 % selten. Glück verschiebt die Grenzen, episch höchstens 25 %, episch+selten höchstens 65 %.

Falls weniger als drei normale Optionen verbleiben, werden wiederholbare Angebote ergänzt: +1 % Run-Schaden, +4 maximale LP mit entsprechender Heilung oder sofort 20 LP Heilung. Sobald der erlaubte Build vollständig ausgebaut ist, folgen automatische Run-Meisterschaftslevel: +1 % Run-Schaden je Level, alle fünf zusätzlich +4 maximale LP. Keine weiteren Kartenunterbrechungen. Ein bewusst kleiner Kartenpool erreicht diesen Zustand früher.

## 8. Gegner

Die Werte in der Tabelle sind Basen vor Zeit- und Schwierigkeitsmultiplikatoren. Gold entspricht auf Anfänger ohne Boni dem Tabellenwert. Schwierigkeit und Glück multiplizieren die Belohnung. Beschworene Helfer geben kein Gold.

| Gegner | LP | DEF | Tempo | Kontakt-ATK | XP | Radius | Regulär ab s | Goldbasis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Aschenpilger | 40 | 0 | 75 | 12 | 2 | 14 | 0 | 1 |
| Rissläufer | 25 | 0 | 145 | 9 | 2 | 10 | 0 | 1 |
| Gruftkoloss | 180 | 5 | 55 | 24 | 7 | 24 | 100 | 4 |
| Panzerwächter | 95 | 35 | 72 | 15 | 5 | 19 | 75 | 3 |
| Bluthetzer | 68 | 0 | 105 | 17 | 4 | 16 | 55 | 2 |
| Rissbeschwörer | 100 | 0 | 59 | 10 | 8 | 15 | 160 | 5 |
| Rissritter | 290 | 18 | 99 | 24 | 15 | 20 | 240 | 9 |
| DER ENTTHRONTE | 1600 | 12 | 73 | 30 | 95 | 40 | 240 | 120 |
| DIE BRUTMUTTER | 1900 | 5 | 64 | 25 | 110 | 40 | 480 | 150 |
| DER HENKER | 2200 | 20 | 85 | 36 | 130 | 38 | 720 | 180 |

- Aschenpilger: langsame Verfolger, bilden die Hordengrundlage.
- Rissläufer: schwache, schnelle Nahkämpfer; bereits unter den Startgegnern.
- Gruftkoloss: großer, langsamer Gegner mit viel Leben und hohem Kontaktschaden.
- Panzerwächter: gepanzerter Nahkämpfer; physische Blockade durch den Körper, keine unsichtbare Schutz-Aura.
- Bluthetzer: visuell angekündigter Ansturm, auf eine beim Start festgelegte Richtung. 0,85 Sekunden Vorbereitung, 0,5 Sekunden Sprint mit Tempo 320. Regulär ab Sekunde 55. Gleichzeitig höchstens 4 + floor(Zeit / 1200); zusätzliche gewürfelte Hetzer werden Pilger.
- Rissbeschwörer: hält etwas Abstand und beschwört alle sieben Sekunden drei Läufer, soweit Platz und Sicherheitsabstand bestehen. Höchstens drei normale Beschwörer; weitere werden Panzerwächter. Die Kinder geben kein Gold und nur 15 % XP, keine Heil-Drops.
- Rissritter: starke gepanzerte Elite mit Ansturm. Ab Sekunde 240.
- Der Entthronte: schwerer Nahkämpfer mit sichtbarem Stampfbereich, Radius 165, 1,1 Sekunden Vorwarnung. Unter halben LP schnellerer Angriffstakt.
- Die Brutmutter: beschwört sechs Nahkampfhelfer, dazu Stampfbereich mit Radius 120.
- Der Henker: schneller Boss-Ansturm mit Tempo 400, feste Richtung, sichtbare Vorwarnung.

Bosse erscheinen alle 240 Sekunden in dieser Dreierreihenfolge, ohne vorhandene Gegner zu löschen. Besiegte Bosse beenden die Runde nicht. Bosswarnungen werden aufgehoben, wenn der verursachende Boss stirbt. Mehrere lebende Bosse können sich ansammeln; die HUD-Leiste zeigt den ersten noch lebenden, ein Richtungshinweis führt zu ihm.

## 9. Wellen und Zeitsteigerung

Zu Beginn stehen 18 Gegner in zwei Gruppen in 850–1030 Einheiten Abstand, davon drei Läufer. Der Nachschub beginnt nach sechs Sekunden. Normale Gegner erscheinen in 850–1030 Einheiten Entfernung; eine Entfernung von mindestens 849 wird auch an Arenarändern erzwungen. Weit zurückgebliebene normale Gegner werden ab 1.200 Entfernung mit derselben sicheren Abstandskontrolle an den aktuellen Kampf herangeführt, ohne zusätzliche Einheiten zu erzeugen.

Normaler Spawnabstand = max(0,20; 0,68 − Zeit / 5000) Sekunden. Unter der Zielpopulation werden zwei statt einer Einheit nachgeschoben. Die Population wird begrenzt, damit frühe schwache Builds nicht sofort die späte 300er-Horde bekommen. Zielpopulationen steigen linear zwischen Zeitpunkten: 24 bei Start, 30 nach 1 Minute, 56 nach 3, 88 nach 5, 140 nach 8, 175 nach 15, 220 nach 30 und 260 nach 60 Minuten. Keine plötzlichen Populationssprünge an diesen Übergängen. Normale Population höchstens Ziel +15, globale Grenze 300 einschließlich Bossen. Diese Zahl ist kein garantierter Bildschirmbestand; Tötungsrate und Entfernung bestimmen den sichtbaren Bestand.

Erstmals nach 75 Sekunden und danach alle 45 Sekunden bildet sich eine Gruppe mit einer breiten Fluchtlücke, keine Gegner direkt am Spieler. Ab 30 Minuten mehr Panzerwächter/Hetzer; ab 60 Minuten Beschwörer/Rissritter; ab 120 Minuten Rissritter/Panzerwächter. An den Kartenrändern können Teile der Formation entfallen. Warnhinweis und Gegnerbewegung machen den Ereignisbeginn sichtbar.

Normale Gegner-LP = Basis × (1 + Zeit/3200 + (Zeit/4800)^1,2) × Schwierigkeits-LP. Boss-LP = Basis × (1 + max(0,Zeit−240)/1000) × Schwierigkeit. Kontaktschaden = Basis × (1 + Zeit/3600) × Schwierigkeit. Bewegung wächst sehr langsam, höchstens um weitere 25 % aus der Zeitkurve.

## 10. Die Finsternis

Jeder 90-Sekunden-Zyklus endet mit 20 Sekunden Finsternis. Alle Klassen erhalten +12 % Schaden, Ausweichschritt zusätzlich +30 %; Gegner laufen 12 % schneller. Visuelles Licht, Hinweis und Countdown wechseln mit. Ein optionales Risiko-/Belohnungsritual ist nicht implementiert.

## 11. Schwierigkeiten und Arenen

| Schwierigkeit | Arena | LP × | Schaden × | Tempo × | Belohnung × |
| --- | --- | --- | --- | --- | --- |
| Anfänger | Verlassenes Kloster | 1 | 1 | 1 | 1 |
| Veteran | Verfluchter Wald | 1.35 | 1.25 | 1.06 | 1.4 |
| Albtraum | Blutkatakomben | 1.85 | 1.55 | 1.1 | 1.9 |
| Hölle | Brennendes Ödland | 2.5 | 1.9 | 1.14 | 2.6 |
| Abgrund | Ewige Finsternis | 3.4 | 2.35 | 1.18 | 3.5 |

Alle Arenen teilen ein 3200 × 2400 großes begehbares Gebiet. Die Umgebungen unterscheiden sich durch fünf eigene Bodentexturen, Farbgebung und Dekorationszusammenstellung: Klosterstein, Waldgrund, Katakombenplatten, glühende Risse, Abgrundkristalle. Die Dekoration ist nicht kollidierend. Es sind keine fünf separat entworfenen Levelgeometrien.

## 12. Gold, Freischaltungen und permanente Werte

Gold wird beim Tod eines Gegners gutgeschrieben, nicht als zusätzlicher Sammelgegenstand. Gold = Tabellenbasis × Schwierigkeit × (1 + 0,03 × Glückspassiv + 0,01 × permanentes Glück). Bossbasis erhält zusätzlich min(120, max(0, floor(Zeit/240) − 1) × 10) Gold. Der erste Boss gibt auf Anfänger ohne Glück 120 Gold. Beschworene Gegner geben kein Gold. Gold wird mit Nachkommastellen im Run akkumuliert und als ganze Einheiten gesichert.

Seelenfragmente gibt es ausschließlich für besiegte Bosse: floor((3 + min(4, floor(Zeit/1200))) × Schwierigkeit). Der erste Boss gibt auf Anfänger drei Fragmente, genug für die erste Meisterschaft. Der Zeitbonus endet bei sieben Basisfragmenten. Sie finanzieren nur Meisterschaften.

Permanente Werte: zehn Stufen je Wert, Kosten der nächsten Stufe = 75 + 60 × aktuelle Stufe + 15 × aktuelle Stufe² Gold. Boni gelten für neue Runden; laufende oder gespeicherte Runden behalten ihre beim Start festgehaltenen Grundwerte.

| Wert | Pro Stufe |
| --- | --- |
| ATK | +2 % Schaden |
| DEF | +2 Verteidigung |
| Leben | +5 maximale LP |
| Tempo | +1 % Bewegung |
| Krit-Chance | +0,5 Prozentpunkte |
| Krit-Schaden | +3 Prozentpunkte |
| Glück | +1 % Gold / Seltenheit |

## 13. Klassen-Meisterschaften

Neun Zweige, jeweils fünf Stufen, klassengebunden. Kosten der fünf Stufen: 3 / 5 / 8 / 12 / 18 Fragmente, insgesamt 46 pro Zweig. Bis zu drei freigeschaltete Zweige werden pro Vorlage ausgewählt; kostenloser Wechsel. Die aktuelle kompakte Fassung besitzt drei auswählbare Effekte pro Klasse, keine verzweigten Talentbäume mit Einzelknoten.

| Klasse | Meisterschaft | Wirkung pro Stufe |
| --- | --- | --- |
| Schattenkrieger | Berserker | Pro Stufe +6 % Schaden bei voller Wut. |
| Schattenkrieger | Wächter | Pro Stufe +4 DEF und +3 maximale LP. |
| Schattenkrieger | Seelenkrieger | Pro Stufe −0,3 s Dash-Abklingzeit und +10 % Dash-Schaden. |
| Rissmagier | Inferno | Pro Stufe +15 % Verbrennungs- und Explosionsschaden. |
| Rissmagier | Sturm | Pro Stufe +5 % Angriffstempo. |
| Rissmagier | Arkan | Pro Stufe +15 Prozentpunkte Überladungsschaden. |
| Nachtjäger | Präzision | Pro Stufe +2 % Krit-Chance gegen markierte Gegner. |
| Nachtjäger | Pfeilhagel | Pro Stufe +20 % Chance auf einen Zusatzpfeil. |
| Nachtjäger | Seelenjäger | Pro Stufe +6 % XP und +6 % Sammelradius. |

## 14. Hauptmenü und HUD

- Zuflucht: eigene Pixel-Art-Ruine mit Mondlicht, animiertem Charakter in der Mitte und Klassenwechsel direkt darunter.
- Spiel starten: direkter Start unter dem Charakter; bei gespeicherter Runde stattdessen Runde fortsetzen. Die rechts gezeigte Arena öffnet die Schwierigkeitsauswahl.
- Einstellungen oben rechts, daneben Gold-/Fragmentanzeige mit Zugang zur Preisübersicht.
- Talismane: eigener Menüpunkt für alle passiven Kräfte und ihre Freischaltungen.
- Belohnungen & Preise: normaler Gegnerertrag, erste Bossbelohnung je Schwierigkeit, Freischaltpreise und sämtliche permanenten Kostenstufen.
- Charaktere: Klassenmechanik und Basiswerte; Klasse wählt ihre bestehende Vorlage.
- Waffenkammer: alle 26 Waffen und 13 Passives, Preise, Werte, Beschreibungen und Kaufstatus.
- Grundwerte: permanente Goldverbesserungen mit Stufen und Kosten.
- Meisterschaften: Klassenboni, Fragmentkosten und Maximalstufen.
- Build-Editor: Startwaffe, zugelassener Angriffspool, passiver Pool, ausgerüstete Meisterschaften und Name. Bis zu zwölf gespeicherte Vorlagen, überschreiben oder als neue Vorlage speichern. Startwaffe bleibt automatisch im Pool.
- Chronik: Runs, Bosse, Kills, Rekorde und die letzten 20 abgeschlossenen Runden mit Belohnungen.
- Einstellungen: Lautstärke, Bildschirmerschütterung, Zahlen, Partikel.
- Steuerung: erklärt Kampf, Fortschritt und Speichern.

HUD: LP/XP, Level, Zeit, Kills, ATK-Multiplikator, DEF, Krit, acht Angriffsslots mit Stufen und Cooldownleisten, acht passive Slots, Klassenmechanik, Run-Gold/-Fragmente, Boss-/Finsterniscountdown, Bossname/LP, Ausweichschritt-Cooldown. Zahlen für Gegnerwerte und Freischaltungen stehen zusätzlich im Shop beziehungsweise in dieser Datei.

Pause: Weiterkämpfen, Einstellungen, Speichern & Hauptmenü, freiwillig beenden. Ergebnis: Zeit, Kills, Level, Bosse, verdiente Ressourcen, benutzte Waffen und Neustart. Ein gespeicherter Run muss fortgesetzt oder ausdrücklich beendet werden, bevor ein neuer ihn ersetzen kann.

## 15. Speicherung und Migration

Ein versionierter LocalStorage-Eintrag eclipse-survivor-v2 enthält Einstellungen, Profil, Ressourcen, Vorlagen, Chronik und Rundensnapshot. Snapshots aus Version 2.0 werden auf acht Waffenstufen umgerechnet: neue Stufe = ceil(1 + (alte Stufe − 1) × 7/11); unbesetzte Waffen bleiben auf 0. Ressourcen, Freischaltungen, Chronik und Belohnungsgutschriften bleiben erhalten. Bereits gewählte Kartenpools werden nicht automatisch erweitert. Neu kostenlose Rüstung und Sammelradius können im Build-Editor hinzugefügt werden. Ein vorhandener eclipse-survivor-v1-Spielstand liefert Einstellungen und historische Statistiken; er bleibt unverändert erhalten. Frühere Siege bleiben als historische Zahl gespeichert, werden in der neuen Chronik nicht als Endless-Siege ausgegeben.

Autosave alle 15 Simulationssekunden, nach einer Kartenwahl, bei Pause/Fokusverlust, Bossbelohnung und pagehide. Gespeichert werden unter anderem Position, HP, Waffen, Zustände, Gegner, Beute, Geschosse samt bereits getroffener Ziele, Wellen-/Bosszeiten, offene Karten, Zufallszustand und bereits gutgeschriebene Run-Belohnungen. Das Fortsetzen beginnt pausiert beziehungsweise bei der noch offenen Kartenwahl.

Rundensnapshot und zugehörige Profilgutschrift werden zusammen in einem einzigen LocalStorage-Schreibvorgang abgelegt. Dadurch zahlt das erneute Laden desselben Checkpoints keine zweite Belohnung. Fehlerhafte Einzelwerte werden validiert, kaputte Rundensnapshots verworfen; das gültige Profil bleibt möglichst erhalten. Gesperrter oder voller Speicher zeigt einen Hinweis und lässt die aktuelle Sitzung spielbar. Ein abruptes Browser-/Systemende kann Fortschritt seit dem letzten erfolgreichen Checkpoint verlieren. Mehrere gleichzeitig geöffnete Tabs desselben Profils sind nicht als synchrones Mehrbenutzersystem ausgelegt.

## 16. Grafik, Audio und Technik

70 lokale PNG-Dateien aus eigener programmatischer Pixel-Art; keine Fremdpakete, Webfonts, Emoji-Figuren oder kostenpflichtigen Dienste. 13 Figuren-Sheets mit elf Frames, fünf Böden, Props, Icons, Licht und Menükulisse. Sprite-/Textobjekte werden wiederverwendet. Trefferblitze, Zahlen, Waffenbögen, direkte Stoßlinien, Kettenblitze, Statusfarben, Todesframes, Bosswarnungen, Schatten und Finsternislicht. Alle Sounds sind lokale Web-Audio-Synthese. Herkunft und CC0-Freigabe: ASSETS.md.

TypeScript, Phaser 3.90, Vite. Reine Simulation in src/core, Darstellung in src/render, DOM-Oberfläche separat. Räumliches Raster für Nähe-/Kollisionsabfragen; Projektilkollisionen prüfen die pro Schritt zurückgelegte Strecke. Gegnerlimit 300, Beutelimit 380 mit XP-Zusammenführung. Darstellung höchstens 280 Projektilbilder, 180 Effekte, 55 Schadenslabels, Ereignispuffer 900. Die Projektilbildgrenze unterdrückt keinen simulierten Angriffsschaden. Projektillebensdauer und Angriffsslots begrenzen die tatsächlichen Geschosse. Proc-Generationen sind explizit begrenzt.

Zeitschritt maximal 0,05 Sekunden. Unter sehr langsamen Frames kann Spielzeit gegenüber Echtzeit zurückbleiben. Kein Versprechen von 60 FPS auf jedem Gerät; Software-Rendering ist deutlich langsamer. QA-Zugriff nur im Entwicklungsbuild mit ?qa=1, nicht im Produktionsbuild.

## 17. Tests und offene Grenzen

Die aktuellen Messwerte stehen in QA.md und reports/*-v21.json. Automatische Tests prüfen alle Waffen auf Stufen 1/3/5/8, Passives, Meisterschaften, Klassen, DEF, Karten-/Slotregeln, Zustände, Pause, Kontakt, Tod, Beenden, Bosswiederkehr, Ökonomie, Korruptionsfälle, Migration, identische Wiederaufnahme und doppelte Gutschriften. Browserprüfungen bedienen die echten Menüs und Kontrollen; Extremzustände werden teilweise über einen Entwicklungszugang gesetzt.

27 neue Profil-Botläufe vergleichen drei Klassen bei drei Seeds und drei Strategien (Klassenwaffen, universelle Waffen, defensiver Build mit Ausweichen vor Anstürmen). Sie protokollieren Upgrade-Zeiten, Gold und Level pro Minute. Sie sind reproduzierbare Vergleichsszenarien, keine menschlichen Erfolgsquoten. Zusätzlich gibt es dreistündige Belastungsläufe je Klasse mit maximalen Builds und künstlicher Unverwundbarkeit: Diese prüfen Speicher-/Zustandsgrenzen, keine legitime Überlebensdauer.

Noch echtes Playtesting nötig: Verhältnis Nahkampf/Fernkampf, frühe Lernkurve, Boss-Erreichbarkeit für neue Spieler, Shoptempo, alle fünf Schwierigkeiten und unterhaltsame 2–3-Stunden-Builds. Die fünf Umgebungen nutzen dieselbe Arenageometrie. Es gibt keinen Mehrspieler, keine Cloud-Saves, kein Touch-Steuerungssystem und keine unbegrenzten prozeduralen Talentbäume.

## 18. Start und Übergabe

Voraussetzung Node.js ab 22.12 mit npm. Einmalige Installation benötigt Zugang zur Paketregistrierung. Laufzeit lädt nur lokale Ressourcen.

```sh
npm install
npm run dev
```

Produktionsbuild: npm run build. Vorschau: npm run preview. Tests: npm test. Klassen-Bots: npm run simulate. Belastung: npm run test:endurance. Browserprüfung bei laufendem Devserver: npm run test:browser. Produktionsprüfung bei laufender Vorschau: npm run test:production. Browserprüfungen benötigen lokal installiertes Chromium/Playwright oder CHROME_PATH.

Für einen ChatGPT-Designchat: Diese Datei ist der implementierte Ist-Stand. Bitte vorgeschlagene Änderungen deutlich davon trennen, konkrete Werte vor/nach angeben und menschliches Spielgefühl nicht aus Bot-Survival allein ableiten. Das ursprüngliche Problem war ein zu leichter Einstieg; die neue Fassung soll gefordert, lesbar und ohne erzwungenen Grind spielbar bleiben.
