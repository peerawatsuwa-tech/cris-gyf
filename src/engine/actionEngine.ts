import type { Ship } from "@/types/ship";

export interface Action {

  ship: string;

  title: string;

  priority: "HIGH" | "MEDIUM";

}

export function calculateActions(ship: Ship): Action[] {

  const actions: Action[] = [];

  if (ship.equipment.radar !== "Operational") {

    actions.push({

      ship: ship.hullNumber,

      title: "Repair Radar",

      priority: "HIGH",

    });

  }

  if (ship.equipment.weapon !== "Operational") {

    actions.push({

      ship: ship.hullNumber,

      title: "Repair Weapon",

      priority: "HIGH",

    });

  }

  if (ship.equipment.rhib !== "Operational") {

    actions.push({

      ship: ship.hullNumber,

      title: "Repair RHIB",

      priority: "MEDIUM",

    });

  }

  if (ship.crew / ship.authorizedCrew < 0.9) {

    actions.push({

      ship: ship.hullNumber,

      title: "Increase Personnel",

      priority: "HIGH",

    });

  }

  return actions;

}