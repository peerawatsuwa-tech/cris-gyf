import { useMemo } from "react";
import { buildCommanderDecisions } from "@/engine/commanderDecisionEngine";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

export function useCommanderDecision() {
  const intelligence = useFleetIntelligence();
  const { total } = useCommanderSnapshot();

  return useMemo(
    () => buildCommanderDecisions(intelligence, total),
    [intelligence, total],
  );
}
