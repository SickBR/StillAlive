import {ENEMIES,RULES,WORLD,WEAPONS,WEAPON_IDS,PASSIVE_IDS,CLASSES,DIFFICULTIES,isBoss,reduction,enemyScaling,weaponStats,weaponRank,xpForLevel,type EnemyKind,type WeaponId,type PassiveId,type Ailment} from './config';
import {FLOOR_RULES,floorDifficulty,floorPopulation,floorSpawnInterval} from './floors';
import {goldReward,fragmentReward} from './economy';
import {Random} from './random';
import {SpatialHash} from './spatial';
import {choices,initialBuild,type Upgrade} from './upgrades';
import {defaultRunConfig,type RunConfig,type MasteryId} from './meta';
export interface Enemy {id:number;kind:EnemyKind;x:number;y:number;hp:number;maxHp:number;radius:number;speed:number;damage:number;slow:number;flash:number;attack:number;orbHit:number;orbitHits:Partial<Record<WeaponId,number>>;facing:number;chargeX:number;chargeY:number;charge:number;marks:number;dots:Partial<Record<Ailment,{left:number;dps:number;source:WeaponId}>>;summoned:boolean}
export interface Projectile {id:number;x:number;y:number;vx:number;vy:number;damage:number;enemy:false;life:number;radius:number;target:number;pierce:number;hit:Set<number>;weapon:WeaponId}
export interface Loot {id:number;x:number;y:number;value:number;heal:boolean}
export interface Warning {id:number;x:number;y:number;radius:number;remaining:number;duration:number;damage:number;source:number}
export interface GameEvent {type:string;x:number;y:number;value?:number;crit?:boolean;angle?:number;radius?:number;points?:{x:number;y:number}[];kind?:string}
export type Status='playing'|'paused'|'upgrade'|'floorReward'|'floorReady'|'dead'|'retired';
export interface EngineOptions {floorDuration?:number}
export interface Input {x:number;y:number;dash?:boolean}
const dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export class Engine {
 balanceVersion=4;nextChoiceAt=0;
 floor=1;floorTime=0;floorDuration:number=FLOOR_RULES.duration;completedFloors=0;rewardOffers:Upgrade[]=[];chosenReward:Upgrade|null=null;
 rng:Random;config:RunConfig;status:Status='playing';time=0;kills=0;level=1;xp=0;damageDealt=0;gold=0;souls=0;creditedGold=0;creditedSouls=0;bossKills=0;nextBoss=RULES.bossAt;masteryPower=0;rage=0;casts=0;healBudget=0;nextFormation=75;bossSpawned=false;bossDefeated=false;
 build=initialBuild();player={x:WORLD.width/2,y:WORLD.height/2,hp:125,maxHp:125,invulnerable:0,dashLeft:0,dashCooldown:0,directionX:0,directionY:1,moving:false};
 enemies:Enemy[]=[];projectiles:Projectile[]=[];loot:Loot[]=[];warnings:Warning[]=[];events:GameEvent[]=[];offers:Upgrade[]=[];grid=new SpatialHash<Enemy>();
 cooldowns=Object.fromEntries(WEAPON_IDS.map(id=>[id,.25])) as Record<WeaponId,number>;
 weaponDamage=Object.fromEntries([...WEAPON_IDS,'dash'].map(id=>[id,0])) as Record<WeaponId|'dash',number>;
 private nextId=1;private spawnClock=6;private eclipseWas=false;private autoMasteryClock=0;
 constructor(seed?:number,config:RunConfig=defaultRunConfig(),options:EngineOptions={}){
  if(options.floorDuration!==undefined){if(!Number.isFinite(options.floorDuration)||options.floorDuration<FLOOR_RULES.minimumTestDuration||options.floorDuration>FLOOR_RULES.duration)throw new RangeError('Invalid floor duration');this.floorDuration=options.floorDuration;}
  this.rng=new Random(seed);this.config=structuredClone(config);this.build=initialBuild(config.startWeapon);
  this.player.maxHp=this.player.hp=CLASSES[config.classId].hp+config.permanent.health*5+this.mastery('guardian')*3;
  this.spawnOpening();
 }
 private spawnOpening(){
  for(let i=0;i<RULES.openingCount;i++){const a=(i%2?Math.PI:0)+(Math.floor(i/2)-4)*.12,r=RULES.openingRadius+(i%4)*60;this.spawn(i%6===0?'crawler':'hollow',this.player.x+Math.cos(a)*r,this.player.y+Math.sin(a)*r);}
 }
 mastery(id:MasteryId){return this.config.masteries.includes(id)?this.config.masteryLevels[id]:0;}
 get eclipse(){return false;}
 get floorProgress(){return this.floorTime/this.floorDuration;}
 get floorRemaining(){return Math.max(0,this.floorDuration-this.floorTime);}
 get encounterTime(){return this.floorProgress*FLOOR_RULES.duration+Math.min(FLOOR_RULES.maximumEncounterAdvance,(this.floor-1)*FLOOR_RULES.encounterAdvancePerFloor);}
 get damageMultiplier(){return CLASSES[this.config.classId].damage*(1+this.config.permanent.attack*.02+this.build.passives.power*.08+this.masteryPower*.01)*(this.config.classId==='warrior'?1+this.rage*(.3+this.mastery('berserker')*.06):1)*(this.eclipse?1.12:1);}
 get attackSpeed(){return Math.min(3,1+this.build.passives.haste*.06+this.mastery('storm')*.05);}
 get rangeMultiplier(){return 1+this.build.passives.reach*.06;}
 get playerSpeed(){return CLASSES[this.config.classId].speed*(1+this.build.passives.speed*.04+this.config.permanent.speed*.01);}
 get defense(){return CLASSES[this.config.classId].defense+this.config.permanent.defense*2+this.build.passives.armor*6+this.mastery('guardian')*4;}
 get criticalChance(){return Math.min(.75,CLASSES[this.config.classId].crit+this.build.passives.crit*.03+this.config.permanent.crit*.005);}
 get criticalDamage(){return 1.7+this.build.passives.ferocity*.12+this.config.permanent.critDamage*.03;}
 get pickupRadius(){return RULES.pickupRadius*(1+this.build.passives.magnet*.18+this.mastery('soulhunter')*.06);}
 get dashCooldown(){return RULES.dashCooldown-this.mastery('soulwarrior')*.3;}
 get boss(){return this.enemies.find(e=>isBoss(e.kind)&&e.hp>0);}
 get completeBuild(){return !this.config.weapons.some(id=>this.build.weapons[id]<RULES.weaponMax&&(this.build.weapons[id]>0||Object.values(this.build.weapons).filter(Boolean).length<8))&&!this.config.passives.some(id=>this.build.passives[id]<8&&(this.build.passives[id]>0||Object.values(this.build.passives).filter(Boolean).length<8));}
 drainEvents(){const out=this.events;this.events=[];return out;}
 emit(type:string,x=this.player.x,y=this.player.y,extra:Partial<GameEvent>={}){if(this.events.length<900)this.events.push({type,x,y,...extra});}
 pause(){if(this.status==='playing')this.status='paused';else if(this.status==='paused')this.status='playing';}
 retire(){if(this.status!=='dead'){this.status='retired';this.emit('retired');}}
 selectUpgrade(i:number){if(this.status!=='upgrade'||!this.offers[i])return false;this.applyUpgrade(this.offers[i]);this.offers=[];this.status='playing';this.nextChoiceAt=this.time+RULES.choiceInterval;return true;}
 applyUpgrade(u:Upgrade){
  if(u.recovery){if(u.recovery==='power')this.masteryPower++;if(u.recovery==='vitality'){this.player.maxHp+=4;this.player.hp+=4;}if(u.recovery==='heal')this.player.hp=Math.min(this.player.maxHp,this.player.hp+20);return;}
  if(u.id in WEAPONS){const id=u.id as WeaponId;if(!this.config.weapons.includes(id)||(this.build.weapons[id]===0&&Object.values(this.build.weapons).filter(Boolean).length>=8))return;this.build.weapons[id]=Math.min(RULES.weaponMax,this.build.weapons[id]+1);}
  else {const id=u.id as PassiveId;if(!this.config.passives.includes(id)||(this.build.passives[id]===0&&Object.values(this.build.passives).filter(Boolean).length>=8))return;if(this.build.passives[id]<8){this.build.passives[id]++;if(id==='vitality'){this.player.maxHp+=15;this.player.hp+=15;}}}
  // Rarity adds a small run-wide damage bonus, not unlimited healing.
  this.masteryPower+=u.bonus;this.emit('upgrade');
 }
 addXp(v:number){this.xp+=v;this.checkLevel();}
 private checkLevel(){if(this.status!=='playing')return;if(this.time<this.nextChoiceAt||this.xp<xpForLevel(this.level))return;this.xp-=xpForLevel(this.level);this.level++;this.player.hp=Math.min(this.player.maxHp,this.player.hp+1);
  if(this.completeBuild){this.autoMasteryClock++;this.masteryPower++;if(this.autoMasteryClock%5===0){this.player.maxHp+=4;this.player.hp+=4;}this.emit('mastery');return;}
  this.offers=choices(this.build,this.rng,this.config,this.build.passives.fortune*.015+this.config.permanent.luck*.01);this.status='upgrade';this.emit('level');}
 spawn(kind?:EnemyKind,x?:number,y?:number,summoned=false):Enemy|undefined{
  if(this.enemies.length>=RULES.enemyCap||(!kind||!isBoss(kind))&&this.enemies.length>=Math.min(RULES.enemyCap,floorPopulation(this.floor,this.floorProgress)+15))return;
  if(!kind){const roll=this.rng.next(),t=this.encounterTime;kind=t>=240&&roll<.04?'reaper':t>=160&&roll<.08?'seer':t>=100&&roll<.18?'brute':t>=75&&roll<.29?'armored':t>=55&&roll<.37?'charger':roll<.57?'crawler':'hollow';}
  if(kind==='charger'&&this.enemies.filter(e=>e.kind==='charger').length>=4+Math.floor(this.time/1200))kind='hollow';if(kind==='seer'&&this.enemies.filter(e=>e.kind==='seer').length>=3)kind='armored';
  if(x===undefined||y===undefined){const point=this.spawnPoint();x=point.x;y=point.y;}
  const s=ENEMIES[kind],d=DIFFICULTIES[this.config.difficulty],power=floorDifficulty(this.floor),localTime=this.floorProgress*FLOOR_RULES.duration,scale=enemyScaling(localTime)*d.hp*power.hp;
  const e:Enemy={id:this.nextId++,kind,x,y,hp:s.hp*scale,maxHp:s.hp*scale,speed:s.speed*d.speed*power.speed,damage:s.damage*d.damage*power.damage*(1+localTime/3600),radius:s.radius,slow:0,flash:0,attack:isBoss(kind)?2.5:this.rng.between(1,3),orbHit:0,orbitHits:{},facing:1,chargeX:0,chargeY:0,charge:0,marks:0,dots:{},summoned};this.enemies.push(e);return e;
 }
 private finishFloor(){
  this.time+=this.floorDuration-this.floorTime;
  this.floorTime=this.floorDuration;this.completedFloors=this.floor;this.status='floorReward';
  // Bank uncollected crystals before the arena is cleared; healing drops are not auto-consumed.
  for(const drop of this.loot)if(!drop.heal)this.xp+=drop.value*(1+this.build.passives.magnet*.04+this.mastery('soulhunter')*.06);
  this.enemies=[];this.projectiles=[];this.warnings=[];this.loot=[];this.grid.rebuild([]);this.offers=[];
  this.player.moving=false;this.player.dashLeft=0;this.rage=0;this.events=[];
  this.rewardOffers=choices(this.build,this.rng,this.config,this.build.passives.fortune*.015+this.config.permanent.luck*.01);
  this.chosenReward=null;this.emit('floor-complete');
 }
 selectFloorReward(index:number){
  if(this.status!=='floorReward'||!Number.isInteger(index)||!this.rewardOffers[index])return false;
  this.chosenReward=structuredClone(this.rewardOffers[index]);this.applyUpgrade(this.chosenReward);
  this.rewardOffers=[];this.status='floorReady';return true;
 }
 startNextFloor(){
  if(this.status!=='floorReady')return false;
  this.floor++;this.floorTime=0;this.chosenReward=null;this.status='playing';this.nextFormation=FLOOR_RULES.firstFormation;this.spawnClock=6;
  this.player.x=WORLD.width/2;this.player.y=WORLD.height/2;this.player.moving=false;this.player.dashLeft=0;this.player.invulnerable=0;
  this.nextChoiceAt=Math.max(this.nextChoiceAt,this.time+FLOOR_RULES.nextFloorGrace);this.spawnOpening();this.emit('floor-start');return true;
 }
 private spawnPoint(){
  const angle=this.rng.between(0,Math.PI*2),radius=this.rng.between(RULES.openingRadius,RULES.openingRadius+180);
  for(let i=0;i<16;i++){const a=angle+i*Math.PI/8,x=clamp(this.player.x+Math.cos(a)*radius,40,WORLD.width-40),y=clamp(this.player.y+Math.sin(a)*radius,40,WORLD.height-40);if(Math.hypot(x-this.player.x,y-this.player.y)>=RULES.openingRadius-1)return{x,y};}
  // The farthest arena corner is always safely outside the player's reach.
  return{x:this.player.x<WORLD.width/2?WORLD.width-40:40,y:this.player.y<WORLD.height/2?WORLD.height-40:40};
 }
 step(dt:number,input:Input){
  if(this.status!=='playing'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.05,dt,this.floorRemaining);this.time+=dt;this.floorTime=Math.min(this.floorDuration,this.floorTime+dt);
  if(this.floorRemaining<1e-8){this.finishFloor();return;}const p=this.player;
  if(this.eclipse!==this.eclipseWas){this.eclipseWas=this.eclipse;this.emit('eclipse',undefined,undefined,{value:this.eclipse?1:0});}
  p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.hp=Math.min(p.maxHp,p.hp+this.build.passives.regen*.18*dt);
  const leechRate=this.build.passives.leech*.18+(WEAPON_IDS.some(id=>this.build.weapons[id]>0&&WEAPONS[id].leech)?.35:0)+(WEAPON_IDS.some(id=>this.build.weapons[id]===RULES.weaponMax&&WEAPONS[id].kind==='orbit')?.3:0);this.healBudget=Math.min(leechRate*2,this.healBudget+leechRate*dt);
  const length=Math.hypot(input.x,input.y),dx=length?input.x/length:0,dy=length?input.y/length:0;if(length){p.directionX=dx;p.directionY=dy;}
  this.grid.rebuild(this.enemies.filter(e=>e.hp>0));
  this.rage=clamp(this.rage+(this.grid.query(p.x,p.y,160).length>=3?.5:-.24)*dt,0,1);
  if(input.dash&&p.dashCooldown===0){p.dashCooldown=this.dashCooldown;p.dashLeft=RULES.dashDuration;p.invulnerable=.43;this.emit('dash',p.x,p.y,{radius:135});for(const e of this.grid.query(p.x,p.y,135)){this.hit(e,RULES.dashDamage*(1+this.mastery('soulwarrior')*.1)*(this.eclipse?1.3:1),'dash');if(this.config.classId==='mage')e.slow=1.4;}}
  const dashing=p.dashLeft>0;p.x=clamp(p.x+(dashing?p.directionX:dx)*(dashing?RULES.dashSpeed:this.playerSpeed)*dt,32,WORLD.width-32);p.y=clamp(p.y+(dashing?p.directionY:dy)*(dashing?RULES.dashSpeed:this.playerSpeed)*dt,32,WORLD.height-32);p.dashLeft=Math.max(0,p.dashLeft-dt);p.moving=length>0||dashing;
  this.spawnClock-=dt;if(this.spawnClock<=0){this.spawnClock+=floorSpawnInterval(this.floor,this.floorProgress);this.spawn();if(this.enemies.length<floorPopulation(this.floor,this.floorProgress))this.spawn();}
  if(this.floorProgress*FLOOR_RULES.duration>=this.nextFormation){this.nextFormation+=FLOOR_RULES.formationInterval;const gap=this.rng.between(0,Math.PI*2);for(let i=0;i<15;i++){const a=gap+.7+i/15*(Math.PI*2-1.4);const x=clamp(p.x+Math.cos(a)*720,40,WORLD.width-40),y=clamp(p.y+Math.sin(a)*720,40,WORLD.height-40);if(Math.hypot(x-p.x,y-p.y)<430)continue;const kind:EnemyKind=this.encounterTime>=7200?(i%3===0?'reaper':'armored'):this.encounterTime>=3600?(i%5===0?'seer':i%3===0?'reaper':'armored'):this.encounterTime>=1800?(i%4===0?'charger':'armored'):i%4===0?'armored':'hollow';this.spawn(kind,x,y);}this.emit('formation');}
  this.updateEnemies(dt);this.grid.rebuild(this.enemies.filter(e=>e.hp>0));if(this.status!=='playing')return;
  this.updateWeapons(dt);this.updateProjectiles(dt);this.updateWarnings(dt);this.updateLoot(dt);this.enemies=this.enemies.filter(e=>e.hp>0);
 }
 private updateEnemies(dt:number){const p=this.player;
  for(const e of [...this.enemies]){if(e.hp<=0)continue;e.slow=Math.max(0,e.slow-dt);e.flash=Math.max(0,e.flash-dt);e.orbHit=Math.max(0,e.orbHit-dt);e.attack-=dt;
   for(const [key,dot] of Object.entries(e.dots)){if(!dot)continue;dot.left-=dt;this.hit(e,dot.dps*dt,dot.source,true,true);if(dot.left<=0)delete e.dots[key as Ailment];}if(e.hp<=0)continue;
   const d=dist(e,p),dx=(p.x-e.x)/(d||1),dy=(p.y-e.y)/(d||1);e.facing=dx<0?-1:1;let movement=1;
   if(e.kind==='seer'){movement=d<180?.1:d<320?.35:1;if(e.attack<=0){for(let i=0;i<3;i++){const a=i/3*Math.PI*2;const x=e.x+Math.cos(a)*45,y=e.y+Math.sin(a)*45;if(Math.hypot(x-p.x,y-p.y)>110)this.spawn('crawler',x,y,true);}e.attack=7;this.emit('cast',e.x,e.y);}}
   if((e.kind==='charger'||e.kind==='reaper'||e.kind==='executioner')&&e.attack<=0&&d<480){e.charge=1.35;e.chargeX=dx;e.chargeY=dy;e.attack=e.kind==='executioner'?4.5:5.5;this.emit('charge',e.x,e.y);}
   if(isBoss(e.kind)&&e.kind!=='executioner'&&e.attack<=0){if(e.kind==='matriarch'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2,x=e.x+Math.cos(a)*90,y=e.y+Math.sin(a)*90;if(Math.hypot(x-p.x,y-p.y)>110)this.spawn(i%3?'crawler':'charger',x,y,true);}}
    // A stomp is anchored to the boss and cancels if the source dies. No remote artillery.
    this.warnings.push({id:this.nextId++,x:e.x,y:e.y,radius:e.kind==='boss'?165:120,remaining:1.1,duration:1.1,damage:e.damage*1.25,source:e.id});e.attack=e.hp<e.maxHp/2?3.2:4.5;}
   let vx=dx*movement,vy=dy*movement;for(const other of this.grid.query(e.x,e.y,e.radius+25)){if(other.id===e.id||other.hp<=0)continue;const r=dist(e,other),overlap=e.radius+other.radius-r;if(overlap>0&&r>.01){vx+=(e.x-other.x)/r*overlap*.065;vy+=(e.y-other.y)/r*overlap*.065;}}
   let speed=e.speed*(e.slow>0?(isBoss(e.kind)?.85:.6):1)*(this.eclipse?1.12:1);if(e.charge>0){e.charge=Math.max(0,e.charge-dt);if(e.charge>.5)speed=0;else{vx=e.chargeX;vy=e.chargeY;speed=e.kind==='executioner'?400:320;}}
   const v=Math.hypot(vx,vy);if(v>1.3){vx*=1.3/v;vy*=1.3/v;}e.x=clamp(e.x+vx*speed*dt,18,WORLD.width-18);e.y=clamp(e.y+vy*speed*dt,18,WORLD.height-18);if(dist(e,p)<e.radius+12)this.hurt(e.damage);
   if(d>1200&&!isBoss(e.kind)){const point=this.spawnPoint();e.x=point.x;e.y=point.y;}
  }
 }
 orbPositions(){const result:{x:number;y:number;weapon:WeaponId}[]=[];for(const id of WEAPON_IDS){const level=this.build.weapons[id];if(!level||WEAPONS[id].kind!=='orbit')continue;const s=weaponStats(id,level);for(let i=0;i<s.count;i++){const a=this.time*2.4+i/s.count*Math.PI*2+WEAPON_IDS.indexOf(id);result.push({x:this.player.x+Math.cos(a)*s.range*this.rangeMultiplier,y:this.player.y+Math.sin(a)*s.range*this.rangeMultiplier,weapon:id});}}return result;}
 private updateWeapons(dt:number){const p=this.player;
  for(const id of WEAPON_IDS){const lv=this.build.weapons[id];if(!lv)continue;const w=WEAPONS[id],s=weaponStats(id,lv),range=s.range*this.rangeMultiplier;this.cooldowns[id]-=dt;
   // Orbit contacts are sampled every step, independently throttled per weapon/target.
   if(w.kind==='orbit'){for(const orb of this.orbPositions().filter(o=>o.weapon===id))for(const e of this.grid.query(orb.x,orb.y,55))if(dist(e,orb)<e.radius+22&&(e.orbitHits[id]??0)<=this.time){this.hit(e,s.damage,id);e.orbitHits[id]=this.time+s.cooldown/this.attackSpeed;}this.cooldowns[id]=Math.max(0,this.cooldowns[id]);continue;}
   if(this.cooldowns[id]>0)continue;
   const targets=this.grid.query(p.x,p.y,range+45).filter(e=>e.hp>0&&dist(e,p)<=range+e.radius).sort((a,b)=>dist(a,p)-dist(b,p));if(!targets.length){this.cooldowns[id]=.08;continue;}
   this.cooldowns[id]=s.cooldown/this.attackSpeed;this.casts++;const overload=this.config.classId==='mage'&&this.casts%6===0,damage=s.damage*(overload?1.65+this.mastery('arcane')*.15:1),first=targets[0],angle=Math.atan2(first.y-p.y,first.x-p.x);if(overload)this.emit('overload',p.x,p.y,{radius:70});
   if(w.kind==='sweep'||w.kind==='thrust'){this.emit(w.kind==='sweep'?'blade':'thrust',p.x,p.y,{angle,radius:range,points:w.kind==='thrust'?[{x:p.x,y:p.y},{x:p.x+Math.cos(angle)*range,y:p.y+Math.sin(angle)*range}]:undefined});for(const e of targets){const a=Math.atan2(e.y-p.y,e.x-p.x),along=Math.cos(a-angle)*dist(e,p),side=Math.abs(Math.sin(a-angle)*dist(e,p));if(w.kind==='sweep'?(lv>=5||Math.cos(a-angle)>(lv>=3?-.6:-.1)):(along>=0&&side<e.radius+12+(lv>=3?16:0))){this.hit(e,damage,id);if(lv>=8)this.knock(e,24);}}}
   if(w.kind==='projectile'){let count=s.count;if(this.config.classId==='archer'&&this.rng.next()<this.mastery('barrage')*.2)count++;for(let i=0;i<count;i++){const target=targets[i%targets.length],a=Math.atan2(target.y-p.y,target.x-p.x)+(i-(count-1)/2)*.045;this.projectiles.push({id:this.nextId++,x:p.x,y:p.y,vx:Math.cos(a)*430,vy:Math.sin(a)*430,damage,enemy:false,life:Math.min(2.5,range/430+.35),radius:7,target:target.id,pierce:s.pierce+(this.config.classId==='archer'?1:0),hit:new Set(),weapon:id});}this.emit('fire');}
   if(w.kind==='nova'){this.emit('frost',p.x,p.y,{radius:range});for(const e of targets){this.hit(e,damage*(lv>=8?1.3:1),id);if(lv>=3)e.slow=Math.max(e.slow,.4);if(lv>=5)this.knock(e,30);}}
   if(w.kind==='meteor'){const victims=[first];if(lv>=8&&targets.length>1)victims.push(targets[targets.length-1]);for(const target of victims){this.emit('impact',target.x,target.y,{radius:s.area*this.rangeMultiplier});for(const e of this.grid.query(target.x,target.y,s.area*this.rangeMultiplier)){this.hit(e,damage,id);if(lv>=5)this.knock(e,22);}}}
   if(w.kind==='chain'){let current:Enemy|undefined=first;const struck=new Set<number>(),points=[{x:p.x,y:p.y}];for(let i=0;i<s.count&&current;i++){const source:Enemy=current;struck.add(source.id);points.push({x:source.x,y:source.y});this.hit(source,damage*Math.max(.55,1-i*.05),id);current=this.grid.query(source.x,source.y,(lv>=8?250:175)*this.rangeMultiplier).filter(e=>e.hp>0&&!struck.has(e.id)).sort((a,b)=>dist(a,source)-dist(b,source))[0];}this.emit('lightning',p.x,p.y,{points});}
  }
 }
 private knock(e:Enemy,amount:number){if(isBoss(e.kind))return;const d=dist(e,this.player)||1;e.x=clamp(e.x+(e.x-this.player.x)/d*amount,18,WORLD.width-18);e.y=clamp(e.y+(e.y-this.player.y)/d*amount,18,WORLD.height-18);}
 private updateProjectiles(dt:number){for(const b of this.projectiles){b.life-=dt;const old={x:b.x,y:b.y};b.x+=b.vx*dt;b.y+=b.vy*dt;for(const e of this.grid.query(b.x,b.y,65)){if(e.hp<=0||b.hit.has(e.id))continue;const vx=b.x-old.x,vy=b.y-old.y,t=clamp(((e.x-old.x)*vx+(e.y-old.y)*vy)/(vx*vx+vy*vy||1),0,1);if(Math.hypot(e.x-old.x-vx*t,e.y-old.y-vy*t)<e.radius+b.radius){this.hit(e,b.damage,b.weapon);b.hit.add(e.id);if(this.build.weapons[b.weapon]>=RULES.weaponMax||b.weapon==='firestaff'){const radius=this.build.weapons[b.weapon]>=RULES.weaponMax?85:55;this.emit('impact',e.x,e.y,{radius});for(const near of this.grid.query(e.x,e.y,radius))if(near.id!==e.id)this.hit(near,b.damage*(b.weapon==='firestaff'?.5:.35),b.weapon,true);}if(b.pierce--<=0){b.life=0;break;}}}}this.projectiles=this.projectiles.filter(b=>b.life>0&&b.x>0&&b.y>0&&b.x<WORLD.width&&b.y<WORLD.height);}
 private updateWarnings(dt:number){for(const w of this.warnings){w.remaining-=dt;const source=this.enemies.find(e=>e.id===w.source&&e.hp>0);if(!source){w.remaining=0;continue;}if(w.remaining<=0){this.emit('impact',w.x,w.y,{radius:w.radius});if(dist(w,this.player)<w.radius+10)this.hurt(w.damage);}}this.warnings=this.warnings.filter(w=>w.remaining>0);}
 private updateLoot(dt:number){const p=this.player,kept:Loot[]=[];for(const drop of this.loot){const d=dist(drop,p);if(d<this.pickupRadius){const speed=(260+(this.pickupRadius-d)*6)*dt;drop.x+=(p.x-drop.x)/(d||1)*Math.min(d,speed);drop.y+=(p.y-drop.y)/(d||1)*Math.min(d,speed);}if(dist(drop,p)<18){if(drop.heal){p.hp=Math.min(p.maxHp,p.hp+drop.value);this.emit('heal');}else this.xp+=drop.value*(1+this.build.passives.magnet*.04+this.mastery('soulhunter')*.06);}else kept.push(drop);}this.loot=kept;this.checkLevel();}
 hit(e:Enemy,base:number,weapon:WeaponId|'dash',secondary=false,deathProc=!secondary){if(e.hp<=0)return;const w=weapon==='dash'?undefined:WEAPONS[weapon],lv=weapon==='dash'?0:this.build.weapons[weapon];const crit=!secondary&&this.rng.next()<this.criticalChance+(w?.crit??0)+(e.marks>=3?this.mastery('precision')*.02:0);const marked=this.config.classId==='archer'&&e.marks>=3;const raw=base*this.damageMultiplier*(crit?this.criticalDamage:1)*(marked?1.3:1);const armor=w?.kind==='thrust'&&lv>=5?0:ENEMIES[e.kind].defense;const damage=raw*(1-reduction(armor));const actual=Math.min(e.hp,damage);this.damageDealt+=actual;this.weaponDamage[weapon]+=actual;e.hp-=damage;if(!secondary){e.flash=.1;e.marks=Math.min(3,e.marks+1);this.emit('hit',e.x,e.y,{value:Math.round(damage),crit,kind:e.kind});
  if(this.healBudget>0){const heal=Math.min(this.healBudget,.4);this.player.hp=Math.min(this.player.maxHp,this.player.hp+heal);this.healBudget-=heal;}
  if(w&&w.ailment==='frost')e.slow=Math.max(e.slow,1.2+weaponRank(lv)*.04);if(w&&['burn','poison','bleed'].includes(w.ailment)){const dps=w.damage*(w.ailment==='poison'?.3:.2)*(1+weaponRank(lv)*.15)*(1+this.build.passives.catalyst*.12)*(w.ailment==='burn'?1+this.mastery('inferno')*.15:1);const old=e.dots[w.ailment];e.dots[w.ailment]={left:3,dps:Math.max(old?.dps??0,dps),source:weapon as WeaponId};}}
  if(e.hp<=0){this.kills++;this.emit('death',e.x,e.y,{kind:e.kind});this.gold+=goldReward(e.kind,this.time,this.config.difficulty,this.build.passives.fortune,this.config.permanent.luck,e.summoned);if(isBoss(e.kind)){this.bossKills++;this.bossDefeated=true;this.souls+=fragmentReward(this.time,this.config.difficulty);this.emit('boss-kill');}this.drop(e.x,e.y,ENEMIES[e.kind].xp*(e.summoned?.15:1),false);if(!e.summoned&&(this.rng.next()<.008||isBoss(e.kind)))this.drop(e.x+12,e.y,isBoss(e.kind)?20:10,true);
   if(deathProc&&e.dots.burn&&this.build.passives.catalyst>0&&weapon!=='dash'){this.emit('impact',e.x,e.y,{radius:75});for(const near of this.grid.query(e.x,e.y,75))if(near.id!==e.id)this.hit(near,WEAPONS[weapon].damage*(.5+this.build.passives.catalyst*.1)*(1+this.mastery('inferno')*.15),weapon,true);}
  }
 }
 drop(x:number,y:number,value:number,heal:boolean){if(this.loot.length>=RULES.lootCap){if(!heal){const near=this.loot.filter(l=>!l.heal).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(near)near.value+=value;}return;}this.loot.push({id:this.nextId++,x,y,value,heal});}
 hurt(damage:number){const p=this.player;if(p.invulnerable>0||this.status!=='playing')return;const actual=damage*(1-reduction(this.defense));p.hp=Math.max(0,p.hp-actual);p.invulnerable=RULES.invulnerability;this.emit('hurt',p.x,p.y,{value:Math.round(actual)});if(p.hp<=0){this.status='dead';this.emit('dead');}}
 snapshot(){const {grid,events,rng,...rest}=this;return JSON.parse(JSON.stringify({...rest,seed:rng.seed,projectiles:this.projectiles.map(p=>({...p,hit:[...p.hit]}))}));}
 static restore(value:unknown):Engine|undefined {try{
  const v=structuredClone(value) as Record<string,any>;if(!v||!v.config||!['playing','paused','upgrade','floorReward','floorReady'].includes(v.status)||!Number.isFinite(v.time)||v.time<0||v.time>1e7)return;
  if(v.balanceVersion!==4)return;
  if(!Number.isInteger(v.floor)||v.floor<1||!Number.isInteger(v.completedFloors)||v.completedFloors<0||!Number.isFinite(v.floorDuration)||v.floorDuration<FLOOR_RULES.minimumTestDuration||v.floorDuration>FLOOR_RULES.duration||!Number.isFinite(v.floorTime)||v.floorTime<0||v.floorTime>v.floorDuration||v.time<v.floorTime)return;
  const between=v.status==='floorReward'||v.status==='floorReady';if(v.completedFloors!==(between?v.floor:v.floor-1)||(between&&v.floorTime!==v.floorDuration))return;
  const c=v.config as RunConfig;if(!Object.hasOwn(CLASSES,c.classId)||!Number.isInteger(c.difficulty)||!DIFFICULTIES[c.difficulty]||!WEAPON_IDS.includes(c.startWeapon)||!Array.isArray(c.weapons)||!Array.isArray(c.passives)||!Array.isArray(c.masteries))return;
  if(c.weapons.some(id=>!WEAPON_IDS.includes(id))||c.passives.some(id=>!PASSIVE_IDS.includes(id)))return;
  const finiteTree=(x:unknown):boolean=>typeof x==='number'?Number.isFinite(x)&&Math.abs(x)<1e14:Array.isArray(x)?x.every(finiteTree):x&&typeof x==='object'?Object.values(x).every(finiteTree):true;if(!finiteTree(v))return;
  if(!v.player||v.player.hp<=0||v.player.maxHp<v.player.hp||!v.build||!Array.isArray(v.enemies)||v.enemies.length>300||!Array.isArray(v.loot)||v.loot.length>380||!Array.isArray(v.projectiles)||v.projectiles.length>10000||!Array.isArray(v.warnings)||v.warnings.length>100)return;
  if(v.enemies.some((e:Enemy)=>!Object.hasOwn(ENEMIES,e.kind)||!e.dots||e.hp<0)||v.projectiles.some((p:any)=>!WEAPON_IDS.includes(p.weapon)||!Array.isArray(p.hit)))return;
  if(WEAPON_IDS.some(id=>!Number.isInteger(v.build.weapons[id])||v.build.weapons[id]<0||v.build.weapons[id]>RULES.weaponMax)||PASSIVE_IDS.some(id=>!Number.isInteger(v.build.passives[id])||v.build.passives[id]<0||v.build.passives[id]>8))return;
  const e=new Engine(1,c);
  const matches=(shape:any,input:any):boolean=>{if(typeof shape==='number')return typeof input==='number'&&Number.isFinite(input);if(typeof shape==='boolean')return typeof input==='boolean';if(typeof shape==='string')return typeof input==='string';if(Array.isArray(shape))return Array.isArray(input);if(shape&&typeof shape==='object')return input&&typeof input==='object'&&Object.keys(shape).every(k=>matches(shape[k],input[k]));return true;};
  for(const key of Object.keys(e)){if(['grid','events','rng','enemies','projectiles','loot','warnings','offers','rewardOffers','chosenReward','config'].includes(key))continue;if(!matches((e as any)[key],v[key]))return;}
  if(v.gold<0||v.souls<0||v.creditedGold<0||v.creditedSouls<0||v.nextId<1)return;
  if(!matches(defaultRunConfig().permanent,c.permanent)||!matches(defaultRunConfig().masteryLevels,c.masteryLevels)||!Number.isInteger(v.seed)||v.creditedGold>Math.floor(v.gold)||v.creditedSouls>v.souls)return;
  for(const t of v.enemies){if(!t.orbitHits)t.orbitHits={};if(!matches({id:0,x:0,y:0,hp:0,maxHp:0,radius:0,speed:0,damage:0,slow:0,flash:0,attack:0,orbHit:0,facing:0,chargeX:0,chargeY:0,charge:0,marks:0,summoned:false},t))return;for(const [key,d] of Object.entries(t.dots) as [string,any][]){if(!['burn','bleed','poison'].includes(key)||!matches({left:0,dps:0,source:''},d)||!WEAPON_IDS.includes(d.source))return;}}
  for(const l of v.loot)if(!matches({id:0,x:0,y:0,value:0,heal:false},l))return;
  for(const w of v.warnings)if(!matches({id:0,x:0,y:0,radius:0,remaining:0,duration:0,damage:0,source:0},w))return;
  for(const p of v.projectiles)if(!matches({id:0,x:0,y:0,vx:0,vy:0,damage:0,enemy:false,life:0,radius:0,target:0,pierce:0},p)||p.enemy!==false)return;
  for(const key of Object.keys(e)){if(['grid','events','rng','config'].includes(key))continue;if(Object.hasOwn(v,key))(e as any)[key]=v[key];}e.rng=new Random(v.seed>>>0);e.projectiles=v.projectiles.map((p:any)=>({...p,hit:new Set(p.hit)}));e.events=[];e.grid.rebuild(e.enemies);if(e.status==='playing')e.status='paused';if(e.status==='upgrade'&&(!Array.isArray(e.offers)||e.offers.length!==3||e.offers.some(o=>!o||!['common','rare','epic'].includes(o.rarity)||!Number.isFinite(o.bonus)||(!WEAPON_IDS.includes(o.id as WeaponId)&&!PASSIVE_IDS.includes(o.id as PassiveId))||(o.recovery&&!['heal','vitality','power'].includes(o.recovery)))))return;const validReward=(o:any)=>o&&['common','rare','epic'].includes(o.rarity)&&Number.isInteger(o.bonus)&&o.bonus>=0&&o.bonus<=2&&(WEAPON_IDS.includes(o.id)||PASSIVE_IDS.includes(o.id))&&(!o.recovery||['heal','vitality','power'].includes(o.recovery));if(!Array.isArray(e.rewardOffers)||e.rewardOffers.some(o=>!validReward(o))||(e.chosenReward!==null&&!validReward(e.chosenReward)))return;if(e.status==='floorReward'&&(e.rewardOffers.length!==3||e.chosenReward!==null))return;if(e.status==='floorReady'&&(e.rewardOffers.length!==0||e.chosenReward===null))return;if(!between&&(e.rewardOffers.length!==0||e.chosenReward!==null))return;return e;
 }catch{return;}}
}
