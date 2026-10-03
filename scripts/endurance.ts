import {Engine} from '../src/core/engine';
import {WEAPON_IDS,PASSIVE_IDS,CLASS_IDS,WEAPONS,DIFFICULTIES} from '../src/core/config';
import {freshProfile,defaultPreset,runConfig,MASTERY_IDS,MASTERIES} from '../src/core/meta';
import {writeFileSync} from 'node:fs';
const results=[];
for(const cls of CLASS_IDS){
 const profile=freshProfile();profile.weapons=[...WEAPON_IDS];profile.passives=[...PASSIVE_IDS];profile.presets=[defaultPreset(cls)];const preset=profile.presets[0];preset.weapons=WEAPON_IDS.filter(id=>WEAPONS[id].class===cls).concat(['orb']).slice(0,8);preset.passives=['power','haste','armor','regen','vitality','crit','ferocity','catalyst'];preset.masteries=MASTERY_IDS.filter(id=>MASTERIES[id].class===cls);for(const id of preset.masteries)profile.masteries[id]=5;
 const e=new Engine(100,runConfig(profile));for(const id of preset.weapons)e.build.weapons[id]=8;for(const id of preset.passives)e.build.passives[id]=8;e.player.hp=e.player.maxHp=1000000; // Explicit stress harness, not a survival/balance result.
 let maxEnemies=0,maxShots=0,maxLoot=0,checkpoints=0;const start=performance.now();
 for(let tick=0;tick<10800*20;tick++){
  e.player.invulnerable=1;e.step(.05,{x:Math.cos(e.time*.2),y:Math.sin(e.time*.2),dash:tick%160===0});e.drainEvents();maxEnemies=Math.max(maxEnemies,e.enemies.length);maxShots=Math.max(maxShots,e.projectiles.length);maxLoot=Math.max(maxLoot,e.loot.length);
  if(tick%12000===0){if(!Engine.restore(e.snapshot()))throw new Error('Checkpoint invalid at '+e.time);checkpoints++;}
  if(e.status==='upgrade')e.selectUpgrade(0);if(!Number.isFinite(e.damageDealt))throw new Error('Non-finite damage');
 }
 const result={classId:cls,simulatedSeconds:Math.round(e.time),bosses:e.bossKills,level:e.level,kills:e.kills,maxEnemies,maxShots,maxLoot,checkpoints,wallMs:Math.round(performance.now()-start)};console.log(JSON.stringify(result));results.push(result);
}
const difficulties=DIFFICULTIES.map((d,i)=>{const p=freshProfile();p.difficulty=i;const e=new Engine(7,runConfig(p));e.enemies=[];const b=e.spawn('boss')!;e.hit(b,1e9,'longsword');return{name:d.name,bossHp:b.maxHp,bossDamage:b.damage,gold:e.gold,souls:e.souls};});
writeFileSync('reports/endurance-v21.json',JSON.stringify({note:'Three full 3-hour simulations at 20 Hz, prebuilt maximum class loadouts and artificial immunity/HP for stress only. Not proof of human survivability or balance.',results,difficulties},null,2));
