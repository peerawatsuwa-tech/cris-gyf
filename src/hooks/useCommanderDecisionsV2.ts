import { useMemo } from "react";
import { useFleet } from "@/context/FleetContext";
import { evaluateCommanderDecisionsV2 } from "@/engine/commanderDecisionEngineV2";

export function useCommanderDecisionsV2() {
  const { fleet } = useFleet();

  return useMemo(() => evaluateCommanderDecisionsV2(fleet), [fleet]);
}
