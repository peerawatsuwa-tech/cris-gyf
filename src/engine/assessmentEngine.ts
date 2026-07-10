import type { Ship } from "@/types/ship";
import type { AssessmentResult } from "@/types/assessment";

import { calculateReadiness } from "./calculateReadiness";
import { calculateMission } from "./MissionEngine";
import { calculateRecommendation } from "./recommendationEngine";

export function calculateAssessment(
  ship: Ship
): AssessmentResult {

  const readiness = calculateReadiness(ship);

  const missions = calculateMission(ship);

  const recommendations =
    calculateRecommendation(ship);

  return {

    personnel: readiness.personnel,

    equipment: readiness.equipment,

    mission:
      missions.reduce(
        (a, b) => a + b.score,
        0
      ) / missions.length,

    overall: readiness.score,

    readiness: readiness.readiness,

    recommendations,

  };

}