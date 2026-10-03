"""Export the generated poses to native Phaser frames without smooth scaling.

Usage: python export.py concept-sheet.png
"""
from pathlib import Path
import sys, json, itertools
from PIL import Image, ImageDraw, ImageFont

here = Path(__file__).resolve().parent
source = Image.open(sys.argv[1]).convert('RGBA')
alpha = source.getchannel('A').point(lambda p: 255 if p >= 128 else 0)
source.putalpha(alpha)
# Extract complete poses by transparent column gaps within each source row.
# Source coordinates are generation-specific, not the final Phaser grid.
poses = {}
for row, (top,bottom) in enumerate(((0,340),(340,600),(600,887))):
    strip = source.crop((0,top,source.width,bottom))
    active = [bool(strip.getchannel('A').crop((x,0,x+1,strip.height)).getbbox()) for x in range(strip.width)]
    # A tiny detached highlight separated by one pixel belongs to its pose.
    for x in range(1,len(active)-1):
        if not active[x] and active[x-1] and active[x+1]:
            active[x] = True
    runs, offset = [], 0
    for occupied, group in itertools.groupby(active):
        length = len(list(group))
        if occupied:
            runs.append((offset, offset+length))
        offset += length
    assert len(runs) == (5 if row == 1 else 6), (row, runs)
    for col, (left,right) in enumerate(runs):
        pose = strip.crop((left,0,right,strip.height))
        bbox = pose.getchannel('A').getbbox()
        poses[row,col] = pose.crop(bbox)

ordered = [poses[0,c] for c in range(6)] + [poses[1,c] for c in range(5)] + [poses[2,c] for c in range(6)]
# One shared palette for all states; invisible RGB never participates.
colors = []
for pose in ordered:
    colors.extend((r,g,b) for r,g,b,a in pose.getdata() if a)
palette_sample = Image.new('RGB',(len(colors),1))
palette_sample.putdata(colors)
palette = palette_sample.quantize(colors=32, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
frames = []
base_scale = 42/ordered[0].height
for index, pose in enumerate(ordered):
    scale = base_scale if 7 <= index <= 10 else 42/pose.height
    # Planted-foot horizontal center, independent of cloak/weapon extent.
    if 7 <= index <= 10:
        root_x = pose.width/2
    else:
        xs = [x for y in range(max(0,pose.height-4),pose.height) for x in range(pose.width) if pose.getpixel((x,y))[3]]
        root_x = (min(xs)+max(xs))/2 if xs else pose.width/2
    scale = min(scale, 29/max(root_x,1), 29/max(pose.width-root_x,1))
    size = (max(1,round(pose.width*scale)), max(1,round(pose.height*scale)))
    native = pose.resize(size,Image.Resampling.NEAREST)
    opaque = native.getchannel('A')
    native = native.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGBA')
    native.putalpha(opaque)
    x, y = 32-round(root_x*scale), 55-native.height
    assert x >= 2 and x+native.width <= 62 and y >= 2
    frame = Image.new('RGBA',(64,64))
    frame.alpha_composite(native,(x,y))
    bounds = frame.getchannel('A').getbbox()
    assert bounds and bounds[0] >= 2 and bounds[2] <= 62 and bounds[1] >= 2 and bounds[3] == 55
    frames.append(frame)

sheet = Image.new('RGBA',(64*17,64))
for index,frame in enumerate(frames):
    sheet.alpha_composite(frame,(index*64,0))
out = here.parents[1]/'public'/'assets'/'arcanist-v1.png'
assert not out.exists(), 'Never overwrite an existing asset'
sheet.save(out)
states = [('idle',0,1,3,-1),('walk',2,5,10,-1),('hit',6,6,8,0),('death',7,10,7,0),('cast',11,16,12,0)]
metadata = {'textureKey':'arcanist-v1','image':'assets/arcanist-v1.png','frameWidth':64,'frameHeight':64,'sheetWidth':1088,'sheetHeight':64,'frameCount':17,'margin':0,'spacing':0,'footAnchor':{'x':32,'y':54},'recommendedOrigin':{'x':0.5,'y':54/64},'direction':'southeast; horizontal flip for southwest','animations':[{'key':'arcanist-'+name,'start':start,'end':end,'frameRate':fps,'repeat':repeat} for name,start,end,fps,repeat in states],'hitHoldMs':125,'castReleaseFrame':15,'deathFinalFrame':10}
(out.with_suffix('.json')).write_text(json.dumps(metadata,indent=2)+'\n',encoding='utf-8')

font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14)
preview = Image.new('RGB',(640,230),'#191c24')
draw = ImageDraw.Draw(preview)
for col,(name,start,end,fps,repeat) in enumerate(states):
    x = col*128
    draw.text((x+8,8),name,font=font,fill='#cbdfe2')
    preview.paste(frames[start],(x+32,38),frames[start])
    zoom = frames[start].resize((112,112),Image.Resampling.NEAREST)
    preview.paste(zoom,(x+8,108),zoom)
preview.save(here/'preview.png')

gifframes=[]
for tick in range(48):
    canvas=Image.new('RGB',(640,230),'#191c24')
    draw=ImageDraw.Draw(canvas)
    for col,(name,start,end,fps,repeat) in enumerate(states):
        count=end-start+1
        # Pause between one-shot cycles to make hit and death easy to inspect.
        period = count if repeat == -1 else count+12
        local = (tick*fps//10)%period
        index = start+min(local,count-1)
        x=col*128
        draw.text((x+8,8),name,font=font,fill='#cbdfe2')
        canvas.paste(frames[index],(x+32,38),frames[index])
        canvas.paste(frames[index].resize((112,112),Image.Resampling.NEAREST),(x+8,108),frames[index].resize((112,112),Image.Resampling.NEAREST))
    gifframes.append(canvas)
gifframes[0].save(here/'preview.gif',save_all=True,append_images=gifframes[1:],duration=100,loop=0,disposal=2)
report = {'imageSize':list(sheet.size),'frames':len(frames),'opaquePaletteColors':len({(r,g,b) for r,g,b,a in sheet.getdata() if a}),'alphaValues':sorted(set(sheet.getchannel('A').getdata())),'allFramesContained':True,'footBaselineInclusive':54,'duplicateFramePairs':[[a,b] for a in range(17) for b in range(a+1,17) if frames[a].tobytes()==frames[b].tobytes()],'sourcePoseCount':len(poses)}
(here/'validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,indent=2))

