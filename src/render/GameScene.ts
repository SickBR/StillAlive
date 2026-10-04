import Phaser from 'phaser';
import { Engine, type GameEvent } from '../core/engine';
import { ENEMIES, WORLD, CLASSES, DIFFICULTIES, WEAPONS, isBoss } from '../core/config';
import { Random } from '../core/random';
import type { Settings } from '../core/storage';

interface Effect extends GameEvent { life: number; maxLife: number; id: number }
interface Label { text: Phaser.GameObjects.Text; life: number; maxLife: number; x: number; y: number; crit?: boolean }
export class GameScene extends Phaser.Scene {
  engine?:Engine;
  settings!:Settings;
  onTick:()=>void=()=>{};
  onEvent:(e:GameEvent)=>void=()=>{};
  onPause:()=>void=()=>{};
  onReady:()=>void=()=>{};
  private terrain!:Phaser.GameObjects.TileSprite;
  private props:Phaser.GameObjects.Image[]=[];
  private hero!:Phaser.GameObjects.Image;
  private glow!:Phaser.GameObjects.Image;
  private floorFx!:Phaser.GameObjects.Graphics;
  private fx!:Phaser.GameObjects.Graphics;
  private lighting!:Phaser.GameObjects.Graphics;
  private keys!:Record<string,Phaser.Input.Keyboard.Key>;
  private images=new Map<string,Phaser.GameObjects.Image>();
  private pool:Phaser.GameObjects.Image[]=[];
  private effects:Effect[]=[];
  private labels:Label[]=[];
  private textPool:Phaser.GameObjects.Text[]=[];
  private lastDirection=1;
  private dashRequested=false;
  private deathTime=0;
  private effectId=0;
  constructor(){super('arena');}
  preload(){
    for(const key of ['knight','mage','archer',...Object.keys(ENEMIES)])this.load.spritesheet(key,`assets/${key}.png`,{frameWidth:64,frameHeight:64});
    for(const key of ['ground','ground1','ground2','ground3','ground4','pillar','grave','tree','light','icon-xp','icon-heal','icon-fire','icon-orb','icon-arrow','icon-frost'])this.load.image(key,`assets/${key}.png`);
  }
  create(){
    this.terrain=this.add.tileSprite(0,0,WORLD.width,WORLD.height,'ground').setOrigin(0).setDepth(-100);
    const ground=this.add.graphics().setDepth(-95), rng=new Random(8821);
    ground.lineStyle(2,0x727665,.16);
    for(let i=0;i<4;i++)ground.strokeCircle(WORLD.width/2,WORLD.height/2,125+i*12);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;ground.lineBetween(1600+Math.cos(a)*122,1200+Math.sin(a)*122,1600+Math.cos(a)*169,1200+Math.sin(a)*169);}
    for(let i=0;i<110;i++){
      const x=rng.between(70,WORLD.width-70),y=rng.between(80,WORLD.height-70);
      if(Math.hypot(x-1600,y-1200)<210)continue;
      const key=rng.pick(['grave','grave','pillar','tree']);
      this.props.push(this.add.image(x,y,key).setOrigin(.5,.85).setDepth(y-45).setAlpha(.72).setScale(key==='tree'?1.3:1));
    }
    const border=this.add.graphics().setDepth(-90);border.lineStyle(20,0x151d23,.8);border.strokeRect(12,12,WORLD.width-24,WORLD.height-24);border.lineStyle(2,0x788076,.3);border.strokeRect(28,28,WORLD.width-56,WORLD.height-56);
    this.floorFx=this.add.graphics().setDepth(-10);
    this.glow=this.add.image(1600,1200,'light').setScale(2.5).setDepth(-50).setBlendMode(Phaser.BlendModes.ADD).setAlpha(.75);
    this.hero=this.add.image(1600,1200,'knight').setScale(1.2).setOrigin(.5,.72);
    this.fx=this.add.graphics().setDepth(10000);
    this.lighting=this.add.graphics().setScrollFactor(0).setDepth(12000);
    this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height).setZoom(1.08).startFollow(this.hero,true,.09,.09);
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ESC,P',false) as Record<string,Phaser.Input.Keyboard.Key>;
    this.keys.ESC.on('down',()=>this.onPause());this.keys.P.on('down',()=>this.onPause());
    this.keys.SPACE.on('down',()=>{if(this.engine?.status==='playing')this.dashRequested=true;});
    this.onReady();
  }
  startRun(engine:Engine){
    this.engine=engine;this.terrain.setTexture(engine.config.difficulty?'ground'+engine.config.difficulty:'ground');this.hero.setTexture(CLASSES[engine.config.classId].texture);for(const [i,prop] of this.props.entries()){prop.setTint(DIFFICULTIES[engine.config.difficulty].color);prop.setTexture(engine.config.difficulty===1?(i%3?'tree':'grave'):engine.config.difficulty===2?(i%3?'grave':'pillar'):engine.config.difficulty===3?(i%4?'pillar':'tree'):i%3?'grave':'pillar');}this.effects=[];this.dashRequested=false;this.deathTime=0;
    for(const image of this.images.values()){image.setVisible(false);this.pool.push(image);}this.images.clear();
    for(const label of this.labels){label.text.setVisible(false);this.textPool.push(label.text);}this.labels=[];
    this.hero.setPosition(engine.player.x,engine.player.y).setFrame(0).setAlpha(1).setAngle(0).clearTint();this.cameras.main.centerOn(engine.player.x,engine.player.y);
    for(const key of Object.values(this.keys))key.reset();
  }
  clearRun(){this.engine=undefined;this.effects=[];this.fx.clear();this.floorFx.clear();for(const image of this.images.values()){image.setVisible(false);this.pool.push(image);}this.images.clear();for(const label of this.labels){label.text.setVisible(false);this.textPool.push(label.text);}this.labels=[];}
  private image(key:string,texture:string,x:number,y:number,seen:Set<string>){
    seen.add(key);let image=this.images.get(key);
    if(!image){image=this.pool.pop()??this.add.image(x,y,texture);this.images.set(key,image);}
    if(image.texture.key!==texture)image.setTexture(texture);image.setPosition(x,y).setVisible(true).setAlpha(1).setScale(1).setRotation(0).setFlipX(false).setOrigin(.5).clearTint();return image;
  }
  update(_time:number,delta:number){
    const e=this.engine;if(!e)return;
    const dt=Math.min(delta/1000,.05),k=this.keys;
    if(e.status==='playing')e.step(dt,{x:Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown),y:Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown),dash:this.dashRequested});
    this.dashRequested=false;
    for(const event of e.drainEvents()){this.event(event);this.onEvent(event);}
    this.renderWorld(e,e.status==='playing'||e.status==='dead'||e.status==='retired'?dt:0);
    this.onTick();
  }
  private event(event:GameEvent){
    const life=event.type==='lightning'?.22:event.type==='blade'?.25:event.type==='death'?.48:event.type==='dash'?.45:.65;
    if(['blade','thrust','frost','lightning','dash','death','impact','charge','overload'].includes(event.type)&&this.effects.length<180)this.effects.push({...event,life,maxLife:life,id:this.effectId++});
    if(event.type==='hit'&&this.settings.numbers&&this.labels.length<55){
      const text=this.textPool.pop()??this.add.text(0,0,'',{fontFamily:'"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',fontStyle:'bold',fontSize:'16px',stroke:'#07080b',strokeThickness:4}).setDepth(11000).setOrigin(.5);
      text.setText(String(event.value)).setColor(event.crit?'#ffd27a':'#ece3cd').setFontSize(event.crit?24:15).setVisible(true).setAlpha(1).setScale(1);
      this.labels.push({text,life:event.crit?.8:.65,maxLife:event.crit?.8:.65,x:event.x+(Math.random()-.5)*14,y:event.y-30,crit:event.crit});
    }
    if(this.settings.shake&&(event.type==='hurt'||event.type==='boss'))this.cameras.main.shake(event.type==='boss'?350:110,event.type==='boss'?.004:.0025);
  }
  private renderWorld(e:Engine,dt:number){
    const p=e.player, seen=new Set<string>(),floor=this.floorFx,fx=this.fx;floor.clear();fx.clear();
    floor.fillStyle(0x080f16,.35);floor.fillEllipse(p.x,p.y+9,42,18);
    floor.lineStyle(1,e.eclipse?0xc89da9:0xa8b4a3,.18);floor.strokeCircle(p.x,p.y,33);
    this.hero.setPosition(p.x,p.y).setDepth(8500);
    this.glow.setPosition(p.x,p.y);
    if(p.directionX!==0)this.lastDirection=p.directionX<0?-1:1;
    this.hero.setFlipX(this.lastDirection<0);
    if(e.status==='dead')this.deathTime+=dt;
    const frame=e.status==='dead'?7+Math.min(3,Math.floor(this.deathTime*8)):p.invulnerable>0&&p.dashLeft===0?6:p.moving?2+Math.floor(e.time*10)%4:Math.floor(e.time*2)%2;
    this.hero.setFrame(frame).setAlpha(p.dashLeft>0?.6:p.invulnerable>0?.72+Math.sin(e.time*50)*.25:1);
    for(const enemy of e.enemies){
      const scale=isBoss(enemy.kind)?2.4:enemy.kind==='brute'?1.4:enemy.kind==='reaper'?1.25:1;
      floor.fillStyle(0x080e17,.32);floor.fillEllipse(enemy.x,enemy.y+10,32*scale,12*scale);
      const image=this.image(`e${enemy.id}`,enemy.kind,enemy.x,enemy.y,seen).setScale(scale).setOrigin(.5,.72).setDepth(enemy.y).setFlipX(enemy.facing<0);
      image.setFrame(enemy.flash>0?6:2+(Math.floor(e.time*(enemy.kind==='crawler'?13:7)+enemy.id)%4));
      if(enemy.slow>0)image.setTint(0xa3dfe9);else if(enemy.dots.poison)image.setTint(0x90bd75);else if(enemy.dots.burn)image.setTint(0xffb682);if(enemy.marks>=3&&e.config.classId==='archer'){fx.lineStyle(1,0xd4c999,.7);fx.strokeRect(enemy.x-7,enemy.y-47,14,5);}
      if(enemy.charge>.5){floor.lineStyle(2,0xe89e9d,.55);floor.lineBetween(enemy.x,enemy.y,enemy.x+enemy.chargeX*210,enemy.y+enemy.chargeY*210);}
      if(!isBoss(enemy.kind)&&enemy.hp<enemy.maxHp&&(enemy.kind==='brute'||enemy.kind==='reaper')){fx.fillStyle(0x131720,.8);fx.fillRect(enemy.x-18,enemy.y-49,36,3);fx.fillStyle(0xc18687);fx.fillRect(enemy.x-18,enemy.y-49,36*Math.max(0,enemy.hp/enemy.maxHp),3);}
    }
    for(const drop of e.loot){
      const image=this.image(`l${drop.id}`,drop.heal?'icon-heal':'icon-xp',drop.x,drop.y+Math.sin(e.time*3+drop.id)*2,seen).setScale(drop.heal?.62:drop.value>5?.65:.44).setDepth(drop.y-20);
      image.setAlpha(.85+Math.sin(e.time*2+drop.id)*.15);
    }
    for(const b of e.projectiles.slice(0,280)){
      this.image(`b${b.id}`,WEAPONS[b.weapon].class==='archer'?'icon-arrow':WEAPONS[b.weapon].ailment==='frost'?'icon-frost':'icon-fire',b.x,b.y,seen).setScale(b.enemy?.48:.65).setRotation(Math.atan2(b.vy,b.vx)+Math.PI/2).setDepth(9000).setTint(WEAPONS[b.weapon].ailment==='poison'?0x91d798:0xffffff);
      fx.lineStyle(b.enemy?2:3,b.enemy?0xc381b8:0xf0b67c,.4);fx.lineBetween(b.x,b.y,b.x-b.vx*.055,b.y-b.vy*.055);
    }
    for(const [i,orb] of e.orbPositions().entries()){
      this.image(`o${i}`,'icon-orb',orb.x,orb.y,seen).setScale(.85).setDepth(9000).setRotation(e.time+i);
      floor.lineStyle(1,0x9fbee8,.12);floor.strokeCircle(p.x,p.y,Math.hypot(orb.x-p.x,orb.y-p.y));
    }
    for(const w of e.warnings){floor.fillStyle(0xc34c67,.1+(1-w.remaining/w.duration)*.15);floor.fillCircle(w.x,w.y,w.radius);floor.lineStyle(2,0xd58391,.75);floor.strokeCircle(w.x,w.y,w.radius);floor.lineStyle(2,0xedb99c,.8);floor.strokeCircle(w.x,w.y,w.radius*(1-w.remaining/w.duration));}
    for(const effect of this.effects){
      effect.life-=dt;const t=1-effect.life/effect.maxLife,a=Math.max(0,1-t),r=effect.radius??50;
      if(effect.type==='blade'){
        const angle=effect.angle??0;fx.lineStyle(9,0xbaa4db,a*.6);fx.beginPath();fx.arc(effect.x,effect.y,r*(.7+t*.3),angle-1.8+t*.8,angle+1.5+t*.5,false);fx.strokePath();
        fx.lineStyle(2,0xe5d7f0,a);fx.beginPath();fx.arc(effect.x,effect.y,r*(.74+t*.3),angle-1.6+t*.8,angle+1.3+t*.5,false);fx.strokePath();
      }else if(effect.type==='thrust'&&effect.points){fx.lineStyle(5,0xd3c9a5,a*.65);fx.strokePoints(effect.points);fx.lineStyle(1,0xf7ead4,a);fx.strokePoints(effect.points);
      }else if(effect.type==='lightning'&&effect.points){
        const points=effect.points;fx.lineStyle(5,0xcabf83,a*.25);fx.strokePoints(points);fx.lineStyle(2,0xffeac0,a);fx.beginPath();fx.moveTo(points[0].x,points[0].y);
        for(let i=1;i<points.length;i++){const from=points[i-1],to=points[i];fx.lineTo((from.x+to.x)/2+Math.sin(i*7)*15,(from.y+to.y)/2+Math.cos(i*3)*15);fx.lineTo(to.x,to.y);}fx.strokePath();
      }else if(effect.type==='death'){
        if(effect.kind)this.image(`fx${effect.id}`,effect.kind,effect.x,effect.y,seen).setFrame(7+Math.min(3,Math.floor(t*4))).setOrigin(.5,.72).setAlpha(a).setDepth(effect.y-10).setScale(effect.kind&&isBoss(effect.kind as keyof typeof ENEMIES)?2.4:effect.kind==='brute'?1.4:1);
        if(this.settings.particles){fx.fillStyle(0xa390ad,a*.65);for(let i=0;i<7;i++){const angle=i*2.4;fx.fillRect(effect.x+Math.cos(angle)*t*35,effect.y+Math.sin(angle)*t*25-10,3,3);}}
      }else{
        const color=effect.type==='frost'?0xaddddd:effect.type==='impact'?0xe89e95:0xbca1d5;
        fx.lineStyle(3,color,a*.8);fx.strokeCircle(effect.x,effect.y,r*(.2+t*.8));fx.lineStyle(1,color,a*.5);fx.strokeCircle(effect.x,effect.y,r*(.15+t*.65));
        if(this.settings.particles)for(let i=0;i<12;i++){const angle=i/12*Math.PI*2+t;fx.fillStyle(color,a*.65);fx.fillRect(effect.x+Math.cos(angle)*r*t,effect.y+Math.sin(angle)*r*t,3,3);}
      }
    }
    this.effects=this.effects.filter(effect=>effect.life>0);
    for(const [key,image] of this.images)if(!seen.has(key)){image.setVisible(false);this.pool.push(image);this.images.delete(key);}
    const remaining:Label[]=[];
    for(const label of this.labels){label.life-=dt;if(label.life<=0){label.text.setVisible(false);this.textPool.push(label.text);}else{const age=1-label.life/label.maxLife;label.text.setPosition(label.x,label.y-age*29).setAlpha(Math.min(1,label.life*3)).setScale(label.crit?1+Math.max(0,.18-age)*3:1);remaining.push(label);}}
    this.labels=remaining;
    this.lighting.clear();
    if(e.eclipse){this.lighting.fillStyle(0x322035,.14);this.lighting.fillRect(0,0,1280,720);}
    const boss=e.boss;
    if(boss&&Math.hypot(boss.x-p.x,boss.y-p.y)>280){
      const a=Math.atan2(boss.y-p.y,boss.x-p.x),x=p.x+Math.cos(a)*235,y=p.y+Math.sin(a)*235;
      fx.fillStyle(0xe5b88c,.85);fx.fillTriangle(x+Math.cos(a)*12,y+Math.sin(a)*12,x+Math.cos(a+2.4)*9,y+Math.sin(a+2.4)*9,x+Math.cos(a-2.4)*9,y+Math.sin(a-2.4)*9);
    }
    if(p.hp/p.maxHp<.28){this.lighting.lineStyle(24,0x9e4456,.1+Math.sin(e.time*4)*.04);this.lighting.strokeRect(0,0,1280,720);}
  }
  get diagnostics(){return {images:this.images.size,pooled:this.pool.length,effects:this.effects.length,labels:this.labels.length,displayObjects:this.children.length};}
}
