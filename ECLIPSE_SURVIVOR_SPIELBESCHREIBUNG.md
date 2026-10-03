> Historische Übergabe vor dem Endless-Umbau. Der aktuelle implementierte Stand steht in **ECLIPSE_SURVIVOR_V2_SPIELBESCHREIBUNG.md**. Die folgenden alten Werte bleiben als Referenz erhalten.

# ECLIPSE SURVIVOR – vollständige Spielbeschreibung und Übergabe an ChatGPT

Stand: 3. Oktober 2026. Sprache: Deutsch.

**Zweck:** Diese einzelne Datei beschreibt das vorhandene Spiel so, dass ein neuer Chat ohne die frühere Unterhaltung daran weiterdenken kann. Sie enthält Spielregeln, Zahlen, Gegner, Waffen, Menüs, technische Grenzen und die geplante neue Richtung.

**Wichtige Unterscheidung:** Teil A beschreibt den tatsächlich implementierten Stand im Projekt. Teil B beschreibt das vom Entwickler eingereichte Game Design Document Version 0.2 und die dazugehörige Designbewertung. Die Versionsnummer 0.2 des Konzepts bedeutet nicht, dass dessen Funktionen bereits im Spiel vorhanden sind.

**Aktuelles Feedback des Entwicklers:** „Das Spiel ist von Anfang an zu einfach.“ Mehr früher Gegnerdruck und langfristige Build-Entwicklung sind zentrale Wünsche.

# Teil A – tatsächlich implementiertes Spiel

## 1. Idee, Umfang und Ziel

ECLIPSE SURVIVOR ist ein 2D-Dark-Fantasy-Survival-Spiel mit automatischen Angriffen. Der Spieler bewegt einen Shadow Knight durch das zerbrochene Kloster, besiegt Schattenwesen, sammelt Erfahrung und wählt Verbesserungen.

Vorhanden sind ein spielbarer Charakter, eine Arena, fünf Waffen, sieben passive Verbesserungen, fünf normale Gegnerarten und ein Boss. Die Zielspieldauer beträgt ungefähr zwölf Minuten.

Der Boss erscheint nach elf Minuten. Sein Tod beendet den Run mit einem Sieg. Null Spieler-LP bedeuten Niederlage. Minute zwölf allein löst keinen Sieg aus; der Boss kann auch danach noch bekämpft werden. Es gibt aktuell keinen auswählbaren Endless-Modus.

Alle Waffen und passiven Werte werden für jeden neuen Run zurückgesetzt. Dauerhaft bleiben nur Einstellungen und Statistiken erhalten.

## 2. Steuerung und Arena

| Eingabe | Funktion |
| --- | --- |
| WASD oder Pfeiltasten | Bewegen |
| Leertaste | Schattenschritt |
| Escape oder P | Pause/Fortsetzen |
| 1, 2 oder 3 | Upgrade-Karte wählen |
| Maus | Menüs und Upgrade-Karten bedienen |

Angriffe sind automatisch; es gibt kein manuelles Zielen. Kurze Leertasten-Tipps werden bis zum nächsten Spielschritt gepuffert. Bei Fokusverlust beziehungsweise verborgenem Browser-Tab pausiert ein laufender Kampf automatisch.

Die Arena ist 3.200 × 2.400 Spieleinheiten groß. Der Spieler startet bei Position 1.600 / 1.200 und bleibt mindestens 32 Einheiten von den Außenkanten entfernt. Die Kamera folgt ihm. Säulen, Grabsteine und Bäume sind dekorativ und blockieren die Bewegung nicht.

Die Darstellung hat eine Basisauflösung von 1.280 × 720. Sie wird an das Fenster angepasst. Einheiten für Entfernungen entsprechen Weltkoordinaten, nicht unbedingt sichtbaren Bildschirmpixeln.

## 3. Shadow Knight: Leben, Angriff, Verteidigung und Bewegung

| Wert | Startwert | Bedeutung |
| --- | ---: | --- |
| Aktuelle/maximale LP | 110 / 110 | Keine automatische LP-Steigerung allein durch höhere Charakterlevel |
| Startwaffe | Shadow Blade Stufe 1 | 30 Schaden pro getroffenem Gegner |
| Allgemeiner Schadensfaktor | 1,0 | Multipliziert den jeweiligen Waffenschaden |
| Separater ATK-Wert | Nicht vorhanden | Angriff ergibt sich aus Waffe und passiven Faktoren |
| DEF/Rüstung | Nicht implementiert | Keine Rüstungsformel und keine dauerhafte Schadensreduktion |
| Widerstände | Nicht implementiert | Keine Feuer-, Frost-, Blitz- oder Schattenresistenzen |
| Bewegung | 172 Einheiten/s | Diagonale Bewegung ist normalisiert |
| Kritische Trefferchance | 5 % | Gilt auch für Schattenschritt-Schaden |
| Kritischer Multiplikator | 2,0 | Doppelter Schaden; bisher nicht separat steigerbar |
| Regeneration | 0 LP/s | Erst durch Blutwurzel verfügbar |
| Sammelradius | 76 Einheiten | Zieht XP und Heilgegenstände heran |
| Kontakttrefferradius des Spielers | 12 Einheiten | Für Gegnerkontakt und feindliche Geschosse |
| Unverwundbarkeit nach Schaden | 0,65 s | Weitere Treffer verursachen in dieser Zeit keinen Schaden |

Schaden und LP werden intern als Dezimalzahlen berechnet. Schadenszahlen werden gerundet, Spieler-LP im HUD aufgerundet. Sichtbare Werte können deshalb geringfügig vom internen Wert abweichen.

**Schattenschritt:**

- Abklingzeit: 8 Sekunden.
- Sprintdauer: 0,32 Sekunden.
- Sprintgeschwindigkeit: 580 Einheiten/s.
- Unverwundbarkeit beim Auslösen: 0,47 Sekunden.
- Theoretische Sprintstrecke: ungefähr 186 Einheiten, begrenzt durch Arenaränder und Spielschritte.
- Schadenswelle: einmalig am Ausgangspunkt, Radius 140, 55 Basisschaden.
- Richtung: aktuelle beziehungsweise zuletzt gespeicherte Bewegungsrichtung; zu Spielbeginn nach unten.
- Während der Finsternis 50 % mehr Basisschaden.
- Kein eigener Upgrade-Baum und keine durch normalen Waffen-Haste verkürzte Abklingzeit.

## 4. Waffen und ihre vollständigen Stufenwerte

Alle fünf Waffen können gleichzeitig getragen werden. Die vier zusätzlichen Waffen werden über Level-up-Karten freigeschaltet. Es gibt keinen Waffenwechsel und keine Ausrüstungsgegenstände außerhalb dieses Systems.

