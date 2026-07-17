import type { ReadinessLevel } from "@/types/ship";

export type DecisionPriority = "วิกฤต" | "เร่งด่วน" | "ตามแผน";
export type DecisionCategory = "กำลังพล" | "ยุทโธปกรณ์";

export interface DecisionMissionImpact {
  missionId: string;
  missionName: string;
  currentScore: number;
  currentStatus: ReadinessLevel;
  projectedScore: number;
  projectedStatus: ReadinessLevel;
  estimatedGain: number;
}

export interface DecisionConstraint {
  id: string;
  category: DecisionCategory;
  title: string;
  affectedShipIds: string[];
  affectedHullNumbers: string[];
  affectedMissionIds: string[];
  severity: number;
  evidence: string[];
}

export interface RankedCommanderAction {
  id: string;
  rank: number;
  priority: DecisionPriority;
  title: string;
  rationale: string;
  constraintIds: string[];
  affectedShips: number;
  missionImpact: DecisionMissionImpact[];
  estimatedFleetGain: number;
  projectedFleetReadiness: number;
  confidence: number;
  evidence: string[];
}

export interface CommanderDecisionV2Snapshot {
  generatedAt: string;
  fleetReadiness: number;
  fleetStatus: ReadinessLevel;
  constraints: DecisionConstraint[];
  actions: RankedCommanderAction[];
  topAction: RankedCommanderAction | null;
  executiveSummary: string;
}
