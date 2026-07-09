import { WEIGHTS } from './weights';
import { equipmentScore } from './helpers';
import { getReadiness } from './readiness';

export function calculateReadiness(ship: any) {
  const crew = (ship.crew / ship.authorizedCrew) * 100;

  const score =
    crew * (WEIGHTS.crew / 100) +
    equipmentScore(ship.equipment.radar) * (WEIGHTS.radar / 100) +
    equipmentScore(ship.equipment.communication) * (WEIGHTS.communication / 100) +
    equipmentScore(ship.equipment.weapon) * (WEIGHTS.weapon / 100) +
    equipmentScore(ship.equipment.navigation) * (WEIGHTS.navigation / 100) +
    equipmentScore(ship.equipment.eoir) * (WEIGHTS.eoir / 100) +
    equipmentScore(ship.equipment.rhib) * (WEIGHTS.rhib / 100);

  return {
    score: Number(score.toFixed(1)),
    readiness: getReadiness(score),
  };
}
