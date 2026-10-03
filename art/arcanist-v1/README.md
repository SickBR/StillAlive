# Arkanist — STILLALIVE: ENDLESS

Eigenständiges Asset; keine Änderung an vorhandenen Figuren oder Spielcode.

- PNG: `public/assets/arcanist-v1.png`, RGBA, 1088 × 64 Pixel.
- 17 Frames, jeweils 64 × 64, ohne Rand oder Zwischenraum.
- Eine Blickrichtung: schräg von oben nach Südosten. Für Südwesten horizontal spiegelbar; kein vollständiges Vier- oder Acht-Richtungen-Set.
- Gleiche Framebelegung wie beim Schattenjäger und kompatible Basisbelegung zum bestehenden Spiel: Idle 0–1, Laufen 2–5, Treffer 6, Tod 7–10. Zaubern ergänzt 11–16.
- Gemeinsame Palette mit 32 Farben; Alpha ausschließlich 0 oder 255. Keine geglättete Skalierung.
- Bodenkontaktlinie y=54; Fußanker x=32. Empfohlener Origin `(0.5, 0.84375)`. Der vorhandene GameScene-Origin `(0.5, 0.72)` bleibt im Spiel unverändert und muss bei einer späteren Integration bewusst berücksichtigt werden.
- Treffer ist wie im bestehenden Format eine einzelne Rückstoßpose, empfohlen 125 ms halten. Die letzte Todespose halten; Zaubern einmal abspielen.

## Phaser-Verwendung

```ts
// preload
this.load.spritesheet('arcanist-v1', 'assets/arcanist-v1.png', {
  frameWidth: 64,
  frameHeight: 64,
});

// create; frameRate/repeat aus arcanist-v1.json
const states = [
  ['idle', 0, 1, 3, -1],
  ['walk', 2, 5, 10, -1],
  ['hit', 6, 6, 8, 0],
  ['death', 7, 10, 7, 0],
  ['cast', 11, 16, 12, 0],
] as const;
for (const [state, start, end, frameRate, repeat] of states) {
  this.anims.create({
    key: `arcanist-${state}`,
    frames: this.anims.generateFrameNumbers('arcanist-v1', { start, end }),
    frameRate,
    repeat,
  });
}
const sprite = this.add.sprite(0, 0, 'arcanist-v1')
  .setOrigin(0.5, 54 / 64)
  .play('arcanist-idle');
```

Phaser mit `pixelArt: true` bzw. NEAREST-Texturfilter und ganzzahligen Vergrößerungen verwenden. Metadaten sind eine Belegungshilfe, kein automatisch importierbarer Phaser-Atlas.

## Prüfung und Grenzen

`validation.json` dokumentiert 17 vollständige, nicht identische Frames, RGBA-Transparenz, Palette und freien Zellrand. Generierte Posen wurden vollständig extrahiert, auf eine gemeinsame Palette reduziert und ohne Interpolation in das native Raster gepackt. `export.py` erhält die vollständigen Silhouetten einschließlich der Magie, statt an den Rohbild-Zellgrenzen abzuschneiden.

Die Bilder und Einzelposen wurden visuell geprüft. Das Asset wurde noch nicht im laufenden Spiel getestet. Die Vorlage erzeugt etwas variierende Stoff-/Haardetails; ein komplett von Hand bereinigter Animationszyklus ist damit nicht nachgewiesen. Insbesondere der bodenstehende Körper und schwebende Kristalle sind zusammen in den Frames enthalten; bei Änderungen der Fokusbewegung ist weitere Spritebearbeitung erforderlich.

## Erzeugung

Bildgestaltung mit der eingebauten Imagegen-Funktion; deterministischer Pixel-/Phaser-Export mit Pillow. Referenzen: Reaperin sowie `art/shadow-hunter-v1/concept-sheet.png`. Das Rohbild liegt hier als `concept-sheet.png`.

### Bildprompt

Generate a premium TRUE 2D PIXEL ART animation spritesheet for STILLALIVE ENDLESS. References show the established Reaper camera/proportions and Shadow Hunter pixel art palette/rendering. NEW character: ARCANIST, a slender elegant mysterious young ADULT MALE battle mage, early twenties, mature male facial features, silver-white hair lightly tinted lavender, stylish dark black-violet tailored mage clothing, short split coat tails, slim trousers and practical boots, selective GOLD runic trims readable as a few bold marks. Three SMALL angular floating arcane crystals close to shoulders and waist, one small floating spell-focus orb near his hand, violet-blue energy on hands. NO staff, bow, hood or scythe. Clean strong silhouette, luminous hair contrasts dark clothing, crystalline shapes and violet magic recognizable at 64x64. Same elevated three-quarter TOP-DOWN camera facing southeast as references, crown and shoulder top visible, not frontal portrait. Adult slender proportions, not chibi.

Sheet has exactly6 columns and3 rows, equal spacing between poses, total17 occupied cells and1 empty. Match SAME character identity, costume, pixel density and camera in all poses. Keep ample transparent margins around every complete silhouette; no magic or crystal overlaps adjacent cells. No labels, text, lines, background or painted checkerboard, genuinely transparent alpha. Hard clean deliberate square pixel clusters, limited approximately32-color palette, no anti-aliasing, no blur, no smooth gradients, no tiny painterly details. Each sprite intended for native64x64 export. Large readable material clusters, elegant black/violet cloth, pale silver-lavender hair, sparse gold runes, bright violet-blue magic. Compact controlled magic entirely inside each frame.

ROW1: idleA gentle breathing crystals at shoulder height; idleB gentle breathing crystals subtly moved; FOUR genuinely different WALK cycle frames: left-foot contact, left-leg passing with opposite arm motion, right-foot contact, right-leg passing. Planted feet stay at constant baseline, same character size.

ROW2: hit-recoil hands drawn inward, knees flexed; death1 stumble, death2 kneel, death3 fall sideways, death4 lying still on ground with extinguished crystals settled beside body. Maintain same physical character scale, do not just shrink him. Last sixth cell is completely EMPTY.

ROW3: six MAGIC CASTING poses showing continuous arc: preparation hand low with tiny focus; gathering energy with hands close; opening left hand with charging orb; arm extended fully with crystal alignment; spell RELEASE compact bright violet-blue angular burst beside hand; recovery as burst vanishes and focus settles. Frame4/5 magical accents brighter but cannot obscure face, hands or extend beyond cell; avoid large spherical particle fog. Same foot baseline and pelvis/root location all standing poses. No duplicated poses, clipped crystals, extra arms, changes of face or outfit. Professional game animation source artwork with exact17 useful poses and plenty of separation, not a conceptual illustration collage.
