import type { Ship } from "@/types/ship";

export interface Alert {
  ship: string;
  message: string;
  level: "HIGH" | "MEDIUM";
}

export function calculateAlerts(ship: Ship): Alert[] {

  const alerts: Alert[] = [];

  if (ship.crew / ship.authorizedCrew < 0.9) {

    alerts.push({
      ship: ship.hullNumber,
      message: "Crew below 90%",
      level: "HIGH",
    });

  }

  if (ship.equipment.radar !== "Operational") {

    alerts.push({
      ship: ship.hullNumber,
      message: "Radar unavailable",
      level: "HIGH",
    });

  }

  if (ship.equipment.weapon !== "Operational") {

    alerts.push({
      ship: ship.hullNumber,
      message: "Weapon unavailable",
      level: "HIGH",
    });

  }

  if (ship.equipment.rhib !== "Operational") {

    alerts.push({
      ship: ship.hullNumber,
      message: "RHIB unavailable",
      level: "MEDIUM",
    });

  }

  return alerts;

}