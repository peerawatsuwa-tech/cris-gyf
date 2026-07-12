import type { Ship } from "@/types/ship";

import { calculateReadiness } from "./calculateReadiness";
import { calculateMission } from "./MissionEngine";
import { calculateRecommendation } from "./recommendationEngine";
import { calculateAlerts } from "./alertEngine";
import { calculateActions } from "./actionEngine";
import { calculateImpact } from "./impactEngine";

export interface AssessmentEngineResult {
  readiness: ReturnType<typeof calculateReadiness>;

  missions: ReturnType<typeof calculateMission>;

  alerts: ReturnType<typeof calculateAlerts>;

  actions: ReturnType<typeof calculateActions>;

  impacts: ReturnType<typeof calculateImpact>;

  recommendations: ReturnType<typeof calculateRecommendation>;
}

export function assessShip(
  ship: Ship
): AssessmentEngineResult {

  const readiness =
    calculateReadiness(ship);

  const missions =
    calculateMission(ship);

  const alerts =
    calculateAlerts(ship);

  const actions =
    calculateActions(ship);

  const impacts =
    calculateImpact(ship);

  const recommendations =
    calculateRecommendation(ship);

  return {

    readiness,

    missions,

    alerts,

    actions,

    impacts,

    recommendations,

  };

}