import {PASSIVE_IDS,PASSIVES,WEAPON_IDS,WEAPONS,RULES,MILESTONES,type UpgradeId,type WeaponId,type PassiveId,weaponStats} from './config';
import type {Random} from './random';
import {defaultRunConfig,type RunConfig} from './meta';
export interface Build {weapons:Record<WeaponId,number>;passives:Record<PassiveId,number>}
export interface Upgrade {id:UpgradeId;rarity:'common'|'rare'|'epic';bonus:number;recovery?:'heal'|'vitality'|'power'}
export const initialBuild=(start:WeaponId='longsword'):Build=>({weapons:Object.fromEntries(WEAPON_IDS.map(id=>[id,id===start?1:0])) as Record<WeaponId,number>,passives:Object.fromEntries(PASSIVE_IDS.map(id=>[id,0])) as Record<PassiveId,number>});
export function choices(build:Build,rng:Random,config:RunConfig=defaultRunConfig(),luck=0):Upgrade[]{
 const nw=Object.values(build.weapons).filter(Boolean).length,np=Object.values(build.passives).filter(Boolean).length;
 const weapons=config.weapons.filter(id=>build.weapons[id]<RULES.weaponMax&&(build.weapons[id]>0||nw<RULES.weaponSlots));
 const passives=config.passives.filter(id=>build.passives[id]<RULES.passiveMax&&(build.passives[id]>0||np<RULES.passiveSlots));
 const result:Upgrade[]=[];
 const take=(pool:UpgradeId[])=>{if(!pool.length)return;const id=pool[Math.floor(rng.next()*pool.length)],roll=rng.next(),rarity=roll<Math.min(.25,.08+luck)?'epic':roll<Math.min(.65,.3+luck)?'rare':'common';result.push({id,rarity,bonus:rarity==='epic'?2:rarity==='rare'?1:0});};
 // Keep offense and defense visible. The third card remains a wild card.
 take(weapons);take(passives);
 while(result.length<3){const pool:UpgradeId[]=[...weapons,...passives].filter(id=>!result.some(o=>o.id===id));if(!pool.length)break;take(pool);}
 for(const [id,recovery] of [['power','power'],['vitality','vitality'],['regen','heal']] as const){if(result.length===3)break;result.push({id,rarity:'common',bonus:0,recovery});}return result;
}
export function upgradeDescription(u:Upgrade,b:Build):string{
 if(u.recovery)return{heal:'Sofort 20 LP heilen.',vitality:'Run-Meisterschaft: +4 maximale LP und +4 LP Heilung.',power:'Run-Meisterschaft: dauerhaft in dieser Runde +1 % Schaden.'}[u.recovery];
 if(u.id in WEAPONS){const id=u.id as WeaponId,lv=b.weapons[id],s=weaponStats(id,lv+1),before=lv?Math.round(weaponStats(id,lv).damage):0;return `${WEAPONS[id].subtitle}. Schaden ${before?`${before} → `:''}${Math.round(s.damage)} · ${s.cooldown.toFixed(2)} s. ${MILESTONES[WEAPONS[id].kind]}`;}
 const id=u.id as PassiveId,lv=b.passives[id];const values:Record<PassiveId,[number,string]>={power:[8,'% Schaden'],haste:[6,'% Angriffstempo'],speed:[4,'% Bewegung'],vitality:[15,'max. LP'],regen:[.18,'LP/s Regeneration'],crit:[3,'% Krit-Chance'],reach:[6,'% Reichweite'],armor:[6,'DEF'],magnet:[18,'% Sammelradius'],ferocity:[12,'% Krit-Schaden'],fortune:[3,'% Gold'],catalyst:[12,'% Statusschaden'],leech:[.18,'LP/s Heilbudget']};const [step,unit]=values[id];const fmt=(n:number)=>Number(n.toFixed(2)).toLocaleString('de-DE');return `${PASSIVES[id].description}. Gesamtbonus: +${fmt(lv*step)} → +${fmt((lv+1)*step)} ${unit}.`;
}
