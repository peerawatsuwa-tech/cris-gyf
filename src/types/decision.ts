export type DecisionUrgency = "เร่งด่วน" | "สูง" | "ตามแผน";

export interface CommanderDecision {
  priority: number;
  title: string;
  reason: string;
  urgency: DecisionUrgency;
  affectedShips: number;
  affectedMissions: number;
  estimatedReadinessGain: number;
  expectedOutcome: string;
}

export interface CommanderDecisionSummary {
  headline: string;
  decisions: CommanderDecision[];
}
