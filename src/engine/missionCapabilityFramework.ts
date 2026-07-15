import type { EquipmentStatus, Ship } from "@/types/ship";

export type MissionId =
  | "M1_MARITIME_PRESENCE"
  | "M2_MARITIME_LAW_ENFORCEMENT"
  | "M4_SEARCH_AND_RESCUE";

export type MissionRequirement =
  | {
      kind: "crew";
      minimumRatio: number;
      penalty: number;
      reason: string;
    }
  | {
      kind: "equipment";
      equipment: keyof Ship["equipment"];
      requiredStatus: EquipmentStatus;
      penalty: number;
      reason: string;
    };

export interface MissionCapabilityDefinition {
  id: MissionId;
  name: string;
  requirements: readonly MissionRequirement[];
}

export const missionCapabilityFramework: readonly MissionCapabilityDefinition[] = [
  {
    id: "M1_MARITIME_PRESENCE",
    name: "Maritime Presence",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.9,
        penalty: 20,
        reason: "Personnel below 90%",
      },
      {
        kind: "equipment",
        equipment: "radar",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "Radar unavailable",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "Communication unavailable",
      },
    ],
  },
  {
    id: "M2_MARITIME_LAW_ENFORCEMENT",
    name: "Maritime Law Enforcement",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.9,
        penalty: 20,
        reason: "Personnel below 90%",
      },
      {
        kind: "equipment",
        equipment: "weapon",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "Weapon unavailable",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "RHIB unavailable",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "Communication unavailable",
      },
    ],
  },
  {
    id: "M4_SEARCH_AND_RESCUE",
    name: "Search and Rescue",
    requirements: [
      {
        kind: "crew",
        minimumRatio: 0.8,
        penalty: 20,
        reason: "Personnel below 80%",
      },
      {
        kind: "equipment",
        equipment: "navigation",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "Navigation unavailable",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "Communication unavailable",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "RHIB unavailable",
      },
    ],
  },
] as const;

function crewRatio(ship: Ship): number {
  if (ship.authorizedCrew <= 0) return 0;
  return ship.crew / ship.authorizedCrew;
}

export function isRequirementMet(
  ship: Ship,
  requirement: MissionRequirement,
): boolean {
  if (requirement.kind === "crew") {
    return crewRatio(ship) >= requirement.minimumRatio;
  }

  return ship.equipment[requirement.equipment] === requirement.requiredStatus;
}
