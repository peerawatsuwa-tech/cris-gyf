import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  Gauge,
  Ship,
  Sparkles,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFleet } from "@/context/FleetContext";
import {
  buildCommanderIntelligence,
  type MissionImpactResult,
} from "@/engine/commanderIntelligenceEngine";

const statusMeta = {
  Y: { label: "พร้อม", barClass: "bg-emerald-400" },
  Q: { label: "มีข้อจำกัด", barClass: "bg-amber-400" },
  N: { label: "ไม่พร้อม", barClass: "bg-rose-500" },
} as const;

function getDecisionLabel(index: number) {
  if (index === 0) return "เร่งด่วน";
  if (index === 1) return "ลำดับถัดไป";
  return "ติดตาม";
}

function getDecisionClass(index: number) {
  if (index === 0) return "border-rose-500/40 bg-rose-950/25 text-rose-300";
  if (index === 1) return "border-amber-500/40 bg-amber-950/20 text-amber-300";
  return "border-sky-500/30 bg-sky-950/20 text-sky-300";
}

export default function CommanderIntelligencePanel() {
  const { fleet } = useFleet();
  const intelligence = useMemo(
    () => buildCommanderIntelligence(fleet),
    [fleet],
  );

  const [expandedAction, setExpandedAction] = useState<string | null>(
    intelligence.recoveryActions[0]?.id ?? null,
  );
  const [selectedMission, setSelectedMission] =
    useState<MissionImpactResult | null>(null);

  const criticalShips = intelligence.fleetRisks.filter(
    (item) => item.riskLevel === "วิกฤต",
  ).length;

  return (
    <section className="space-y-4">
      <article className="overflow-hidden rounded-2xl border border-sky-900/60 bg-[linear-gradient(135deg,rgba(3,16,34,0.98),rgba(7,30,55,0.96),rgba(3,15,30,0.98))]">
        <header className="flex flex-col gap-4 border-b border-sky-900/50 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.22em] text-sky-400">
              <BrainCircuit className="h-4 w-4" />
              COMMAND RECOMMENDATION ENGINE
            </div>

            <h2 className="mt-2 text-2xl font-black text-white">
              ข้อเสนอเพื่อการพิจารณาสั่งการ
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              {intelligence.executiveAssessment}
            </p>
          </div>

          <div className="grid min-w-[300px] grid-cols-2 gap-3">
            <SummaryMetric
              icon={Gauge}
              label="Fleet Risk"
              value={`${intelligence.overallRiskScore}`}
              suffix={intelligence.overallRiskLevel}
              valueClass="text-amber-300"
            />
            <SummaryMetric
              icon={Ship}
              label="เรือวิกฤต"
              value={`${criticalShips}`}
              suffix="ลำ"
              valueClass="text-rose-300"
            />
          </div>
        </header>

        <div className="divide-y divide-slate-800">
          {intelligence.recoveryActions.slice(0, 3).map((action, index) => {
            const expanded = expandedAction === action.id;

            return (
              <article key={action.id}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedAction(expanded ? null : action.id)
                  }
                  className="grid w-full gap-4 px-6 py-4 text-left transition hover:bg-slate-900/50 md:grid-cols-[auto,1fr,auto,auto] md:items-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-black text-white">
                        {action.title}
                      </h3>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getDecisionClass(index)}`}>
                        {getDecisionLabel(index)}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {action.reason}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-right">
                    <p className="text-[10px] text-emerald-300">Fleet Gain</p>
                    <p className="text-xl font-black text-white">
                      +{action.fleetGain}%
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expanded && (
                  <div className="grid gap-4 border-t border-slate-800 bg-slate-950/25 px-6 py-5 lg:grid-cols-[1.3fr,1fr,0.8fr]">
                    <div>
                      <p className="text-xs font-bold text-sky-300">เหตุผล</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {action.reason}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        เรือที่เกี่ยวข้อง {action.affectedShips} ลำ
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-sky-300">
                        ผลต่อภารกิจ
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {action.missionGains.map((gain) => (
                          <button
                            key={`${action.id}-${gain.mission}`}
                            type="button"
                            onClick={() => {
                              const mission = intelligence.missions.find(
                                (item) => item.id === gain.mission,
                              );
                              if (mission) setSelectedMission(mission);
                            }}
                            className="flex items-center gap-1 rounded-lg border border-sky-800/70 bg-slate-950/50 px-2.5 py-1.5 text-xs font-bold text-sky-300 hover:border-sky-400"
                          >
                            {gain.mission}
                            <ArrowUpRight className="h-3 w-3" />
                            {gain.gain}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-right">
                      <p className="text-xs font-bold text-emerald-300">
                        ผลที่คาดว่าจะได้รับ
                      </p>
                      <p className="mt-2 text-4xl font-black text-white">
                        +{action.fleetGain}%
                      </p>
                      <p className="text-xs text-slate-500">Fleet Readiness</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <footer className="flex flex-col gap-2 border-t border-sky-900/50 bg-slate-950/25 px-6 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            ข้อมูลวิเคราะห์เชิงสาธิตเพื่อสนับสนุนการพิจารณา
          </div>
          <span className="font-semibold text-sky-400">
            แสดง 3 ลำดับสำคัญ · กดเพื่อดูรายละเอียด
          </span>
        </footer>
      </article>

      {selectedMission && (
        <article className="rounded-2xl border border-sky-700/60 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-sky-300">
                <Target className="h-4 w-4" />
                รายละเอียดผลกระทบ {selectedMission.id}
              </div>
              <h3 className="mt-2 text-xl font-black text-white">
                {selectedMission.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {selectedMission.shortTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMission(null)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              ปิดรายละเอียด
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <DetailBox
              title="เรือที่ได้รับผลกระทบ"
              items={
                selectedMission.affectedShips.length > 0
                  ? selectedMission.affectedShips
                  : ["ไม่พบเรือวิกฤต"]
              }
            />
            <DetailBox
              title="สาเหตุสำคัญ"
              items={
                selectedMission.causes.length > 0
                  ? selectedMission.causes
                  : ["รักษาระดับความพร้อมต่อเนื่อง"]
              }
            />
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles className="h-4 w-4" />
                ศักยภาพการฟื้นคืนภารกิจ
              </div>
              <p className="mt-3 text-4xl font-black text-white">
                +{selectedMission.recoveryPotential}%
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    statusMeta[selectedMission.status].barClass
                  }`}
                  style={{ width: `${selectedMission.score}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                ปัจจุบัน {selectedMission.score}% ·{" "}
                {statusMeta[selectedMission.status].label}
              </p>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  suffix,
  valueClass,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  suffix: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/55 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-sky-400" />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className={`text-2xl font-black ${valueClass}`}>{value}</span>
        <span className="pb-0.5 text-xs font-bold text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function DetailBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs font-bold text-sky-300">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-sky-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
