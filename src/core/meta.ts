import { CLASSES,WEAPONS,WEAPON_IDS,PASSIVES,PASSIVE_IDS,CLASS_IDS,type ClassId,type WeaponId,type PassiveId } from './config';
export const PERMANENT={attack:{name:'ATK',description:'+2 % Schaden',step:.02},defense:{name:'DEF',description:'+2 Verteidigung',step:2},health:{name:'Leben',description:'+5 maximale LP',step:5},speed:{name:'Tempo',description:'+1 % Bewegung',step:.01},crit:{name:'Krit-Chance',description:'+0,5 Prozentpunkte',step:.005},critDamage:{name:'Krit-Schaden',description:'+3 Prozentpunkte',step:.03},luck:{name:'Glück',description:'+1 % Gold / Seltenheit',step:.01}} as const;
export type PermanentId=keyof typeof PERMANENT;
export const MASTERIES={
 berserker:{class:'warrior',name:'Berserker',description:'Pro Stufe +6 % Schaden bei voller Wut.'},guardian:{class:'warrior',name:'Wächter',description:'Pro Stufe +4 DEF und +3 maximale LP.'},soulwarrior:{class:'warrior',name:'Seelenkrieger',description:'Pro Stufe −0,3 s Dash-Abklingzeit und +10 % Dash-Schaden.'},
 inferno:{class:'mage',name:'Inferno',description:'Pro Stufe +15 % Verbrennungs- und Explosionsschaden.'},storm:{class:'mage',name:'Sturm',description:'Pro Stufe +5 % Angriffstempo.'},arcane:{class:'mage',name:'Arkan',description:'Pro Stufe +15 Prozentpunkte Überladungsschaden.'},
 precision:{class:'archer',name:'Präzision',description:'Pro Stufe +2 % Krit-Chance gegen markierte Gegner.'},barrage:{class:'archer',name:'Pfeilhagel',description:'Pro Stufe +20 % Chance auf einen Zusatzpfeil.'},soulhunter:{class:'archer',name:'Seelenjäger',description:'Pro Stufe +6 % XP und +6 % Sammelradius.'},
} as const;
export type MasteryId=keyof typeof MASTERIES;
export const MASTERY_IDS=Object.keys(MASTERIES) as MasteryId[];
export interface Preset {name:string;classId:ClassId;startWeapon:WeaponId;weapons:WeaponId[];passives:PassiveId[];masteries:MasteryId[]}
export interface Profile {gold:number;souls:number;weapons:WeaponId[];passives:PassiveId[];permanent:Record<PermanentId,number>;masteries:Record<MasteryId,number>;presets:Preset[];selected:number;difficulty:number;unlockedDifficulty:number}
export interface RunConfig extends Preset {difficulty:number;permanent:Record<PermanentId,number>;masteryLevels:Record<MasteryId,number>}
const record=<T extends string>(ids:T[])=>Object.fromEntries(ids.map(id=>[id,0])) as Record<T,number>;
export function defaultPreset(classId:ClassId):Preset {const weapons=WEAPON_IDS.filter(id=>(WEAPONS[id].class===classId||WEAPONS[id].class==='all')&&WEAPONS[id].cost===0);return{name:CLASSES[classId].name,classId,startWeapon:weapons.find(id=>WEAPONS[id].class===classId)!,weapons,passives:PASSIVE_IDS.filter(id=>!PASSIVES[id].cost),masteries:[]};}
export function freshProfile():Profile{return{gold:0,souls:0,weapons:WEAPON_IDS.filter(id=>!WEAPONS[id].cost),passives:PASSIVE_IDS.filter(id=>!PASSIVES[id].cost),permanent:record(Object.keys(PERMANENT) as PermanentId[]),masteries:record(MASTERY_IDS),presets:CLASS_IDS.map(defaultPreset),selected:0,difficulty:0,unlockedDifficulty:0};}
export function normalizePreset(value:Partial<Preset>,p:Profile):Preset {const classId=CLASS_IDS.includes(value.classId!)?value.classId!:'warrior',base=defaultPreset(classId);const allowed=p.weapons.filter(id=>WEAPONS[id].class===classId||WEAPONS[id].class==='all');const start=allowed.includes(value.startWeapon!)?value.startWeapon!:base.startWeapon;return{name:typeof value.name==='string'?value.name.slice(0,36):base.name,classId,startWeapon:start,weapons:[...new Set([start,...(Array.isArray(value.weapons)?value.weapons:base.weapons).filter(id=>allowed.includes(id))])],passives:[...new Set((Array.isArray(value.passives)?value.passives:base.passives).filter(id=>p.passives.includes(id)))],masteries:[...new Set((Array.isArray(value.masteries)?value.masteries:[]).filter(id=>MASTERY_IDS.includes(id)&&MASTERIES[id].class===classId&&p.masteries[id]>0))].slice(0,3)};}
export function runConfig(p:Profile):RunConfig {return{...normalizePreset(p.presets[p.selected]??{},p),difficulty:p.difficulty,permanent:{...p.permanent},masteryLevels:{...p.masteries}};}
export function defaultRunConfig():RunConfig{return runConfig(freshProfile());}
export const permanentCost=(level:number)=>75+60*level+15*level*level;
export const masteryCost=(level:number)=>[3,5,8,12,18][Math.min(4,Math.max(0,level))];
export function purchase(p:Profile,type:string,id:string):boolean{
 if(type==='weapon'&&WEAPON_IDS.includes(id as WeaponId)){const key=id as WeaponId,cost=WEAPONS[key].cost;if(p.weapons.includes(key)||p.gold<cost)return false;p.gold-=cost;p.weapons.push(key);return true;}
 if(type==='passive'&&PASSIVE_IDS.includes(id as PassiveId)){const key=id as PassiveId,cost=PASSIVES[key].cost;if(p.passives.includes(key)||p.gold<cost)return false;p.gold-=cost;p.passives.push(key);return true;}
 if(type==='permanent'&&Object.hasOwn(PERMANENT,id)){const key=id as PermanentId,lv=p.permanent[key],cost=permanentCost(lv);if(lv>=10||p.gold<cost)return false;p.gold-=cost;p.permanent[key]++;return true;}
 if(type==='mastery'&&Object.hasOwn(MASTERIES,id)){const key=id as MasteryId,lv=p.masteries[key],cost=masteryCost(lv);if(lv>=5||p.souls<cost)return false;p.souls-=cost;p.masteries[key]++;return true;}return false;
}
