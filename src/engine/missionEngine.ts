import type { Ship } from "@/types/ship";

export interface MissionResult {
  mission: string;
  readiness: "Y" | "Q" | "N";
  score: number;
  reasons: string[];
}

export function calculateMission(ship: Ship): MissionResult[] {

  const results: MissionResult[] = [];

  // ------------------------
  // Maritime Presence
  // ------------------------

  {
    let score = 100;
    const reasons: string[] = [];

    if (ship.crew / ship.authorizedCrew < 0.9) {
      score -= 20;
      reasons.push("Personnel below 90%");
    }

    if (ship.equipment.radar !== "Operational") {
      score -= 40;
      reasons.push("Radar unavailable");
    }

    if (ship.equipment.communication !== "Operational") {
      score -= 40;
      reasons.push("Communication unavailable");
    }

    results.push({
      mission: "Maritime Presence",
      readiness:
        score >= 90
          ? "Y"
          : score >= 70
          ? "Q"
          : "N",
      score,
      reasons,
    });
  }

  // ------------------------
  // Maritime Law Enforcement
  // ------------------------

  {
    let score = 100;
    const reasons: string[] = [];

    if (ship.crew / ship.authorizedCrew < 0.9) {
      score -= 20;
      reasons.push("Personnel below 90%");
    }

    if (ship.equipment.weapon !== "Operational") {
      score -= 30;
      reasons.push("Weapon unavailable");
    }

    if (ship.equipment.rhib !== "Operational") {
      score -= 30;
      reasons.push("RHIB unavailable");
    }

    if (ship.equipment.communication !== "Operational") {
      score -= 20;
      reasons.push("Communication unavailable");
    }

    results.push({
      mission: "Maritime Law Enforcement",
      readiness:
        score >= 90
          ? "Y"
          : score >= 70
          ? "Q"
          : "N",
      score,
      reasons,
    });
  }

  // ------------------------
  // Search and Rescue
  // ------------------------

  {
    let score = 100;
    const reasons: string[] = [];

    if (ship.crew / ship.authorizedCrew < 0.8) {
      score -= 20;
      reasons.push("Personnel below 80%");
    }

    if (ship.equipment.navigation !== "Operational") {
      score -= 30;
      reasons.push("Navigation unavailable");
    }

    if (ship.equipment.communication !== "Operational") {
      score -= 20;
      reasons.push("Communication unavailable");
    }

    if (ship.equipment.rhib !== "Operational") {
      score -= 30;
      reasons.push("RHIB unavailable");
    }

    results.push({
      mission: "Search and Rescue",
      readiness:
        score >= 90
          ? "Y"
          : score >= 70
          ? "Q"
          : "N",
      score,
      reasons,
    });
  }

  return results;
}