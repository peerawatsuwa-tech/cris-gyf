import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  Gauge,
  ShieldAlert,
  Ship,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCommanderDecisionsV2 } from "@/hooks/useCommanderDecisionsV2";
import type {
  DecisionPriority,
  RankedCommanderAction,
} from "@/types/commanderDecisionV2";

const priorityMeta: Record<
  DecisionPriority,
  { label: string; className: string }
> = {
  วิกฤต: {
    label: "วิกฤต",
    className: "border-rose-500/50 bg-rose-950/30 text-rose-300",
  },
  เร่งด่วน: {
    label: "เร่งด่วน",
    className: "border-amber-500/50 bg-amber-950/30 text-amber-300",
  },
  ตามแผน: {
    label: "ตามแผน",
    className: "border-sky-500/40 bg-sky-950/30 text-sky-300",
  },
};

export default function CommanderDecisionV2Panel() {
  const snapshot = useCommanderDecisionsV2();
  const [expandedActionId, setExpandedActionId] = useState<string | null>(
    snapshot.topAction?.id ?? null,
  );

  useEffect(() => {
    if (
      expandedActionId &&
      !snapshot.actions.some((action) => action.id === expandedActionId)
    ) {
      setExpandedActionId(snapshot.topAction?.id ?? null);
    }
  }, [expandedActionId, snapshot.actions, snapshot.topAction?.id]);

  const criticalConstraints = snapshot.constraints.filter(
    (constraint) => constraint.severity >= 75,
  ).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-900/60 bg-[linear-gradient(135deg,rgba(3,16,34,0.98),rgba(7,30,55,0.96),rgba(3,15,30,0.98))]">
      <header className="flex flex-col gap-5 border-b border-sky-900/50 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.22em] text-sky-400">
            <BrainCircuit className="h-4 w-4" />
            DECISION ENGINE V2
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">
            ข้อเสนอเพื่อการตัดสินใจของผู้บังคับบัญชา
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
            {snapshot.executiveSummary}
          </p>
        </div>

        <div className="grid min-w-[340px] grid-cols-3 gap-2">
          <SummaryMetric
            icon={Gauge}
            label="ความพร้อม"
            value={`${snapshot.fleetReadiness.toFixed(0)}%`}
            valueClass="text-sky-300"
          />
          <SummaryMetric
            icon={ShieldAlert}
            label="ข้อจำกัดวิกฤต"
            value={`${criticalConstraints}`}
            valueClass="text-rose-300"
          />
          <SummaryMetric
            icon={Target}
            label="ทางเลือก"
            value={`${snapshot.actions.length}`}
            valueClass="text-emerald-300"
          />
        </div>
      </header>

      {snapshot.actions.length === 0 ? (
        <div className="flex items-center gap-3 px-6 py-8 text-sm text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          ไม่พบข้อจำกัดที่ต้องเสนอเพื่อการสั่งการ
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {snapshot.actions.slice(0, 3).map((action) => (
            <DecisionRow
              key={action.id}
              action={action}
              expanded={expandedActionId === action.id}
              onToggle={() =>
                setExpandedActionId((current) =>
                  current === action.id ? null : action.id,
                )
              }
            />
          ))}
        </div>
      )}

      <footer className="flex flex-col gap-2 border-t border-sky-900/50 bg-slate-950/25 px-6 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          ผลวิเคราะห์จากชุดข้อมูลสาธิตเพื่อสนับสนุนการพิจารณา
        </div>
        <span className="font-semibold text-sky-400">
          ทุกข้อเสนอมีเหตุผล ผลกระทบ และหลักฐานตรวจสอบได้
        </span>
      </footer>
    </section>
  );
}

function DecisionRow({
  action,
  expanded,
  onToggle,
}: {
  action: RankedCommanderAction;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = priorityMeta[action.priority];

  return (
    <article>
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full gap-4 px-6 py-4 text-left transition hover:bg-slate-900/50 md:grid-cols-[auto,1fr,auto,auto] md:items-center"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950">
          {action.rank}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-white">{action.title}</h3>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.className}`}
            >
              {meta.label}
            </span>
            <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-400">
              ความเชื่อมั่น {action.confidence}%
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {action.rationale}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-right">
          <p className="text-[10px] text-emerald-300">ผลที่คาด</p>
          <div className="mt-1 flex items-center justify-end gap-1 text-sm font-black">
            <span className="text-slate-400">
              {Math.round(
                action.projectedFleetReadiness - action.estimatedFleetGain,
              )}%
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-300">
              {action.projectedFleetReadiness}%
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 text-slate-400 transition ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="grid gap-4 border-t border-slate-800 bg-slate-950/25 px-6 py-5 xl:grid-cols-[1.15fr,1.35fr,1fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Ship className="h-4 w-4" />
              ขอบเขตผลกระทบ
            </div>
            <p className="mt-3 text-3xl font-black text-white">
              {action.affectedShips}
              <span className="ml-2 text-sm font-bold text-slate-500">ลำ</span>
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {action.rationale}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Target className="h-4 w-4" />
              ผลต่อภารกิจ
            </div>
            <div className="mt-3 space-y-2">
              {action.missionImpact.length > 0 ? (
                action.missionImpact.map((impact) => (
                  <div
                    key={`${action.id}-${impact.missionId}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-black text-sky-300">
                        {impact.missionId}
                      </span>
                      <span className="ml-2 text-slate-400">
                        {impact.missionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-black">
                      <span className="text-slate-500">{impact.currentScore}%</span>
                      <ArrowRight className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-300">
                        {impact.projectedScore}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  ไม่พบภารกิจที่ได้รับผลกระทบโดยตรง
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <FileSearch className="h-4 w-4" />
              หลักฐานประกอบ
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-400">
              {action.evidence.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/55 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-sky-400" />
      </div>
      <p className={`mt-2 text-2xl font-black ${valueClass}`}>{value}</p>
    </div>
  );
}
