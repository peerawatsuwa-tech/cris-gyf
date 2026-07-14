import { WEIGHTS } from "./weights";
import { equipmentScore } from "./helpers";
import { getReadiness } from "./readiness";
import type { Ship } from "@/types/ship";

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function calculateReadiness(ship: Ship) {
  const personnel = clampScore(
    ship.authorizedCrew > 0 ? (ship.crew / ship.authorizedCrew) * 100 : 0,
  );

  const equipmentScores = [
    equipmentScore(ship.equipment.radar),
    equipmentScore(ship.equipment.communication),
    equipmentScore(ship.equipment.weapon),
    equipmentScore(ship.equipment.navigation),
    equipmentScore(ship.equipment.eoir),
    equipmentScore(ship.equipment.rhib),
  ];

  const score = clampScore(
    personnel * (WEIGHTS.crew / 100) +
      equipmentScores[0] * (WEIGHTS.radar / 100) +
      equipmentScores[1] * (WEIGHTS.communication / 100) +
      equipmentScores[2] * (WEIGHTS.weapon / 100) +
      equipmentScores[3] * (WEIGHTS.navigation / 100) +
      equipmentScores[4] * (WEIGHTS.eoir / 100) +
      equipmentScores[5] * (WEIGHTS.rhib / 100),
  );

  const equipment =
    equipmentScores.reduce((sum, value) => sum + value, 0) /
    equipmentScores.length;

  return {
    score: Number(score.toFixed(1)),
    readiness: getReadiness(score),
    personnel: Number(personnel.toFixed(1)),
    equipment: Number(equipment.toFixed(1)),
  };
}
