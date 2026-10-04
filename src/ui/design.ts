/** Shared presentation primitives; no game or persistence state is changed here. */
export const escapeText=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const uiNumber=(n:number,digits=0)=>n.toLocaleString('de-DE',{minimumFractionDigits:digits,maximumFractionDigits:digits});
export const uiTime=(s:number)=>`${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
export const uiIcon=(id:string)=>`<img class="sa-icon" src="assets/icon-${id}.png" alt="" draggable="false">`;
export function statRow(stats:{label:string;value:string;key?:string}[]){
 return `<dl class="sa-stats">${stats.map(s=>`<div${s.key?` data-result-stat="${escapeText(s.key)}"`:''}><dt>${escapeText(s.label)}</dt><dd>${escapeText(s.value)}</dd></div>`).join('')}</dl>`;
}
export function uiButton(action:string,label:string,primary=false,title=''){
 return `<button class="sa-button ${primary?'sa-button-primary':'sa-button-secondary'}" data-action="${escapeText(action)}"${primary?' data-primary="true"':''}${title?` title="${escapeText(title)}"`:''}>${escapeText(label)}${primary?'<span aria-hidden="true">→</span>':''}</button>`;
}
/** Small original ornament, drawn as UI geometry rather than raster artwork. */
export const eclipseSeal=()=>`<svg class="sa-seal" viewBox="0 0 120 120" aria-hidden="true"><path class="seal-arch" d="M24 85V50Q24 25 60 8Q96 25 96 50V85M34 86V50Q34 32 60 18Q86 32 86 50V86"/><path class="seal-moon" d="M75 39A25 25 0 1 0 80 78A22 22 0 0 1 75 39Z"/><path class="seal-detail" d="M13 94H48L60 106L72 94H107M60 0V12M7 59H17M103 59H113M56 111L60 116L64 111"/></svg>`;
