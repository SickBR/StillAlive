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
  const base=process.env.PRODUCTION_URL||'http://127.0.0.1:4173/';await page.goto(`${base}?qa=1`);
  await page.getByRole('button',{name:'Spiel starten',exact:true}).waitFor();await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(()=>typeof window.__eclipse),'undefined');
  await page.getByRole('button',{name:'Spiel starten',exact:true}).click();
  for(const key of ['d','s','a','w','d','s','a','w']){
    await page.keyboard.down(key);await page.waitForTimeout(1900);await page.keyboard.up(key);
    if(await page.locator('.upgrade-card').count())await page.keyboard.press('Digit1');
  }
  await page.screenshot({path:'reports/screenshots/v21-production-gameplay.png'});
  assert.equal(await page.getByText('Im Schatten gefallen.',{exact:true}).count(),0);
  await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.ok(await page.getByRole('button',{name:'Weiterkämpfen'}).isVisible());
  const external=requests.filter(url=>!url.startsWith('data:')&&new URL(url).origin!==new URL(base).origin);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const report={productionBoot:true,keyboardGameplaySeconds:15,paused:true,qaHookAbsent:true,externalRequests:external.length,errors};
  writeFileSync('reports/production-v21.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
