import { fleet } from "@/data/fleet";
import { calculateMission } from "@/engine/MissionEngine";

export default function MissionOverviewCard() {

  const all = fleet.flatMap(ship =>
    calculateMission(ship)
  );

  const count = (name: string, readiness: "Y" | "Q" | "N") =>
    all.filter(
      m =>
        m.mission === name &&
        m.readiness === readiness
    ).length;

  const missions = [
    "Maritime Presence",
    "Maritime Law Enforcement",
    "Search and Rescue",
  ];

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">
        Mission Overview
      </h2>

      <div className="mt-6 space-y-6">

        {missions.map((mission) => (

          <div key={mission}>

            <p className="text-slate-300">
              {mission}
            </p>

            <div className="mt-2 flex gap-6 text-sm">

              <span className="text-emerald-400">
                Y : {count(mission,"Y")}
              </span>

              <span className="text-yellow-400">
                Q : {count(mission,"Q")}
              </span>

              <span className="text-red-400">
                N : {count(mission,"N")}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}