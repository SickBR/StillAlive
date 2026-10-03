"""Original pixel art for Eclipse Survivor. Python 3 + Pillow; no source assets."""
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import random, math

OUT=Path(__file__).resolve().parents[1]/'public'/'assets'
OUT.mkdir(parents=True,exist_ok=True)
random.seed(7341)
INK='#10141c'; EDGE='#252838'; STEEL='#707a85'; LIGHT='#b9b8b0'; GOLD='#bf9367'

def sprite(kind, frame):
    im=Image.new('RGBA',(64,64)); d=ImageDraw.Draw(im)
    walk=frame in (2,3,4,5); bob=[0,-1,0,1,0,-1,0,0,0,0,0][frame]; leg=[0,0,-3,-1,3,1,0,0,0,0,0][frame]
    if kind=='crawler':
        y=36+bob
        d.polygon([(8,y+4),(18,y-7),(30,y-10),(43,y-6),(53,y+4),(44,y+12),(19,y+11)],fill=INK)
        for x,sgn in [(16,-1),(44,1)]:
            for j in range(3):d.line([(x,y+j*3),(x+sgn*(9+j),y+7+j*2+leg),(x+sgn*13,y+13+j*3)],fill='#72646d',width=2)
        d.polygon([(17,y),(24,y-7),(37,y-6),(46,y+1),(40,y+9),(23,y+7)],fill='#584551')
        d.polygon([(23,y-3),(31,y-7),(39,y-3),(34,y+3)],fill='#877277')
        for x in [25,35]:d.rectangle((x,y+3,x+3,y+5),fill='#f3b085')
        d.line((28,y+9,26,y+15),fill='#beaaa0',width=2);d.line((36,y+9,38,y+15),fill='#beaaa0',width=2)
    elif kind in ('boss','matriarch','executioner'):
        d.polygon([(10,58),(5,34),(13,22),(19,12),(44,12),(52,24),(59,56),(45,53),(33,62)],fill=INK)
        d.polygon([(10,53),(16,27),(24,19),(42,19),(51,29),(55,54),(39,49),(29,58)],fill='#523747')
        for x in [18,23,42,47]:d.line((x,31,x-3 if x<30 else x+3,52),fill='#755263',width=2)
        d.polygon([(23,24),(32,20),(43,26),(40,44),(30,49),(22,39)],fill='#6a6976')
        d.polygon([(29,24),(35,25),(36,41),(30,44)],fill='#b29e8e')
        d.rectangle((23,12+bob,42,25+bob),fill=INK);d.polygon([(25,13+bob),(41,13+bob),(38,26+bob),(28,25+bob)],fill='#b8b2a2')
        d.rectangle((27,18+bob,31,20+bob),fill='#f2a071');d.rectangle((35,18+bob,39,20+bob),fill='#f2a071')
        d.polygon([(22,15),(18,3),(27,9),(32,0),(36,9),(47,3),(43,16)],fill=GOLD)
        d.line((26,13,40,13),fill='#ead2a5',width=2)
        d.line((52,22,54,61),fill='#b5a17e',width=3);d.polygon([(47,25),(53,11),(61,21),(55,29)],fill='#d0b48b')
    else:
        knight=kind in ('knight','armored'); brute=kind=='brute'; seer=kind in ('seer','mage'); reaper=kind in ('reaper','charger')
        width=12 if brute else 8
        cloak='#433957' if knight else '#4b464b' if brute else '#535264' if seer else '#533f4f' if reaper else '#494c47'
        highlight='#796186' if knight else '#747369' if brute else '#8b788f' if seer else '#8f586c' if reaper else '#717063'
        y=20+bob
        d.polygon([(30-width,y+4),(34+width,y+3),(42+width,53),(33,48),(19-width,55),(23-width,y+16)],fill=INK)
        d.polygon([(30-width,y+5),(34+width,y+5),(38+width,50),(31,46),(22-width,51),(26-width,y+12)],fill=cloak)
        d.line((26-width,y+11,20-width,49),fill=highlight,width=2)
        d.line((35+width,y+12,39+width,48),fill=highlight,width=2)
        for lx,off in [(25,leg),(35,-leg)]:
            d.rectangle((lx,43,lx+5,53+off),fill=INK);d.rectangle((lx+1,43,lx+4,49+off),fill='#414754');d.rectangle((lx-1,51+off,lx+5,54+off),fill='#68707b' if knight else '#585851')
        d.polygon([(20-width//2,y+9),(31,y+4),(43+width//2,y+10),(40,y+25),(25,y+25)],fill=INK)
        d.polygon([(23-width//2,y+9),(31,y+7),(40+width//2,y+10),(38,y+23),(26,y+23)],fill=STEEL if knight else '#66685e' if brute else cloak)
        d.polygon([(25,y+10),(31,y+8),(33,y+21),(27,y+21)],fill='#9ca4a6' if knight else highlight)
        d.rectangle((24,y+22,40,y+25),fill='#302c34');d.rectangle((30,y+23,33,y+25),fill=GOLD)
        d.rectangle((18-width//2,y+10,24,y+17),fill='#92949a' if knight else highlight);d.rectangle((39,y+10,46+width//2,y+17),fill='#53586b' if knight else highlight)
        if knight or brute or reaper:
            d.polygon([(23,10+bob),(37,8+bob),(43,15+bob),(40,28+bob),(29,30+bob),(22,23+bob)],fill=INK)
            d.polygon([(25,12+bob),(36,10+bob),(40,16+bob),(37,27+bob),(29,27+bob),(25,22+bob)],fill='#87919b' if knight else '#686962' if brute else '#9b8392')
            d.polygon([(25,13+bob),(30,12+bob),(30,21+bob),(26,23+bob)],fill='#b4babc' if knight else '#999084')
            d.rectangle((29,18+bob,40,21+bob),fill=INK);d.rectangle((31,19+bob,39,20+bob),fill='#c3a8ed' if knight else '#ed9672')
            d.polygon([(32,10+bob),(35,10+bob),(35,26+bob),(32,28+bob)],fill='#424856')
            if knight:d.polygon([(27,11+bob),(29,3+bob),(34,2+bob),(37,7+bob),(34,14+bob)],fill='#71628a')
            if reaper:
                d.line((23,17,18,6),fill='#b8a0a4',width=3);d.line((40,16,47,5),fill='#b8a0a4',width=3)
        else:
            d.polygon([(21,27+bob),(22,14+bob),(30,7+bob),(40,13+bob),(44,29+bob)],fill=INK)
            d.polygon([(24,25+bob),(25,15+bob),(31,10+bob),(38,15+bob),(41,26+bob)],fill=highlight)
            d.polygon([(27,18+bob),(37,18+bob),(38,27+bob),(27,26+bob)],fill='#23252d')
            for xx in [28,35]:d.rectangle((xx,21+bob,xx+2,22+bob),fill='#f4a49c' if seer else '#cfbf81')
        if knight or reaper:
            d.line((44,36,55,17),fill=INK,width=6);d.line((45,35,55,17),fill='#798996',width=3);d.line((45,34,55,16),fill='#d2d6d5',width=1);d.line((40,32,49,38),fill=GOLD,width=3);d.line((40,43,44,36),fill='#716176',width=3)
        elif brute:
            d.rectangle((43,30,48,53),fill='#5e5047');d.rectangle((39,28,54,37),fill=INK);d.rectangle((41,29,53,35),fill='#9b9281')
        elif seer:
            d.line((46,52,48,15),fill='#a28d75',width=2);d.polygon([(48,10),(53,16),(48,22),(44,16)],fill='#bd94ba');d.rectangle((47,13,49,17),fill='#f2cbca')
        else:d.line((44,34,50,46),fill='#8c8073',width=3)
    # Class and enemy silhouettes retain the same palette and pixel density.
    if kind=='mage':
        d.polygon([(20,18+bob),(25,7+bob),(35,2+bob),(42,18+bob)],fill='#536889')
        d.line((24,16+bob,39,16+bob),fill='#a1bed7',width=2)
        d.rectangle((47,12,49,17),fill='#93dcf0')
    if kind=='archer':
        d.polygon([(22,20+bob),(25,10+bob),(37,8+bob),(42,22+bob)],fill='#486658')
        d.line([(48,19),(55,26),(57,36),(52,46),(47,50)],fill='#c4a57b',width=3)
        d.line((48,19,47,50),fill='#ccc5a4',width=1)
        d.line((33,34,59,34),fill='#c4cbbc',width=2)
        d.polygon([(59,31),(63,34),(59,37)],fill='#d2d8c9')
        for off in (0,4,8):d.line((20+off,29,12+off,10),fill='#9b9988',width=2)
    if kind=='armored':
        d.polygon([(12,27),(24,25),(30,32),(28,48),(20,53),(12,45)],fill='#252b38')
        d.polygon([(15,30),(23,28),(27,33),(25,46),(20,49),(15,44)],fill='#8c8d9b')
        d.line((20,30,20,46),fill='#d2b887',width=2)
    if kind=='charger':
        d.polygon([(19,18),(12,7),(24,14)],fill='#c3887a')
        d.polygon([(40,15),(51,7),(46,23)],fill='#c3887a')
        d.line((24,35,39,36),fill='#dd877c',width=2)
    if kind=='matriarch':
        d.rectangle((15,0,48,15),fill=(0,0,0,0))
        for x,sgn in [(16,-1),(48,1)]:
            for j in range(3):d.line([(x,29+j*5),(x+sgn*9,38+j*4),(x+sgn*13,52+j*2)],fill='#a291ab',width=3)
        d.polygon([(22,16),(29,5),(38,6),(44,18),(36,25),(26,23)],fill='#84708e')
        for x in (26,32,38):d.rectangle((x,16,x+2,18),fill='#e3bd96')
    if kind=='executioner':
        d.rectangle((15,0,48,15),fill=(0,0,0,0))
        d.polygon([(22,24),(24,9),(33,3),(43,11),(44,26)],fill='#2e333d')
        d.rectangle((29,17,39,19),fill='#e29c83')
        d.polygon([(47,16),(62,14),(62,28),(48,26)],fill='#9c9fa4')
        d.line((49,16,61,16),fill='#e1d7c5',width=2)
    if frame==6:
        tint=Image.new('RGBA',im.size,'#d9c9e3');tint.putalpha(im.getchannel('A').point(lambda a:a//2));im=Image.alpha_composite(im,tint)
    if frame>=7:
        progress=(frame-6)/4
        dead=Image.new('RGBA',(64,64));small=im.resize((int(64-progress*16),int(64-progress*44)),Image.Resampling.NEAREST).rotate(int(progress*9),Image.Resampling.NEAREST,expand=True);dead.alpha_composite(small,(int(progress*6),int(progress*37)));im=dead
    return im

for kind in ['knight','mage','archer','hollow','crawler','brute','armored','charger','seer','reaper','boss','matriarch','executioner']:
    sheet=Image.new('RGBA',(704,64))
    for f in range(11):sheet.alpha_composite(sprite(kind,f),(f*64,0))
    sheet.save(OUT/f'{kind}.png')
sprite('knight',0).resize((256,256),Image.Resampling.NEAREST).save(OUT/'portrait.png')

# Seamless stone and moss ground, sparse readable highlights.
im=Image.new('RGB',(256,256),'#232b2b');d=ImageDraw.Draw(im)
for i in range(9000):
    x=random.randrange(256);y=random.randrange(256);d.point((x,y),fill=random.choice(['#26302e','#29322f','#202829','#2d3431','#242b2c']))
for row in range(-1,9):
    for col in range(-1,7):
        x=col*48+(row%2)*24;y=row*32
        d.line((x+2,y+1,x+44,y+1),fill='#1c2326');d.line((x+44,y+1,x+44,y+29),fill='#1c2326')
        if random.random()<.5:d.line((x+4,y+3,x+random.randint(12,38),y+3),fill='#323a36')
        if random.random()<.45:d.line([(x+7,y+8),(x+12,y+13),(x+10,y+23)],fill='#1a2425')
for i in range(100):
    x=random.randrange(256);y=random.randrange(256);d.rectangle((x,y,x+random.randrange(2,7),y+1),fill='#3b4335')
im.save(OUT/'ground.png')

def prop(kind):
    im=Image.new('RGBA',(128,128));d=ImageDraw.Draw(im)
    if kind=='pillar':
        d.ellipse((20,99,111,119),fill='#121c2080');d.polygon([(34,101),(36,30),(43,22),(43,12),(67,17),(73,27),(83,33),(87,101)],fill=INK)
        d.rectangle((38,33,81,98),fill='#4d5554');d.rectangle((42,34,52,94),fill='#67706a');d.rectangle((72,33,80,99),fill='#303c3d')
        for y in [40,61,81]:d.line((38,y,80,y),fill='#283435',width=2)
        d.polygon([(36,33),(38,22),(48,17),(55,25),(70,22),(83,31),(81,38)],fill='#758073')
        d.polygon([(31,100),(87,98),(95,109),(26,111)],fill='#687064');d.line((32,102,84,102),fill='#8b8b75',width=2)
        d.line([(66,34),(62,52),(68,62),(59,81)],fill='#202c30',width=2)
        for i in range(32):x=random.randrange(37,79);y=random.randrange(78,101);d.rectangle((x,y,x+3,y+2),fill='#454e36')
    if kind=='grave':
        d.ellipse((26,91,100,110),fill='#111c2070');d.polygon([(42,100),(40,49),(47,40),(73,38),(83,49),(80,99)],fill=INK)
        d.polygon([(45,96),(44,49),(50,44),(72,42),(78,50),(76,96)],fill='#565d59');d.line((47,50,47,93),fill='#848476',width=2)
        d.line((61,51,61,75),fill='#2b3535',width=3);d.line((53,60,69,60),fill='#2b3535',width=3)
        d.rectangle((50,84,70,87),fill='#353f3c');d.polygon([(35,98),(86,97),(92,104),(30,106)],fill='#626c5b')
    if kind=='tree':
        d.ellipse((14,106,115,124),fill='#121b2270')
        for pts,w in [([(59,112),(67,69),(57,33),(67,7)],12), ([(63,70),(36,52),(21,26),(12,19)],7), ([(64,62),(87,42),(101,18)],8), ([(59,36),(39,22),(40,7)],5), ([(86,43),(111,41),(122,30)],4), ([(37,53),(15,57),(6,47)],4)]:
            d.line(pts,fill='#171f27',width=w+3);d.line(pts,fill='#4c494b',width=w);d.line([(x-2,y) for x,y in pts],fill='#68605b',width=2)
        d.polygon([(49,119),(63,89),(75,106),(90,119),(68,112)],fill='#3d3c41')
    im.save(OUT/f'{kind}.png')
for p in ['pillar','grave','tree']:prop(p)

# Small raster inventory illustrations; no font symbols are used as icons.
for index,kind in enumerate(['blade','orb','fire','frost','lightning','power','haste','speed','vitality','regen','crit','reach','xp','heal']):
    im=Image.new('RGBA',(32,32));d=ImageDraw.Draw(im)
    if kind=='blade':
        d.polygon([(9,22),(22,4),(27,2),(25,9),(13,25)],fill='#bdc5d1');d.line((11,22,25,4),fill='#e5dced',width=2);d.line((6,18,16,27),fill='#aa82b7',width=3);d.line((5,29,10,23),fill='#92775e',width=3)
    elif kind in ['orb','xp']:
        c='#9bbaf0' if kind=='orb' else '#94d9bf';d.polygon([(16,2),(25,13),(20,27),(11,30),(6,17)],fill='#34466e' if kind=='orb' else '#316b6c');d.polygon([(16,3),(20,14),(14,25),(8,17)],fill=c);d.line((16,5,12,16),fill='#e2f7ec',width=2)
    elif kind=='fire':
        d.polygon([(16,1),(17,10),(24,6),(24,16),(28,23),(23,29),(10,29),(4,23),(8,12),(11,18)],fill='#ae584b');d.polygon([(16,10),(18,19),(23,19),(20,27),(12,27),(9,22)],fill='#e7aa6c');d.polygon([(15,19),(19,26),(13,26)],fill='#f5e2a2')
    elif kind=='frost':
        for a in range(0,360,60):
            x=16+math.cos(math.radians(a))*13;y=16+math.sin(math.radians(a))*13;d.line((16,16,x,y),fill='#a1dddd',width=2)
        d.polygon([(16,8),(23,16),(16,24),(9,16)],outline='#d8f1e9',fill='#598d9f')
    elif kind=='lightning':d.polygon([(18,1),(6,19),(15,19),(11,31),(28,12),(18,12),(24,1)],fill='#e6ce87');d.line((19,5,12,16,20,16,15,25),fill='#fff0c5',width=2)
    elif kind in ['vitality','heal']:
        d.polygon([(16,28),(3,15),(3,8),(8,4),(13,4),(16,8),(20,4),(26,4),(29,9),(29,15)],fill='#984b62');d.polygon([(7,8),(12,7),(15,12),(13,18),(7,14)],fill='#de8b92');d.line((21,8,25,10),fill='#f0b3a7',width=2)
    elif kind=='speed':d.polygon([(16,4),(23,4),(21,18),(28,24),(27,28),(8,28),(7,24),(14,19)],fill='#9cbfb7');d.line((3,13,11,13),fill='#729d99',width=2);d.line((2,19,9,19),fill='#729d99',width=2)
    elif kind=='regen':
        d.line((16,29,16,7),fill='#779376',width=2);d.polygon([(15,19),(4,15),(3,7),(12,9)],fill='#b3c391');d.polygon([(17,14),(20,3),(28,2),(27,11)],fill='#86a880')
    elif kind=='crit':
        d.polygon([(2,16),(10,8),(22,8),(30,16),(22,23),(10,23)],fill='#c2b389');d.ellipse((11,10,21,21),fill='#55425d');d.rectangle((15,10,17,20),fill='#f4cf91')
    elif kind=='haste':
        d.rectangle((7,3,25,5),fill=GOLD);d.rectangle((7,27,25,29),fill=GOLD);d.polygon([(9,6),(23,6),(20,12),(16,16),(22,23),(22,26),(10,26),(10,23),(14,16),(10,11)],fill='#b5a6a0');d.polygon([(11,8),(21,8),(16,14)],fill='#e9c691')
    else:
        d.polygon([(16,2),(28,16),(16,30),(4,16)],outline='#b8a3d6',fill='#514261');d.polygon([(16,8),(23,16),(16,24),(9,16)],outline='#cbbbde');d.rectangle((14,14,18,18),fill='#e0c6e7')
    im.save(OUT/f'icon-{kind}.png')

# Menu vista: ruined cloister, eclipsed sun, distant mountains and foreground knight.
W,H=800,500
im=Image.new('RGB',(W,H));d=ImageDraw.Draw(im)
for y in range(H):
    t=y/H;d.line((0,y,W,y),fill=(int(20+24*t),int(25+15*t),int(34+9*t)))
for i in range(1900):
    x=random.randrange(W);y=random.randrange(330);c=random.choice(['#32343b','#292d36','#3c3b42']);d.point((x,y),fill=c)
glow=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(glow)
for r in range(150,50,-2):gd.ellipse((540-r,142-r,540+r,142+r),fill=(171,92,73,max(1,int((150-r)*.08))))
glow=glow.filter(ImageFilter.GaussianBlur(12));im=Image.alpha_composite(im.convert('RGBA'),glow);d=ImageDraw.Draw(im)
d.ellipse((484,86,596,198),fill='#b1846d');d.ellipse((489,84,595,191),fill='#e0b18a');d.ellipse((487,82,590,187),fill='#171d29')
for i in range(34):
    a=random.random()*math.tau;r=random.randrange(57,64);x=540+math.cos(a)*r;y=142+math.sin(a)*r;d.rectangle((int(x),int(y),int(x)+1,int(y)+2),fill='#d4a183')
for layer,col,base in [(0,'#313741',295),(1,'#292f38',334),(2,'#222c32',370)]:
    pts=[(0,H),(0,base)]
    for x in range(0,W+40,35):pts.append((x,base+random.randrange(-50,30)))
    pts.extend([(W,H)]);d.polygon(pts,fill=col)
# Distant abbey silhouettes.
for x,h,w in [(465,116,37),(506,158,31),(555,108,52),(626,140,36),(672,101,27),(715,191,33)]:
    y=340-h;d.rectangle((x,y,x+w,358),fill='#202832');d.polygon([(x-5,y),(x+w/2,y-27),(x+w+5,y)],fill='#202832')
    for wy in range(y+22,326,28):
        d.rectangle((x+9,wy,x+14,wy+13),fill='#3c3d43');d.rectangle((x+w-13,wy,x+w-9,wy+13),fill='#373b40')
    if x==506:d.line((x+w//2,y-27,x+w//2,y-42),fill='#202832',width=3)
# Arched ruined foreground wall on right.
d.polygon([(686,352),(684,203),(703,184),(704,113),(720,105),(737,110),(741,88),(762,91),(769,122),(794,125),(800,383)],fill='#1b252d')
d.polygon([(700,350),(702,217),(714,207),(718,131),(731,131),(733,202),(762,220),(770,359)],fill='#3c4244')
d.rectangle((733,231,752,353),fill='#111d27');d.pieslice((724,203,761,250),180,360,fill='#101d27')
for y in range(134,353,19):d.line((704,y,763,y+2),fill='#222e34',width=2)
# Broken pillars left framing, visible through menu gradient.
for x,y,h in [(80,207,189),(128,231,144),(404,276,81),(651,293,89)]:
    d.rectangle((x,y,x+17,y+h),fill='#3e4546');d.rectangle((x+2,y+3,x+6,y+h),fill='#555b56');d.rectangle((x-5,y,x+23,y+9),fill='#60665d');d.rectangle((x-6,y+h-7,x+25,y+h+3),fill='#454e48')
    for by in range(y+19,y+h,24):d.line((x,by,x+17,by),fill='#293638',width=2)
d.polygon([(0,409),(90,390),(198,412),(319,382),(433,380),(491,391),(562,385),(637,372),(800,398),(800,500),(0,500)],fill='#18252b')
# Worn path and scattered rubble.
d.polygon([(464,379),(503,379),(622,500),(330,500)],fill='#39403e')
for y in range(393,500,16):
    spread=(y-370)*.85;d.line((int(480-spread),y,int(488+spread),y+3),fill='#202b2e',width=3)
for i in range(280):
    x=random.randrange(W);y=random.randrange(398,H);c=random.choice(['#39413c','#41463d','#283830','#4d5143']);d.rectangle((x,y,x+random.randint(1,7),y+random.randint(1,3)),fill=c)
# Foreground hero, torch, grasses, spectral motes.
hero=sprite('knight',0).resize((112,112),Image.Resampling.NEAREST);im.alpha_composite(hero,(488,354));d=ImageDraw.Draw(im)
d.ellipse((508,446,589,462),fill='#0f1b2450')
im.alpha_composite(hero,(488,354));d=ImageDraw.Draw(im)
for i in range(85):
    x=random.randrange(W);y=random.randrange(420,500);d.line((x,y,x+random.randrange(-5,5),y-random.randrange(3,13)),fill='#111f25',width=2)
for i in range(35):
    x=random.randrange(320,780);y=random.randrange(230,457);d.rectangle((x,y,x+1,y+1),fill=random.choice(['#b58e6a','#92a499','#74857d']))
im.convert('RGB').resize((1600,1000),Image.Resampling.NEAREST).save(OUT/'vista.png',optimize=True)
icon=Image.new('RGBA',(64,64));d=ImageDraw.Draw(icon);d.ellipse((5,5,59,59),fill='#c39474');d.ellipse((7,3,54,50),fill='#141b25');icon.save(OUT/'icon.png')
light=Image.new('RGBA',(256,256))
pixels=light.load()
for y in range(256):
    for x in range(256):
        falloff=max(0,1-math.hypot(x-128,y-128)/128)**2
        pixels[x,y]=(104,118,105,int(falloff*80))
light.save(OUT/'light.png')
# Additional original icons and four distinct ground patterns for Endless.
for kind in ['axe','spear','hammer','dual','blood','scythe','firestaff','froststaff','arcanestaff','stormstaff','meteorstaff','shadowstaff','soulbook','hunting','shortbow','crossbow','longbow','poisonbow','scatterbow','shadowbow','armor','magnet','ferocity','fortune','catalyst','leech','arrow']:
    im=Image.new('RGBA',(32,32));d=ImageDraw.Draw(im)
    colors={'firestaff':'#e3996f','froststaff':'#98d7da','arcanestaff':'#ad93d8','stormstaff':'#ddd398','meteorstaff':'#cf775f','shadowstaff':'#9480b9','poisonbow':'#a4c285','shadowbow':'#b095cf','blood':'#d08092'}
    c=colors.get(kind,'#c3b699')
    if 'staff' in kind:
        d.line((9,29,21,7),fill='#3b3038',width=5);d.line((10,29,22,7),fill='#aa9279',width=2)
        d.polygon([(22,1),(29,8),(23,15),(17,9)],fill=c);d.line((22,4,25,8),fill='#f0e5d1',width=2)
    elif 'bow' in kind or kind=='hunting':
        d.line([(8,3),(20,7),(25,15),(20,24),(8,29)],fill=c,width=3);d.line((8,3,8,29),fill='#7f8990',width=1)
        d.line((3,16,28,16),fill='#bcc7c2',width=2);d.polygon([(27,12),(31,16),(27,20)],fill='#c2c9c5')
        if kind=='scatterbow':d.line((5,11,27,7),fill=c);d.line((5,21,27,25),fill=c)
    elif kind=='soulbook':
        d.polygon([(4,7),(16,10),(29,6),(28,27),(16,30),(4,26)],fill='#574b72');d.line((16,10,16,29),fill='#bcb1a0',width=2)
        for y in (14,19,24):d.line((7,y,12,y+2),fill='#a6bdc9');d.line((20,y,25,y-2),fill='#a6bdc9')
    elif kind in ('armor','magnet','ferocity','fortune','catalyst','leech'):
        d.polygon([(16,2),(28,9),(26,24),(16,30),(5,23),(4,9)],fill='#514955');d.polygon([(16,5),(25,10),(23,22),(16,27),(8,21),(7,10)],fill=c)
        if kind=='armor':d.line((16,8,16,24),fill='#515e70',width=3);d.line((10,14,22,14),fill='#515e70',width=3)
        elif kind=='magnet':d.arc((10,8,22,22),0,180,fill='#476779',width=4)
        elif kind=='fortune':d.polygon([(16,8),(22,16),(16,24),(10,16)],fill='#f0d790')
        elif kind=='catalyst':d.polygon([(16,7),(22,18),(16,24),(10,19)],fill='#aa5e51')
        else:d.polygon([(16,8),(20,19),(16,24),(12,19)],fill='#945367')
    elif kind=='arrow':d.line((16,29,16,6),fill='#b3ab8b',width=2);d.polygon([(16,1),(21,10),(16,8),(11,10)],fill='#e1d9c3');d.line((12,24,16,29),fill='#8e9e92',width=2)
    else:
        d.line((6,28,24,5),fill='#615267',width=5);d.line((8,27,25,5),fill='#d0c7b7',width=2)
        if kind=='axe':d.polygon([(18,4),(29,3),(29,14),(23,17),(21,9)],fill=c)
        elif kind=='hammer':d.polygon([(15,4),(22,1),(31,9),(25,15)],fill='#9c9ea6')
        elif kind=='scythe':d.line([(11,6),(19,2),(28,5),(31,14)],fill=c,width=4)
        elif kind=='spear':d.polygon([(25,1),(28,10),(22,9)],fill=c)
        elif kind=='dual':d.line((25,28,7,5),fill=c,width=3)
        else:d.line((9,20,18,27),fill='#b89a71',width=3)
    im.save(OUT/f'icon-{kind}.png')
for idx,bg,palette in [(1,'#172b25',['#20362b','#2b3a2c','#1d302b']), (2,'#30252a',['#3a2a30','#36232b','#29232a']), (3,'#312720',['#3c2e22','#3b2924','#292322']), (4,'#222337',['#282b40','#242839','#2b2740'])]:
    im=Image.new('RGB',(256,256),bg);d=ImageDraw.Draw(im)
    for i in range(12000):
        x=random.randrange(256);y=random.randrange(256);d.rectangle((x,y,x+1,y+1),fill=random.choice(palette))
    if idx==1:
        for i in range(100):
            x=random.randrange(256);y=random.randrange(256);d.line([(x,y),(x-2,y-5),(x-4,y-2)],fill='#3e4d36',width=1)
    elif idx==2:
        for y in range(0,256,32):
            d.line((0,y,255,y),fill='#191e27');
            for x in range((y//32%2)*32,256,64):d.line((x,y,x,y+31),fill='#191e27')
        for i in range(10):
            x=random.randrange(240);y=random.randrange(240);d.line((x,y,x+14,y+9),fill='#54303c',width=3)
    elif idx==3:
        for i in range(18):
            x=random.randrange(230);y=random.randrange(210);d.line([(x,y),(x+12,y+8),(x+8,y+20),(x+23,y+32)],fill='#82523a',width=2)
    else:
        for i in range(25):
            x=random.randrange(250);y=random.randrange(250);d.polygon([(x,y),(x+4,y-7),(x+7,y),(x+4,y+2)],fill='#545474')
    im.save(OUT/f'ground{idx}.png')

print(f'Generated {len(list(OUT.glob("*.png")))} original PNG assets in {OUT}')