Die Tabelle zeigt **Waffenwerte ohne passive Boni, Finsternis und kritische Treffer**. „Anzahl“ bedeutet bei Orb Kugeln, bei Firebolt Geschosse pro Angriff und bei Lightning Chain maximale Ziele. Bei Blade und Nova steht sie für eine Auslösung, die mehrere Gegner treffen kann.

| Waffe | Stufe | Schaden | Intervall in s | Reichweite/Radius | Anzahl |
| --- | ---: | ---: | ---: | ---: | ---: |
| Shadow Blade | 1 | 30 | 1,05 | 102 | 1 |
| Shadow Blade | 2 | 39,6 | 0,963 | 109,65 | 1 |
| Shadow Blade | 3 | 49,2 | 0,89 | 117,3 | 1 |
| Shadow Blade | 4 | 58,8 | 0,827 | 124,95 | 1 |
| Shadow Blade | 5 | 68,4 | 0,772 | 132,6 | 1 |
| Shadow Blade | 6 | 78 | 0,724 | 140,25 | 1 |
| Arcane Orb | 1 | 16 | 0,55 | 88 | 1 |
| Arcane Orb | 2 | 21,12 | 0,505 | 94,6 | 2 |
| Arcane Orb | 3 | 26,24 | 0,466 | 101,2 | 2 |
| Arcane Orb | 4 | 31,36 | 0,433 | 107,8 | 3 |
| Arcane Orb | 5 | 36,48 | 0,404 | 114,4 | 3 |
| Arcane Orb | 6 | 41,6 | 0,379 | 121 | 4 |
| Firebolt | 1 | 26 | 1,55 | 480 | 1 |
| Firebolt | 2 | 34,32 | 1,422 | 516 | 1 |
| Firebolt | 3 | 42,64 | 1,314 | 552 | 2 |
| Firebolt | 4 | 50,96 | 1,22 | 588 | 2 |
| Firebolt | 5 | 59,28 | 1,14 | 624 | 3 |
| Firebolt | 6 | 67,6 | 1,069 | 660 | 3 |
| Frost Nova | 1 | 20 | 4,2 | 148 | 1 |
| Frost Nova | 2 | 26,4 | 3,853 | 159,1 | 1 |
| Frost Nova | 3 | 32,8 | 3,559 | 170,2 | 1 |
| Frost Nova | 4 | 39,2 | 3,307 | 181,3 | 1 |
| Frost Nova | 5 | 45,6 | 3,088 | 192,4 | 1 |
| Frost Nova | 6 | 52 | 2,897 | 203,5 | 1 |
| Lightning Chain | 1 | 29 | 2,5 | 350 | 4 |
| Lightning Chain | 2 | 38,28 | 2,294 | 376,25 | 5 |
| Lightning Chain | 3 | 47,56 | 2,119 | 402,5 | 6 |
| Lightning Chain | 4 | 56,84 | 1,969 | 428,75 | 7 |
| Lightning Chain | 5 | 66,12 | 1,838 | 455 | 8 |
| Lightning Chain | 6 | 75,4 | 1,724 | 481,25 | 9 |

### Shadow Blade

Weiter automatischer Hieb zum nächsten Gegner. Trifft Gegner innerhalb der Waffenreichweite in einem Bogen von ungefähr 247 Grad. Gegner näher als 38 Einheiten können unabhängig vom Winkel getroffen werden.

Die Reichweitenprüfung verwendet den Abstand zum Gegnermittelpunkt. Es gibt keinen zusätzlichen Rückstoß, keine Blutung und keine Rüstungsdurchdringung. In der Finsternis wird der Schaden mit 1,35 multipliziert.

### Arcane Orb

Kugeln kreisen mit 2,4 Radiant/s um den Charakter. Die Reichweite bezeichnet den Umlaufradius. Schaden entsteht bei Berührung, nicht automatisch an allen Gegnern innerhalb des Kreises.

Jeder Gegner besitzt eine gemeinsame Orb-Treffersperre. Mehrere Kugeln können denselben Gegner nicht gleichzeitig mehrfach innerhalb dieses Intervalls treffen. Mehr Kugeln verbessern vor allem die Abdeckung.

Die tatsächliche Trefferprüfung verwendet eine Vorabfrage mit Radius 43 und anschließend Gegner-Radius plus 19. Das kann bei sehr großen Gegnern relevant sein: Die Vorabfrage begrenzt auch dort die effektive Trefferdistanz.

### Firebolt

Feuerprojektile werden auf nahe Gegner verteilt. Sie verfolgen ihr zunächst ausgewähltes Ziel mit sanfter Richtungsanpassung. Nach dem Tod dieses Ziels erhalten sie aktuell kein neues Ziel.

- Bewegungsgeschwindigkeit ungefähr 360 Einheiten/s.
- Lebensdauer 2,2 Sekunden.
- Trefferradius 9.
- Ab Stufe 4 kann ein Geschoss zwei verschiedene Gegner treffen.
- Keine Explosion, kein Brennen und keine Bodenfläche im aktuellen Stand.
- Die Tabellenreichweite ist die Entfernung zur Zielauswahl; Geschosse können danach weiterfliegen.

### Frost Nova

Trifft alle erfassten Gegner um den Spieler. Reduziert ihre Geschwindigkeit auf 45 % des normalen Werts, also um 55 %.

Verlangsamungsdauer = 2,2 + 0,22 × Waffenstufe Sekunden.

Das ergibt 2,42 Sekunden auf Stufe 1 und 3,52 Sekunden auf Stufe 6. Erneute Treffer setzen die Dauer wieder auf den aktuellen Wert. Kein Einfrieren, keine Schadensresistenz und keine besondere Boss-Immunität.

Technische Besonderheit: Der Ansturm des Rissritters setzt seine Geschwindigkeit gesondert auf 265; während dieser Phase greift die normale Verlangsamungsberechnung nicht.

### Lightning Chain

Beginnt beim nächsten Gegner und springt von dort zum jeweils nächsten noch nicht getroffenen lebenden Gegner.

- Entfernung für Folgesprünge: 180 × passiver Reichweitenfaktor.
- Ein Gegner wird innerhalb einer Kette höchstens einmal getroffen.
- Schadensfaktor pro Zielindex i: 1 − 0,055 × i, beginnend bei i = 0.
- Das erste Ziel erhält 100 %, das zweite 94,5 %, das dritte 89 % usw.
- Beim neunten Ziel bleiben 56 % des ersten Grundtreffers.
- Jeder Treffer kann unabhängig kritisch werden.
- Kein Betäuben und keine dauerhafte elektrische Aufladung.

### Formeln

