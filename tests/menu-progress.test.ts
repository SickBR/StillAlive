import test from 'node:test';
import assert from 'node:assert/strict';
import {menuProgress,worldRecord} from '../src/menu-progress';
import {freshSave,decodeSave} from '../src/core/storage';
import {WEAPON_IDS,PASSIVE_IDS,DIFFICULTIES} from '../src/core/config';
import {CHARACTERS} from '../src/characters';

test('Menu progress uses registered content and available characters, without counting ranks or duplicates',()=>{
 const s=freshSave(),before=structuredClone(s),v=menuProgress(s);
 assert.equal(v.heroes.current,CHARACTERS.filter(c=>c.kind==='playable').length);
 assert.equal(v.heroes.total,CHARACTERS.length);
 assert.equal(v.upgrades.total,WEAPON_IDS.length+PASSIVE_IDS.length);
 assert.equal(v.upgrades.current,s.profile.weapons.length+s.profile.passives.length);
 assert.deepEqual(s,before);
 s.profile.weapons.push(s.profile.weapons[0]);s.profile.permanent.attack=10;
 assert.equal(menuProgress(s).upgrades.current,v.upgrades.current);
 s.profile.weapons=[...WEAPON_IDS];s.profile.passives=[...PASSIVE_IDS];
 assert.equal(menuProgress(s).upgrades.current,v.upgrades.total);
});
test('Legacy access and completed floors never fabricate completed Endless worlds',()=>{
 const s=decodeSave(JSON.stringify({version:2,profile:{unlockedDifficulty:4},stats:{wins:50,bestTime:5000,bestFloor:20}}));
 assert.deepEqual(menuProgress(s).worlds,{current:0,total:DIFFICULTIES.length});
 assert.equal(s.profile.unlockedDifficulty,4);
});
test('World records use saved history for that world and remain read-only',()=>{
 const s=freshSave();assert.equal(worldRecord(s,0),null);
 const h={className:'warrior',time:200,kills:100,bosses:0,gold:8,souls:0,difficulty:0,ending:'dead',floors:1};
 s.history=[h,{...h,time:100,kills:200},{...h,difficulty:1,time:999,kills:999}];
 const before=structuredClone(s);
 assert.deepEqual(worldRecord(s,0),{time:200,kills:200,runs:2});
 assert.equal(worldRecord(s,2),null);assert.deepEqual(s,before);
});
