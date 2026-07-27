import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Target } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { useFleet } from "@/context/FleetContext";
import {
  statusLabel,
  summarizeFleet,
  type ReadinessStatus,
} from "@/lib/readinessV027";

const statusClasses: Record<ReadinessStatus, string> = {
  Y: "border-emerald-500/30 text-emerald-400",
  Q: "border-amber-500/30 text-amber-400",
  N: "border-rose-500/30 text-rose-400",
  U: "border-sky-700/50 bg-sky-950/25 text-sky-200",
};

export default function AssessmentPage() {
  const { fleet } = useFleet();
  const summary = useMemo(() => summarizeFleet(fleet), [fleet]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">
            Mission Readiness Module · Safe Integration
          </p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                ภาพรวมความพร้อมตามภารกิจหลัก
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/30 px-4 py-3 text-sm text-sky-300">
              <Target className="h-5 w-5" />
              Approved Y / Q / N Calculation Gate
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard label="ภารกิจทั้งหมด" value={summary.missions.length} tone="text-sky-400" />
          <SummaryCard label="เรือพร้อม (Y)" value={summary.counts.Y} tone="text-emerald-400" />
          <SummaryCard label="เรือมีข้อจำกัด (Q)" value={summary.counts.Q} tone="text-amber-400" />
          <SummaryCard label="เรือไม่พร้อม (N)" value={summary.counts.N} tone="text-rose-400" />
          <SummaryCard label="รอการประเมิน" value={summary.counts.U} tone="text-sky-200" />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <div>
            <h2 className="text-xl font-bold text-white">สถานะภารกิจ</h2>
            <p className="mt-1 text-sm text-slate-400">
              ผลรวมจากข้อมูลปัจจุบันหลัง Merge Local Storage Overlay
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {summary.missions.map((mission) => (
              <article
                key={mission.id}
                className={`rounded-xl border bg-slate-900/70 p-5 ${statusClasses[mission.status]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-sky-400">{mission.id}</p>
                    <h3 className="mt-1 min-h-12 font-bold text-white">{mission.name}</h3>
                  </div>
                  <span className="rounded-lg border border-current/30 px-2 py-1 text-sm font-bold">
                    {mission.status === "U" ? "—" : mission.status}
                  </span>
                </div>

                <p className="mt-4 text-lg font-bold">{statusLabel(mission.status)}</p>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  <Count label="Y" value={mission.distribution.Y} />
                  <Count label="Q" value={mission.distribution.Q} />
                  <Count label="N" value={mission.distribution.N} />
                  <Count label="รอประเมิน" value={mission.distribution.U} />
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  {mission.distribution.U > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {mission.distribution.U > 0
                    ? `${mission.distribution.U} ลำรอการประเมิน`
                    : "ประเมินแล้วทุกลำ"}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 px-2 py-2">
      <p className="font-bold text-white">{value}</p>
      <p className="mt-1 text-slate-500">{label}</p>
    </div>
  );
}