Für Waffenstufe L von 1 bis 6:

    Waffenschaden = Grundschaden × (1 + 0,32 × (L − 1))
    Waffenintervall = Grundintervall / (1 + 0,09 × (L − 1))
    Waffenreichweite = Grundreichweite × (1 + 0,075 × (L − 1))

Passive Faktoren:

    Schadensfaktor = 1 + 0,12 × Dunkler-Pakt-Stufe
    Angriffstempofaktor = 1 + 0,09 × Rasende-Runen-Stufe
    Reichweitenfaktor = 1 + 0,10 × Grenzenlos-Stufe

Der endgültige Treffer wird aus Waffenschaden, allgemeinem Schadensfaktor, gegebenenfalls Finsternis-/Kettenfaktor und kritischem Faktor berechnet. Es gibt keine gegnerische DEF, die diesen Wert vermindert.

Das endgültige Angriffsintervall ist das Waffenintervall geteilt durch den passiven Angriffstempofaktor. Passive Stufen addieren sich innerhalb ihres Faktors; Waffen- und passive Faktoren werden miteinander kombiniert.

Ein einfacher Schaden/Intervall-Wert ist kein verlässlicher Gesamt-DPS-Vergleich, weil Flächentreffer, Zielzahl, Bewegung, Orb-Kontakt und Kettensprünge unterschiedlich wirken.

## 5. Passive Fähigkeiten

Jede passive Fähigkeit ist maximal fünfmal wählbar.

| Fähigkeit | Pro Stufe | Bei Stufe 5 |
| --- | --- | --- |
| Dunkler Pakt | +12 % allgemeiner Schaden | Faktor 1,60 |
| Rasende Runen | +9 % Angriffstempo | Faktor 1,45 |
| Nebeltritt | +8 % Bewegung | +40 %; insgesamt 240,8 Einheiten/s |
| Eisernes Herz | +20 maximale LP und 20 LP Heilung | +100 maximale LP; insgesamt 210 reguläre maximale LP |
| Blutwurzel | +0,35 LP/s | 1,75 LP/s |
| Tödlicher Blick | +7 Prozentpunkte Krit-Chance | 40 % Gesamtchance einschließlich 5 % Basis |
| Grenzenlos | +10 % Waffenreichweite und +25 % Sammelradius | Reichweitenfaktor 1,50; Sammelradius 171 |

Keine passiven Upgrades für DEF, Glück, kritischen Multiplikator, Projektilgeschwindigkeit, Gold oder Erfahrung vorhanden.

210 LP sind das reguläre Maximum mit Eisernem Herz. Späte Erholungsangebote können darüber hinaus zusätzliche maximale LP geben.

## 6. Gegner: Grundwerte und tatsächliche Skalierung

**Alle Gegner haben derzeit keine implementierte DEF/Rüstung, keine Regeneration, keine Blockchance und keine elementaren Widerstände.** Ein Tank ist hier durch seine LP widerstandsfähig.

| Gegner | Interne ID | Frühestens verfügbar | Basis-LP | Basis-Kontaktschaden | Bewegung/s | Radius | XP |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Aschenpilger | hollow | 0:00 | 28 | 10 | 43 | 15 | 2 |
| Rissläufer | crawler | 0:35 | 17 | 7 | 103 | 11 | 2 |
| Gruftwächter | brute | 1:40 | 145 | 20 | 32 | 24 | 8 |
| Leerseher | seer | 2:50 | 52 | 12 | 54 | 15 | 5 |
| Rissritter | reaper | 4:30 | 225 | 18 | 64 | 19 | 14 |
| Der Entthronte | boss | 11:00 | 6.200 | 26 | 43 | 43 | 200 |

**Die Tabellenwerte sind Grundwerte.** Bei der Erzeugung eines Gegners zur Zeit t in Sekunden gilt:

    LP normaler Gegner = Basis-LP × (1 + t / 520)
    Schaden aller Gegner = Basis-Schaden × (1 + t / 1600)

Die LP-Skalierung gilt nicht für den Boss. Seine 6.200 LP bleiben fest, sein Kontaktschaden wird jedoch ebenfalls zeitabhängig berechnet. Die Werte eines bereits erzeugten Gegners wachsen danach nicht laufend weiter.

Beispiele bei frühestmöglicher Erzeugung:

| Gegner | LP ungefähr | Kontaktschaden ungefähr |
| --- | ---: | ---: |
| Aschenpilger bei 0:00 | 28 | 10 |
| Rissläufer bei 0:35 | 18,14 | 7,15 |
| Gruftwächter bei 1:40 | 172,88 | 21,25 |
| Leerseher bei 2:50 | 69 | 13,28 |
| Rissritter bei 4:30 | 341,83 | 21,04 |
| Boss bei 11:00 | 6.200 | 36,73 |

Kontakt verursacht Schaden, sobald die Entfernung kleiner als Gegner-Radius plus 12 ist. Gegner besitzen dafür keine separate Nahkampf-Angriffsanimation mit eigenem Trefferintervall. Die 0,65 Sekunden Spieler-Unverwundbarkeit begrenzen die Trefferfolge.

### Verhalten

- **Aschenpilger:** Langsamer direkter Verfolger; zuerst allein vertreten.
- **Rissläufer:** Schneller, schwacher Verfolger. Seine normale Geschwindigkeit 103 ist immer noch geringer als die Spielerbasis 172.
- **Gruftwächter:** Großer, sehr langsamer Verfolger mit vielen LP und hohem Kontaktschaden.
- **Leerseher:** Nähert sich bis auf etwa 320 Einheiten. Hält zwischen 220 und 320 Abstand. Unter 220 weicht er mit 65 % seiner normalen Bewegungsgeschwindigkeit zurück. Schießt bei weniger als 640 Entfernung alle 3,1 Sekunden in die zum Schusszeitpunkt berechnete Spielerrichtung. Geschossgeschwindigkeit 190; der Schaden entspricht seinem skalierten Schadenswert. Die Geschosse verfolgen den Spieler nach dem Abschuss nicht.
- **Rissritter:** Direkter Verfolger mit angekündigtem Ansturm. Innerhalb von 390 Entfernung ungefähr alle fünf Sekunden möglich. Insgesamt 0,85 Sekunden Ansturmzustand: ungefähr 0,35 Sekunden Vorbereitung und 0,5 Sekunden Sprint mit Geschwindigkeit 265 in eine festgelegte Richtung. Kein eigener zusätzlicher Ansturmschaden; es gilt Kontaktschaden.
- Gegner haben gegenseitige Abstandskorrekturen. Normale Gegner, die weiter als 1.250 Einheiten vom Spieler entfernt sind, werden ungefähr 730 Einheiten um ihn herum neu positioniert.

## 7. Boss im Detail

Der Entthronte erscheint bei 11:00 nahe dem Spieler, ungefähr 380 Einheiten seitlich und 100 Einheiten darüber, unter Berücksichtigung der Arenagrenzen.

