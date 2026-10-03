# Original pixel-art sanctuary backdrop. Uses no external image assets.
from PIL import Image,ImageDraw
from pathlib import Path
import random,math
out=Path('public/assets');random.seed(2121)
im=Image.new('RGB',(640,400));d=ImageDraw.Draw(im)
for y in range(400):
 c=(12+int(y*.012),20+int(y*.012),29+int(y*.018));d.line((0,y,640,y),fill=c)
for i in range(210):
 x=random.randrange(640);y=random.randrange(210);d.point((x,y),fill=random.choice(['#44565d','#65716f','#2c404d']))
# Blue eclipsed moon, mist behind the open central arch.
for r in range(96,45,-2):
 t=(96-r)/51;col=(int(17+t*9),int(28+t*14),int(38+t*17));d.ellipse((320-r,120-r,320+r,120+r),fill=col)
d.ellipse((273,65,367,159),fill='#9ca692');d.ellipse((282,62,372,152),fill='#182c38');d.arc((273,65,367,159),60,270,fill='#cfb98b',width=2)
# Distant gothic ruins and silhouettes.
for x,top,w in [(25,112,44),(90,145,45),(143,119,37),(470,128,39),(525,102,43),(582,153,40)]:
 d.rectangle((x,top,x+w,278),fill='#15222c');d.polygon([(x-5,top),(x+w/2,top-31),(x+w+5,top)],fill='#15222c')
 for yy in range(top+17,247,33):d.rectangle((x+w//2-3,yy,x+w//2+3,yy+16),fill='#233440')
# Broken stone arch: carefully layered pixel blocks and cool edge lights.
for side in [0,1]:
 x=195 if side==0 else 413
 for y in range(58,286,20):
  shift=(y//20%2)*2;d.rectangle((x-shift,y,x+32,y+18),fill='#293641');d.line((x-shift,y,x+32,y),fill='#4a5558');d.line((x+28,y+2,x+28,y+16),fill='#182730')
 d.rectangle((x-7,279,x+38,291),fill='#45504e');d.rectangle((x-3,273,x+34,278),fill='#65716a')
 for j in range(7):
  t=j/6;bx=(216+int(t*96)) if side==0 else (397-int(t*78));by=58-int(math.sin(t*math.pi/2)*39)
  d.polygon([(bx-10,by-5),(bx+9,by-8),(bx+13,by+8),(bx-8,by+13)],fill='#33414a',outline='#536064')
# Ground stones, perspective paths and a central ritual platform.
for y in range(277,400):d.line((0,y,640,y),fill=('#202b31' if y%3 else '#233037'))
for y in [286,301,320,346,381]:
 d.line((0,y,640,y),fill='#121e27')
 for x in range(-80,720,75):
  xx=x+(y%4)*16;d.line((xx,y,xx-12,y+22),fill='#152129')
for i in range(1100):
 x=random.randrange(640);y=random.randrange(282,400);d.rectangle((x,y,x+random.randrange(1,4),y+1),fill=random.choice(['#26353a','#2d3b3e','#17262e']))
# Raised dais with a softly illuminated rim. Hero is a separate animated sprite.
d.ellipse((257,302,383,338),fill='#101923');d.ellipse((255,291,385,325),fill='#485052');d.rectangle((255,306,385,315),fill='#303c42');d.ellipse((255,288,385,320),fill='#4b5556');d.ellipse((261,291,379,315),fill='#283840');d.arc((260,290,380,317),5,172,fill='#a6a88b',width=2);d.ellipse((279,296,361,311),outline='#63746e',width=1)
for i in range(12):
 a=i/12*math.pi*2;x=320+math.cos(a)*48;y=303+math.sin(a)*9;d.rectangle((int(x),int(y),int(x)+2,int(y)+1),fill='#8b967e')
# Lanterns give a warmer, welcoming focal frame.
for x in [236,404]:
 d.line((x,228,x,305),fill='#141f27',width=4);d.rectangle((x-8,239,x+8,255),fill='#151f28');d.rectangle((x-5,241,x+5,252),fill='#b47e47');d.rectangle((x-2,239,x+2,251),fill='#f1ce8d');d.line((x-10,237,x+10,237),fill='#7b725d',width=2);d.polygon([(x-11,237),(x,227),(x+11,237)],fill='#4d4b45')
for x in [174,461,115,523]:
 d.line([(x,319),(x-6,266),(x-21,241)],fill='#26383a',width=3);d.line([(x-4,282),(x+9,254)],fill='#26383a',width=2)
im.resize((1280,800),Image.Resampling.NEAREST).save(out/'sanctuary.png')
# Pixel utility icons drawn on transparent backgrounds.
for kind in ['gold','soul','settings']:
 icon=Image.new('RGBA',(32,32));p=ImageDraw.Draw(icon)
 if kind=='gold':
  p.ellipse((5,5,26,26),fill='#735b35',outline='#d5b673',width=2);p.ellipse((9,8,23,23),fill='#bd9855');p.line((16,10,16,22),fill='#f4db9b',width=2);p.line((12,13,20,13),fill='#f4db9b',width=2)
 elif kind=='soul':
  p.polygon([(16,2),(25,12),(22,23),(16,30),(8,21),(7,13)],fill='#647a96');p.polygon([(16,5),(21,13),(16,25),(11,16)],fill='#bacbdf');p.line((16,5,16,25),fill='#e0e7e7')
 else:
  for a in range(8):
   x=16+int(math.cos(a*math.pi/4)*10);y=16+int(math.sin(a*math.pi/4)*10);p.rectangle((x-3,y-3,x+3,y+3),fill='#a4b2b7')
  p.ellipse((6,6,26,26),fill='#a4b2b7');p.ellipse((11,11,21,21),fill='#243640')
 icon.save(out/f'icon-{kind}.png')
print('Created sanctuary and three utility icons.')
