import type { ReadinessLevel, Ship } from "@/types/ship";
import { assessOperationalReadiness } from "./operationalReadinessAssessmentEngine";

export interface MissionResult {
  mission: string;
  readiness: ReadinessLevel;
  score: number;
  reasons: string[];
}

export function calculateMission(ship: Ship): MissionResult[] {
  return assessOperationalReadiness(ship).map(
    ({ mission, readiness, score, reasons }) => ({
      mission,
      readiness,
      score,
      reasons,
    }),
  );
}
