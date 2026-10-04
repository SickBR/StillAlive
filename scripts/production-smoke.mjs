import { chromium } from '@playwright/test';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.LOCALAPPDATA?join(process.env.LOCALAPPDATA,'ms-playwright'):'';
const executablePath=process.env.CHROME_PATH||(root&&existsSync(root)?readdirSync(root).filter(x=>/^chromium-/.test(x)).sort().reverse().map(x=>join(root,x,'chrome-win64','chrome.exe')).find(existsSync):undefined)||undefined;
const browser=await chromium.launch({headless:true,executablePath,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>requests.push(r.url()));
  const base=process.env.PRODUCTION_URL||'http://127.0.0.1:4183/';await page.goto(`${base}?qa=1&floorSeconds=5`);
  await page.getByRole('button',{name:'Spiel starten',exact:true}).waitFor();await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(()=>typeof window.__eclipse),'undefined');
  assert.equal(await page.locator('.sanctuary-brand>span').textContent(),'ENDLESS');
  await page.getByRole('button',{name:'Charaktere',exact:true}).click();
  assert.equal(await page.locator('.character-card').count(),13);assert.equal(await page.locator('.future-character:disabled').count(),10);
  await page.locator('[data-action=preview-character][data-id=warrior]').click();
  assert.equal(await page.locator('[data-preview-character=warrior] button').isDisabled(),true);
  await page.locator('[data-action=preview-character][data-id=mage]').click();await page.locator('[data-action=choose-character][data-id=mage]').click();
  assert.equal(await page.locator('.hero-caption h2').textContent(),'Arkanist');
  await page.getByRole('button',{name:'Charaktere',exact:true}).click();await page.locator('[data-action=preview-character][data-id=warrior]').click();await page.locator('[data-action=choose-character][data-id=warrior]').click();
  await page.getByRole('button',{name:'Spiel starten',exact:true}).click();
  assert.equal(await page.locator('#timer').textContent(),'03:00');
  assert.equal(await page.locator('#phase-name').textContent(),'ETAGE 1');
  for(const key of ['d','s','a','w','d','s','a','w']){
    await page.keyboard.down(key);await page.waitForTimeout(1900);await page.keyboard.up(key);
    if(await page.locator('.upgrade-card').count())await page.keyboard.press('Digit1');
  }
  await page.screenshot({path:'reports/screenshots/v3-step1-production-gameplay.png'});
  assert.equal(await page.getByText('GEFALLEN',{exact:true}).count(),0);
  await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.ok(await page.getByRole('button',{name:'Weiterkämpfen'}).isVisible());
  await page.getByRole('button',{name:'Speichern & Hauptmenü',exact:true}).click();await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Charaktere',exact:true}).click();await page.locator('[data-action=preview-character][data-id=warrior]').click();
  assert.equal(await page.locator('.dialog').evaluate(n=>n.scrollWidth>n.clientWidth+1),false);
  assert.equal(await page.locator('[data-preview-character=warrior] button').isDisabled(),true);
  await page.screenshot({path:'reports/screenshots/phase-a-production-mobile.png'});await page.keyboard.press('Escape');
  assert.equal(await page.locator('.dialog-layer').count(),0);
  const external=requests.filter(url=>!url.startsWith('data:')&&new URL(url).origin!==new URL(base).origin);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const report={productionBoot:true,phaseACharacterSelector:true,productionMobileSelector:true,characterCards:13,futureSlots:10,reaperPlayable:true,normalFloorSeconds:180,developmentShortFloorIgnored:true,keyboardGameplaySeconds:15,paused:true,qaHookAbsent:true,externalRequests:external.length,errors};
  writeFileSync('reports/production-v3-step1.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
