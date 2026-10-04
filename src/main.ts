import Phaser from 'phaser';
import {FLOOR_RULES} from './core/floors';
import {Engine} from './core/engine';
import {readSave,writeSave,checkpoint} from './core/storage';
import {purchase,runConfig} from './core/meta';
import {GameScene} from './render/GameScene';
import {AudioBus} from './audio';
import {UI} from './ui';
import './style.css';
import './ui/design.css';
import './ui/theme.css';
const save=readSave(),audio=new AudioBus(),scene=new GameScene();audio.setVolume(save.settings.volume);scene.settings=save.settings;
let engine:Engine|undefined,ready=false,recorded=false,lastStatus='',lastCheckpoint=0;
function persist(){if(!writeSave(save))ui.toast('Speicher nicht verfügbar. Die Sitzung bleibt spielbar; Fortsetzen nach Schließen ist nicht gesichert.');}
function record(){if(!engine||recorded)return;recorded=true;checkpoint(save,engine,true);persist();}
function secure(){if(engine&&!recorded){checkpoint(save,engine);persist();lastCheckpoint=engine.time;}}
function attach(e:Engine){audio.start();engine=e;recorded=false;lastStatus=e.status;lastCheckpoint=e.time;scene.startRun(e);ui.startHud();ui.update(e,true);ui.overlay(e);if(e.status!=='playing')audio.pause();}
function start(){if(!ready){ui.toast('Die Arena wird geladen. Gleich geht es los.');return;}if(save.run){ui.toast('Setze die gespeicherte Runde fort oder beende sie über das Pausemenü.');return;}const requested=import.meta.env.DEV?Number(new URLSearchParams(location.search).get('floorSeconds')):0;const floorDuration=requested>=FLOOR_RULES.minimumTestDuration&&requested<=FLOOR_RULES.duration?requested:FLOOR_RULES.duration;attach(new Engine(undefined,runConfig(save.profile),{floorDuration}));secure();ui.toast('WASD bewegen · Automatische Angriffe · LEERTASTE ausweichen');}
function continueRun(){if(!ready)return;const e=Engine.restore(save.run);if(!e){save.run=null;persist();ui.menu();ui.toast('Dieser Rundenspeicher konnte nicht wiederhergestellt werden. Dein Vermächtnis bleibt erhalten.');return;}attach(e);}
function pause(){if(!engine||engine.status==='dead'||engine.status==='retired')return;const dialog=document.querySelector('.dialog-layer');if(dialog){dialog.remove();return;}engine.pause();if(engine.status==='paused'){audio.pause();secure();}else if(engine.status==='playing')audio.start();ui.overlay(engine);lastStatus=engine.status;}
function menu(){engine=undefined;scene.clearRun();lastStatus='';audio.pause();ui.menu();}
function chooseReward(index:number){if(engine?.selectFloorReward(index)){ui.overlay(engine);lastStatus=engine.status;ui.update(engine,true);secure();}}
function nextFloor(){if(engine?.startNextFloor()){scene.startRun(engine);audio.start();ui.overlay(engine);lastStatus=engine.status;ui.update(engine,true);secure();ui.toast(`Etage ${engine.floor} beginnt. Dein Build bleibt erhalten.`);}}
const ui=new UI(save,{reward:chooseReward,nextFloor,start,continue:continueRun,resume:pause,pause,menu,suspend:()=>{secure();menu();},retire:()=>{if(!engine)return;engine.retire();record();ui.overlay(engine);lastStatus=engine.status;audio.result('retired');},upgrade:i=>{if(engine?.selectUpgrade(i)){ui.overlay(engine);lastStatus=engine.status;ui.update(engine,true);secure();}},settings:s=>{scene.settings=s;audio.setVolume(s.volume);persist();},persist:()=>{persist();},buy:(type,id)=>{const ok=purchase(save.profile,type,id);if(ok)persist();return ok;}});
ui.menu();scene.onReady=()=>{ready=true;};scene.onPause=pause;scene.onEvent=event=>{if(event.type!=='player-attack')audio.play(event.type);if(event.type==='floor-complete'){document.getElementById('toast')?.classList.remove('visible');audio.pause();secure();}if(event.type==='formation')ui.toast('Eine Flanke zieht zu. Suche die Lücke.');};
scene.onTick=()=>{if(!engine)return;ui.update(engine);if(engine.status!==lastStatus){lastStatus=engine.status;if(engine.status!=='dead')ui.overlay(engine);if(engine.status==='dead'||engine.status==='retired'){record();audio.pause();}}if(engine.status==='dead'&&scene.playerDeathComplete&&!document.querySelector('.result-card')){ui.overlay(engine);audio.result('dead');}if(!recorded&&engine.time-lastCheckpoint>=15)secure();};
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1280,height:720,backgroundColor:'#1c2428',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[scene],audio:{noAudio:true},fps:{target:60,smoothStep:true},render:{antialias:false}});
document.addEventListener('keydown',event=>{const editing=(event.target as HTMLElement).matches('input,select,textarea');if(event.code==='Escape'&&!engine)ui.closeDialog();if(editing)return;if(engine?.status==='floorReward'&&['Digit1','Digit2','Digit3'].includes(event.code)&&!event.repeat){chooseReward(Number(event.code.slice(-1))-1);return;}if(engine?.status==='upgrade'&&['Digit1','Digit2','Digit3'].includes(event.code)&&!event.repeat){if(engine.selectUpgrade(Number(event.code.slice(-1))-1)){ui.overlay(engine);lastStatus=engine.status;ui.update(engine,true);secure();}}if(event.code==='Tab'){const modal=document.querySelector('.dialog-layer,.overlay-backdrop');if(!modal)return;const items=[...modal.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,[tabindex="0"],.result-card summary')].filter(n=>n.getClientRects().length>0);if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}}});
function blur(){if(engine?.status==='playing'){engine.pause();audio.pause();ui.overlay(engine);lastStatus=engine.status;}secure();}
window.addEventListener('blur',blur);document.addEventListener('visibilitychange',()=>{if(document.hidden)blur();});window.addEventListener('pagehide',secure);
if(import.meta.env.DEV&&new URLSearchParams(location.search).has('qa'))Object.assign(window,{__eclipse:{get engine(){return engine;},get scene(){return scene;},get game(){return game;},start,continueRun,save,pause,secure,ui}});
