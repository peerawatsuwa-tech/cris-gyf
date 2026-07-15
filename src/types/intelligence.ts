import type { ReadinessLevel } from "@/types/ship";

export type IntelligenceSeverity = "วิกฤต" | "สูง" | "ปานกลาง";

export interface FleetIntelligenceIssue {
  title: string;
  severity: IntelligenceSeverity;
  affectedShips: number;
  affectedMissions: number;
}

export interface FleetIntelligenceAction {
  title: string;
  priority: number;
  affectedShips: number;
}

export interface FleetMissionImpact {
  title: string;
  affectedShips: number;
}

export interface FleetIntelligenceSummary {
  fleetReadiness: ReadinessLevel;
  averageReadiness: number;
  headline: string;
  issues: FleetIntelligenceIssue[];
  actions: FleetIntelligenceAction[];
  missionImpacts: FleetMissionImpact[];
}
