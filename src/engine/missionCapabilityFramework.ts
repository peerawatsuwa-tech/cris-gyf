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
      impact: string;
      recommendation: string;
    }
  | {
      kind: "equipment";
      equipment: keyof Ship["equipment"];
      requiredStatus: EquipmentStatus;
      penalty: number;
      reason: string;
      impact: string;
      recommendation: string;
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
        impact: "Reduced watchkeeping and sustained operations capacity",
        recommendation: "Restore crew strength to at least 90%",
      },
      {
        kind: "equipment",
        equipment: "radar",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "Radar unavailable",
        impact: "Reduced surface surveillance and contact detection",
        recommendation: "Restore radar to operational status",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 40,
        reason: "Communication unavailable",
        impact: "Command and coordination capability is degraded",
        recommendation: "Restore communication equipment to operational status",
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
        impact: "Reduced watchkeeping and sustained operations capacity",
        recommendation: "Restore crew strength to at least 90%",
      },
      {
        kind: "equipment",
        equipment: "weapon",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "Weapon unavailable",
        impact: "Interdiction and force protection capability is degraded",
        recommendation: "Restore weapon system to operational status",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "RHIB unavailable",
        impact: "Boarding, transfer, or rescue operations are restricted",
        recommendation: "Restore RHIB to operational status",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "Communication unavailable",
        impact: "Command and coordination capability is degraded",
        recommendation: "Restore communication equipment to operational status",
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
        impact: "Rescue team endurance and response capacity are reduced",
        recommendation: "Restore crew strength to at least 80%",
      },
      {
        kind: "equipment",
        equipment: "navigation",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "Navigation unavailable",
        impact: "Safe navigation and search pattern execution are degraded",
        recommendation: "Restore navigation equipment to operational status",
      },
      {
        kind: "equipment",
        equipment: "communication",
        requiredStatus: "Operational",
        penalty: 20,
        reason: "Communication unavailable",
        impact: "Command and coordination capability is degraded",
        recommendation: "Restore communication equipment to operational status",
      },
      {
        kind: "equipment",
        equipment: "rhib",
        requiredStatus: "Operational",
        penalty: 30,
        reason: "RHIB unavailable",
        impact: "Boarding, transfer, or rescue operations are restricted",
        recommendation: "Restore RHIB to operational status",
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
