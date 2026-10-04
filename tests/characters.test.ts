import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS,characterById,selectCharacter} from '../src/characters';
import {freshProfile,defaultPreset} from '../src/core/meta';
import {freshSave,decodeSave} from '../src/core/storage';
import {CLASS_IDS} from '../src/core/config';

test('Starter catalog has three playable classes and exactly ten future slots',()=>{
 assert.equal(CHARACTERS.length,13);assert.equal(new Set(CHARACTERS.map(c=>c.id)).size,13);
 assert.deepEqual(CHARACTERS.filter(c=>c.kind==='playable').map(c=>c.id).sort(),[...CLASS_IDS].sort());
 assert.equal(characterById('warrior')?.name,'Reaper');assert.equal(characterById('mage')?.name,'Arkanist');assert.equal(characterById('archer')?.name,'Schattenjäger');
 const future=CHARACTERS.filter(c=>c.kind==='future');assert.equal(future.length,10);
 for(const c of future){assert.equal('price' in c,false);assert.equal('ability' in c,false);assert.equal('classId' in c,false);}
});

test('Each actual character selects an existing build for free and persists through the unchanged save format',()=>{
 const save=freshSave();save.profile.gold=423;save.profile.souls=17;save.profile.permanent.health=4;save.profile.masteries.guardian=2;
 const before=structuredClone(save);
 for(const id of CLASS_IDS){
  assert.equal(selectCharacter(save.profile,id),'selected');
  const loaded=decodeSave(JSON.stringify(save));assert.equal(loaded.profile.presets[loaded.profile.selected].classId,id);
  assert.equal(loaded.profile.gold,before.profile.gold);assert.equal(loaded.profile.souls,before.profile.souls);
  assert.deepEqual(loaded.profile.permanent,before.profile.permanent);assert.deepEqual(loaded.profile.masteries,before.profile.masteries);
  assert.deepEqual(loaded.stats,before.stats);assert.deepEqual(loaded.settings,before.settings);
 }
 assert.deepEqual(save.profile.presets,before.profile.presets,'Selection must not rewrite a preset');
});

test('An already selected custom build remains selected when viewing or selecting its class',()=>{
 const p=freshProfile();p.presets.push({...defaultPreset('mage'),name:'Meine Magie',startWeapon:'froststaff'});p.selected=3;
 const before=structuredClone(p);assert.equal(selectCharacter(p,'mage'),'selected');assert.deepEqual(p,before);
});

test('A missing class preset is added without replacing an old build',()=>{
 const p=freshProfile();p.presets=[{...defaultPreset('warrior'),name:'Alte Vorlage'}];p.selected=0;
 const old=structuredClone(p.presets[0]);assert.equal(selectCharacter(p,'mage'),'selected');
 assert.deepEqual(p.presets[0],old);assert.equal(p.presets[p.selected].classId,'mage');
 assert.equal(selectCharacter(p,'mage'),'selected');assert.equal(p.presets.length,2);
});

test('Future entries and malformed character IDs cannot alter the profile or enter a run',()=>{
 const p=freshProfile(),before=structuredClone(p);
 for(const id of ['reaper',...CHARACTERS.filter(c=>c.kind==='future').map(c=>c.id),'boss','__proto__','warrior-invalid']){
  assert.equal(selectCharacter(p,id),'unavailable');assert.deepEqual(p,before);
 }
});

test('A full legacy preset collection is never silently overwritten or truncated',()=>{
 const p=freshProfile();p.presets=Array.from({length:12},(_,i)=>({...defaultPreset('warrior'),name:`Alt ${i}`}));p.selected=8;
 const before=structuredClone(p);assert.equal(selectCharacter(p,'mage'),'preset-limit');assert.deepEqual(p,before);
});
