import type { ReadinessLevel, Ship } from "@/types/ship";
import {
  isRequirementMet,
  missionCapabilityFramework,
  type MissionId,
  type MissionRequirement,
} from "./missionCapabilityFramework";

export interface OperationalReadinessAssessment {
  missionId: MissionId;
  mission: string;
  score: number;
  readiness: ReadinessLevel;
  reasons: string[];
  impacts: string[];
  recommendations: string[];
  unmetRequirements: readonly MissionRequirement[];
}

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, score));
}

function toReadiness(score: number): ReadinessLevel {
  return score >= 90 ? "Y" : score >= 70 ? "Q" : "N";
}

export function assessOperationalReadiness(
  ship: Ship,
): OperationalReadinessAssessment[] {
  return missionCapabilityFramework.map((mission) => {
    const unmetRequirements = mission.requirements.filter(
      (requirement) => !isRequirementMet(ship, requirement),
    );

    const score = clampScore(
      100 -
        unmetRequirements.reduce(
          (totalPenalty, requirement) => totalPenalty + requirement.penalty,
          0,
        ),
    );

    return {
      missionId: mission.id,
      mission: mission.name,
      score,
      readiness: toReadiness(score),
      reasons: unmetRequirements.map((requirement) => requirement.reason),
      impacts: unmetRequirements.map((requirement) => requirement.impact),
      recommendations: unmetRequirements.map(
        (requirement) => requirement.recommendation,
      ),
      unmetRequirements,
    };
  });
}
