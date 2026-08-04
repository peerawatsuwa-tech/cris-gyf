export type ReadinessLevel = "Y" | "Q" | "N";

export type EquipmentStatus =
  | "Operational"
  | "Limited"
  | "Not Ready";

export type CurrentEquipmentStatus =
  | EquipmentStatus
  | "Not Installed"
  | null;

export interface ShipCurrentReadiness {
  crew: number | null;
  propulsion: CurrentEquipmentStatus;
  radar: CurrentEquipmentStatus;
  communication: CurrentEquipmentStatus;
  navigation: CurrentEquipmentStatus;
  weapon: CurrentEquipmentStatus;
  rhib: CurrentEquipmentStatus;
  eoir: CurrentEquipmentStatus;
  majorDeficiencies: string;
  missionLimitations: string;
  updatedAt: string | null;
  assignmentGroup?: import("@/constants/assignments").AssignmentGroup | null;
  assignmentLocation?: import("@/constants/assignments").AssignmentLocation | null;
}

export interface ShipSourceReference {
  datasetId: string;
  communicationReadinessReference: number | null;
}

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

  currentReadiness: ShipCurrentReadiness;

  source: ShipSourceReference;

}
