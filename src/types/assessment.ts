import type { ReadinessLevel } from './ship';

export interface Assessment {
  overall: number;
  readiness: ReadinessLevel;
  confidence: number;
  risk: string;
}
