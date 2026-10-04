import {chromium} from '@playwright/test';
import {existsSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const root=join(process.env.LOCALAPPDATA,'ms-playwright');
const exe=readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync);
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||exe,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
mkdirSync('reports/screenshots',{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
const ready=()=>page.waitForFunction(()=>window.__eclipse?.scene?.textures.exists('shadow-hunter-v1'));
const diag=()=>page.evaluate(()=>window.__eclipse.scene.diagnostics);
try{
 await page.goto(`${process.env.BASE_URL||'http://127.0.0.1:5183/'}?qa=1`);await ready();
 for(const [id,name,texture,weapon] of [['warrior','Reaper','reaper_gameplay','scythe'],['archer','Schattenjäger','shadow-hunter-v1','hunting'],['mage','Arkanist','arcanist-v1','firestaff']]){
  await page.getByRole('button',{name:'Charaktere',exact:true}).click();await page.locator(`[data-action=preview-character][data-id=${id}]`).click();
  if(id==='warrior'){assert.ok((await page.locator('.character-preview-sprite').getAttribute('style')).includes('reaper_menu_hero'));assert.ok((await page.locator('[data-id=warrior] .character-card-sprite').getAttribute('style')).includes('reaper_menu_hero'));}
  const choose=page.locator(`[data-action=choose-character][data-id=${id}]`);if(await choose.isDisabled())await page.locator('.dialog .close').click();else await choose.click();
  assert.equal(await page.locator('.hero-caption h2').textContent(),name);
  assert.ok((await page.locator('.hero-idle').getAttribute('style')).includes(id==='warrior'?'reaper_menu_hero':texture));
  const initialPosition=await page.locator('.hero-idle').evaluate(n=>getComputedStyle(n).backgroundPosition);
  await page.waitForFunction(initial=>getComputedStyle(document.querySelector('.hero-idle')).backgroundPosition!==initial,initialPosition,{timeout:10000});
  await page.screenshot({path:`reports/screenshots/starter-${id}-menu.png`});
  await page.getByRole('button',{name:'Spiel starten',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.classId),id);assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.startWeapon),weapon);
  assert.equal((await diag()).playerTexture,texture);
  await page.evaluate(()=>{const s=window.__eclipse.scene;window.starterFrames=[];for(const event of ['animationstart','animationupdate','animationcomplete'])s.hero.on(event,(animation,frame)=>window.starterFrames.push({key:animation.key,frame:Number(frame.textureFrame)}));});
  await page.keyboard.down('a');await page.waitForTimeout(750);assert.equal((await diag()).playerAnimation,'walk');assert.equal((await diag()).playerFacing,-1);await page.keyboard.up('a');
  await page.keyboard.down('d');await page.waitForTimeout(270);assert.equal((await diag()).playerFacing,1);await page.keyboard.up('d');
  await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='idle');
  if(id==='warrior'){await page.waitForTimeout(1100);const frames=await page.evaluate(()=>window.starterFrames);for(let i=0;i<=4;i++)assert.ok(frames.some(f=>f.key.endsWith('-idle')&&f.frame===i),`Reaper idle frame ${i}`);for(let i=5;i<=12;i++)assert.ok(frames.some(f=>f.key.endsWith('-walk')&&f.frame===i),`Reaper walk frame ${i}`);}
  // Controlled real combat: spawn an actual durable target, then let the engine attack it.
  await page.evaluate(id=>{const e=window.__eclipse.engine;e.enemies=[];const n=e.spawn('brute',e.player.x+(id==='warrior'?85:220),e.player.y);n.hp=n.maxHp=10000;n.speed=0;for(const k of Object.keys(e.cooldowns))e.cooldowns[k]=0;window.starterFrames=[];},id);
  await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='attack');
  await page.keyboard.press('Escape');await page.waitForTimeout(60);const frozen=await page.evaluate(()=>({time:window.__eclipse.engine.time,frame:window.__eclipse.scene.diagnostics.playerFrame}));await page.waitForTimeout(220);
  assert.deepEqual(await page.evaluate(()=>({time:window.__eclipse.engine.time,frame:window.__eclipse.scene.diagnostics.playerFrame})),frozen);
  await page.getByRole('button',{name:'Weiterkämpfen',exact:true}).click();await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='idle');
  assert.ok(await page.evaluate(w=>window.__eclipse.engine.weaponDamage[w]>0,weapon),`${name} deals actual damage`);
  const attack=await page.evaluate(()=>window.starterFrames.filter(f=>f.key.endsWith('-attack')).map(f=>f.frame));
  for(let i=id==='warrior'?13:11;i<=(id==='warrior'?19:16);i++)assert.ok(attack.includes(i),`${name} attack includes frame ${i}: ${attack}`);
  await page.screenshot({path:`reports/screenshots/starter-${id}-game.png`});
  await page.evaluate(()=>{const e=window.__eclipse.engine;e.enemies=[];e.player.invulnerable=0;e.hurt(10);});
  await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='hit');assert.ok((id==='warrior'?[20,21,22,23]:[6]).includes(Number((await diag()).playerFrame)));
  await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='idle');
  if(id==='warrior'){const frames=await page.evaluate(()=>window.starterFrames);for(let i=20;i<=23;i++)assert.ok(frames.some(f=>f.key.endsWith('-hit')&&f.frame===i),`Reaper hit frame ${i}`);}
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();
  const saved=await page.evaluate(()=>({config:window.__eclipse.save.run.config,build:window.__eclipse.save.run.build,hp:window.__eclipse.save.run.player.hp}));
  await page.reload();await ready();await page.getByRole('button',{name:'Runde fortsetzen',exact:true}).click();
  assert.deepEqual(await page.evaluate(()=>({config:window.__eclipse.engine.config,build:window.__eclipse.engine.build,hp:window.__eclipse.engine.player.hp})),saved);
  assert.equal((await diag()).playerTexture,texture);await page.getByRole('button',{name:'Weiterkämpfen',exact:true}).click();
  await page.evaluate(()=>{const s=window.__eclipse.scene;window.starterFrames=[];for(const event of ['animationstart','animationupdate','animationcomplete'])s.hero.on(event,(animation,frame)=>window.starterFrames.push({key:animation.key,frame:Number(frame.textureFrame)}));const e=window.__eclipse.engine;e.player.invulnerable=0;e.hurt(100000);});
  await page.waitForFunction(()=>window.__eclipse.scene.diagnostics.playerAnimation==='death');assert.equal(await page.locator('.result-card').count(),0,'Death is visible before results');
  await page.locator('.result-card').waitFor();assert.equal((await diag()).playerDeathComplete,true);assert.equal(Number((await diag()).playerFrame),id==='warrior'?29:10);
  const death=await page.evaluate(()=>window.starterFrames.filter(f=>f.key.endsWith('-death')).map(f=>f.frame));for(let i=id==='warrior'?24:7;i<=(id==='warrior'?29:10);i++)assert.ok(death.includes(i),`${name} death frame ${i}`);
  await page.getByRole('button',{name:'Erneut spielen',exact:true}).click();assert.equal(await page.evaluate(()=>window.__eclipse.engine.status),'playing');assert.equal((await diag()).playerDeathComplete,false);
  assert.equal(await page.evaluate(()=>window.__eclipse.engine.config.classId),id);assert.equal(await page.evaluate(()=>window.__eclipse.engine.player.hp===window.__eclipse.engine.player.maxHp),true);
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'Runde freiwillig beenden',exact:true}).click();await page.getByRole('button',{name:'Hauptmenü',exact:true}).click();
  checks.push({name,texture,weapon,menuIdle:true,walkAndFlip:true,attackFrames:[...new Set(attack)],hit:true,deathFrames:[...new Set(death)],pauseAndReload:true,restart:true});
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);const report={checks,errors,failed};writeFileSync('reports/browser-starters.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
