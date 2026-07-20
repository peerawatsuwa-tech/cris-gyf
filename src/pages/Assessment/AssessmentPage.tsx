import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Search, Target } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { MissionReadinessDetailModal } from "@/components/mission/MissionReadinessDetailModal";
import { useFleet } from "@/context/FleetContext";
import {
  buildCommanderIntelligence,
  type MissionImpactResult,
} from "@/engine/commanderIntelligenceEngine";
import type { ReadinessLevel } from "@/types/ship";

type MissionFilter = "ALL" | ReadinessLevel;

const statusText: Record<ReadinessLevel, string> = {
  Y: "พร้อม",
  Q: "มีข้อจำกัด",
  N: "ไม่พร้อม",
};

const statusClasses: Record<ReadinessLevel, string> = {
  Y: "border-emerald-500/30 text-emerald-400",
  Q: "border-amber-500/30 text-amber-400",
  N: "border-rose-500/30 text-rose-400",
};

export default function AssessmentPage() {
  const { fleet } = useFleet();
  const [filter, setFilter] = useState<MissionFilter>("ALL");
  const [selectedMission, setSelectedMission] =
    useState<MissionImpactResult | null>(null);

  const intelligence = useMemo(
    () => buildCommanderIntelligence(fleet),
    [fleet],
  );

  const counts = useMemo(
    () => ({
      Y: intelligence.missions.filter((mission) => mission.status === "Y").length,
      Q: intelligence.missions.filter((mission) => mission.status === "Q").length,
      N: intelligence.missions.filter((mission) => mission.status === "N").length,
    }),
    [intelligence.missions],
  );

  const averageScore = Math.round(
    intelligence.missions.reduce((sum, mission) => sum + mission.score, 0) /
      Math.max(1, intelligence.missions.length),
  );

  const visibleMissions = intelligence.missions.filter(
    (mission) => filter === "ALL" || mission.status === filter,
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">
            Mission Readiness Module · Prototype
          </p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                ภาพรวมความพร้อมตามภารกิจ M1–M8
              </h1>
              <p className="mt-2 text-slate-400">
                เลือกภารกิจเพื่อดูผลกระทบ ข้อจำกัด เรือสนับสนุน และหลักฐานประกอบ
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/30 px-4 py-3 text-sm text-sky-300">
              <Target className="h-5 w-5" />
              ใช้ผลวิเคราะห์จาก Decision Engine ปัจจุบัน
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="ภารกิจทั้งหมด" value="8" tone="text-sky-400" />
          <SummaryCard label="พร้อม (Y)" value={counts.Y} tone="text-emerald-400" />
          <SummaryCard label="มีข้อจำกัด (Q)" value={counts.Q} tone="text-amber-400" />
          <SummaryCard label="ไม่พร้อม (N)" value={counts.N} tone="text-rose-400" />
          <SummaryCard label="คะแนนเฉลี่ย" value={`${averageScore}%`} tone="text-cyan-400" />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">สถานะภารกิจ</h2>
              <p className="mt-1 text-sm text-slate-400">
                กดการ์ดเพื่อเปิด Mission Decision Detail
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "Y", "Q", "N"] as MissionFilter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "border-sky-500 bg-sky-500/15 text-sky-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {item === "ALL" ? "ทุกสถานะ" : `${item} ${statusText[item]}`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visibleMissions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={() => setSelectedMission(mission)}
                className={`group rounded-xl border bg-slate-900/70 p-5 text-left transition hover:-translate-y-0.5 hover:bg-slate-900 ${statusClasses[mission.status]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-sky-400">{mission.id}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-12 font-bold text-white">
                      {mission.title}
                    </h3>
                  </div>
                  <span className="rounded-lg border border-current/30 px-2 py-1 text-sm font-bold">
                    {mission.status}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <p className="text-3xl font-bold">{mission.score}%</p>
                  <p className="text-xs text-slate-500">{mission.shortTitle}</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-current"
                    style={{ width: `${mission.score}%` }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  {mission.affectedShips.length > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {mission.affectedShips.length > 0
                    ? `ตรวจสอบ ${mission.affectedShips.length} ลำ`
                    : "ไม่พบข้อจำกัดสำคัญ"}
                </div>
              </button>
            ))}
          </div>

          {visibleMissions.length === 0 && (
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-12 text-slate-400">
              <Search className="h-5 w-5" /> ไม่มีภารกิจในสถานะนี้
            </div>
          )}
        </section>
      </div>

      <MissionReadinessDetailModal
        mission={selectedMission}
        fleet={fleet}
        recoveryActions={intelligence.recoveryActions}
        onClose={() => setSelectedMission(null)}
      />
    </MainLayout>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
