import {CLASSES,type ClassId} from './core/config';
import {defaultPreset,type Profile} from './core/meta';

export type CharacterId=ClassId|`future-${number}`;
export type CharacterEntry=
 |{kind:'playable';id:ClassId;name:string;role:string}
 |{kind:'future';id:`future-${number}`;name:string};

/** Presentation catalog only. Unimplemented entries never enter combat or saves. */
export const CHARACTERS:readonly CharacterEntry[]=[
 {kind:'playable',id:'warrior',name:CLASSES.warrior.name,role:'Sense · Nahkampf'},
 {kind:'playable',id:'mage',name:CLASSES.mage.name,role:'Arkanmagie · Fernkampf'},
 {kind:'playable',id:'archer',name:CLASSES.archer.name,role:'Rabenbogen · Fernkampf'},
 ...Array.from({length:10},(_,i):CharacterEntry=>({kind:'future',id:`future-${i+1}`,name:`Charakterplatz ${String(i+1).padStart(2,'0')}`})),
];
export const characterById=(id:string)=>CHARACTERS.find(c=>c.id===id);

/** Reuses existing presets; selecting an active custom build must not replace it. */
export function selectCharacter(p:Profile,id:string):'selected'|'unavailable'|'preset-limit'{
 const c=characterById(id);if(c?.kind!=='playable')return 'unavailable';
 if(p.presets[p.selected]?.classId===c.id)return 'selected';
 let index=p.presets.findIndex(b=>b.classId===c.id);
 if(index<0){
  if(p.presets.length>=12)return 'preset-limit';
  p.presets.push(defaultPreset(c.id));index=p.presets.length-1;
 }
 p.selected=index;return 'selected';
}
