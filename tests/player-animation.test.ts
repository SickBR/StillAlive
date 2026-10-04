import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {PlayerAnimator,PLAYER_ANIMATIONS,animationsFor,menuTexture,PLAYER_SPRITES} from '../src/player-animation';
import {freshSave,decodeSave} from '../src/core/storage';
import {defaultRunConfig,runConfig} from '../src/core/meta';
import {Engine} from '../src/core/engine';

test('Movement, facing and complete attacks recover without restarting under frequent automatic attacks',()=>{
 const a=new PlayerAnimator();a.step(.1,true,-1,false,true);assert.equal(a.state,'walk');assert.equal(a.facing,-1);
 a.attack(0);for(let i=0;i<9;i++){a.attack(0);a.step(.05,true,-1,false,true);assert.equal(a.state,'attack');assert.equal(a.facing,1);}
 a.step(.1,true,-1,false,true);assert.equal(a.state,'walk');assert.equal(a.facing,-1);
 a.step(.1,false,0,false,true);assert.equal(a.state,'idle');
});
test('Pause freezes attack; hit interrupts it briefly; death cannot be interrupted and holds its last frame',()=>{
 const a=new PlayerAnimator();a.attack(0);a.step(.2,false,0,false,true);const elapsed=a.elapsed;
 a.step(2,false,0,false,false);assert.equal(a.elapsed,elapsed);assert.equal(a.state,'attack');
 a.hit();a.attack(0);a.step(.1,false,0,false,true);assert.equal(a.state,'hit');a.step(.03,false,0,false,true);assert.equal(a.state,'idle');
 a.step(.1,false,0,true,false);a.hit();a.attack(0);assert.equal(a.state,'death');assert.equal(a.deathComplete,false);
 a.step(.5,false,0,true,false);assert.equal(a.deathComplete,true);assert.equal(PLAYER_ANIMATIONS.death.end,10);
});
test('Legacy standard templates get starter identities while custom builds, unlocks and active runs survive',()=>{
 const s=freshSave();s.profile.presets[0]={...s.profile.presets[0],name:'Schattenkrieger',startWeapon:'longsword',weapons:['longsword','blade','orb']};
 s.profile.presets[1].name='Rissmagier';s.profile.presets[2].name='Nachtjäger';
 s.profile.presets.push({...s.profile.presets[0],name:'Meine alte Klinge'});s.profile.gold=789;s.profile.souls=12;
 const config=defaultRunConfig();config.startWeapon='longsword';config.weapons=['longsword','blade'];
 const e=new Engine(123,config);e.step(.1,{x:1,y:0});s.run=e.snapshot();const before=structuredClone(s);
 const loaded=decodeSave(JSON.stringify(s));assert.equal(loaded.profile.presets[0].name,'Reaper');assert.equal(loaded.profile.presets[0].startWeapon,'scythe');
 assert.equal(loaded.profile.presets[1].name,'Arkanist');assert.equal(loaded.profile.presets[2].name,'Schattenjäger');
 assert.equal(loaded.profile.presets[3].name,'Meine alte Klinge');assert.equal(loaded.profile.presets[3].startWeapon,'longsword');
 assert.equal(runConfig(loaded.profile).startWeapon,'scythe');
 assert.deepEqual(loaded.profile.weapons,before.profile.weapons);assert.deepEqual(loaded.profile.passives,before.profile.passives);
 assert.equal(loaded.profile.gold,789);assert.equal(loaded.profile.souls,12);assert.deepEqual(loaded.stats,before.stats);
 const restored=Engine.restore(loaded.run)!;assert.equal(restored.config.startWeapon,'longsword');assert.deepEqual(restored.build,e.build);assert.equal(restored.player.hp,e.player.hp);
 assert.deepEqual(decodeSave(JSON.stringify(loaded)),loaded,'Migration is idempotent');
});
test('Existing scythe is the free starter without globally unlocking equipment or changing its stats',()=>{
 const s=freshSave(),c=runConfig(s.profile);assert.equal(c.startWeapon,'scythe');assert.ok(c.weapons.includes('scythe'));
 assert.equal(s.profile.weapons.includes('scythe'),false);
 const e=new Engine(4,c);assert.equal(e.build.weapons.scythe,1);assert.equal(e.build.weapons.longsword,0);
 e.enemies=[];e.spawn('brute',e.player.x+70,e.player.y);for(let i=0;i<30;i++)e.step(.02,{x:0,y:0});
 assert.ok(e.drainEvents().some(v=>v.type==='player-attack'&&v.kind==='scythe'));assert.ok(e.weaponDamage.scythe>0);
});

test('Reaper uses separate presentation and combat assets and all five audited sequences',()=>{
 assert.notEqual(menuTexture('warrior'),PLAYER_SPRITES.warrior.texture);
 const defs=animationsFor('warrior');assert.deepEqual(Object.values(defs).map(a=>a.end-a.start+1),[5,8,7,4,6]);
 const a=new PlayerAnimator('warrior');a.hit();a.step(.2,false,0,false,true);assert.equal(a.state,'hit');a.step(.06,false,0,false,true);assert.equal(a.state,'idle');
 a.step(.1,false,0,true,false);a.step(.6,false,0,true,false);assert.equal(a.deathComplete,false);a.step(.06,false,0,true,false);assert.equal(a.deathComplete,true);
});

test('Reaper atlas covers every sequence with valid source rectangles and stable virtual feet',()=>{
 const atlas=JSON.parse(readFileSync('public/assets/reaper_gameplay.json','utf8'));assert.equal(Object.keys(atlas.frames).length,30);
 for(const a of Object.values(animationsFor('warrior')))for(let i=a.start;i<=a.end;i++){const f=atlas.frames[String(i)];assert.ok(f);assert.ok(f.frame.x>=0&&f.frame.y>=0&&f.frame.x+f.frame.w<=1448&&f.frame.y+f.frame.h<=1086);assert.deepEqual(f.sourceSize,{w:400,h:280});assert.ok(f.spriteSourceSize.x>=0&&f.spriteSourceSize.y>=0&&f.spriteSourceSize.x+f.frame.w<=400&&f.spriteSourceSize.y+f.frame.h<=280);}
 for(const name of ['reaper_gameplay','reaper_menu_hero']){const png=readFileSync(`public/assets/${name}.png`);assert.equal(png.readUInt32BE(16),1448);assert.equal(png.readUInt32BE(20),1086);assert.equal(png[25],6,'Original RGBA transparency retained');}
});
