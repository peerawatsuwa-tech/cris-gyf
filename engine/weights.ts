export interface EngineWeights {
  readiness: number;
  mission: number;
  rating: number;
}

export const weights: EngineWeights = {
  readiness: 0.5,
  mission: 0.3,
  rating: 0.2,
};
