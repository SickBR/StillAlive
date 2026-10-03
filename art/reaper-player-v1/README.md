# Reaper — STILLALIVE: ENDLESS

Eigenständige Reaper-Grafik, Texture-Key `reaper-player-v1`. Das vorhandene `reaper.png` ist ein Gegner-Sheet und wird nicht ersetzt.

## Datei und Belegung

- `public/assets/reaper-player-v1.png`: RGBA, 1088 × 64 Pixel.
- 17 Frames à 64 × 64, ohne Margin oder Spacing.
- Idle 0–1, Laufen 2–5, Treffer 6, Tod 7–10, Sensenangriff 11–16.
- Gemeinsame 32-Farben-Palette, Alpha 0/255, keine geglättete Skalierung.
- Bodenkontaktlinie y=54, zentraler Fußanker x=32. Südöstliche Perspektive wie bei Schattenjäger und Arkanist; horizontal spiegelbar für Südwesten. Kein vollständiges Richtungsset.
- Alle Posen werden mit einer gemeinsamen Grundskalierung exportiert; nur bei Platzbedarf greift eine Zellrandbegrenzung. Die Todespose wird nicht nach ihrer Höhe vergrößert.

## Phaser

```ts
// preload
this.load.spritesheet('reaper-player-v1', 'assets/reaper-player-v1.png', {
  frameWidth: 64,
  frameHeight: 64,
});

// create
const animations = [
  ['idle', 0, 1, 3, -1],
  ['walk', 2, 5, 10, -1],
  ['hit', 6, 6, 8, 0],
  ['death', 7, 10, 7, 0],
  ['attack', 11, 16, 12, 0],
] as const;
for (const [state, start, end, frameRate, repeat] of animations) {
  this.anims.create({
    key: `reaper-player-${state}`,
    frames: this.anims.generateFrameNumbers('reaper-player-v1', { start, end }),
    frameRate,
    repeat,
  });
}
const hero = this.add.sprite(0, 0, 'reaper-player-v1')
  .setOrigin(0.5, 54 / 64)
  .play('reaper-player-idle');
```

Mit `pixelArt: true` bzw. NEAREST-Filter und ganzzahligen Vergrößerungen verwenden. Treffer ist entsprechend dem vorhandenen Spiel eine einzelne Rückstoßpose (125 ms halten). Tod und Angriff einmal abspielen, die letzte Todespose halten. Die vorhandene GameScene spielt noch keine eigenen Angriffsanimationen ab; diese müssen bei einer späteren Integration gezielt angesteuert werden. Der vorhandene Origin `(0.5, 0.72)` weicht vom empfohlenen Fußanker ab.

## Vorschau und Validierung

`preview.gif` zeigt alle fünf Folgen, oben in 64 × 64 und unten mit exakt zweifacher NEAREST-Vergrößerung. Die Wiederholung von Treffer/Tod dient nur der Vorschau.

`validation.json` bestätigt Abmessungen, Palette, binäres Alpha, 17 nicht identische Frames, freie Zellränder und die gemeinsame Bodenlinie. Vollständige Posen einschließlich Sense und Magie wurden aus dem Rohbild extrahiert und erst danach ins Phaser-Raster gepackt.

Kein Spielcode wurde geändert. Das Sheet wurde visuell und technisch geprüft, aber noch nicht im laufenden Spiel getestet. Generierte Kleidung, Griffpositionen und Waffenornamente können zwischen Posen leicht variieren; die technischen Prüfungen beweisen keine vollständig von Hand bereinigte Animation. Nur eine Blickrichtung ist enthalten.

## Herkunft

Design und Posen mit der eingebauten Imagegen-Funktion, anhand der früheren Reaperin und des Arkanisten. Ein zweiter Bilddurchlauf schafft Platz zwischen den Posen. Das endgültige Rohbild liegt als `concept-sheet.png` vor. Pixel-Export mit `export.py` und Pillow; Generierungs- und Korrekturprompt in `prompts.txt`.