Beim Eintritt werden bestehende normale Gegner und feindliche Geschosse entfernt. Dafür gibt es keine Kills oder XP. Bereits liegende Beute bleibt erhalten. Der Nachschub läuft danach langsamer weiter.

| Eigenschaft | Phase 1 | Phase 2 |
| --- | --- | --- |
| Auslöser | Nach Erscheinen | Unter 50 % Boss-LP oder ab 12:00 |
| Angriffspause nach einer Salve | 3,7 s | 2,7 s |
| Radiale Geschosse je Salve | 12 | 18 |
| Markierte Flächeneinschläge je Salve | 2 | 4 |
| Geschossgeschwindigkeit | 155 | 155 |
| Geschossradius | 7 | 7 |
| Geschosslebensdauer | 5 s | 5 s |
| Geschossschaden | 65 % seines skalierten Schadenswerts | Unverändert |
| Flächenschaden | 24 | 24 |
| Einschlagsradius | 65 | 65 |
| Vorwarnung für Einschläge | 1,35 s | 1,35 s |

Bei Erzeugung genau zur elften Minute verursacht ein Bossgeschoss ungefähr 23,87 Schaden. Der erste Angriff ist nach ungefähr 2,5 Sekunden möglich.

Einschläge werden nahe der Spielerposition ausgewählt, jeweils bis zu 140 Einheiten Abweichung in X und Y. Sichtbare Markierungen warnen davor. Der Boss bewegt sich zum Spieler. Ein Richtungspfeil erscheint bei größerem Abstand.

Es gibt nur diesen einen Bosstyp und einen Boss pro Run. Ein lebender Spieler gewinnt unmittelbar nach dem Boss-Tod; es gibt keine weitere Welle.

## 8. Nachschub, Gegnerverteilung und Finsternis

Vier Aschenpilger stehen beim Start auf einem Ring mit Radius 290. Der erste reguläre Nachschub ist nach ungefähr 0,3 Sekunden fällig.

Reguläre Spawnpositionen liegen normalerweise 610 bis 780 Einheiten entfernt und werden an die Arena angepasst. Sehr nahe Randpositionen werden auf die gegenüberliegende Richtung verlegt.

Vor dem Boss gilt:

    Spawnintervall in Sekunden = max(0,13; 0,88 − Zeit / 850)

Bis einschließlich Minute sechs entsteht ein Gegner je Spawnereignis. Nach Minute sechs entstehen zwei. Alle Spawns werden durch die Gegnerobergrenze begrenzt. Beim Boss gilt wieder ein Gegner je 0,65 Sekunden.

Die Gegner werden zufällig nach folgendem tatsächlichen Pool gewählt:

| Zeitraum | Aschenpilger | Rissläufer | Gruftwächter | Leerseher | Rissritter |
| --- | ---: | ---: | ---: | ---: | ---: |
| 0:00 bis vor 0:35 | 100 % | 0 % | 0 % | 0 % | 0 % |
| 0:35 bis vor 1:40 | 42 % | 58 % | 0 % | 0 % | 0 % |
| 1:40 bis vor 2:50 | 42 % | 24 % | 34 % | 0 % | 0 % |
| 2:50 bis vor 4:30 | 42 % | 24 % | 14 % | 20 % | 0 % |
| Ab 4:30 | 42 % | 24 % | 14 % | 13 % | 7 % |

Es gibt aktuell keine einzeln entworfenen Wellenformationen und keinen adaptiven Encounter-Director. Schwierigkeit entsteht aus Zeit, Spawnrate, Zufallsmischung und Werten.

**Finsternis:** Jeder Zyklus dauert 90 Sekunden. In seinen letzten 20 Sekunden, erstmals von 1:10 bis vor 1:30, gilt:

- Shadow Blade: Schadensfaktor 1,35.
- Schattenschritt: Schadensfaktor 1,50.
- Normale Gegnerbewegung: Faktor 1,15.
- Farbiger Bildschirmton und HUD-/Texthinweis.
- Andere Waffen erhalten durch die Finsternis keinen direkten Schadensbonus.
- Nach Zyklusende kehren diese Faktoren zu ihren Normalwerten zurück.

## 9. XP, Karten, Seltenheit und Loot

Der Charakter startet auf Level 1 mit null XP. Für den Übergang von Level L auf L + 1 gilt:

    XP-Anforderung = floor(8 + 5 × L + 1,5 × L^1,38)

| Levelübergang | Benötigte XP für diesen Übergang |
| --- | ---: |
| 1 → 2 | 14 |
| 2 → 3 | 21 |
| 3 → 4 | 29 |
| 5 → 6 | 46 |
| 10 → 11 | 93 |
| 15 → 16 | 145 |
| 20 → 21 | 201 |
| 30 → 31 | 321 |
| 40 → 41 | 451 |
| 50 → 51 | 589 |

Die Anforderung wird aus vorhandenen XP abgezogen. Überschüssige XP bleiben erhalten. Mehrere mögliche Levelaufstiege werden mit einzelnen Kartenwahlen nacheinander abgearbeitet. Jedes Level-up heilt 5 LP.

Der normale Kartenpool enthält jede noch nicht maximierte Waffe und passive Fähigkeit einmal. Es werden drei unterschiedliche Einträge ohne Zurücklegen gezogen. Es gibt keine garantierte Waffe, keinen Reroll, keinen Bann und keine Überspringen-Funktion.

| Seltenheit | Wahrscheinlichkeit je angebotener Karte | Zusatz |
| --- | ---: | --- |
| Gewöhnlich | 64 % | Normale Stufe |
| Selten | 26 % | Normale Stufe und 8 LP Heilung |
| Episch | 10 % | Normale Stufe und 18 LP Heilung |

Seltenheit verändert bisher nicht die Stärke der eigentlichen Waffen-/Passivstufe. Sie bringt zusätzliche Heilung.

Bei fast oder vollständig ausgebautem Kartenpool werden fehlende Angebote mit Erholung gefüllt:

- Zweiter Atem: 35 LP sofort.
- Zähes Erbe: +10 maximale LP und 10 LP Heilung.
- Schattenreserve: Schattenschritt sofort bereit und 20 LP Heilung.

Diese Angebote sichern drei Karten. Sie können bei weiterem Leveln wiederkehren.

**Beute:**

