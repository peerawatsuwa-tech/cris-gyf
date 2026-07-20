import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  ShieldAlert,
  Ship,
  Target,
} from "lucide-react";
import { useCommanderDecisionsV2 } from "@/hooks/useCommanderDecisionsV2";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function ExecutiveCockpit() {
  const fleet = useCommanderSnapshot();
  const decisions = useCommanderDecisionsV2();
  const criticalIssues = decisions.constraints.slice(0, 3);
  const recommendedActions = decisions.actions.slice(0, 3);
  const topAction = decisions.topAction;
  const projected = topAction?.projectedFleetReadiness ?? fleet.average;
  const operationalStatus = fleet.notReady > 0 ? "พร้อมโดยมีความเสี่ยง" : "พร้อมปฏิบัติ";

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-800/60 bg-[radial-gradient(circle_at_top_right,rgba(14,116,144,0.18),transparent_36%),linear-gradient(135deg,rgba(3,15,31,0.99),rgba(5,26,46,0.98))] shadow-2xl shadow-slate-950/50">
      <header className="flex flex-col gap-4 border-b border-sky-900/60 px-5 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.24em] text-cyan-400">
            <BrainCircuit className="h-4 w-4" />
            AI COMMANDER · EXECUTIVE COCKPIT
          </div>
          <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">
            ข้อสรุปเพื่อการตัดสินใจ
          </h1>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">
            {decisions.executiveSummary}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/35 bg-emerald-950/25 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              Operational Status
            </p>
            <p className="font-black text-emerald-300">{operationalStatus}</p>
          </div>
        </div>
      </header>

      <div className="grid xl:grid-cols-[0.8fr,1.25fr,1.25fr]">
        <div className="border-b border-sky-900/50 p-5 md:p-6 xl:border-r xl:border-b-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>OVERALL READINESS</span>
            <Gauge className="h-5 w-5 text-sky-400" />
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-6xl font-black tracking-tight text-sky-300">
              {fleet.average.toFixed(0)}
            </span>
            <span className="pb-2 text-2xl font-black text-sky-500">%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
              style={{ width: `${Math.min(100, fleet.average)}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <StatusMini label="Y" value={fleet.ready} tone="text-emerald-300" />
            <StatusMini label="Q" value={fleet.limited} tone="text-amber-300" />
            <StatusMini label="N" value={fleet.notReady} tone="text-rose-300" />
          </div>
          {topAction && (
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3">
              <p className="text-[10px] font-bold text-emerald-400">EXPECTED AFTER ACTION</p>
              <div className="mt-2 flex items-center gap-2 text-lg font-black">
                <span className="text-slate-500">{fleet.average.toFixed(0)}%</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-300">{projected}%</span>
              </div>
            </div>
          )}
        </div>

        <CockpitList
          icon={ShieldAlert}
          eyebrow="TOP CRITICAL ISSUES"
          title="ประเด็นที่ต้องให้ความสนใจ"
          emptyText="ไม่พบข้อจำกัดสำคัญ"
          items={criticalIssues.map((issue, index) => ({
            id: issue.id,
            index: index + 1,
            title: issue.title,
            meta: `${issue.affectedShipIds.length} ลำ · ${issue.affectedMissionIds.join(", ") || "ติดตามภาพรวม"}`,
            value: `${issue.severity}`,
          }))}
          accent="rose"
        />

        <CockpitList
          icon={Target}
          eyebrow="RECOMMENDED ACTIONS"
          title="ข้อเสนอเพื่อการสั่งการ"
          emptyText="รักษาระดับความพร้อมและติดตามสถานการณ์"
          items={recommendedActions.map((action) => ({
            id: action.id,
            index: action.rank,
            title: action.title,
            meta: `${action.affectedShips} ลำ · ความเชื่อมั่น ${action.confidence}%`,
            value: `+${action.estimatedFleetGain}%`,
          }))}
          accent="emerald"
        />
      </div>

      <footer className="flex flex-col gap-2 border-t border-sky-900/50 bg-slate-950/25 px-5 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          ข้อสรุปจากข้อมูลสาธิต ต้องตรวจสอบหลักฐานก่อนออกคำสั่ง
        </span>
        <span className="font-bold text-sky-400">รายละเอียดทั้งหมดอยู่ในส่วน Drill-down ด้านล่าง</span>
      </footer>
    </section>
  );
}

function StatusMini({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2">
      <p className={`text-lg font-black ${tone}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
    </div>
  );
}

function CockpitList({
  icon: Icon,
  eyebrow,
  title,
  emptyText,
  items,
  accent,
}: {
  icon: typeof Ship;
  eyebrow: string;
  title: string;
  emptyText: string;
  items: Array<{ id: string; index: number; title: string; meta: string; value: string }>;
  accent: "rose" | "emerald";
}) {
  const tone = accent === "rose" ? "text-rose-300" : "text-emerald-300";
  const badge = accent === "rose" ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-300";

  return (
    <div className="border-b border-sky-900/50 p-5 md:p-6 xl:border-r xl:border-b-0 last:xl:border-r-0">
      <div className={`flex items-center gap-2 text-[10px] font-black tracking-[0.18em] ${tone}`}>
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="mt-2 font-black text-white">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="rounded-lg border border-slate-800 p-3 text-xs text-slate-500">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="grid grid-cols-[auto,1fr,auto] items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${badge}`}>{item.index}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{item.title}</p>
                <p className="mt-1 truncate text-[10px] text-slate-500">{item.meta}</p>
              </div>
              <span className={`text-sm font-black ${tone}`}>{item.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
