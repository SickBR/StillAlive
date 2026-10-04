import {DIFFICULTIES,WEAPON_IDS,PASSIVE_IDS} from './core/config';
import {CHARACTERS} from './characters';
import type {Save} from './core/storage';

/** Count each registered weapon/passive ID once, never its ranks or preset slots. */
export function menuProgress(save:Save){
 const p=save.profile;
 return {
  heroes:{current:CHARACTERS.filter(c=>c.kind==='playable').length,total:CHARACTERS.length},
  upgrades:{current:WEAPON_IDS.filter(id=>p.weapons.includes(id)).length+PASSIVE_IDS.filter(id=>p.passives.includes(id)).length,total:WEAPON_IDS.length+PASSIVE_IDS.length},
  // No completed-world field or Endless unlock mechanic exists yet. Neither
  // unlockedDifficulty (legacy access) nor bestFloor proves a completed world.
  worlds:{current:0,total:DIFFICULTIES.length},
 };
}

/** Only persisted results of this world are evidence of its personal record. */
export function worldRecord(save:Save,index:number){
 const runs=save.history.filter(h=>h.difficulty===index);
 if(!runs.length)return null;
 return {time:Math.max(...runs.map(h=>h.time)),kills:Math.max(...runs.map(h=>h.kills)),runs:runs.length};
}
