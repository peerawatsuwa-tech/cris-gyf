import { calculateMission, type MissionResult } from "./MissionEngine";
import type { Ship, ReadinessLevel } from "@/types/ship";

export interface FleetMissionShipAssessment {
  ship: Ship;
  result: MissionResult;
}

export interface FleetMissionSummary {
  mission: string;
  readiness: ReadinessLevel;
  averageScore: number;
  ready: number;
  limited: number;
  notReady: number;
  total: number;
  assessments: FleetMissionShipAssessment[];
}

export interface FleetMissionAssessment {
  missions: FleetMissionSummary[];
  totalAssessments: number;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;

  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1),
  );
}

function toReadiness(score: number): ReadinessLevel {
  return score >= 90 ? "Y" : score >= 70 ? "Q" : "N";
}

function safeCalculateMission(ship: Ship): MissionResult[] {
  try {
    return calculateMission(ship).map((result) => ({
      ...result,
      score: Math.min(100, Math.max(0, result.score)),
    }));
  } catch (error) {
    console.error(`Unable to assess missions for ${ship.shipName}`, error);
    return [];
  }
}

export function evaluateFleetMissions(
  fleet: Ship[],
): FleetMissionAssessment {
  const assessments = fleet.flatMap((ship) =>
    safeCalculateMission(ship).map((result) => ({ ship, result })),
  );

  const missionNames = Array.from(
    new Set(assessments.map(({ result }) => result.mission)),
  );

  const missions = missionNames.map((mission) => {
    const missionAssessments = assessments.filter(
      ({ result }) => result.mission === mission,
    );
    const averageScore = average(
      missionAssessments.map(({ result }) => result.score),
    );

    return {
      mission,
      readiness: toReadiness(averageScore),
      averageScore,
      ready: missionAssessments.filter(
        ({ result }) => result.readiness === "Y",
      ).length,
      limited: missionAssessments.filter(
        ({ result }) => result.readiness === "Q",
      ).length,
      notReady: missionAssessments.filter(
        ({ result }) => result.readiness === "N",
      ).length,
      total: missionAssessments.length,
      assessments: missionAssessments,
    };
  });

  return {
    missions,
    totalAssessments: assessments.length,
  };
}
