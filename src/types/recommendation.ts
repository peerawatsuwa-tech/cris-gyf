export type RecommendationPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export interface Recommendation {
  priority: RecommendationPriority;

  title: string;

  impact: string;
}