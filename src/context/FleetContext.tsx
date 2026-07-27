import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

import { EXCEL_DATASET_ID, fleet as baseFleet } from "@/data/excelFleet";
import type { Ship, ShipCurrentReadiness } from "@/types/ship";

interface FleetContextType {
  fleet: Ship[];
  saveState: "idle" | "saved" | "error";
  lastSavedShipId: string | null;
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

function emptyOverlay(): ReadinessOverlay {
  return {
    schemaVersion: OVERLAY_SCHEMA_VERSION,
    datasetId: EXCEL_DATASET_ID,
    byShipId: {},
  };
}

function loadOverlay(): ReadinessOverlay {
  const empty = emptyOverlay();
  const saved = localStorage.getItem(OVERLAY_STORAGE_KEY);
  if (!saved) return empty;

  try {
    const parsed = JSON.parse(saved) as ReadinessOverlay;
    if (
      parsed.schemaVersion !== OVERLAY_SCHEMA_VERSION ||
      parsed.datasetId !== EXCEL_DATASET_ID ||
      typeof parsed.byShipId !== "object" ||
      parsed.byShipId === null
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
}

export function FleetProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [overlay, setOverlay] = useState<ReadinessOverlay>(loadOverlay);
  const overlayRef = useRef(overlay);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [lastSavedShipId, setLastSavedShipId] = useState<string | null>(null);

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

    const previous = overlayRef.current;
    const next: ReadinessOverlay = {
      ...previous,
      byShipId: {
        ...previous.byShipId,
        [id]: {
          ...(previous.byShipId[id] ?? {}),
          ...patch,
        },
      },
    };

    try {
      localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(next));
      overlayRef.current = next;
      setOverlay(next);
      setLastSavedShipId(id);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <FleetContext.Provider
      value={{
        fleet,
        saveState,
        lastSavedShipId,
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
