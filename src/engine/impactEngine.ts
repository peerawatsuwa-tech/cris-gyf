import type { Ship } from "@/types/ship";
import { calculateMission } from "@/engine/MissionEngine";

export interface Impact {

  title: string;

  priority: "HIGH" | "MEDIUM";

  effect: string;

}

export function calculateImpact(ship: Ship): Impact[] {

  const impacts: Impact[] = [];

  const missions = calculateMission(ship);

  missions.forEach((m) => {

    if (m.readiness === "N") {

      impacts.push({

        title: m.mission,

        priority: "HIGH",

        effect: "Mission cannot be executed"

      });

    }

    else if (m.readiness === "Q") {

      impacts.push({

        title: m.mission,

        priority: "MEDIUM",

        effect: "Mission capability degraded"

      });

    }

  });

  return impacts;

}