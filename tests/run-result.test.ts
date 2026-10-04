import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/core/engine';
import {freshSave,checkpoint} from '../src/core/storage';
import {runConfig} from '../src/core/meta';
import {renderRunResult,runResultData} from '../src/ui/run-result';

test('Result reads actual run values and equipment, distinguishing reached from completed floors',()=>{
 const save=freshSave(),e=new Engine(15,runConfig(save.profile));
 e.time=1536;e.floor=9;e.completedFloors=8;e.kills=1248;e.level=31;e.gold=864.9;e.souls=3;
 e.build.weapons.scythe=8;e.build.weapons.orb=5;e.build.passives.armor=4;e.damageDealt=123456.7;e.weaponDamage.scythe=45678;
 const before=e.snapshot(),r=runResultData(e);
 assert.equal(r.character,'Reaper');assert.equal(r.world,'Verlassenes Kloster');assert.equal(r.time,'25:36');
 assert.equal(r.floor,9);assert.equal(r.completedFloors,8);assert.equal(r.kills,1248);assert.equal(r.level,31);
 assert.equal(r.gold,864);assert.equal(r.souls,3);assert.equal(r.damage,123456.7);
 assert.deepEqual(r.weapons.map(v=>[v.id,v.level]),[['orb',5],['scythe',8]]);
 assert.deepEqual(r.passives.map(v=>[v.id,v.level]),[['armor',4]]);
 assert.deepEqual(e.snapshot(),before,'Presentation cannot alter the build, combat state or RNG');
});

test('Repeated result rendering after checkpoint never credits rewards or records another run',()=>{
 const save=freshSave(),e=new Engine(12,runConfig(save.profile));e.gold=58.7;e.souls=2;
 checkpoint(save,e);e.status='dead';checkpoint(save,e,true);
 const beforeSave=structuredClone(save),beforeRun=e.snapshot();
 for(let i=0;i<30;i++){assert.equal(runResultData(e).gold,58);assert.ok(renderRunResult(e).includes('GEFALLEN'));}
 assert.deepEqual(save,beforeSave);assert.deepEqual(e.snapshot(),beforeRun);
 assert.equal(save.stats.runs,1);assert.equal(save.profile.gold,58);assert.equal(save.profile.souls,2);assert.equal(save.run,null);
});

test('Retirement uses its own heading and empty passive equipment does not invent abilities',()=>{
 const e=new Engine(3);e.retire();const html=renderRunResult(e);
 assert.equal(runResultData(e).retired,true);assert.ok(html.includes('RUNDE BEENDET'));assert.ok(!html.includes('>GEFALLEN<'));
 assert.deepEqual(runResultData(e).passives,[]);assert.ok(!html.includes('Passive Kräfte'));
 assert.ok(html.includes('Erneut spielen'));assert.ok(html.includes('Hauptmenü'));
});
