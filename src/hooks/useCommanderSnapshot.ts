import { useMemo } from "react";
import { useFleet } from "@/context/FleetContext";
import { evaluateFleetReadiness } from "@/engine/fleetReadinessEngine";

export function useCommanderSnapshot() {
  const { fleet } = useFleet();

  return useMemo(() => evaluateFleetReadiness(fleet), [fleet]);
}