- Jeder getötete Gegner erzeugt XP entsprechend seiner Tabelle.
- Normale Gegner haben eine Heil-Drop-Chance von 1,8 %; Heilung 16 LP.
- Rissritter erzeugen grundsätzlich einen Heildrop für 12 LP, sofern die Loot-Grenze Platz lässt.
- XP und Herzen werden innerhalb des Sammelradius angezogen und bei weniger als 18 Entfernung aufgenommen.
- Heilung wird auf die maximalen LP begrenzt. Ein aufgenommenes Herz wird auch bei vollen LP verbraucht.
- Beute hat aktuell keinen normalen zeitlichen Verfall.
- Bei 380 liegenden Beuteobjekten werden weitere XP nach Möglichkeit einem vorhandenen XP-Drop hinzugefügt. Neue Heildrops werden dann verworfen.
- Kein Gold, keine Seelenfragmente und keine Gegenstandsraritäten.

## 10. Hauptmenü und alle Oberflächen

### Hauptmenü

Dunkle Klosterkulisse mit Finsternis, eigenem Logo, Version v1.0 und großer Titelgrafik. Text: „Die letzte Nacht hat begonnen. Stell dich der Finsternis. Versiegle den Riss.“

Funktionen:

1. Durchlauf beginnen.
2. Einstellungen.
3. Statistiken.
4. Steuerung.

Darunter steht eine Charakterkarte für den Shadow Knight mit Porträt, Nahkampf-/Schattenschritt-Hinweis und Auswahlmarkierung. Es gibt bisher keine Auswahl zwischen mehreren Charakteren.

### Einstellungen

- Gesamtlautstärke 0 bis 100 %, Standard 35 %.
- Bildschirmerschütterung an/aus, standardmäßig an.
- Schadenszahlen an/aus, standardmäßig an.
- Partikeleffekte an/aus, standardmäßig an.
- Einstellungen werden sofort lokal gespeichert.
- Keine Schwierigkeitseinstellung, Tastenbelegung, getrennte Musik-/Effektlautstärke oder frei wählbare Grafikstufen.

### Steuerungsdialog

Erklärt Bewegung, Schattenschritt, Pause, Kartentasten, automatische Angriffe, XP, Finsternis und das Bossziel.

### Chronik/Statistik

Zeigt Durchläufe, Siege („Versiegelte Risse“), insgesamt besiegte Gegner, längste Überlebenszeit und höchstes erreichtes Level. Kein detaillierter Verlauf einzelner Runs und keine Rangliste.

### HUD im Kampf

- Charaktername und LP als Zahl/Balken.
- Charakterlevel, XP-Balken und XP bis zum nächsten Level.
- Überlebenszeit.
- Orts-/Phasenbezeichnung und Countdown zur Finsternis.
- Kill-Zähler.
- Pauseknopf.
- Fünf Waffenslots mit Symbolen und Stufen; nicht erhaltene Waffen erscheinen abgedunkelt.
- Schattenschritt-Anzeige mit Ladebalken und Restzeit.
- Bossname und Boss-Lebensbalken.
- Kurze Hinweise für Spielstart, Finsternis und Boss.
- Passive Fähigkeiten besitzen derzeit keine eigene vollständige HUD-Leiste.

### Level-up

Das Spiel pausiert. Drei Karten zeigen Seltenheit, Icon, Namen, Kategorie, nächste Stufe und Beschreibung. Auswahl mit Maus oder 1–3. Karten haben Hover-/Fokuszustände.

### Pause

„Die Nacht wartet.“ mit Weiterkämpfen, Einstellungen und „Durchlauf beenden & Hauptmenü“. Aufgeben zählt als beendeter Run. Es gibt keine Speicher-und-Fortsetzen-Funktion.

### Ergebnis

Niederlage: „Im Schatten gefallen.“ Sieg: „Ein neuer Morgen.“

Angezeigt werden Überlebenszeit, Kills, Level und verwendete Waffen mit Stufen. Buttons erlauben einen neuen Run oder die Rückkehr zum Hauptmenü.

## 11. Darstellung, Animation und Audio

29 eigene lokale PNG-Dateien bilden Charaktere, Gegner, Waffen-/Passivicons, Boden, Grabsteine, Säulen, Bäume, Menübild, Porträt, Logo und Lichttextur ab.

Figuren-Spritesheets besitzen elf 64×64-Frames: zwei Idle-, vier Lauf-, einen Treffer- und vier Todesframes. Der Spieler verwendet diese Zustände; Gegner verwenden insbesondere Laufen, Treffer und Tod. Links/rechts wird durch Spiegeln dargestellt.

Effekte umfassen Bodenschatten, Nahkampfbögen, Trefferblitze, Schadenszahlen, Orb-Umlauf, Geschossspuren, Frostwellen, Kettenblitze, Gegner-Todespartikel, Bossmarkierungen, additive Beleuchtung und optionale leichte Bildschirmerschütterung.

Alle Klänge werden im Browser mit Web Audio synthetisiert. Enthalten sind kurze Treffer-, Waffen-, Level-up-, Schadens-, Heil-, Boss- und Endklänge sowie ein leiser dunkler Grundton. Es gibt keine eingesprochenen Stimmen und keinen komponierten Musiktrack.

Eigene Grafik- und Klanginhalte sind als CC0 dokumentiert. Laufzeitbibliotheken besitzen eigene mitgelieferte Lizenzhinweise. Schriften stammen aus lokal verfügbaren Systemschriften.

## 12. Speicherung und Technik

- TypeScript 5.9.3.
- Phaser 3.90.0.
- Vite 7.2.2.
- Desktop-Browser, Tastatur und Maus.
- WebGL/Canvas über Phaser.
- Kein Backend, keine Benutzerkonten, keine kostenpflichtigen APIs.
- Lokale Assets und Bibliotheken, keine externen Ressourcen während des Spiels.
- Node.js ab 22.12 mit npm für lokale Entwicklung.
- Start: npm install, danach npm run dev.
- Produktionsbuild: npm run build.
- Produktionsvorschau: npm run preview.

LocalStorage-Schlüssel: eclipse-survivor-v1. Datenversion: 1. Gespeichert werden Einstellungen, Runanzahl, Siege, Gesamtkills, längste Überlebenszeit und höchstes Level. Falsche Daten werden validiert beziehungsweise auf Standardwerte zurückgesetzt; unzugänglicher Speicher verhindert den Start nicht.

Sieg, Niederlage und Aufgeben über das Menü werden genau einmal erfasst. Das bloße Schließen eines laufenden Runs sichert diesen Run nicht. Spielerzustand, Beute, Gegner, Waffen und XP werden nicht für eine Wiederaufnahme gespeichert.

Die Kampfsimulation ist von Phaser getrennt. Ein räumliches Raster reduziert Nachbarschaftsabfragen. Bilder und Schadenslabels werden wiederverwendet. Aktuelle Grenzen:

| Ressource | Grenze |
| --- | ---: |
| Normale Gegnerpopulation einschließlich laufendem Boss im üblichen Ablauf | 230 |
| Geschosse, Spieler und Gegner gemeinsam | 280 |
| Beuteobjekte | 380 |
| Gleichzeitig verwaltete Darstellungseffekte | 180 |
| Schadenslabels | 55 |

