import type { Ship } from "@/types/ship";
import { calculateMission } from "@/engine/MissionEngine";

interface Props {
  ship: Ship;
}

export default function MissionCard({ ship }: Props) {

  const missions = calculateMission(ship);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        Mission Capability
      </h3>

      <div className="mt-5 space-y-4">

        {missions.map((mission) => (

          <div
            key={mission.mission}
            className="border-b border-slate-800 pb-3"
          >

            <div className="flex items-center justify-between">

              <span className="text-slate-300">
                {mission.mission}
              </span>

              <span
                className={
                  mission.readiness === "Y"
                    ? "text-emerald-400 font-semibold"
                    : mission.readiness === "Q"
                    ? "text-yellow-400 font-semibold"
                    : "text-red-400 font-semibold"
                }
              >
                {mission.readiness}
              </span>

            </div>

            <div className="mt-1 text-sm text-sky-400">
              Score : {mission.score}%
            </div>

            {mission.reasons.length > 0 && (

              <div className="mt-2 space-y-1">

                {mission.reasons.map((reason) => (

                  <div
                    key={reason}
                    className="text-xs text-slate-500"
                  >
                    • {reason}
                  </div>

                ))}

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}