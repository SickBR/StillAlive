import {DIFFICULTIES,ENEMIES,isBoss,type EnemyKind} from './config';
/** One transparent economy for runtime, UI and balance reports. Summons never pay. */
export function goldReward(kind:EnemyKind,time:number,difficulty:number,fortune=0,luck=0,summoned=false){
 if(summoned)return 0;
 const bonus=isBoss(kind)?Math.min(120,Math.max(0,Math.floor(time/240)-1)*10):0;
 return (ENEMIES[kind].gold+bonus)*DIFFICULTIES[difficulty].reward*(1+fortune*.03+luck*.01);
}
export function fragmentReward(time:number,difficulty:number){
 return Math.floor((3+Math.min(4,Math.floor(Math.max(0,time)/1200)))*DIFFICULTIES[difficulty].reward);
}
export const ECONOMY_GUIDE={normal:'Pilger & Läufer: 1 Gold. Stärkere Gegner: 2–9 Gold.',boss:'Erster Boss: 120 Gold + 3 Fragmente auf Anfänger.',summon:'Beschworene Gegner: kein Gold, keine Fragmente.',prices:'Waffen: 120–650 Gold. Kaufbare Passives: 120–200 Gold.',permanent:'Grundwerte: ab 75 Gold, danach 150 / 255 / 390 …',mastery:'Meisterschaftsstufen: 3 / 5 / 8 / 12 / 18 Fragmente.'};
