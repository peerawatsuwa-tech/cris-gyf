import { calculateReadiness } from "./calculateReadiness";
import type { Ship, ReadinessLevel } from "@/types/ship";

export type ShipReadinessResult = ReturnType<typeof calculateReadiness>;

export interface FleetReadinessItem {
  ship: Ship;
  result: ShipReadinessResult;
}

export interface FleetReadinessSummary {
  items: FleetReadinessItem[];
  ready: number;
  limited: number;
  notReady: number;
  total: number;
  average: number;
  averagePersonnel: number;
  averageEquipment: number;
  fleetReadiness: ReadinessLevel;
}

const EMPTY_RESULT: ShipReadinessResult = {
  readiness: "N",
  score: 0,
  personnel: 0,
  equipment: 0,
};

function safeCalculateReadiness(ship: Ship): ShipReadinessResult {
  try {
    return calculateReadiness(ship);
  } catch (error) {
    console.error(`Unable to calculate readiness for ${ship.shipName}`, error);
    return EMPTY_RESULT;
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0;

  return Number(
    (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1),
  );
}

export function evaluateFleetReadiness(fleet: Ship[]): FleetReadinessSummary {
  const items = fleet.map((ship) => ({
    ship,
    result: safeCalculateReadiness(ship),
  }));

  const ready = items.filter(({ result }) => result.readiness === "Y").length;
  const limited = items.filter(({ result }) => result.readiness === "Q").length;
  const notReady = items.filter(({ result }) => result.readiness === "N").length;

  const averageScore = average(items.map(({ result }) => result.score));

  return {
    items,
    ready,
    limited,
    notReady,
    total: items.length,
    average: averageScore,
    averagePersonnel: average(items.map(({ result }) => result.personnel)),
    averageEquipment: average(items.map(({ result }) => result.equipment)),
    fleetReadiness:
      averageScore >= 85 ? "Y" : averageScore >= 70 ? "Q" : "N",
  };
}
