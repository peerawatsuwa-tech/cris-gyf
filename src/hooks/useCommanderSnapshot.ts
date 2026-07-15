import { useMemo } from "react";
import { useFleet } from "@/context/FleetContext";
import { evaluateFleetReadiness } from "@/engine/fleetReadinessEngine";
import { evaluateFleetMissions } from "@/engine/fleetMissionAssessmentEngine";
import { assessOperationalReadiness } from "@/engine/operationalReadinessAssessmentEngine";

export function useCommanderSnapshot() {
  const { fleet } = useFleet();

  return useMemo(
    () => ({
      ...evaluateFleetReadiness(fleet),
      missionAssessment: evaluateFleetMissions(fleet),
      operationalAssessments: fleet.flatMap((ship) =>
        assessOperationalReadiness(ship).map((assessment) => ({ ship, assessment })),
      ),
    }),
    [fleet],
  );
}
