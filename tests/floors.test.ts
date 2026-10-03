import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/core/engine';
import {FLOOR_RULES,floorDifficulty,floorPopulation,floorSpawnInterval} from '../src/core/floors';
import {RULES,CLASS_IDS,WEAPONS,PASSIVES} from '../src/core/config';
import {freshProfile,runConfig,defaultPreset} from '../src/core/meta';
import {freshSave,checkpoint,readSave,writeSave,SAVE_KEY,decodeSave} from '../src/core/storage';

function quick(seed=1){const e=new Engine(seed,undefined,{floorDuration:5});e.enemies=[];return e;}
function advance(e:Engine,seconds:number){for(let i=0;i<Math.ceil(seconds/.05);i++){if(e.status==='upgrade')e.selectUpgrade(0);e.step(.05,{x:0,y:0});e.drainEvents();}}

test('Normal floors last 180 active seconds and pause freezes both clocks',()=>{
 const e=new Engine(7);assert.equal(e.floorDuration,180);e.player.invulnerable=1e6;e.enemies=[];e.spawn=()=>undefined;
 e.step(.05,{x:1,y:0});e.pause();const before=e.snapshot();advance(e,20);assert.deepEqual(e.snapshot(),before);e.pause();
 advance(e,179.9);assert.equal(e.status,'playing');advance(e,.1);assert.equal(e.status,'floorReward');assert.equal(e.floorTime,180);assert.equal(e.time,180);assert.equal(e.completedFloors,1);assert.equal(e.rewardOffers.length,3);
});
test('Completion happens exactly at the boundary and removes all combat hazards',()=>{
 const e=quick();e.floorTime=e.time=4.98;e.player.hp=40;e.player.invulnerable=0;
 e.spawn('brute',e.player.x,e.player.y);e.warnings.push({id:999,x:e.player.x,y:e.player.y,radius:200,remaining:.01,duration:1,damage:999,source:e.enemies[0].id});
 e.projectiles.push({id:998,x:e.player.x,y:e.player.y,vx:100,vy:0,damage:1,enemy:false,life:1,radius:7,target:0,pierce:0,hit:new Set(),weapon:'longsword'});
 e.drop(e.player.x+500,e.player.y,9,false);e.drop(e.player.x,e.player.y,10,true);e.step(.05,{x:0,y:0});
 assert.equal(e.status,'floorReward');assert.equal(e.floorTime,5);assert.equal(e.time,5);assert.equal(e.player.hp,40);assert.equal(e.xp,9);
 assert.equal(e.enemies.length+e.projectiles.length+e.warnings.length+e.loot.length,0);
 const snapshot=e.snapshot();advance(e,20);e.hurt(999);assert.deepEqual(e.snapshot(),snapshot);assert.ok(Engine.restore(snapshot));
});
test('Chest allows exactly one temporary choice and next floor requires that choice',()=>{
 const e=quick();advance(e,5);assert.equal(e.startNextFloor(),false);const offer=e.rewardOffers[0],before=e.snapshot();assert.equal(e.selectFloorReward(-1),false);assert.equal(e.selectFloorReward(3),false);assert.equal(e.selectFloorReward(.5),false);assert.deepEqual(e.snapshot(),before);
 const oldLevel=offer.id in WEAPONS?e.build.weapons[offer.id as keyof typeof WEAPONS]:e.build.passives[offer.id as keyof typeof PASSIVES];
 assert.equal(e.selectFloorReward(0),true);assert.equal(e.status,'floorReady');assert.equal(e.rewardOffers.length,0);assert.equal(e.selectFloorReward(1),false);
 const newLevel=offer.id in WEAPONS?e.build.weapons[offer.id as keyof typeof WEAPONS]:e.build.passives[offer.id as keyof typeof PASSIVES];assert.equal(newLevel,oldLevel+1);
 const build=structuredClone(e.build),hp=e.player.hp,xp=e.xp,level=e.level,gold=e.gold,power=e.masteryPower;
 assert.equal(e.startNextFloor(),true);assert.equal(e.floor,2);assert.equal(e.floorTime,0);assert.equal(e.time,5);assert.equal(e.completedFloors,1);assert.deepEqual(e.build,build);assert.equal(e.player.hp,hp);assert.equal(e.xp,xp);assert.equal(e.level,level);assert.equal(e.gold,gold);assert.equal(e.masteryPower,power);assert.equal(e.startNextFloor(),false);
 assert.equal(new Engine(1).build.weapons[offer.id as keyof typeof WEAPONS]??0,offer.id==='longsword'?1:0);
});
test('Two full floors and a third start work for every existing class',()=>{
 for(const classId of CLASS_IDS){const p=freshProfile();p.presets=[defaultPreset(classId)];const e=new Engine(17,runConfig(p),{floorDuration:5});e.player.invulnerable=1e6;
  for(let i=1;i<=2;i++){advance(e,5);assert.equal(e.status,'floorReward');assert.equal(e.completedFloors,i);assert.equal(e.rewardOffers.length,3);assert.ok(e.rewardOffers.some(o=>o.id in WEAPONS));assert.ok(e.rewardOffers.some(o=>o.id in PASSIVES));assert.equal(e.selectFloorReward(0),true);assert.equal(e.startNextFloor(),true);}
  assert.equal(e.floor,3);assert.ok(Math.abs(e.time-10)<1e-8);assert.equal(e.config.classId,classId);assert.ok(e.enemies.every(t=>Math.hypot(t.x-e.player.x,t.y-e.player.y)>=RULES.openingRadius-1));
 }
});
test('Difficulty ramps within a floor and moderately between floors',()=>{
 assert.ok(floorPopulation(1,1)>floorPopulation(1,0));assert.ok(floorSpawnInterval(1,1)<floorSpawnInterval(1,0));
 const one=quick(),two=quick();two.floor=2;two.completedFloors=1;const a=one.spawn('hollow')!,b=two.spawn('hollow')!;
 assert.ok(Math.abs(b.maxHp/a.maxHp-1.15)<1e-10);assert.ok(Math.abs(b.damage/a.damage-1.08)<1e-10);assert.ok(b.speed>a.speed);assert.equal(floorDifficulty(1000).speed,1.2);assert.ok(floorPopulation(1000,1)<=RULES.enemyCap);
});
test('Old boss deadlines and darkness cycles cannot interfere across four floors',()=>{
 const e=new Engine(2);e.player.invulnerable=1e6;e.enemies=[];const kinds:string[]=[];const original=e.spawn.bind(e);e.spawn=(kind,x,y,summoned)=>{if(kind&&['boss','matriarch','executioner'].includes(kind))kinds.push(kind);return original(kind,x,y,summoned);};
 for(let floor=1;floor<=4;floor++){e.nextBoss=0;e.floorTime=179.98;e.time=(floor-1)*180+179.98;e.step(.05,{x:0,y:0});assert.equal(e.eclipse,false);assert.equal(e.status,'floorReward');assert.ok(Engine.restore(e.snapshot()));assert.equal(e.selectFloorReward(0),true);assert.ok(Engine.restore(e.snapshot()));e.startNextFloor();}
 assert.deepEqual(kinds,[]);assert.equal(e.completedFloors,4);assert.equal(e.bossKills,0);
});
test('Pending chest and selected reward survive reload without duplication or rerolls',()=>{
 const save=freshSave(),e=quick();advance(e,5);e.gold=25.9;checkpoint(save,e);
 const r=Engine.restore(decodeSave(JSON.stringify(save)).run)!;assert.ok(r);assert.equal(r.status,'floorReward');assert.deepEqual(r.rewardOffers,e.rewardOffers);assert.equal(r.rng.next(),e.rng.next());
 checkpoint(save,r);assert.equal(save.profile.gold,25);r.selectFloorReward(1);checkpoint(save,r);const selected=Engine.restore(save.run)!;assert.equal(selected.status,'floorReady');assert.deepEqual(selected.build,r.build);assert.equal(selected.selectFloorReward(0),false);assert.equal(selected.startNextFloor(),true);checkpoint(save,selected);assert.equal(save.profile.gold,25);
});
test('Malformed floor snapshots reject only the run, retaining the profile',()=>{
 const e=quick();advance(e,5);for(const change of [(s:any)=>s.floor=0,(s:any)=>s.floorTime=6,(s:any)=>s.floorDuration=0,(s:any)=>s.completedFloors=0,(s:any)=>s.rewardOffers.pop(),(s:any)=>s.rewardOffers[0]=null,(s:any)=>s.chosenReward={id:'bad'}]){const snapshot=e.snapshot();change(snapshot);const save=freshSave();save.profile.gold=321;save.run=snapshot;const restored=decodeSave(JSON.stringify(save));assert.equal(restored.run,null);assert.equal(restored.profile.gold,321);}
});
test('Death and retirement work and restart resets all floor rewards',()=>{
 const e=quick();e.player.invulnerable=0;e.hurt(1e6);assert.equal(e.status,'dead');advance(e,10);assert.equal(e.completedFloors,0);assert.equal(e.selectFloorReward(0),false);assert.equal(e.startNextFloor(),false);
 const next=quick();advance(next,5);next.selectFloorReward(0);next.retire();const save=freshSave();checkpoint(save,next,true);assert.equal(save.stats.floors,1);assert.equal(save.history[0].floors,1);assert.equal(save.stats.retired,1);assert.equal(save.run,null);
 const restart=quick();assert.equal(restart.floor,1);assert.equal(restart.completedFloors,0);assert.equal(restart.chosenReward,null);assert.equal(restart.rewardOffers.length,0);assert.equal(restart.masteryPower,0);
});
test('V3 writes its own key and preserves both old save blobs byte for byte',()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const old=JSON.stringify({...freshSave(),version:2,profile:{...freshProfile(),gold:91},run:{legacy:'run kept in V2'}}),v1='{"version":1,"stats":{"runs":4}}';const data=new Map([['eclipse-survivor-v2',old],['eclipse-survivor-v1',v1]]);
 try{Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>data.set(key,value)}});const s=readSave();assert.equal(s.profile.gold,91);assert.equal(s.run,null);assert.ok(writeSave(s));assert.ok(data.has(SAVE_KEY));assert.equal(data.get('eclipse-survivor-v2'),old);assert.equal(data.get('eclipse-survivor-v1'),v1);assert.equal(readSave().profile.gold,91);}finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete (globalThis as any).localStorage;}
});
test('Reward chest still offers three useful fallback choices after a completed build',()=>{
 const e=quick();e.config.weapons=['longsword'];e.config.passives=['power'];e.build.weapons.longsword=8;e.build.passives.power=8;advance(e,5);assert.equal(e.rewardOffers.length,3);assert.ok(e.rewardOffers.every(o=>o.recovery));assert.ok(e.selectFloorReward(0));assert.equal(e.masteryPower,1);
});
