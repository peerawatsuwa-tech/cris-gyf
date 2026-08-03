import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase, supabaseConfigurationError } from "@/services/supabase";
import type { Ship, ShipCurrentReadiness } from "@/types/ship";

type ShipRow = {
  id: string;
  payload: Ship;
};

type OverlayRow = {
  ship_id: string;
  crew: number | null;
  propulsion: ShipCurrentReadiness["propulsion"];
  radar: ShipCurrentReadiness["radar"];
  communication: ShipCurrentReadiness["communication"];
  navigation: ShipCurrentReadiness["navigation"];
  weapon: ShipCurrentReadiness["weapon"];
  rhib: ShipCurrentReadiness["rhib"];
  eoir: ShipCurrentReadiness["eoir"];
  major_deficiencies: string;
  mission_limitations: string;
  updated_at: string | null;
};

export type CloudOverlay = Record<string, ShipCurrentReadiness>;

function assertConfigured() {
  if (supabaseConfigurationError) throw new Error(supabaseConfigurationError);
}

function readinessFromRow(row: OverlayRow): ShipCurrentReadiness {
  return {
    crew: row.crew,
    propulsion: row.propulsion,
    radar: row.radar,
    communication: row.communication,
    navigation: row.navigation,
    weapon: row.weapon,
    rhib: row.rhib,
    eoir: row.eoir,
    majorDeficiencies: row.major_deficiencies,
    missionLimitations: row.mission_limitations,
    updatedAt: row.updated_at,
  };
}

function toDatabasePatch(patch: Partial<ShipCurrentReadiness>) {
  return Object.fromEntries(
    Object.entries({
      crew: patch.crew,
      propulsion: patch.propulsion,
      radar: patch.radar,
      communication: patch.communication,
      navigation: patch.navigation,
      weapon: patch.weapon,
      rhib: patch.rhib,
      eoir: patch.eoir,
      major_deficiencies: patch.majorDeficiencies,
      mission_limitations: patch.missionLimitations,
      updated_at: patch.updatedAt,
    }).filter((entry) => entry[1] !== undefined),
  );
}

export async function loadFleetData(): Promise<{
  ships: Ship[];
  overlay: CloudOverlay;
}> {
  assertConfigured();

  const [shipsResult, overlayResult] = await Promise.all([
    supabase.from("ships").select("id,payload").order("id"),
    supabase.from("ship_overlay").select("*"),
  ]);

  if (shipsResult.error) throw shipsResult.error;
  if (overlayResult.error) throw overlayResult.error;

  const ships = (shipsResult.data as ShipRow[]).map((row) => row.payload);
  const overlay = Object.fromEntries(
    (overlayResult.data as OverlayRow[]).map((row) => [
      row.ship_id,
      readinessFromRow(row),
    ]),
  );

  return { ships, overlay };
}

export async function patchShipOverlay(
  shipId: string,
  patch: Partial<ShipCurrentReadiness>,
): Promise<void> {
  assertConfigured();
  const { error } = await supabase.rpc("patch_ship_overlay", {
    p_ship_id: shipId,
    p_patch: toDatabasePatch(patch),
  });

  if (error) throw error;
}

export function subscribeToFleetChanges(onChange: () => void): RealtimeChannel {
  return supabase
    .channel("cris-fleet-overlay")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "ship_overlay" },
      onChange,
    )
    .subscribe();
}
