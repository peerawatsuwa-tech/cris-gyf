import type { Ship } from "@/types/ship";
import { calculateMission } from "@/engine/MissionEngine";

interface Props {
  ship: Ship;
}

export default function MissionCard({ ship }: Props) {
  const missions = calculateMission(ship);

  const getColor = (readiness: "Y" | "Q" | "N") => {
    switch (readiness) {
      case "Y":
        return {
          badge: "bg-emerald-500/20 text-emerald-400",
          bar: "bg-emerald-500",
          text: "พร้อมปฏิบัติ",
        };

      case "Q":
        return {
          badge: "bg-yellow-500/20 text-yellow-400",
          bar: "bg-yellow-500",
          text: "พร้อมบางส่วน",
        };

      default:
        return {
          badge: "bg-red-500/20 text-red-400",
          bar: "bg-red-500",
          text: "ไม่พร้อม",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        ผลการประเมินภารกิจ
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Mission Capability Assessment
      </p>

      <div className="mt-6 space-y-5">

        {missions.map((mission) => {

          const style = getColor(mission.readiness);

          return (

            <div
              key={mission.mission}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold text-white">
                    {mission.mission}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    คะแนน {mission.score}%
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                >
                  {style.text}
                </span>

              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-700">

                <div
                  className={`h-2 rounded-full ${style.bar}`}
                  style={{
                    width: `${mission.score}%`,
                  }}
                />

              </div>

              {mission.reasons.length > 0 && (

                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    สาเหตุที่ส่งผลต่อภารกิจ
                  </p>

                  <ul className="space-y-1">

                    {mission.reasons.map((reason) => (

                      <li
                        key={reason}
                        className="text-sm text-slate-300"
                      >
                        • {reason}
                      </li>

                    ))}

                  </ul>

                </div>

              )}

            </div>

          );

        })}

      </div>

    </div>
  );
}