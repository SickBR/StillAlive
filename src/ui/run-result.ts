import type {Engine} from '../core/engine';
import {CLASSES,DIFFICULTIES,PASSIVES,PASSIVE_IDS,RULES,WEAPONS,WEAPON_IDS,reduction} from '../core/config';
import {escapeText,eclipseSeal,statRow,uiButton,uiIcon,uiNumber,uiTime} from './design';

/** Read-only projection. Rewards shown here are the run total, never a new grant. */
export function runResultData(e:Engine){
 return {
  retired:e.status==='retired',character:CLASSES[e.config.classId].name,world:DIFFICULTIES[e.config.difficulty].arena,
  time:uiTime(e.time),kills:e.kills,level:e.level,floor:e.floor,completedFloors:e.completedFloors,
  gold:Math.floor(e.gold),souls:Math.floor(e.souls),damage:e.damageDealt,
  weapons:WEAPON_IDS.filter(id=>e.build.weapons[id]>0).map(id=>({id,name:WEAPONS[id].name,icon:WEAPONS[id].icon,level:e.build.weapons[id],max:RULES.weaponMax,damage:e.weaponDamage[id]})),
  passives:PASSIVE_IDS.filter(id=>e.build.passives[id]>0).map(id=>({id,name:PASSIVES[id].name,icon:PASSIVES[id].icon,level:e.build.passives[id],max:RULES.passiveMax})),
 };
}

export function renderRunResult(e:Engine){
 const r=runResultData(e),heading=r.retired?'RUNDE BEENDET':'GEFALLEN';
 const items=(list:readonly {id:string;name:string;icon:string;level:number;max:number}[])=>list.map(v=>`<li data-result-item="${v.id}" aria-label="${escapeText(v.name)} · Stufe ${v.level}/${v.max}" title="${escapeText(v.name)} · Stufe ${v.level}/${v.max}">${uiIcon(v.icon)}<span><b>${escapeText(v.name)}</b><small>${list.length>4?'':'Stufe '}${v.level} <span>/ ${v.max}</span></small></span></li>`).join('');
 const listClass=(length:number)=>`result-item-list${length>4?' result-item-list-compact':''}`;
 const passives=r.passives.length?`<section class="result-build-group"><h3>Passive Kräfte <span>${r.passives.length}</span></h3><ul class="${listClass(r.passives.length)}">${items(r.passives)}</ul></section>`:'';
 return `<div class="overlay-backdrop result-backdrop"><section class="result-card sa-panel ${r.retired?'result-retired':'result-fallen'}" role="dialog" aria-modal="true" aria-labelledby="result-title" aria-describedby="result-subtitle">
  <header class="result-heading">${eclipseSeal()}<span class="sa-kicker">STILLALIVE · ENDLESS</span><h2 id="result-title">${heading}</h2><p id="result-subtitle">${r.retired?'Zurück in die Zuflucht.':'Die Nacht fordert ihren Preis.'}</p><p class="result-identity"><b>${escapeText(r.character)}</b><span aria-hidden="true">·</span>${escapeText(r.world)}</p></header>
  ${statRow([{label:'Überlebenszeit',value:r.time,key:'time'},{label:'Besiegte Gegner',value:uiNumber(r.kills),key:'kills'},{label:'Erreichtes Level',value:uiNumber(r.level),key:'level'},{label:'Erreichte Etage',value:uiNumber(r.floor),key:'floor'}])}
  <section class="result-rewards" aria-label="Beute dieser Runde"><div><span class="sa-kicker">DEINE BEUTE</span><p>Für dein Vermächtnis.</p></div><div class="result-reward" data-result-reward="gold">${uiIcon('gold')}<span><b>${uiNumber(r.gold)}</b><small>Gold</small></span></div><div class="result-reward" data-result-reward="souls">${uiIcon('soul')}<span><b>${uiNumber(r.souls)}</b><small>Seelenfragmente</small></span></div></section>
  <div class="result-build ${r.passives.length?'':'result-build-single'}"><section class="result-build-group"><h3>Deine Waffen <span>${r.weapons.length}</span></h3><ul class="${listClass(r.weapons.length)}">${items(r.weapons)}</ul></section>${passives}</div>
  <details class="sa-details result-details"><summary>Details zur Runde <span aria-hidden="true">+</span></summary><div class="result-detail-body">
   <dl class="result-detail-stats"><div><dt>Etagen abgeschlossen</dt><dd>${r.completedFloors}</dd></div><div><dt>Verursachter Schaden</dt><dd>${uiNumber(r.damage)}</dd></div><div><dt>Angriff</dt><dd>×${uiNumber(e.damageMultiplier,2)}</dd></div><div><dt>Verteidigung</dt><dd>${uiNumber(e.defense)} · ${uiNumber(reduction(e.defense)*100,1)} % Schutz</dd></div><div><dt>Krit-Grundchance</dt><dd>${uiNumber(e.criticalChance*100,1)} %</dd></div><div><dt>Krit-Schaden</dt><dd>×${uiNumber(e.criticalDamage,2)}</dd></div></dl>
   <h3>Schaden nach Quelle</h3><ul class="result-damage-list">${r.weapons.map(w=>`<li><span>${escapeText(w.name)} <small>· Stufe ${w.level}</small></span><b>${uiNumber(w.damage)}</b></li>`).join('')}${e.weaponDamage.dash>0?`<li><span>Ausweichschritt</span><b>${uiNumber(e.weaponDamage.dash)}</b></li>`:''}</ul>${r.passives.length?`<h3 class="result-passive-detail-heading">Passive Kräfte</h3><ul class="result-damage-list">${r.passives.map(p=>`<li><span>${escapeText(p.name)}</span><b>Stufe ${p.level}/${p.max}</b></li>`).join('')}</ul>`:''}<p>Gold und Seelenfragmente bleiben erhalten. Waffenstufen und passive Kräfte gelten für diese Runde.</p>
  </div></details>
  <footer class="result-actions">${uiButton('menu','Hauptmenü')}${uiButton('start','Erneut spielen',true,'Neue Runde mit deiner aktuell ausgewählten Vorlage.')}</footer>
 </section></div>`;
}
