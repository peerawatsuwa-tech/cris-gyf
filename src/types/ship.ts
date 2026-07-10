export type ReadinessLevel = "Y" | "Q" | "N";

export interface Ship {

  id: string;

  hullNumber: string;

  shipName: string;

  squadron: string;

  shipClass: string;

  readiness: ReadinessLevel;

  cRating: "C1" | "C2" | "C3" | "C4";

  status: string;

  crew: number;

  authorizedCrew: number;

  equipment: {

    radar: string;

    communication: string;

    weapon: string;

    navigation: string;

    eoir: string;

    rhib: string;

  };

}