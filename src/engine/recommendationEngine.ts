import type { Ship } from "@/types/ship";

export interface Recommendation {

  priority: "HIGH" | "MEDIUM" | "LOW";

  title: string;

  impact: string;

}

export function calculateRecommendation(ship: Ship): Recommendation[] {

  const list: Recommendation[] = [];

  // กำลังพล

  if (ship.crew < ship.authorizedCrew) {

    list.push({

      priority: "HIGH",

      title: "Increase Personnel",

      impact: "Improve overall readiness score"

    });

  }

  // RHIB

  if (ship.equipment.rhib !== "Operational") {

    list.push({

      priority: "HIGH",

      title: "Repair RHIB",

      impact: "Restore Maritime Law Enforcement capability"

    });

  }

  // EOIR

  if (ship.equipment.eoir !== "Operational") {

    list.push({

      priority: "MEDIUM",

      title: "Repair EO/IR System",

      impact: "Improve surveillance capability"

    });

  }

  // Communication

  if (ship.equipment.communication !== "Operational") {

    list.push({

      priority: "HIGH",

      title: "Repair Communication System",

      impact: "Critical for all missions"

    });

  }

  // ถ้าไม่มีปัญหาเลย

  if (list.length === 0) {

    list.push({

      priority: "LOW",

      title: "Ship Ready",

      impact: "Maintain current readiness"

    });

  }

  return list;

}