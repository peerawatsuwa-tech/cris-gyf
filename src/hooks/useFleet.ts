import { useEffect, useState } from "react";
import { getShips } from "@/services/shipService";

export function useFleet() {
  const [ships, setShips] = useState<any[]>([]);

  useEffect(() => {
    getShips().then((data) => {
      setShips(data ?? []);
    });
  }, []);

  return ships;
}