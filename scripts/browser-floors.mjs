import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.LOCALAPPDATA?join(process.env.LOCALAPPDATA,'ms-playwright'):'';
const exe=root&&existsSync(root)?readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync):undefined;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||exe,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
mkdirSync('reports/screenshots',{recursive:true});const base=process.env.BASE_URL||'http://127.0.0.1:5183/';
const ready=()=>page.waitForFunction(()=>window.__eclipse?.scene?.textures?.exists('mage'));
try{
 // Browser context is isolated from the human player's saved data.
 await page.addInitScript(()=>{if(!localStorage.getItem('eclipse-survivor-v2'))localStorage.setItem('eclipse-survivor-v2',JSON.stringify({version:2,profile:{gold:87,souls:3},settings:{volume:0},stats:{runs:5},run:{oldEndless:'keep me'}}));});
 await page.goto(`${base}?qa=1&floorSeconds=10`);await ready();const legacy=await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2'));
 await page.screenshot({path:'reports/screenshots/v3-step1-menu.png'});
 assert.equal(await page.evaluate(()=>window.__eclipse.save.profile.gold),87);assert.equal(await page.evaluate(()=>window.__eclipse.save.run),null);
 for(const id of ['mage','archer','warrior']){await page.locator(`[data-action=home-class][data-id=${id}]`).click();assert.equal(await page.locator(`[data-action=home-class][data-id=${id}]`).getAttribute('aria-pressed'),'true');}
 checks.push('Existing character selection and safe V2-profile copy');
 await page.getByRole('button',{name:'Spiel starten',exact:true}).click();await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__eclipse.engine.floorDuration),10);
 await page.keyboard.down('d');await page.waitForTimeout(450);await page.keyboard.up('d');assert.ok(await page.evaluate(()=>window.__eclipse.engine.player.x)>1600+30);
 await page.keyboard.press('Space');await page.keyboard.press('Escape');const clocks=await page.evaluate(()=>[window.__eclipse.engine.time,window.__eclipse.engine.floorTime]);await page.waitForTimeout(250);assert.deepEqual(await page.evaluate(()=>[window.__eclipse.engine.time,window.__eclipse.engine.floorTime]),clocks);
 await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();await page.reload();await ready();await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();assert.equal(await page.evaluate(()=>window.__eclipse.engine.status),'paused');await page.getByRole('button',{name:'Weiterkämpfen',exact:true}).click();
 checks.push('Movement, dash, pause, save to menu and reload in active floor');
 // Grant XP only to exercise the existing level-card route; no health or immunity injection.
 await page.evaluate(()=>window.__eclipse.engine.addXp(40));await page.locator('[data-action=upgrade]').first().waitFor();await page.keyboard.press('Digit1');
 await page.waitForFunction(()=>window.__eclipse.engine.status==='floorReward',{},{timeout:30000});
 assert.equal(await page.locator('[data-action=reward]').count(),3);assert.equal(await page.locator('#boss-hud').isVisible(),false);
 const stop=await page.evaluate(()=>({time:window.__eclipse.engine.time,hp:window.__eclipse.engine.player.hp,offers:window.__eclipse.engine.rewardOffers,build:window.__eclipse.engine.build}));await page.waitForTimeout(300);assert.deepEqual(await page.evaluate(()=>({time:window.__eclipse.engine.time,hp:window.__eclipse.engine.player.hp,offers:window.__eclipse.engine.rewardOffers,build:window.__eclipse.engine.build})),stop);
 await page.screenshot({path:'reports/screenshots/v3-step1-chest.png'});await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();await page.reload();await ready();await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.__eclipse.engine.rewardOffers),stop.offers);
 await page.keyboard.press('Digit2');assert.equal(await page.evaluate(()=>window.__eclipse.engine.status),'floorReady');const chosen=await page.evaluate(()=>window.__eclipse.engine.build);
 await page.waitForTimeout(400);await page.screenshot({path:'reports/screenshots/v3-step1-next-floor.png'});await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();await page.reload();await ready();await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.__eclipse.engine.build),chosen);assert.equal(await page.locator('[data-action=reward]').count(),0);
 await page.getByRole('button',{name:'Etage 2 starten',exact:true}).click();assert.deepEqual(await page.evaluate(()=>window.__eclipse.engine.build),chosen);assert.equal(await page.evaluate(()=>window.__eclipse.engine.floor),2);
 await page.waitForFunction(()=>window.__eclipse.engine.status==='floorReward',{},{timeout:30000});assert.equal(await page.evaluate(()=>window.__eclipse.engine.completedFloors),2);await page.locator('[data-action=reward]').first().click();await page.getByRole('button',{name:'Etage 3 starten',exact:true}).click();
 checks.push('Two real timed floors, three chest choices, exact one choice, build retained, chest and ready state reload');
 await page.evaluate(()=>{const e=window.__eclipse.engine;e.player.invulnerable=0;e.hurt(999999);});await page.getByText('Im Schatten gefallen.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.__eclipse.save.stats.floors),2);await page.getByRole('button',{name:'Neue Runde mit diesem Menü-Build',exact:true}).click();assert.equal(await page.evaluate(()=>window.__eclipse.engine.floor),1);assert.equal(await page.evaluate(()=>window.__eclipse.engine.completedFloors),0);
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'Runde freiwillig beenden',exact:true}).click();await page.getByRole('button',{name:'Zum Hauptmenü',exact:true}).click();checks.push('Defeat, restart and retirement retain the existing flow');
 assert.equal(await page.evaluate(()=>localStorage.getItem('eclipse-survivor-v2')),legacy);assert.ok(await page.evaluate(()=>localStorage.getItem('stillalive-v3-step1')));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);checks.push('V2 blob remains byte-for-byte unchanged; V3 uses its own key');
 const report={checks,errors,failed,timedFloors:2,floorSeconds:10,note:'Real timer and UI used. XP injected for level-card coverage; defeat injected at end. No artificial HP or immunity during the two floors. Separate browser context.'};writeFileSync('reports/browser-v3-step1.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
