import test from 'node:test';
import assert from 'node:assert/strict';
import {homeStats} from '../src/ui';
import {freshProfile,runConfig} from '../src/core/meta';
import {Engine} from '../src/core/engine';
import {CLASS_IDS} from '../src/core/config';

for(const classId of CLASS_IDS)test(`Menu values match actual new ${classId} runs, including permanent ranks and equipped mastery`,()=>{
 const p=freshProfile();p.selected=p.presets.findIndex(b=>b.classId===classId);
 p.masteries.guardian=5;
 for(const rank of [0,1,5,10])for(const equipped of [false,true]){
  for(const key of Object.keys(p.permanent) as (keyof typeof p.permanent)[])p.permanent[key]=rank;
  p.presets[p.selected].masteries=equipped?['guardian']:[];
  const before=structuredClone(p),stats=homeStats(p),engine=new Engine(5,runConfig(p));
  assert.equal(stats.health,engine.player.maxHp);assert.equal(stats.attack,engine.damageMultiplier);
  assert.equal(stats.defense,engine.defense);assert.equal(stats.speed,engine.playerSpeed);
  assert.equal(stats.crit,engine.criticalChance);assert.equal(stats.critDamage,engine.criticalDamage);
  assert.deepEqual(p,before,'Rendering must never mutate the profile');
 }
});
