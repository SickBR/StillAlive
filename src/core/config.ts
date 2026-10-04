export const WORLD = { width: 3200, height: 2400 };
export const RULES = { bossAt:240, eclipseCycle:90, eclipseLength:20, playerSpeed:172, playerHp:125, pickupRadius:94, invulnerability:.55, dashCooldown:8, dashDuration:.28, dashSpeed:560, enemyCap:300, lootCap:380, dashDamage:38, eclipseDashBonus:1.3, levelHeal:1, weaponSlots:8, passiveSlots:8, weaponMax:8, passiveMax:8, choiceInterval:20, openingRadius:850, openingCount:18 };
export type ClassId='warrior'|'mage'|'archer';
export const CLASSES={
 warrior:{name:'Reaper',hp:125,speed:166,defense:14,damage:1,crit:.05,texture:'reaper_gameplay',description:'Nähe nährt Wut: bis zu +30 % Schaden. Ansturm trifft im Nahbereich.',mechanic:'WUT'},
 mage:{name:'Arkanist',hp:98,speed:172,defense:4,damage:1.08,crit:.05,texture:'arcanist-v1',description:'Jeder sechste Zauber überlädt: +65 % Schaden. Dash entfesselt Frost.',mechanic:'ÜBERLADUNG'},
 archer:{name:'Schattenjäger',hp:110,speed:184,defense:7,damage:1,crit:.12,texture:'shadow-hunter-v1',description:'Markiere Ziele mit Treffern. Ab dem dritten Treffer +30 % Schaden.',mechanic:'PRÄZISION'},
} as const;
export const DIFFICULTIES=[
 {name:'Anfänger',arena:'Verlassenes Kloster',hp:1,damage:1,speed:1,reward:1,color:0xaab6a0},
 {name:'Veteran',arena:'Verfluchter Wald',hp:1.35,damage:1.25,speed:1.06,reward:1.4,color:0x78ad87},
 {name:'Albtraum',arena:'Blutkatakomben',hp:1.85,damage:1.55,speed:1.1,reward:1.9,color:0xd395a3},
 {name:'Hölle',arena:'Brennendes Ödland',hp:2.5,damage:1.9,speed:1.14,reward:2.6,color:0xe3ac79},
 {name:'Abgrund',arena:'Ewige Finsternis',hp:3.4,damage:2.35,speed:1.18,reward:3.5,color:0x999ad5},
] as const;
export type AttackKind='sweep'|'thrust'|'orbit'|'projectile'|'nova'|'chain'|'meteor';
export type Ailment='none'|'burn'|'frost'|'poison'|'bleed';
interface Weapon {name:string;subtitle:string;color:string;damage:number;cooldown:number;range:number;kind:AttackKind;class:ClassId|'all';cost:number;icon:string;ailment:Ailment;count:number;crit:number;leech:boolean}
const w=(name:string,kind:AttackKind,cls:ClassId|'all',damage:number,cooldown:number,range:number,icon:string,cost=0,ailment:Ailment='none',count=1,crit=0,leech=false):Weapon=>({name,kind,class:cls,damage,cooldown,range,icon,cost,ailment,count,crit,leech,color:ailment==='burn'?'#eaa877':ailment==='frost'?'#9bddda':ailment==='poison'?'#a0bf88':'#ba9bea',subtitle:({sweep:'Breiter Nahkampfhieb',thrust:'Lange, schmale Stoßbahn',orbit:'Rotierende Runenklingen',projectile:'Automatisch gezielte Geschosse',nova:'Flächenwelle um dich',chain:'Springt zwischen nahen Zielen',meteor:'Flächenschlag am Gegner'}[kind])+(ailment!=='none'?` · ${{burn:'Verbrennung',frost:'Verlangsamung',poison:'Gift',bleed:'Blutung'}[ailment]}`:'')+(name==='Feuerstab'?' · kleine Aufprallexplosion':'')+(leech?' · heilt bei Treffern (begrenzt)':'')});
export const WEAPONS={
 blade:w('Shadow Blade','sweep','all',27,1.2,108,'blade'),orb:w('Arcane Orb','orbit','all',12,.65,92,'orb'),fire:w('Firebolt','projectile','all',23,1.6,480,'fire',120,'burn'),frost:w('Frost Nova','nova','all',19,3.8,150,'frost',120,'frost'),lightning:w('Lightning Chain','chain','all',22,2.5,350,'lightning',120,'none',3),
 longsword:w('Langschwert','sweep','warrior',29,1.05,104,'blade'),axe:w('Streitaxt','sweep','warrior',47,1.65,98,'axe'),spear:w('Speer','thrust','warrior',26,.85,178,'spear'),hammer:w('Kriegshammer','nova','warrior',55,2.25,110,'hammer',180),dual:w('Doppelklingen','sweep','warrior',16,.48,76,'dual',300,'bleed'),blood:w('Blutklinge','sweep','warrior',24,1.05,100,'blood',450,'bleed',1,0,true),scythe:w('Seelensense','sweep','warrior',38,1.5,150,'scythe',650),
 firestaff:w('Feuerstab','projectile','mage',28,1.25,490,'firestaff',0,'burn',2),froststaff:w('Froststab','projectile','mage',22,1.1,480,'froststaff',0,'frost'),arcanestaff:w('Arkanstab','chain','mage',25,1.55,350,'arcanestaff',0,'none',2),stormstaff:w('Blitzstab','chain','mage',21,1.8,390,'stormstaff',180,'none',4),meteorstaff:w('Meteorstab','meteor','mage',65,3.4,480,'meteorstaff',300,'burn'),shadowstaff:w('Schattenstab','nova','mage',36,2.1,160,'shadowstaff',450),soulbook:w('Seelenbuch','orbit','mage',15,.65,115,'soulbook',650,'none',2,0,true),
 hunting:w('Jagdbogen','projectile','archer',34,.8,550,'hunting',0,'none',1,.05),shortbow:w('Kurzbogen','projectile','archer',16,.52,410,'shortbow'),crossbow:w('Armbrust','thrust','archer',53,1.6,450,'crossbow'),longbow:w('Langbogen','thrust','archer',47,1.65,620,'longbow',180,'none',1,.12),poisonbow:w('Giftbogen','projectile','archer',17,.95,470,'poisonbow',300,'poison'),scatterbow:w('Splitterbogen','projectile','archer',14,1.25,390,'scatterbow',450,'none',3),shadowbow:w('Schattenbogen','projectile','archer',27,1.2,520,'shadowbow',650,'none',1,.08,true),
};
export type WeaponId=keyof typeof WEAPONS;
export const PASSIVES={
 power:{name:'Dunkler Pakt',description:'+8 % Schaden',color:'#bc92ce',icon:'power',cost:0},haste:{name:'Rasende Runen',description:'+6 % Angriffstempo',color:'#d6b991',icon:'haste',cost:0},speed:{name:'Nebeltritt',description:'+4 % Bewegungstempo',color:'#a6bfba',icon:'speed',cost:0},vitality:{name:'Eisernes Herz',description:'+15 maximale LP, heilt 15 LP',color:'#da9191',icon:'vitality',cost:0},regen:{name:'Blutwurzel',description:'+0,18 LP pro Sekunde',color:'#a0bf88',icon:'regen',cost:0},crit:{name:'Tödlicher Blick',description:'+3 % Krit-Chance',color:'#d8c383',icon:'crit',cost:0},reach:{name:'Grenzenlos',description:'+6 % Reichweite',color:'#94b6dd',icon:'reach',cost:0},armor:{name:'Obsidianschutz',description:'+6 DEF; abnehmende Schadensreduktion',color:'#98a8ba',icon:'armor',cost:0},magnet:{name:'Seelenruf',description:'+18 % Sammelradius, +4 % XP',color:'#8dcdbd',icon:'magnet',cost:0},ferocity:{name:'Henkerzeichen',description:'+12 Prozentpunkte Krit-Schaden',color:'#ce9699',icon:'ferocity',cost:120},fortune:{name:'Rissglück',description:'+3 % Gold und bessere Seltenheitschancen',color:'#dbc583',icon:'fortune',cost:120},catalyst:{name:'Aschenkatalysator',description:'+12 % Statusschaden; brennende Gegner explodieren beim Tod (ohne Folgeketten)',color:'#e4ac77',icon:'catalyst',cost:200},leech:{name:'Seelenraub',description:'Heilt bei Treffern; +0,18 LP/s maximales Heilbudget',color:'#bc8da5',icon:'leech',cost:200},
};
export type PassiveId=keyof typeof PASSIVES;
export type UpgradeId=WeaponId|PassiveId;
export const PASSIVE_EFFECTS={power:.08,haste:.06,speed:.04,vitality:15,regen:.18,crit:.03,reach:.06,pickup:.18};
export const WEAPON_IDS=Object.keys(WEAPONS) as WeaponId[];
export const PASSIVE_IDS=Object.keys(PASSIVES) as PassiveId[];
export const CLASS_IDS=Object.keys(CLASSES) as ClassId[];
export const BOSSES=['boss','matriarch','executioner'] as const;
export type EnemyKind='hollow'|'crawler'|'brute'|'armored'|'charger'|'seer'|'reaper'|typeof BOSSES[number];
export const ENEMIES:Record<EnemyKind,{name:string;hp:number;speed:number;damage:number;xp:number;radius:number;unlock:number;defense:number;gold:number}>={
 hollow:{name:'Aschenpilger',hp:40,speed:75,damage:12,xp:2,radius:14,unlock:0,defense:0,gold:1},
 crawler:{name:'Rissläufer',hp:25,speed:145,damage:9,xp:2,radius:10,unlock:0,defense:0,gold:1},
 brute:{name:'Gruftkoloss',hp:180,speed:55,damage:24,xp:7,radius:24,unlock:100,defense:5,gold:4},
 armored:{name:'Panzerwächter',hp:95,speed:72,damage:15,xp:5,radius:19,unlock:75,defense:35,gold:3},
 charger:{name:'Bluthetzer',hp:68,speed:105,damage:17,xp:4,radius:16,unlock:55,defense:0,gold:2},
 seer:{name:'Rissbeschwörer',hp:100,speed:59,damage:10,xp:8,radius:15,unlock:160,defense:0,gold:5},
 reaper:{name:'Rissritter',hp:290,speed:99,damage:24,xp:15,radius:20,unlock:240,defense:18,gold:9},
 boss:{name:'DER ENTTHRONTE',hp:1600,speed:73,damage:30,xp:95,radius:40,unlock:240,defense:12,gold:120},
 matriarch:{name:'DIE BRUTMUTTER',hp:1900,speed:64,damage:25,xp:110,radius:40,unlock:480,defense:5,gold:150},
 executioner:{name:'DER HENKER',hp:2200,speed:85,damage:36,xp:130,radius:38,unlock:720,defense:20,gold:180},
};
export const isBoss=(kind:EnemyKind)=>BOSSES.includes(kind as typeof BOSSES[number]);
export const xpForLevel=(level:number)=>Math.floor(20+level*8+level**1.28*2.4);
export const spawnInterval=(time:number)=>Math.max(.20,.68-time/5000);
export const enemyScaling=(time:number)=>1+time/3200+(time/4800)**1.2;
export const targetPopulation=(t:number)=>{const points=[[0,24],[60,30],[180,56],[300,88],[480,140],[900,175],[1800,220],[3600,260]];for(let i=1;i<points.length;i++){const [end,n]=points[i],[start,previous]=points[i-1];if(t<end)return Math.floor(previous+(n-previous)*Math.max(0,t-start)/(end-start));}return 260;};
export const reduction=(defense:number)=>Math.min(.70,Math.max(0,defense)/(100+Math.max(0,defense)));
/** Preserve the old fully-developed ceiling while making each of eight ranks matter. */
export const weaponRank=(level:number)=>1+(Math.max(1,Math.min(RULES.weaponMax,level))-1)*11/7;
export function weaponStats(id:WeaponId,level:number){
 const w=WEAPONS[id],l=Math.max(1,Math.min(RULES.weaponMax,level)),rank=weaponRank(l);
 const milestones=Number(l>=3)+Number(l>=5)+Number(l>=8);
 return{damage:w.damage*(1+(rank-1)*.2),cooldown:w.cooldown/(1+(rank-1)*.065),range:w.range*(1+(rank-1)*.035),count:w.count+(['projectile','orbit','chain'].includes(w.kind)?milestones:0),pierce:l>=5?2:l>=3?1:0,area:w.kind==='meteor'?75+rank*3:45+rank*2,finisher:l>=8};
}
export const MILESTONES={projectile:'3: +1 Geschoss / Durchschlag · 5: erneut verstärkt · 8: Aufprallexplosion',orbit:'3 / 5 / 8: +1 Orbit · 8: Heilbudget +0,3 LP/s',chain:'3 / 5 / 8: +1 Sprung · 8: entferntere Sprünge',sweep:'3: breiterer Bogen · 5: Rundumschlag · 8: Rückstoß',thrust:'3: breitere Bahn · 5: Rüstung ignoriert · 8: Rückstoß',nova:'3: 0,4 s Verlangsamung · 5: Rückstoß · 8: +30 % Schaden',meteor:'3: größerer Einschlag · 5: Rückstoß · 8: zweiter Einschlag'};