Wichtig für spätere Entwicklung: Die Geschossgrenze beeinflusst derzeit tatsächlich, ob neue Geschosse entstehen. Sie ist nicht nur eine visuelle Partikelgrenze.

Spielschritte werden auf höchstens 0,05 Sekunden begrenzt. Sehr langsame Frames werden nicht vollständig aufgeholt; unter starker Last kann die Simulationszeit hinter der realen Zeit zurückbleiben. Das Ziel von 60 FPS ist keine Zusage für alle Geräte.

Ein Entwicklungszugang existiert nur im Entwicklungsbuild mit ?qa=1. Der Produktionsbuild enthält diesen Zugriff nicht.

## 13. Tatsächlich vorhandene Prüfungen und ihre Grenzen

20 automatisierte Tests prüfen Kernmechaniken. TypeScript-Prüfung und Produktionsbuild waren erfolgreich.

Browserprüfungen in Chromium decken Menüs, Einstellungen, Tastatur, Schattenschritt, Pause, Waffen, Karten, Boss, Sieg, Niederlage, Neustarts, Statistik und beschädigten Speicher ab. Randfälle wurden dabei teilweise über den Entwicklungszugang ausgelöst.

Der Produktionsbuild wurde zusätzlich ungefähr 15 Sekunden durch normale Tastatureingaben gespielt und pausiert. Es wurden keine externen Ressourcenanfragen und keine JavaScript-Fehler festgestellt.

Neun vollständige Bot-Simulationen ohne Zusatzgesundheit, kostenlose Waffen oder Unverwundbarkeit:

| Build | Seed | Ergebnis | Zeit | Level | Kills |
| --- | ---: | --- | --- | ---: | ---: |
| Klinge & Orbit | 12 | Niederlage | 11:57 | 23 | 885 |
| Klinge & Orbit | 71 | Sieg | 12:06 | 26 | 1.091 |
| Klinge & Orbit | 313 | Sieg | 13:22 | 27 | 1.367 |
| Elementar | 12 | Sieg | 12:15 | 27 | 1.303 |
| Elementar | 71 | Sieg | 11:21 | 38 | 2.603 |
| Elementar | 313 | Sieg | 11:27 | 38 | 2.344 |
| Ausgewogen | 12 | Sieg | 11:27 | 33 | 1.921 |
| Ausgewogen | 71 | Sieg | 11:26 | 33 | 1.987 |
| Ausgewogen | 313 | Sieg | 11:40 | 30 | 1.646 |

Diese neun Ergebnisse sind keine belastbare menschliche Gewinnrate. Es gab kein umfangreiches menschliches Langzeit-Playtesting.

Ein Browserlasttest mit bis zu 230 aufgesetzten Gegnern und fünf Waffen verwendete Software-Rendering: ungefähr 33,3 ms Median pro Frame und 50 ms am 95. Perzentil. Anzeigeobjekte blieben über sechs Neustarts bei 528. Kein mehrstündiger Heap-Test und keine breite Prüfung verschiedener GPUs, Firefox oder Safari.

## 14. Bekannte Designschwächen des aktuellen Stands

**Beobachtung des Entwicklers:** Bereits der Anfang ist zu leicht.

Aus den vorhandenen Regeln lassen sich mögliche Ursachen ableiten:

- Spielerbewegung 172 gegenüber 43 bei Aschenpilgern: vierfaches Tempo.
- Startklinge 30 Schaden gegenüber anfänglich 28 Gegner-LP: frühe Ein-Treffer-Kills.
- Nachschub meist 610–780 Einheiten entfernt; Anlaufzeit reduziert den gefühlten Druck.
- Die erste schnelle Gegnerart ist immer noch langsamer als der Spieler.
- Fernkämpfer erst ab 2:50, Ansturmgegner erst ab 4:30.
- Heilung kommt aus Level-ups, seltenen/epischen Karten, Drops und Regeneration.
- Alle Waffen und alle passiven Fähigkeiten können langfristig gemeinsam gesammelt werden; es gibt wenig dauerhaften Verzicht innerhalb eines Runs.
- Seltenheit liefert Heilung, aber keine besondere Waffenmechanik.
- Viele Waffenstufen ändern vor allem Zahlen. Feuerketten, Blutungen, Gift und Evolutionen fehlen.
- Die Finsternis verstärkt vor allem die Startklinge und den Dash, nicht jede Spielweise gleichermaßen.
- Später Frost kann länger verlangsamen, als sein eigenes Angriffsintervall dauert. Häufige Auffrischung macht dauerhafte Verlangsamung möglich.
- Gegnerzusammensetzung und Nachschub sind weitgehend zeitgesteuert; markante Formationen und abwechslungsreiche Begegnungsereignisse fehlen.

Diese Liste enthält Designanalysen, keine neu durchgeführten menschlichen Tests.

# Teil B – gewünschte neue Richtung: Konzeptfassung 0.2

## 15. Was das neue Konzept vorsieht

Das eingereichte Konzept plant einen größeren Umbau zu einem endlosen Horde-Survival-Roguelite:

- Drei Klassen: Krieger, Magier und Bogenschütze.
- Je Klasse drei Start-Freischaltungen und weitere kaufbare Waffen.
- Waffen als alternative Spielweisen statt bloß teurerer direkter Verbesserungen.
- Acht automatische Angriffsplätze und acht passive Plätze.
- Angriffe bis Stufe 12, Passives bis Stufe 8; sichtbare mechanische Meilensteine.
- Klassenspezifische und universelle Fähigkeiten; langfristig mindestens 20 Waffen-/Upgrade-Optionen pro Klasse.
- Gold durch Gegner und Bosse: neue Waffen, Karten und dauerhafte Grundwerte.
- Seelenfragmente ausschließlich durch Bosse: dauerhafte Klassen-Meisterschaften.
- Kriegerzweige: Berserker, Wächter, Seelenkrieger.
- Magierzweige: Inferno, Sturm, Arkan.
- Bogenschützenzweige: Präzision, Pfeilhagel, Seelenjäger.
- Zunächst ungefähr fünf Stufen pro Zweig und drei ausrüstbare Meisterschaftseffekte; kostenloser Wechsel.
- Build-Editor mit Startwaffe, erlaubtem Kartenpool, Passives und Meisterschaften; mehrere gespeicherte Vorlagen.
- Ausschließlich Nahkampf-/Kontaktgegner, ausdrücklich keine gegnerischen Fernkampfprojektile.
- Schwärmer, Läufer, Kolosse, Panzerwächter, Hetzer, Beschwörer und Eliten.
- Früher dichterer Nachschub: Ziel 20–35 Gegner in der ersten Minute, später bis 180–250+.
- Wiederkehrende Bosse ungefähr alle drei bis fünf Minuten, ohne finales Runende.
- Fünf Schwierigkeiten mit eigenen Umgebungen: Anfänger/Kloster, Veteran/Wald, Albtraum/Katakomben, Hölle/Ödland, Abgrund/Finsternis.
- Nächste Schwierigkeit nach 30 Minuten Überleben in der vorherigen.
- Sehr lange Runs von zwei bis drei Stunden als seltenes spätes Ziel; zeitweise passives Überleben mit mächtigen Builds.
- Erweiterte Menüs, HUD für aktive und passive Fähigkeiten, Ressourcen und Bossereignisse.
- Zuverlässiges Speichern und Fortsetzen langer Runs.
- Langsame weitere Meisterschaftslevel nach Ausbau normaler Fähigkeiten.

