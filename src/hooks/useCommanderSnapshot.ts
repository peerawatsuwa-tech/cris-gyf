import { useFleet } from "@/context/FleetContext";
import { calculateReadiness } from "@/engine/calculateReadiness";

export function useCommanderSnapshot() {
  const { fleet } = useFleet();

  const results = fleet.map((ship) => {
    try {
      return calculateReadiness(ship);
    } catch (error) {
      console.error(`Unable to calculate readiness for ${ship.shipName}`, error);
      return {
        readiness: "N" as const,
        score: 0,
        personnel: 0,
        equipment: 0,
      };
    }
  });

  const ready = results.filter((result) => result.readiness === "Y").length;
  const limited = results.filter((result) => result.readiness === "Q").length;
  const notReady = results.filter((result) => result.readiness === "N").length;
  const total = results.length;
  const average = total > 0
    ? results.reduce((sum, result) => sum + result.score, 0) / total
    : 0;

  return {
    ready,
    limited,
    notReady,
    total,
    average,
  };
}
