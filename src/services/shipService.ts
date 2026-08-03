import { loadFleetData } from "@/services/fleetService";

export { patchShipOverlay, subscribeToFleetChanges } from "@/services/fleetService";

export async function getShips() {
  return (await loadFleetData()).ships;
}
