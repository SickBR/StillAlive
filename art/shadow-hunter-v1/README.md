# Schattenjäger — STILLALIVE: ENDLESS

Eigenständiges Imagegen-Asset: `public/assets/shadow-hunter-v1.png` mit Belegung in der gleichnamigen JSON-Datei. RGBA, 1088 × 64, 17 Frames à 64 × 64, 32 gemeinsame Farben, binäres Alpha, freie Zellränder. Bodenkontaktlinie y=54.

Idle 0–1, Laufen 2–5, Treffer 6 (125 ms halten), Tod 7–10, Bogenschuss 11–16 (Auslösung 15). Die Basisbelegung entspricht den vorhandenen GameScene-Frames. Eine Blickrichtung nach Südosten; keine zusätzlichen Richtungen. Originale Spielfiguren wurden nicht ersetzt.

`concept-sheet.png` ist das generierte Rohbild. `export.py` extrahiert die vollständigen Posen und exportiert ohne geglättete Skalierung. `validation.json` enthält die technischen Prüfungen. Die Metadaten sind eine Belegungshilfe, kein Phaser-Atlas. Laden mit `this.load.spritesheet('shadow-hunter-v1', 'assets/shadow-hunter-v1.png', {frameWidth:64, frameHeight:64})`, Animationen mit den Framebereichen aus JSON erstellen. Empfohlener Origin `(0.5, 54/64)`; die bestehende GameScene verwendet `(0.5, 0.72)` und benötigt bei Integration eine bewusste Anpassung.

Generierte Animationen können kleine Unterschiede in Kleidung, Bogen und Körperdetails enthalten. Das Asset wurde noch nicht im laufenden Spiel geprüft. Die Trefferreaktion hat wie im bestehenden Format nur eine Pose. Kein Nachweis einer vollständig von Hand bereinigten Animationsserie.
