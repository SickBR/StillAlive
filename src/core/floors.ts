import {RULES} from './config';

/** Step 1: one reusable arena, a timed fight and one run-only chest reward. */
export const FLOOR_RULES = {
  duration:180,
  minimumTestDuration:5,
  hpPerFloor:.15,
  damagePerFloor:.08,
  speedPerFloor:.01,
  maximumSpeedBonus:.20,
  initialPopulation:24,
  finalPopulation:56,
  populationPerFloor:4,
  populationCap:240,
  spawnStart:.80,
  spawnEnd:.55,
  spawnReductionPerFloor:.025,
  minimumSpawnInterval:.30,
  firstFormation:75,
  formationInterval:45,
  encounterAdvancePerFloor:35,
  maximumEncounterAdvance:180,
  nextFloorGrace:3,
} as const;

export function floorDifficulty(floor:number){
  const n=Math.max(0,floor-1);
  return {hp:1+n*FLOOR_RULES.hpPerFloor,damage:1+n*FLOOR_RULES.damagePerFloor,speed:1+Math.min(FLOOR_RULES.maximumSpeedBonus,n*FLOOR_RULES.speedPerFloor)};
}
export function floorPopulation(floor:number,progress:number){
  return Math.min(RULES.enemyCap,FLOOR_RULES.populationCap,Math.floor(FLOOR_RULES.initialPopulation+(FLOOR_RULES.finalPopulation-FLOOR_RULES.initialPopulation)*Math.max(0,Math.min(1,progress))+(floor-1)*FLOOR_RULES.populationPerFloor));
}
export function floorSpawnInterval(floor:number,progress:number){
  return Math.max(FLOOR_RULES.minimumSpawnInterval,FLOOR_RULES.spawnStart+(FLOOR_RULES.spawnEnd-FLOOR_RULES.spawnStart)*Math.max(0,Math.min(1,progress))-(floor-1)*FLOOR_RULES.spawnReductionPerFloor);
}
