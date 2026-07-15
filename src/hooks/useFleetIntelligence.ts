import { useMemo } from "react";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";
import { buildFleetIntelligence } from "@/engine/fleetIntelligenceEngine";

export function useFleetIntelligence() {
  const snapshot = useCommanderSnapshot();

  return useMemo(
    () => buildFleetIntelligence(snapshot, snapshot.operationalAssessments),
    [snapshot],
  );
}
