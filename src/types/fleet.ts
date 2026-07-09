export type ReadinessLevel = 'Y' | 'Q' | 'N';

export interface FleetShip {
  id: string;
  hullNumber: string;
  shipName: string;
  squadron: string;
  shipClass: string;
  readiness: ReadinessLevel;
  cRating: 'C1' | 'C2' | 'C3' | 'C4';
  status: string;
}
