import { useMemo } from "react";
import { useFleet } from "@/context/FleetContext";
import { evaluateFleetReadiness } from "@/engine/fleetReadinessEngine";
import { evaluateFleetMissions } from "@/engine/fleetMissionAssessmentEngine";

export function useCommanderSnapshot() {
  const { fleet } = useFleet();

  return useMemo(
    () => ({
      ...evaluateFleetReadiness(fleet),
      missionAssessment: evaluateFleetMissions(fleet),
    }),
    [fleet],
  );
}
