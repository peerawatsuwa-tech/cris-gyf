import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Ship,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { useFleet } from "@/context/FleetContext";
import { buildCommanderIntelligence } from "@/engine/commanderIntelligenceEngine";
import { useCommanderDecisionsV2 } from "@/hooks/useCommanderDecisionsV2";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

function getThaiDateTime() {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date());
}

export default function CommanderMorningBrief() {
  const { fleet } = useFleet();
  const snapshot = useCommanderSnapshot();
  const decisions = useCommanderDecisionsV2();

  const intelligence = useMemo(
    () => buildCommanderIntelligence(fleet),
    [fleet],
  );

  const topAction = decisions.topAction;
  const criticalShips = intelligence.fleetRisks
    .filter((item) => item.riskLevel === "วิกฤต")
    .slice(0, 4);

  const lowestMission = [...intelligence.missions].sort(
    (a, b) => a.score - b.score,
  )[0];

  const expectedReadiness = Math.min(
    100,
    Math.round(snapshot.average + (topAction?.estimatedFleetGain ?? 0)),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-900/60 bg-[linear-gradient(135deg,rgba(3,16,34,0.98),rgba(7,31,56,0.96),rgba(3,15,30,0.98))] shadow-2xl shadow-slate-950/40">
      <header className="flex flex-col gap-4 border-b border-sky-900/50 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.25em] text-sky-400">
            <BrainCircuit className="h-4 w-4" />
            COMMANDER MORNING BRIEF
          </div>

          <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
            ภาพรวมเพื่อการตัดสินใจภายใน 20 วินาที
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
            {intelligence.executiveAssessment}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
          <Clock3 className="h-4 w-4 text-sky-400" />
          อัปเดต {getThaiDateTime()}
        </div>
      </header>

      <div className="grid gap-px bg-sky-950/50 lg:grid-cols-[1.05fr,1.45fr,1fr,1fr,1fr]">
        <BriefMetric
          icon={ShieldCheck}
          label="Fleet Readiness"
          value={`${snapshot.average.toFixed(0)}%`}
          note={snapshot.notReady === 0 ? "พร้อมปฏิบัติ" : "พร้อมโดยมีความเสี่ยง"}
          valueClass="text-sky-300"
        />

        <div className="bg-slate-950/45 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">
              Today's Top Priority
            </p>
            <Wrench className="h-4 w-4 text-emerald-400" />
          </div>

          <p className="mt-3 line-clamp-1 text-lg font-black text-white">
            {topAction?.title ?? "รักษาระดับความพร้อม"}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-300">
            <span>Fleet +{topAction?.estimatedFleetGain ?? 0}%</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>{topAction?.affectedShips ?? 0} ลำ</span>
          </div>
        </div>

        <div className="bg-slate-950/45 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">Critical Ships</p>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-black text-rose-300">
              {snapshot.notReady}
            </span>
            <span className="pb-1 text-sm text-slate-500">ลำ</span>
          </div>

          <p className="mt-2 truncate text-xs text-slate-400">
            {criticalShips.length > 0
              ? criticalShips.map((item) => item.hullNumber).join(" · ")
              : "ไม่พบเรือวิกฤต"}
          </p>
        </div>

        <div className="bg-slate-950/45 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500">Mission At Risk</p>
            <Ship className="h-4 w-4 text-amber-400" />
          </div>

          <p className="mt-3 text-lg font-black text-white">
            {lowestMission?.id ?? "—"}{" "}
            <span className="text-amber-300">
              {lowestMission?.score ?? 0}%
            </span>
          </p>

          <p className="mt-2 truncate text-xs text-slate-400">
            {lowestMission?.title ?? "ไม่พบข้อมูลภารกิจ"}
          </p>
        </div>

        <div className="bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-emerald-300">
              Expected After Action
            </p>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-black text-slate-400">
              {snapshot.average.toFixed(0)}%
            </span>
            <ArrowRight className="h-4 w-4 text-emerald-400" />
            <span className="text-3xl font-black text-emerald-300">
              {expectedReadiness}%
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            หากดำเนินการตามลำดับแรก
          </p>
        </div>
      </div>

      <CommanderActionBar />
    </section>
  );
}

function CommanderActionBar() {
  const actions = [
    "อนุมัติการซ่อม",
    "จัดสรรกำลังพล",
    "ขอรับการสนับสนุน",
    "ปรับการวางกำลัง",
    "ออกข้อสั่งการ",
  ];

  return (
    <div className="flex flex-col gap-3 border-t border-sky-900/50 bg-slate-950/30 px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-xs font-black tracking-[0.18em] text-sky-400">
          COMMANDER ACTION
        </p>
        <p className="mt-1 text-xs text-slate-500">
          ปุ่มสาธิตสำหรับเตรียมเชื่อมต่อขั้นตอนการสั่งการในอนาคต
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={action}
            type="button"
            title="โหมดสาธิต — ยังไม่บันทึกคำสั่ง"
            className={`rounded-lg border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${
              index === 0
                ? "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-600"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

function BriefMetric({
  icon: Icon,
  label,
  value,
  note,
  valueClass,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  note: string;
  valueClass: string;
}) {
  return (
    <div className="bg-slate-950/45 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-sky-500" />
      </div>

      <p className={`mt-3 text-3xl font-black ${valueClass}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}
