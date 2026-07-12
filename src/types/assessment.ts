import type { Recommendation } from "@/types/recommendation";

export interface AssessmentResult {
  personnel: number;

  equipment: number;

  mission: number;

  overall: number;

  readiness: "Y" | "Q" | "N";

  recommendations: Recommendation[];
}