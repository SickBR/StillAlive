import {Engine} from '../src/core/engine';
import {CLASS_IDS,isBoss,type UpgradeId} from '../src/core/config';
import {freshProfile,defaultPreset,runConfig} from '../src/core/meta';
import {mkdirSync,writeFileSync} from 'node:fs';
const universal=process.argv.includes('--universal');
const defensive=process.argv.includes('--defensive');
const results=[];
for(const classId of CLASS_IDS)for(const seed of [12,71,313]){
 const p=freshProfile();p.presets=[defaultPreset(classId)];const e=new Engine(seed,runConfig(p));const native:Record<string,UpgradeId[]>={warrior:['longsword','spear','axe'],mage:['arcanestaff','firestaff','froststaff'],archer:['crossbow','hunting','shortbow']};const priority:UpgradeId[]=universal?[e.config.startWeapon,'orb','blade','power','haste','vitality','regen','crit','reach','speed',...e.config.weapons]:[...native[classId],'orb','power','haste','vitality','regen','crit','blade','reach','speed'];const choiceTimes:number[]=[],minutes:unknown[]=[];let nextMinute=60;let maxEnemies=0,maxProjectiles=0;const start=performance.now();
 for(let tick=0;tick<20*1800;tick++){
  if(e.status==='dead')break;if(e.status==='floorReward'){e.selectFloorReward(0);if(e.completedFloors>=2)break;}if(e.status==='floorReady')e.startNextFloor();if(e.status==='upgrade'){choiceTimes.push(Number(e.time.toFixed(2)));const rank=e.offers.map(o=>{const r=priority.indexOf(o.id),lv=o.id in e.build.weapons?e.build.weapons[o.id as keyof typeof e.build.weapons]:e.build.passives[o.id as keyof typeof e.build.passives];return(r<0?20:r)+lv*.35-(defensive&&['armor','regen','vitality'].includes(o.id)?7:0)-(e.player.hp/e.player.maxHp<.5&&['vitality','regen'].includes(o.id)?8:0);});e.selectUpgrade(rank.indexOf(Math.min(...rank)));}
 const player=e.player,rx=player.x-1600,ry=player.y-1200,r=Math.hypot(rx,ry)||1;
  let dx=r<200?1:-ry/r+rx/r*(440-r)/170,dy=r<200?0:rx/r+ry/r*(440-r)/170;
  // Keep moving around the horde; collect only nearby crystals ahead of the route.
  const loot=e.loot.filter(l=>Math.hypot(l.x-player.x,l.y-player.y)<150&&(l.x-player.x)*dx+(l.y-player.y)*dy>0).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
  if(loot){const d=Math.hypot(loot.x-player.x,loot.y-player.y)||1;dx+=(loot.x-player.x)/d*.8;dy+=(loot.y-player.y)/d*.8;}
  let chargeDanger=false;if(defensive)for(const enemy of e.enemies){if(enemy.charge>0){const ex=player.x-enemy.x,ey=player.y-enemy.y,along=ex*enemy.chargeX+ey*enemy.chargeY,side=ex*-enemy.chargeY+ey*enemy.chargeX;if(along>0&&along<240&&Math.abs(side)<60){const sign=side>=0?1:-1;dx+=-enemy.chargeY*sign*4;dy+=enemy.chargeX*sign*4;chargeDanger=true;}}}
  let danger=0;for(const enemy of e.enemies){const d=Math.hypot(player.x-enemy.x,player.y-enemy.y);if(d<85){const weight=(85-d)/85*1.5;dx+=(player.x-enemy.x)/(d||1)*weight;dy+=(player.y-enemy.y)/(d||1)*weight;danger+=1;}}
  for(const w of e.warnings){const d=Math.hypot(player.x-w.x,player.y-w.y);if(d<w.radius+35){dx+=(player.x-w.x)/(d||1)*3;dy+=(player.y-w.y)/(d||1)*3;}}
  e.step(.05,{x:dx,y:dy,dash:danger>=2||chargeDanger});e.drainEvents();if(e.time>=nextMinute){minutes.push({minute:nextMinute/60,level:e.level,kills:e.kills,gold:Math.floor(e.gold),hp:Math.round(e.player.hp)});nextMinute+=60;}maxEnemies=Math.max(maxEnemies,e.enemies.length);maxProjectiles=Math.max(maxProjectiles,e.projectiles.length);
 }
 const result={classId,seed,status:e.status,completedFloors:e.completedFloors,floor:e.floor,time:Math.round(e.time),level:e.level,kills:e.kills,bosses:e.bossKills,gold:Math.floor(e.gold),souls:e.souls,hp:Math.round(e.player.hp),maxEnemies,maxProjectiles,choiceTimes,minimumChoiceGap:choiceTimes.length>1?Math.min(...choiceTimes.slice(1).map((t,i)=>t-choiceTimes[i])):null,minutes,simulationMs:Math.round(performance.now()-start),weapons:e.build.weapons};results.push(result);console.log(JSON.stringify(result));
}
mkdirSync('reports',{recursive:true});writeFileSync(defensive?'reports/simulation-defensive-v3-step1.json':universal?'reports/simulation-v3-step1.json':'reports/simulation-native-v3-step1.json',JSON.stringify({note:`9 new-profile bots, 20 Hz, two 180-second floors; first chest card selected; ${defensive?'defensive upgrade preference and charge avoidance':universal?'universal attack preference':'native attack preference'}. No stat boosts or immunity. Limited heuristic, not a human balance verdict.`,results},null,2));
