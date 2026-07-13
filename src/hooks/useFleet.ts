import { useEffect, useState } from "react";
import { getShips } from "@/services/shipService";

export function useFleet() {

  const [ships, setShips] = useState([]);

  useEffect(() => {

    getShips().then(setShips);

  }, []);

  return ships;

}