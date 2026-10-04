import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.LOCALAPPDATA?join(process.env.LOCALAPPDATA,'ms-playwright'):'';
const exe=root&&existsSync(root)?readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync):undefined;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||exe,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('reports/screenshots',{recursive:true});
const page=await browser.newPage({viewport:{width:1664,height:936}}),errors=[],failed=[],checks=[],requests=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});page.on('request',r=>requests.push(r.url()));
const base=process.env.BASE_URL||'http://127.0.0.1:5183/';
const ready=()=>page.waitForFunction(()=>window.__eclipse?.scene?.textures?.exists('mage'));
const close=()=>page.locator('.dialog .close').click();
const bar=async()=>({health:await page.locator('[data-stat=health] b').textContent(),attack:await page.locator('[data-stat=attack] b').textContent(),defense:await page.locator('[data-stat=defense] b').textContent()});
const details=async()=>{await page.getByRole('button',{name:'Vermächtnis',exact:true}).click();};
try{
 await page.addInitScript(()=>{if(!localStorage.getItem('eclipse-survivor-v2'))localStorage.setItem('eclipse-survivor-v2',JSON.stringify({version:2,profile:{gold:19,souls:2},run:{legacy:'unchanged'}}));});
 await page.goto(`${base}?qa=1`);await ready();
 const legacy=await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2'));
 assert.equal(await page.locator('.sanctuary-left nav button').count(),3);
 assert.deepEqual(await page.locator('.sanctuary-left nav button').evaluateAll(ns=>ns.map(n=>n.getAttribute('aria-label'))),['Charaktere','Vermächtnis','Kodex']);
 assert.equal(await page.locator('[data-action=shop],[data-action=passives],[data-action=masteries],[data-action=builds],.stat-details-button,.character-menu-button').count(),0);
 assert.equal(await page.locator('[data-progress=heroes] b').textContent(),'3 / 13');
 assert.equal(await page.locator('[data-progress=upgrades] b').textContent(),'20 / 39');
 assert.equal(await page.locator('[data-progress=worlds] b').textContent(),'0 / 5');
 assert.equal(await page.locator('[data-world-record=time]').textContent(),'—:—');
 assert.equal(await page.locator('[data-world-record=kills]').textContent(),'—');
 assert.equal(await page.locator('.development-loop-note,.run-preview,.sanctuary-note').count(),0);
 await page.screenshot({path:'reports/screenshots/menu-v4-desktop.png'});
 checks.push('Three real main actions; no shops, equipment panel or old floor copy; fresh progress derives from registered content, worlds show no fabricated success');
 const p0=await page.evaluate(()=>structuredClone(window.__eclipse.save.profile));
 await page.getByRole('button',{name:'Kodex',exact:true}).click();assert.equal(await page.locator('.codex-entry').count(),39);assert.equal(await page.locator('.codex-locked').count(),19);assert.equal(await page.locator('.codex-entry button').count(),0);await close();
 assert.deepEqual(await page.evaluate(()=>window.__eclipse.save.profile),p0);
 await page.getByRole('button',{name:'Vermächtnis',exact:true}).click();assert.equal(await page.locator('.permanent-card').count(),7);await close();
 await page.getByRole('button',{name:'WELT WECHSELN',exact:true}).click();assert.equal(await page.locator('.difficulty').count(),5);assert.equal(await page.locator('.difficulty:disabled').count(),4);await close();
 checks.push('Read-only catalog preview and honest skill-tree scope; existing world access rules unchanged');
 for(const [id,expected] of [['mage',{health:'98',attack:'×1,08',defense:'4'}],['archer',{health:'110',attack:'×1,00',defense:'7'}],['warrior',{health:'125',attack:'×1,00',defense:'14'}]]){
  await page.getByRole('button',{name:'Charaktere',exact:true}).click();await page.locator(`[data-action=preview-character][data-id=${id}]`).click();await page.locator(`[data-action=choose-character][data-id=${id}]`).click();assert.deepEqual(await bar(),expected);
 }
 await page.evaluate(()=>{const s=window.__eclipse.save,p=s.profile;p.gold=5000;p.souls=100;p.masteries.guardian=2;p.presets[p.selected].masteries=['guardian'];p.weapons.push('hammer');p.passives.push('fortune');p.presets[p.selected].startWeapon='hammer';p.presets[p.selected].weapons.unshift('hammer');p.unlockedDifficulty=4;s.stats.bestFloor=99;s.history=[{className:'warrior',time:401,kills:234,bosses:0,gold:0,souls:0,difficulty:1,ending:'dead',floors:2}];window.__eclipse.ui.menu();});
 assert.equal(await page.locator('[data-progress=upgrades] b').textContent(),'22 / 39');assert.equal(await page.locator('[data-progress=worlds] b').textContent(),'0 / 5');
 await page.getByRole('button',{name:'WELT WECHSELN',exact:true}).click();await page.locator('[data-action=difficulty][data-index="1"]').click();await close();
 assert.equal(await page.locator('.world-name h2').textContent(),'Verfluchter Wald');assert.equal(await page.locator('[data-world-record=time]').textContent(),'06:41');assert.equal(await page.locator('[data-world-record=kills]').textContent(),'234');
 await page.getByRole('button',{name:'WELT WECHSELN',exact:true}).click();await page.locator('[data-action=difficulty][data-index="0"]').click();await close();
 await details();assert.equal(await page.locator('.permanent-card').count(),7);
 for(const id of ['health','attack','defense','speed','crit','critDamage','luck']){const card=page.locator(`[data-permanent=${id}]`);assert.ok((await card.textContent()).includes('75 Gold'));await card.locator('[data-action=buy]').click();assert.equal(await page.evaluate(id=>window.__eclipse.save.profile.permanent[id],id),1);}
 await page.keyboard.press('Escape');assert.deepEqual(await bar(),{health:'136',attack:'×1,02',defense:'24'});assert.equal(await page.getByRole('button',{name:'Vermächtnis',exact:true}).evaluate(n=>n===document.activeElement),true);
 const preserved=await page.evaluate(()=>structuredClone(window.__eclipse.save.profile));preserved.presets=preserved.presets.map(p=>({...p,weapons:[p.startWeapon,...p.weapons.filter(id=>id!==p.startWeapon)]}));await page.reload();await ready();assert.deepEqual(await page.evaluate(()=>window.__eclipse.save.profile),preserved);assert.equal(await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2')),legacy);
 checks.push('Classes, seven existing permanent upgrades, legacy purchases, equipped build, mastery values, world selection and V2 data persist; records use world-specific saved history');
 await page.getByRole('button',{name:'Spiel starten',exact:true}).click();await page.waitForTimeout(150);await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.startWeapon),'hammer');const run=await page.evaluate(()=>({config:structuredClone(window.__eclipse.engine.config),build:structuredClone(window.__eclipse.engine.build)}));
 await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();await details();await page.locator('[data-permanent=health] [data-action=buy]').click();await close();
 await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>({config:window.__eclipse.engine.config,build:window.__eclipse.engine.build})),run);await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();
 checks.push('Start, pause, return and resume preserve the existing run independently from later menu purchases');
 for(const [width,height] of [[1664,936],[1440,900],[1280,720],[1024,768],[820,900],[390,844],[320,740]]){
  await page.setViewportSize({width,height});await page.locator('#ui').evaluate(n=>n.scrollTo(0,0));await page.waitForTimeout(100);
  assert.ok(await page.locator('#ui').evaluate(n=>n.scrollWidth<=n.clientWidth+1),`Horizontal overflow ${width}`);
  const flow=await page.locator('.sanctuary-header,.sanctuary-layout,.sanctuary-footer').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {y:r.y,bottom:r.bottom};}));assert.ok(flow[0].bottom<=flow[1].y+1&&flow[1].bottom<=flow[2].y+1,`Header/footer overlap ${width}`);
  const boxes=await page.locator('.sanctuary-left,.survivor-center,.sanctuary-right').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
  for(const r of boxes)assert.ok(r.x>=0&&r.x+r.w<=width+1,`Off-screen column ${width}`);
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)<=1||Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)<=1,`Overlapping columns ${width}`);}
  await page.screenshot({path:`reports/screenshots/menu-v4-${width}.png`});
  for(const name of ['Charaktere','Kodex','Vermächtnis']){await page.getByRole('button',{name,exact:true}).click();const b=await page.getByRole('dialog').evaluate(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,overflow:n.scrollWidth>n.clientWidth+1};});assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=width+1&&b.y+b.h<=height+1&&!b.overflow,`Dialog clipping ${name} ${width}`);await page.keyboard.press('Escape');}
  await page.locator('#ui').evaluate(n=>n.scrollTo(0,0));
 }
 checks.push('Seven desktop, tablet and phone sizes: columns do not overlap; all three dialogs fit and close via Escape');
 const external=requests.filter(url=>!url.startsWith('data:')&&new URL(url).origin!==new URL(base).origin);
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={checks,errors,failed,externalRequests:external.length};writeFileSync('reports/browser-menu-v4.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
