export type ReadinessLevel = "Y" | "Q" | "N";

export type EquipmentStatus =
  | "Operational"
  | "Limited"
  | "Not Ready";

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

    radar: EquipmentStatus;

    communication: EquipmentStatus;

    weapon: EquipmentStatus;

    navigation: EquipmentStatus;

    eoir: EquipmentStatus;

    rhib: EquipmentStatus;

  };

}