**Diese Systeme sind Planungen.** Ihre exakten Klassenwerte, DEF-Formel, Preise, Dropmengen, Gegnerwerte, Meisterschaftsboni und langfristigen Skalierungskurven sind noch nicht festgelegt. Sie dürfen nicht als bereits implementiert beschrieben werden.

## 16. Designbewertung und empfohlene Entscheidungen

### A. Umfang in spielbare Etappen teilen

Das Konzept erweitert gleichzeitig Kampf, Klassen, Inhalte, Wirtschaft, Langzeitprogression und Speicherung. Zuerst sollte ein begrenzter Endless-Ausschnitt mit einer Klasse, einer Arena und wenigen unterscheidbaren Bossen funktionieren. Auswertungsziele: Druck in den ersten zwei Minuten, mehrere brauchbare Builds und abwechslungsreiche 20–30 Minuten.

Weitere Klassen, fünf Umgebungen und sehr lange Runs sollten auf diesen Ergebnissen aufbauen. Das ist eine Reihenfolgeempfehlung, keine Streichung der langfristigen Vision.

### B. Finsternis als Identität zurückholen

Der Name ECLIPSE SURVIVOR braucht eine prägende Mechanik. Das aktuelle Konzept benennt hauptsächlich die Umgebung „Ewige Finsternis“, aber noch kein tragendes Finsternissystem.

Vorschlag: wiederkehrende, klar angekündigte Phasen mit verändertem Gegnerverhalten und klassenbezogenen Chancen. Optional kann der Spieler vor einer Phase zusätzliche Gefahr für eine konkrete Belohnung wählen. Dauer und Bonuszahlen müssen getestet werden.

### C. Nahkampfgegner benötigen Raumkontrolle

Der Verzicht auf feindliche Geschosse ist eine klare Designentscheidung und kann funktionieren. Direkte Verfolger allein begünstigen jedoch endloses Kreiseln.

Vorschläge ohne feindliche Projektile: versetzte Anstürme, seitlich eintreffende Gruppen, angekündigte Einkesselung mit erreichbarer Lücke, beschützende Panzerwächter, Beschwörer als priorisierte Ziele und Boss-Nahkampfbögen. Warnungen, Kollisionsgrößen und Fluchtwege müssen fair bleiben. Gegner dürfen nicht unsichtbar direkt auf dem Spieler entstehen.

### D. Gegnerzahl von Bedrohung unterscheiden

20–35 Gegner können harmlos sein, wenn sie langsam sind und mit einem Treffer sterben. Eine Population ist zugleich Ergebnis der Spawnrate und der Tötungsrate.

Zielgrößen zusätzlich zur Anzahl: Distanz zum Spieler, notwendige Treffer, Ankunftszeit, freie Fluchtwege und Zusammensetzung. Ein zeitlich geplanter Begegnungsplan mit wechselnden Gruppen ist sinnvoll. Starke Builds sollen Horden sichtbar schneller räumen dürfen; Werte sollten nicht heimlich unmittelbar gegen sie hochgeregelt werden.

### E. 159 Entscheidungen sind ein erheblicher Umfang

Acht aktive Plätze auf zwölf Stufen plus acht passive auf acht Stufen ergeben 160 Erwerbs-/Stufenschritte. Mit einer vorhandenen Startwaffe auf Stufe 1 bleiben **159 Level-up-Entscheidungen**. Bei fünf Sekunden je Wahl sind das gut 13 Minuten reine Kartenzeit.

Vorschlag für den ersten Test: weniger Slots oder weniger gewöhnliche Stufen; besondere Meilensteine bleiben. Alternativ im späten Run bewusste Entscheidungen seltener machen und kleine wiederholbare Boni gesammelt oder optional automatisch nach Spielerpriorität vergeben. Wesentliche Build-Entscheidungen sollten früh genug stattfinden, damit der Spieler seinen Build lange spielen kann.

### F. Permanente Macht begrenzen

Dauerhafte ATK, HP, DEF, Krit-Chance, Krit-Schaden und Meisterschaften verstärken sich gegenseitig. Unbegrenzte Kombinationen können niedrige Schwierigkeiten trivial und hohe Schwierigkeiten von Grind abhängig machen.

Vorschlag: gut sichtbare Maximalstufen, moderate dauerhafte Zahlenboni, kostenloser Spezialisierungswechsel und freischaltbare Mechaniken. Höhere Schwierigkeiten sollten auch mit niedrigem Fortschritt durch Können grundsätzlich erreichbar bleiben. Verteidigung braucht eine festgelegte Formel mit abnehmendem Nutzen und eine getestete Reduktionsgrenze. Keine konkreten DEF-Zahlen sind bereits beschlossen.

### G. Wiederholbare Effekte technisch begrenzen

„Explosion erzeugt Feuerball, Feuerball erzeugt Explosion“ braucht Regeln gegen unendliche Ketten. Zu definieren sind Auslösechance, Auslöseabstand, maximale Folgegeneration und die Frage, ob erzeugte Folgeeffekte erneut auslösen dürfen.

Darstellungslimits dürfen nicht stillschweigend den Schaden erfolgreicher Builds reduzieren. Die bestehende gemeinsame Geschossgrenze muss dafür überarbeitet werden. Auch extreme Angriffsgeschwindigkeit, Reichweite und Bewegung brauchen überprüfbare Grenzen.

### H. Build-Editor mit sinnvollen Entscheidungen verbinden

Ein exakt ausgewählter kompletter Kartenpool ermöglicht starke Planung, reduziert aber Run-Unterschiede. Das kann gewollt sein.

Falls mehr Variation erwünscht ist: Startwaffe plus garantierter Kern, ergänzt durch flexible Angebote, begrenzte Rerolls oder optionale Überraschungsslots. Neu gekaufte Fähigkeiten dürfen den gewünschten Build nicht unbeabsichtigt seltener machen. Die aktuelle Konzeptidee eines wählbaren Pools verhindert diesen Nachteil grundsätzlich.

