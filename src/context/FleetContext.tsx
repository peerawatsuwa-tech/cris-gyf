import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  loadFleetData,
  patchShipOverlay,
  subscribeToFleetChanges,
  type CloudOverlay,
} from "@/services/fleetService";
import { supabase } from "@/services/supabase";
import type { Ship, ShipCurrentReadiness } from "@/types/ship";

interface FleetContextType {
  fleet: Ship[];
  loading: boolean;
  error: string | null;
  saveState: "idle" | "saved" | "error";
  lastSavedShipId: string | null;
  patchCurrentReadiness: (
    id: string,
    patch: Partial<ShipCurrentReadiness>,
  ) => Promise<void>;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, profile } = useAuth();
  const [ships, setShips] = useState<Ship[]>([]);
  const [overlay, setOverlay] = useState<CloudOverlay>({});
  const overlayRef = useRef(overlay);
  const saveQueue = useRef<Record<string, Promise<void>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [lastSavedShipId, setLastSavedShipId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await loadFleetData();
      setShips(data.ships);
      setOverlay(data.overlay);
      overlayRef.current = data.overlay;
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "โหลดข้อมูลกองเรือไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShips([]);
      setOverlay({});
      overlayRef.current = {};
      return;
    }

    setLoading(true);
    void refresh();

    const channel = subscribeToFleetChanges(() => {
      void refresh();
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAuthenticated, refresh]);

  const fleet = useMemo(
    () => ships.map((ship) => ({
      ...ship,
      currentReadiness: {
        ...ship.currentReadiness,
        ...(overlay[ship.id] ?? {}),
      },
    })),
    [overlay, ships],
  );

  async function patchCurrentReadiness(
    id: string,
    patch: Partial<ShipCurrentReadiness>,
  ) {
    const mayEdit =
      profile?.role === "admin" ||
      (profile?.role === "ship" && profile.shipId === id);
    if (!mayEdit || !ships.some((ship) => ship.id === id)) return;

    const current = overlayRef.current[id] ??
      ships.find((ship) => ship.id === id)?.currentReadiness;
    if (!current) return;

    const nextOverlay = {
      ...overlayRef.current,
      [id]: { ...current, ...patch },
    };
    overlayRef.current = nextOverlay;
    setOverlay(nextOverlay);
    setLastSavedShipId(id);
    setSaveState("idle");

    const previousSave = saveQueue.current[id] ?? Promise.resolve();
    const nextSave = previousSave.then(() => patchShipOverlay(id, patch));
    saveQueue.current[id] = nextSave;

    try {
      await nextSave;
      setSaveState("saved");
    } catch {
      setSaveState("error");
      await refresh();
    } finally {
      if (saveQueue.current[id] === nextSave) delete saveQueue.current[id];
    }
  }

  return (
    <FleetContext.Provider
      value={{
        fleet,
        loading,
        error,
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
  const context = useContext(FleetContext);
  if (!context) throw new Error("useFleet must be used inside FleetProvider");
  return context;
}
