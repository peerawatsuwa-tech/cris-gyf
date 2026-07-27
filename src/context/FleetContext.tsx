import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { EXCEL_DATASET_ID, fleet as baseFleet } from "@/data/excelFleet";
import type { Ship, ShipCurrentReadiness } from "@/types/ship";

interface FleetContextType {
  fleet: Ship[];
  patchCurrentReadiness: (
    id: string,
    patch: Partial<ShipCurrentReadiness>,
  ) => void;
}

const OVERLAY_STORAGE_KEY = "cris-v027-readiness-overlay-v1";
const OVERLAY_SCHEMA_VERSION = 1;

type ReadinessOverlay = {
  schemaVersion: number;
  datasetId: string;
  byShipId: Record<string, Partial<ShipCurrentReadiness>>;
};

const FleetContext =
  createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [overlay, setOverlay] = useState<ReadinessOverlay>(() => {
    const empty: ReadinessOverlay = {
      schemaVersion: OVERLAY_SCHEMA_VERSION,
      datasetId: EXCEL_DATASET_ID,
      byShipId: {},
    };
    const saved = localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (!saved) return empty;
    try {
      const parsed = JSON.parse(saved) as ReadinessOverlay;
      if (
        parsed.schemaVersion !== OVERLAY_SCHEMA_VERSION ||
        parsed.datasetId !== EXCEL_DATASET_ID ||
        typeof parsed.byShipId !== "object"
      ) {
        return empty;
      }
      return {
        ...empty,
        byShipId: Object.fromEntries(
          Object.entries(parsed.byShipId).filter(([id]) =>
            baseFleet.some((ship) => ship.id === id),
          ),
        ),
      };
    } catch {
      return empty;
    }
  });

  useEffect(() => {
    localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(overlay));
  }, [overlay]);

  const fleet = baseFleet.map((ship) => ({
    ...ship,
    currentReadiness: {
      ...ship.currentReadiness,
      ...(overlay.byShipId[ship.id] ?? {}),
    },
  }));

  function patchCurrentReadiness(
    id: string,
    patch: Partial<ShipCurrentReadiness>,
  ) {
    if (!baseFleet.some((ship) => ship.id === id)) return;
    setOverlay((previous) => ({
      ...previous,
      byShipId: {
        ...previous.byShipId,
        [id]: {
          ...(previous.byShipId[id] ?? {}),
          ...patch,
        },
      },
    }));
  }

  return (
    <FleetContext.Provider
      value={{
        fleet,
        patchCurrentReadiness,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {

  const context =
    useContext(FleetContext);

  if (!context) {
    throw new Error(
      "useFleet must be used inside FleetProvider"
    );
  }

  return context;
}
