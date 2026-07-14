import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

const missionTitles: Record<string, string> = {
  "Maritime Presence": "การแสดงกำลังทางทะเล",
  "Maritime Law Enforcement": "การบังคับใช้กฎหมายทางทะเล",
  "Search and Rescue": "ค้นหาและช่วยเหลือ",
};

const statusStyles = {
  Y: "text-emerald-400",
  Q: "text-yellow-400",
  N: "text-red-400",
} as const;

export default function MissionOverviewCard() {
  const { missionAssessment } = useCommanderSnapshot();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <h2 className="text-xl font-bold text-white">ภาพรวมภารกิจ</h2>
      <p className="text-sm text-slate-400">Mission Capability</p>

      <div className="mt-6 space-y-6">
        {missionAssessment.missions.map((mission) => (
          <div key={mission.mission}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">
                  {missionTitles[mission.mission] ?? mission.mission}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  คะแนนเฉลี่ย {mission.averageScore.toFixed(1)}%
                </p>
              </div>

              <span
                className={`text-lg font-bold ${statusStyles[mission.readiness]}`}
              >
                {mission.readiness}
              </span>
            </div>

            <div className="mt-3 flex gap-6">
              <span className="font-semibold text-emerald-400">
                🟢 {mission.ready}
              </span>
              <span className="font-semibold text-yellow-400">
                🟡 {mission.limited}
              </span>
              <span className="font-semibold text-red-400">
                🔴 {mission.notReady}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
