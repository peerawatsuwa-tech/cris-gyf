import type { ReadinessLevel } from '../types/ship';

export function getReadiness(score: number): ReadinessLevel {
  if (score >= 90) return 'Y';
  if (score >= 70) return 'Q';
  return 'N';
}
