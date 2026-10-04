import type {ClassId} from './core/config';

/** Combat textures. Reaper uses a padded atlas; the other starters use 64px cells. */
export const PLAYER_SPRITES={
 warrior:{texture:'reaper_gameplay',scale:.27},
 archer:{texture:'shadow-hunter-v1',scale:1.5},
 mage:{texture:'arcanist-v1',scale:1.5},
} as const satisfies Record<ClassId,{texture:string;scale:number}>;
export const PLAYER_FRAMES={width:64,height:64,count:17,originX:.5,originY:54/64};
export const PLAYER_ANIMATIONS={
 idle:{start:0,end:1,frameRate:3,repeat:-1},
 walk:{start:2,end:5,frameRate:10,repeat:-1},
 attack:{start:11,end:16,frameRate:12,repeat:0},
 hit:{start:6,end:6,frameRate:8,repeat:0},
 death:{start:7,end:10,frameRate:7,repeat:0},
} as const;
export const REAPER_ANIMATIONS={
 idle:{start:0,end:4,frameRate:5,repeat:-1},
 walk:{start:5,end:12,frameRate:12,repeat:-1},
 attack:{start:13,end:19,frameRate:14,repeat:0},
 hit:{start:20,end:23,frameRate:16,repeat:0},
 death:{start:24,end:29,frameRate:8,repeat:0},
};
export const animationsFor=(id:ClassId)=>id==='warrior'?REAPER_ANIMATIONS:PLAYER_ANIMATIONS;
/** UI assets are intentionally independent of combat textures. */
export const menuTexture=(id:ClassId)=>id==='warrior'?'reaper_menu_hero':PLAYER_SPRITES[id].texture;
export const menuSpriteClass=(id:ClassId)=>id==='warrior'?' reaper-menu-art':'';
export type PlayerAnimation=keyof typeof PLAYER_ANIMATIONS;
export const animationKey=(id:ClassId,state:PlayerAnimation)=>`${PLAYER_SPRITES[id].texture}-${state}`;

/** Visual state only; never changes damage, cooldowns, input or saved runs. */
export class PlayerAnimator {
 constructor(readonly classId:ClassId='mage'){}
 state:PlayerAnimation='idle';elapsed=0;facing=1;
 private change(state:PlayerAnimation){if(this.state!==state){this.state=state;this.elapsed=0;}}
 attack(angle:number){if(this.state==='death'||this.state==='hit'||this.state==='attack')return;this.facing=Math.cos(angle)<0?-1:1;this.change('attack');}
 hit(){if(this.state!=='death'){this.change('hit');this.elapsed=0;}}
 step(dt:number,moving:boolean,directionX:number,dead:boolean,running:boolean){
  if(dead)this.change('death');
  if(!running&&!dead)return;
  this.elapsed+=dt;
  if(this.state==='death')return;
  const a=animationsFor(this.classId)[this.state],duration=(a.end-a.start+1)/a.frameRate;
  if((this.state==='attack'||this.state==='hit')&&this.elapsed<duration)return;
  if(directionX)this.facing=directionX<0?-1:1;
  this.change(moving?'walk':'idle');
 }
 get deathComplete(){const a=animationsFor(this.classId).death;return this.state==='death'&&this.elapsed>=(a.end-a.start+1)/a.frameRate;}
}
