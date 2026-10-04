import {chromium} from '@playwright/test';
import {existsSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=join(process.env.LOCALAPPDATA,'ms-playwright');
const exe=readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||exe,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('reports/screenshots',{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],external=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:'))external.push(r.url());});
const base=process.env.BASE_URL||'http://127.0.0.1:5183/';
const ready=()=>page.waitForFunction(()=>window.__eclipse?.scene?.textures.exists('reaper_gameplay'));
const stats=()=>page.evaluate(()=>structuredClone({profile:window.__eclipse.save.profile,stats:window.__eclipse.save.stats,history:window.__eclipse.save.history,run:window.__eclipse.save.run}));
const result=page.locator('.result-card');
const start=()=>page.getByRole('button',{name:'Spiel starten',exact:true}).click();
const select=async id=>{await page.getByRole('button',{name:'Charaktere',exact:true}).click();await page.locator(`[data-action=preview-character][data-id=${id}]`).click();const b=page.locator(`[data-action=choose-character][data-id=${id}]`);if(await b.isDisabled())await page.locator('.dialog .close').click();else await b.click();};
try {
 await page.addInitScript(()=>localStorage.setItem('eclipse-survivor-v2',JSON.stringify({version:2,profile:{gold:41,souls:2},settings:{volume:0},run:{original:'preserve'}})));
 await page.goto(`${base}?qa=1`);await ready();
 const legacy=await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2'));
 await start();await page.keyboard.down('d');await page.waitForTimeout(250);await page.keyboard.up('d');
 const before=await stats();
 // Deterministic visual fixture only: no claim of a naturally played 25-minute run.
 await page.evaluate(()=>{
  const e=window.__eclipse.engine,s=window.__eclipse.scene;window.deathFrames=[];
  s.hero.on('animationstart',(_,f)=>window.deathFrames.push(Number(f.textureFrame)));
  s.hero.on('animationupdate',(_,f)=>window.deathFrames.push(Number(f.textureFrame)));
  s.hero.on('animationcomplete',(_,f)=>window.deathFrames.push(Number(f.textureFrame)));
  e.enemies=[];e.time=1536;e.level=31;e.kills=1742;e.floor=9;e.completedFloors=8;e.gold=864.9;e.souls=3;e.damageDealt=185420;
  e.build.weapons.scythe=8;e.build.weapons.blade=7;e.build.weapons.orb=5;
  e.build.passives.power=6;e.build.passives.armor=5;e.build.passives.crit=3;e.build.passives.regen=4;
  e.weaponDamage.scythe=112240;e.weaponDamage.blade=49300;e.weaponDamage.orb=21260;e.weaponDamage.dash=2620;
  e.player.invulnerable=0;e.hurt(999999);
 });
 await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='death');
 assert.equal(await result.count(),0,'Death must remain visible before results');
 await result.waitFor();await page.waitForTimeout(450);
 for(let i=24;i<=29;i++)assert.ok((await page.evaluate(()=>window.deathFrames)).includes(i),`Death frame ${i}`);
 assert.equal(await page.locator('#result-title').textContent(),'GEFALLEN');
 assert.equal(await page.locator('[data-result-stat=time] dd').textContent(),'25:36');
 assert.equal(await page.locator('[data-result-stat=kills] dd').textContent(),'1.742');
 assert.equal(await page.locator('[data-result-stat=level] dd').textContent(),'31');
 assert.equal(await page.locator('[data-result-stat=floor] dd').textContent(),'9');
 assert.equal(await page.locator('[data-result-reward=gold] b').textContent(),'864');
 assert.equal(await page.locator('[data-result-reward=souls] b').textContent(),'3');
 assert.equal(await page.locator('[data-result-item]').count(),7);assert.equal(await page.locator('#toast.visible').count(),0,'Gameplay toast must not cover result actions');
 const recorded=await stats();assert.equal(recorded.profile.gold,before.profile.gold+864);assert.equal(recorded.profile.souls,before.profile.souls+3);
 assert.equal(recorded.stats.runs,before.stats.runs+1);assert.equal(recorded.stats.floors,before.stats.floors+8);assert.equal(recorded.run,null);
 assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'start');
 await page.screenshot({path:'reports/screenshots/gui-step1-result-desktop.png'});
 // Native details are keyboard accessible; focus wraps inside the modal.
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'SUMMARY');
 await page.keyboard.press('Enter');assert.equal(await page.locator('.result-details').getAttribute('open'),'');
 assert.ok((await page.locator('.result-detail-body').textContent()).includes('Etagen abgeschlossen8'));
 await page.keyboard.press('Escape');assert.equal(await page.locator('.result-details').getAttribute('open'),'','Escape cannot accidentally rerender or restart the finished run');
 await page.keyboard.press('Enter');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'start');
 for(let i=0;i<10;i++){await page.locator('.result-details summary').click();await page.locator('.result-details summary').click();}
 assert.deepEqual(await stats(),recorded,'Inspecting results cannot issue another reward');
 checks.push('Real death API, all six Reaper death frames before results, exact actual fixture values, no double rewards, keyboard details and focus trap');

 // Exercise a fully populated build on narrow and short displays.
 await page.evaluate(()=>{const q=window.__eclipse,e=q.engine;for(const id of Object.keys(e.build.weapons))e.build.weapons[id]=0;for(const id of ['scythe',...Object.keys(e.build.weapons).filter(id=>id!=='scythe')].slice(0,8))e.build.weapons[id]=8;for(const id of Object.keys(e.build.passives).slice(0,8))e.build.passives[id]=8;q.ui.overlay(e);});
 for(const [width,height] of [[1920,1080],[1280,720],[1024,768],[820,900],[390,844],[320,740],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  const bounds=await result.evaluate(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,overflow:n.scrollWidth>n.clientWidth+1};});
  assert.ok(bounds.left>=0&&bounds.right<=width+1&&bounds.top>=0&&bounds.bottom<=height+1,`Result bounds ${width}x${height}: ${JSON.stringify(bounds)}`);
  assert.equal(bounds.overflow,false,`Horizontal overflow ${width}`);
  await page.getByRole('button',{name:'Erneut spielen',exact:true}).scrollIntoViewIfNeeded();assert.ok(await page.getByRole('button',{name:'Erneut spielen',exact:true}).isVisible());
  await result.evaluate(n=>n.scrollTo(0,0));await page.screenshot({path:`reports/screenshots/gui-step1-result-${width}.png`});
  await page.locator('.result-details summary').click();await page.locator('.result-details summary').click();
 }
 checks.push('Populated build, desktop, small laptop, tablet, 320px phone and short landscape; details and actions remain reachable');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await result.evaluate(n=>getComputedStyle(n).animationName),'none');
 assert.equal(await page.locator('.result-rewards').evaluate(n=>getComputedStyle(n,'::after').animationName),'none');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});
 await page.getByRole('button',{name:'Erneut spielen',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.status),'playing');assert.equal(await page.evaluate(()=>window.__eclipse.engine.floor),1);
 assert.equal(await page.evaluate(()=>window.__eclipse.engine.player.hp===window.__eclipse.engine.player.maxHp),true);
 assert.equal(await result.count(),0);await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>window.__eclipse.engine.status),'playing');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Runde freiwillig beenden',exact:true}).click();
 assert.equal(await page.locator('#result-title').textContent(),'RUNDE BEENDET');assert.equal(await page.locator('.result-fallen').count(),0);
 await page.waitForTimeout(400);await page.screenshot({path:'reports/screenshots/gui-step1-retired.png'});
 await page.getByRole('button',{name:'Hauptmenü',exact:true}).click();await page.reload();await ready();
 assert.equal(await page.evaluate(()=>window.__eclipse.save.profile.gold),recorded.profile.gold);
 assert.equal(await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2')),legacy);
 assert.equal(await page.evaluate(()=>window.__eclipse.save.run),null);
 checks.push('Reduced motion, restart at full health on floor one, distinct retirement, menu and persisted rewards, original V2 data unchanged');
 for(const id of ['mage','archer','warrior']){
  await select(id);await start();await page.evaluate(()=>{const e=window.__eclipse.engine;e.player.invulnerable=0;e.hurt(999999);});await result.waitFor();
  assert.equal(await page.evaluate(()=>window.__eclipse.scene.diagnostics.playerDeathComplete),true);
  assert.ok((await page.locator('.result-identity').textContent()).includes(id==='mage'?'Arkanist':id==='archer'?'Schattenjäger':'Reaper'));
  await page.getByRole('button',{name:'Hauptmenü',exact:true}).click();assert.equal(await result.count(),0);assert.equal(await page.locator('#overlay').count(),0);
 }
 checks.push('Repeated completed runs for all three starter classes; one result layer, complete death animation and clean return');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
 const report={checks,errors,failed,externalRequests:external.length,note:'Isolated browser save. Long-run stats/build and defeat are deliberate fixtures; death animation, UI actions, checkpoint credit and restart use actual code.'};
 writeFileSync('reports/browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
