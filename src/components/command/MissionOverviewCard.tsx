import { fleet } from "@/data/fleet";
import { calculateMission } from "@/engine/MissionEngine";

export default function MissionOverviewCard() {

  const all = fleet.flatMap((ship) => calculateMission(ship));

  const count = (
    mission: string,
    readiness: "Y" | "Q" | "N"
  ) =>
    all.filter(
      (m) =>
        m.mission === mission &&
        m.readiness === readiness
    ).length;

  const missions = [
    {
      title: "การแสดงกำลังทางทะเล",
      key: "Maritime Presence",
    },
    {
      title: "การบังคับใช้กฎหมายทางทะเล",
      key: "Maritime Law Enforcement",
    },
    {
      title: "ค้นหาและช่วยเหลือ",
      key: "Search and Rescue",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">
        ภาพรวมภารกิจ
      </h2>

      <p className="text-sm text-slate-400">
        Mission Capability
      </p>

      <div className="mt-6 space-y-6">

        {missions.map((m) => (

          <div key={m.key}>

            <p className="font-semibold text-white">
              {m.title}
            </p>

            <div className="mt-3 flex gap-6">

              <span className="font-semibold text-emerald-400">
                🟢 {count(m.key, "Y")}
              </span>

              <span className="font-semibold text-yellow-400">
                🟡 {count(m.key, "Q")}
              </span>

              <span className="font-semibold text-red-400">
                🔴 {count(m.key, "N")}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}