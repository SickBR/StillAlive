import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.LOCALAPPDATA?join(process.env.LOCALAPPDATA,'ms-playwright'):'';
const exe=root&&existsSync(root)?readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync):undefined;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||exe,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('reports/screenshots',{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
const base=process.env.BASE_URL||'http://127.0.0.1:5183/';
const ready=()=>page.waitForFunction(()=>window.__eclipse?.scene?.textures?.exists('mage'));
const open=()=>page.getByRole('button',{name:'Charaktere',exact:true}).click();
const preview=id=>page.locator(`[data-action=preview-character][data-id=${id}]`).click();
const select=id=>page.locator(`[data-action=choose-character][data-id=${id}]`).click();
const close=()=>page.locator('.dialog .close').click();
const profile=()=>page.evaluate(()=>structuredClone(window.__eclipse.save.profile));
const selected=()=>page.evaluate(()=>window.__eclipse.save.profile.presets[window.__eclipse.save.profile.selected].classId);
try{
 await page.addInitScript(()=>localStorage.setItem('eclipse-survivor-v2',JSON.stringify({version:2,profile:{gold:53,souls:4},run:{oldEndless:'preserve'}})));
 await page.goto(`${base}?qa=1`);await ready();
 const legacy=await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2'));
 assert.equal(await page.locator('.sanctuary-brand>span').textContent(),'ENDLESS');
 assert.equal(await page.locator('.class-switcher,[data-action=home-class]').count(),0);
 assert.equal(await page.getByRole('button',{name:'Charaktere',exact:true}).count(),1);
 assert.equal(await page.getByRole('button',{name:'Charaktere',exact:true}).isVisible(),true);
 assert.equal(await page.locator('.sanctuary-left nav button').count(),3);
 await page.screenshot({path:'reports/screenshots/phase-a-menu.png'});
 await open();assert.equal(await page.locator('.character-card').count(),13);
 assert.equal(await page.locator('.future-character').count(),10);
 assert.equal(await page.locator('.future-character:disabled').count(),10);
 assert.equal(await page.locator('.future-character .character-lock').count(),10);
 assert.ok((await page.locator('.future-character').allTextContents()).every(t=>t.includes('Bald verfügbar')&&!/Gold|Fragmente|ATK|Seelenernte/.test(t)));
 assert.equal(await page.locator('.dialog-layer').count(),1);
 await page.screenshot({path:'reports/screenshots/phase-a-characters-desktop.png'});
 const beforePreview=await profile();await preview('mage');assert.deepEqual(await profile(),beforePreview);await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('button',{name:'Charaktere',exact:true}).evaluate(n=>n===document.activeElement),true);
 checks.push('Three free starters, 13 cards including ten future slots; preview does not mutate the profile');
 for(const id of ['mage','archer','warrior']){
  const before=await profile();await open();await preview(id);assert.deepEqual(await profile(),before,'Preview must not select, buy or rewrite profiles');
  await select(id);assert.equal(await selected(),id);assert.equal(await page.locator('.dialog-layer').count(),0);
  assert.equal((await profile()).gold,before.gold);assert.equal((await profile()).souls,before.souls);
  await page.reload();await ready();assert.equal(await selected(),id);
  assert.equal(await page.locator('.hero-caption h2').textContent(),id==='mage'?'Arkanist':id==='archer'?'Schattenjäger':'Reaper');
 }
 // Existing purchased gear, an active custom template and mastery values must survive the new selector.
 await page.evaluate(()=>{const p=window.__eclipse.save.profile;p.weapons.push('hammer');p.gold=987;p.souls=16;p.permanent.health=3;p.masteries.guardian=2;
  p.presets.push({...structuredClone(p.presets[0]),name:'Erhaltene Vorlage',startWeapon:'hammer',weapons:['hammer',...p.presets[0].weapons],masteries:['guardian']});p.selected=p.presets.length-1;window.__eclipse.ui.menu();});
 const custom=await profile();await open();assert.equal(await page.locator('[data-action=choose-character][data-id=warrior]').isDisabled(),true);
 assert.ok((await page.locator('.character-preview').textContent()).includes('Kriegshammer'));
 assert.ok((await page.locator('.character-properties').textContent()).includes('146 LP'));
 await preview('mage');await preview('warrior');await close();assert.deepEqual(await profile(),custom);
 assert.equal(await page.locator('[data-action=builds]').count(),0); // V4 keeps the existing equipment without a separate home editor.
 // Persist via the normal settings event; no direct localStorage mutation of live-user data.
 await page.locator('[data-action=settings]').click();await page.locator('#volume').fill('0.2');await page.locator('#volume').dispatchEvent('input');await close();
 await page.reload();await ready();const loaded=await profile();assert.equal(loaded.presets[loaded.selected].name,'Erhaltene Vorlage');assert.ok(loaded.weapons.includes('hammer'));assert.equal(loaded.gold,987);assert.equal(loaded.souls,16);
 assert.equal(await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2')),legacy);
 checks.push('All real classes select freely and persist; custom builds, purchases, masteries, currencies and V2 data survive');
 await page.getByRole('button',{name:'Spiel starten',exact:true}).click();await page.waitForTimeout(100);await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.classId),'warrior');
 await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();
 const saved=await page.evaluate(()=>JSON.stringify(window.__eclipse.save.run));
 await open();await preview('mage');await select('mage');assert.equal(await page.evaluate(()=>JSON.stringify(window.__eclipse.save.run)),saved);
 await page.reload();await ready();assert.equal(await selected(),'mage');
 await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.classId),'warrior');
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.startWeapon),'hammer');
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.floorDuration),180);
 await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();
 checks.push('Existing run, equipment, pause, resume and floor duration remain unchanged when selecting a different menu character');
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[820,900],[390,844],[320,740]]){
  await page.setViewportSize({width,height});await page.locator('#ui').evaluate(n=>n.scrollTo(0,0));await open();
  for(const id of ['mage','warrior']){
   await preview(id);
   const layout=await page.locator('.dialog').evaluate(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,overflow:n.scrollWidth>n.clientWidth+1};});
   assert.ok(layout.left>=0&&layout.right<=width+1&&layout.top>=0&&layout.bottom<=height+1,`Dialog bounds ${width}`);
   assert.equal(layout.overflow,false,`Horizontal overflow ${width} ${id}`);
   await page.locator('[data-character-id=future-10]').scrollIntoViewIfNeeded();assert.equal(await page.locator('[data-character-id=future-10]').isVisible(),true);
   assert.equal(await page.locator('.dialog-layer').count(),1);
  }
  await page.keyboard.press('Escape');await open();await page.waitForTimeout(150);
  await page.screenshot({path:`reports/screenshots/phase-a-characters-${width}.png`});
  // Escape while focus is inside the roster, then X; both must leave a clean menu.
  await page.keyboard.press('Escape');await open();await close();
  assert.equal(await page.locator('.dialog-layer').count(),0);
  assert.ok(await page.locator('#ui').evaluate(n=>n.scrollWidth<=n.clientWidth+1),`Menu width ${width}`);
 }
 checks.push('Character selector tested on six screen sizes, including last future card, X, Escape and absence of overlapping dialogs');
 await page.setViewportSize({width:1440,height:900});
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('HeapProfiler.collectGarbage');
 const heap=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value])).JSHeapUsedSize;
 const heapBefore=await heap(),nodesBefore=await page.locator('#ui *').count();
 for(let i=0;i<30;i++){await open();await preview(i%2?'mage':'warrior');assert.equal(await page.locator('.dialog-layer').count(),1);await close();}
 await cdp.send('HeapProfiler.collectGarbage');const heapAfter=await heap();
 assert.equal(await page.locator('#ui *').count(),nodesBefore);assert.equal(await page.locator('.dialog-layer').count(),0);
 assert.ok(heapAfter-heapBefore<15*1024*1024,'Unexpected UI heap accumulation');
 const performanceCheck={dialogCycles:30,menuNodesBefore:nodesBefore,menuNodesAfter:await page.locator('#ui *').count(),heapBefore,heapAfter,note:'Chromium heap after explicit garbage collection; short UI regression, not a gameplay stress test.'};
 checks.push('30 open/preview/close cycles retain a stable menu DOM without accumulated dialog layers');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={phase:'Three integrated starters',checks,performanceCheck,errors,failed};writeFileSync('reports/browser-characters-phase-a.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
