export type ReadinessLevel = 'Y' | 'Q' | 'N';

export interface Ship {
  id: number;
  hullNumber: string;
  name: string;
  fleet: string;
  shipClass: string;

  readiness: ReadinessLevel;
  cRating: string;

  status: string;

  crew: number;
  authorizedCrew: number;
}