Die Grenze zwischen „Waffe“, „Angriff“ und „Zauber“ sollte klar sein: Welche davon belegen einen der acht Plätze? Da diese automatisch auslösen, ist „Angriffsslots“ eventuell verständlicher als „aktive Fähigkeiten“.

### I. Wirtschaft und Ausstieg festlegen

Der Run sollte freiwillig beendet werden können, während bereits verdientes Gold und bereits verdiente Bossfragmente erhalten bleiben. Absichtliches Sterben als einziger geordneter Ausstieg ist für lange Sitzungen unpraktisch.

Bereits verdiente Belohnungen sollten sicher gespeichert werden. Speichern/Fortsetzen benötigt Schutz gegen doppelte Bossbelohnungen beim Laden. Offline ist lokale Manipulation grundsätzlich möglich; für ein Singleplayer-Spiel ist zuverlässige Speicherung wichtiger als eine aufwendige Anti-Cheat-Infrastruktur.

Bossfragmente ausschließlich aus Bossen bedeuten: Der erste Boss muss mit einem neuen Spielstand fair erreichbar sein. Gold- und Fragmentertrag pro Minute zwischen Schwierigkeiten prüfen, damit bequemes Farmen der ersten Bosse nicht automatisch die effektivste Strategie wird.

### J. Lange Runs brauchen Zwischenziele

Zwei bis drei Stunden können ein optionales Ziel für spezialisierte Spieler sein. Schon eine kurze Sitzung sollte Fortschritt und interessante Entscheidungen liefern. Nach 30, 60 und 120 Minuten braucht es neue Begegnungskombinationen und erkennbare Meilensteine.

Die Freischaltung der nächsten Schwierigkeit erst nach 30 Minuten kann insbesondere starke Spieler ausbremsen. Alternativen zum Testen: markanter Boss-Meilenstein oder eine kürzere Überlebensschwelle. Das Ziel, spätere mächtige Runs teilweise passiv spielen zu können, muss mit dem gewünschten Anspruch höherer Schwierigkeiten abgestimmt werden.

### K. Klassen durch eigene Mechanik unterscheiden

Unterschiedliche HP und Waffenlisten allein reichen möglicherweise nicht, sobald viele universelle Fähigkeiten verfügbar sind. Jede Klasse sollte eine einfache, erkennbare Kernmechanik besitzen, beispielsweise Nähe/Wut beim Krieger, Zauberüberladung beim Magier und Markierungen/Präzision beim Bogenschützen. Das sind Vorschläge und keine festgelegten Fähigkeiten.

Kleine Unstimmigkeit im Konzept: „Sturm“ ist zunächst ein Magier-Meisterschaftszweig, wird später aber für einen Bogenschützen-Build genannt. Festlegen, ob Meisterschaften klassengebunden bleiben oder gezielte Klassenkombinationen erlauben.

## 17. Empfohlene nächste Arbeitsreihenfolge

1. Grundbegriffe, Slots, Schadens-/DEF-Regeln und gewünschte frühe Schwierigkeit festlegen.
2. Eine Klasse und eine Arena auf Endless umstellen; neue Nahkampfbegegnungen und mehrere Boss-Meilensteine testen.
3. Wenige Waffen mit tatsächlich unterschiedlichen Upgrade-Meilensteinen und klar begrenzten Kombinationseffekten bauen.
4. Spielerfeedback und vollständige 20–30-Minuten-Läufe auswerten; bisherige kurze technische Tests genügen dafür nicht.
5. Gold, eine kompakte Meisterschaftsauswahl und zuverlässiges Speichern/Fortsetzen ergänzen.
6. Weitere Klassen und Schwierigkeiten hinzufügen.
7. Mehrstündige Simulationen sowie echte Leistungsmessungen und menschliche Langzeittests durchführen.
8. Weitere Waffen, Karten, Umgebungen und Präsentationsdetails nach gesicherter Kernqualität ausbauen.

# Teil C – Arbeitsauftrag für einen neuen ChatGPT-Chat

Den folgenden Text zusammen mit dieser Datei verwenden:

> Du unterstützt mich als Game-Designer und Balancing-Partner für ECLIPSE SURVIVOR. Lies diese Spielbeschreibung vollständig. Teil A ist der implementierte Stand, Teil B beschreibt mein Ausbaukonzept und noch nicht beschlossene Empfehlungen.
>
> Mein wichtigstes aktuelles Problem: Das Spiel ist von Anfang an zu einfach. Meine neue Vision ist ein endloses Nahkampf-Hordenspiel mit drei Klassen, deutlichem Machtzuwachs, Builds, Gold und Boss-Meisterschaften. Feindliche Fernkampfprojektile sollen im neuen Konzept entfallen. Lange Runs dürfen möglich sein, aber kurze Sitzungen sollen ebenfalls interessant und lohnend bleiben.
>
> Analysiere zuerst Zielkonflikte, frühe Schwierigkeit, Klassenidentität, Slots, Heilung, permanente Boni und Wirtschaft. Erfinde keine bereits vorhandenen Werte oder Funktionen. Kennzeichne Vorschläge und ungetestete Zahlen ausdrücklich.
>
> Gib mir anschließend einen priorisierten, umsetzbaren Plan. Für vorgeschlagene Zahlenänderungen nenne bisherigen Wert, neuen Testwert, erwartete Wirkung und ein messbares Prüfkriterium. Bevorzuge Änderungen, die echte Entscheidungen und Gegnerdruck erzeugen. Berücksichtige Lesbarkeit und Browserperformance bei großen Horden und Effektketten.
>
> Bewerte außerdem, welche Entscheidungen wir vor der Implementierung festlegen müssen und was ein Prototyp klären sollte. Bewahre die eigenständige Dark-Fantasy-Identität und entwickle eine sinnvolle zentrale Rolle für die Finsternis.
>
> Behaupte kein perfektes Balancing. Trenne dokumentierte Testergebnisse, rechnerische Folgerungen und Designannahmen.

## Quellen innerhalb des Projekts

Diese Datei wurde anhand der vorhandenen Konfiguration, Kampfsimulation, Upgrades, Oberfläche, Speicherung, Audio-Implementierung und Testberichte erstellt: src/core/config.ts, src/core/engine.ts, src/core/upgrades.ts, src/core/storage.ts, src/ui.ts, src/main.ts, src/render/GameScene.ts, src/audio.ts sowie reports/simulation.json, reports/browser.json und reports/production.json. Teil B beruht auf dem vom Entwickler bereitgestellten Game Design Document Version 0.2.

Die Datei ist als eigenständig lesbare Übergabe gedacht; Quellcode oder weitere Berichte sind für das grundlegende Verständnis nicht erforderlich.

