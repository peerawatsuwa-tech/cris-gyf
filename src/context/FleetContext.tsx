import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { fleet as initialFleet } from "@/data/fleet";
import type { Ship } from "@/types/ship";

interface FleetContextType {
  fleet: Ship[];
  updateShip: (ship: Ship) => void;
}

const FleetContext =
  createContext<FleetContextType | undefined>(undefined);

export function FleetProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [fleet, setFleet] =
    useState<Ship[]>(initialFleet);

  function updateShip(updatedShip: Ship) {

    setFleet((prev) =>
      prev.map((ship) =>
        ship.id === updatedShip.id
          ? updatedShip
          : ship
      )
    );

  }

  return (
    <FleetContext.Provider
      value={{
        fleet,
        updateShip,
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