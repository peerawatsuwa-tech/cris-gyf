import type { Ship } from "@/types/ship";

import { calculateReadiness } from "./calculateReadiness";
import { calculateMission } from "./MissionEngine";
import { calculateRecommendation } from "./recommendationEngine";

export interface AssessmentEngineResult {
  readiness: ReturnType<typeof calculateReadiness>;
  missions: ReturnType<typeof calculateMission>;
  recommendations: ReturnType<typeof calculateRecommendation>;
}

export function assessShip(
  ship: Ship
): AssessmentEngineResult {

  const readiness = calculateReadiness(ship);

  const missions = calculateMission(ship);

  const recommendations =
    calculateRecommendation(ship);

  return {
    readiness,
    missions,
    recommendations,
  };
}