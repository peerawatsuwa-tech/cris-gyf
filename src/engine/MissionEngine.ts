import type { Ship } from "@/types/ship";
import {
  isRequirementMet,
  missionCapabilityFramework,
} from "./missionCapabilityFramework";

export interface MissionResult {
  mission: string;
  readiness: "Y" | "Q" | "N";
  score: number;
  reasons: string[];
}

function toReadiness(score: number): MissionResult["readiness"] {
  return score >= 90 ? "Y" : score >= 70 ? "Q" : "N";
}

export function calculateMission(ship: Ship): MissionResult[] {
  return missionCapabilityFramework.map((mission) => {
    const unmetRequirements = mission.requirements.filter(
      (requirement) => !isRequirementMet(ship, requirement),
    );

    const score = Math.max(
      0,
      100 -
        unmetRequirements.reduce(
          (totalPenalty, requirement) => totalPenalty + requirement.penalty,
          0,
        ),
    );

    return {
      mission: mission.name,
      readiness: toReadiness(score),
      score,
      reasons: unmetRequirements.map((requirement) => requirement.reason),
    };
  });
}
