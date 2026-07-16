import {
  AlertTriangle,
  BrainCircuit,
  Clock3,
  Gauge,
  Radio,
  ShieldCheck,
  Ship,
} from "lucide-react";
import { useCommanderDecision } from "@/hooks/useCommanderDecision";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

function getRiskLevel(notReady: number, limited: number) {
  if (notReady >= 4 || limited >= 12) {
    return {
      label: "สูง",
      className: "border-rose-500/40 bg-rose-950/30 text-rose-300",
    };
  }

  if (notReady >= 1 || limited >= 5) {
    return {
      label: "ปานกลาง",
      className: "border-amber-500/40 bg-amber-950/25 text-amber-300",
    };
  }

  return {
    label: "ต่ำ",
    className: "border-emerald-500/40 bg-emerald-950/25 text-emerald-300",
  };
}

function getThaiDateTime() {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date());
}

export default function CommanderMorningBrief() {
  const snapshot = useCommanderSnapshot();
  const intelligence = useFleetIntelligence();
  const decision = useCommanderDecision();

  const risk = getRiskLevel(snapshot.notReady, snapshot.limited);
  const decisionCount = decision.decisions.filter(
    (item) => item.urgency === "เร่งด่วน" || item.urgency === "สูง",
  ).length;

  const missionCapability = Math.max(
    0,
    Math.round(
      snapshot.average -
        snapshot.notReady * 2.2 -
        snapshot.limited * 0.45,
    ),
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-900/60 bg-[linear-gradient(135deg,rgba(3,16,34,0.98),rgba(8,31,56,0.96),rgba(3,15,30,0.98))] shadow-2xl shadow-slate-950/40">
      <div className="flex flex-col gap-5 border-b border-sky-900/50 px-6 py-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.25em] text-sky-400">
            <BrainCircuit className="h-4 w-4" />
            COMMANDER MORNING BRIEF
          </div>

          <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
            สรุปสถานการณ์สำหรับผู้บังคับบัญชา
          </h2>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">
            {intelligence.headline}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
          <Clock3 className="h-4 w-4 text-sky-400" />
          อัปเดต {getThaiDateTime()}
        </div>
      </div>

      <div className="grid gap-px bg-sky-950/50 sm:grid-cols-2 xl:grid-cols-6">
        <Metric
          icon={Ship}
          label="เรือทั้งหมด"
          value={`${snapshot.total}`}
          suffix="ลำ"
          valueClass="text-white"
        />

        <Metric
          icon={Gauge}
          label="ความพร้อมกองเรือ"
          value={`${snapshot.average.toFixed(0)}`}
          suffix="%"
          valueClass="text-sky-300"
        />

        <Metric
          icon={ShieldCheck}
          label="ขีดความสามารถภารกิจ"
          value={`${missionCapability}`}
          suffix="%"
          valueClass="text-emerald-300"
        />

        <Metric
          icon={AlertTriangle}
          label="เรือวิกฤต"
          value={`${snapshot.notReady}`}
          suffix="ลำ"
          valueClass="text-rose-300"
        />

        <Metric
          icon={Radio}
          label="ประเด็นสำคัญ"
          value={`${intelligence.issues.length}`}
          suffix="เรื่อง"
          valueClass="text-amber-300"
        />

        <div className="bg-slate-950/45 p-5">
          <p className="text-xs font-semibold text-slate-500">
            เรื่องที่ต้องตัดสินใจ
          </p>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <span className="text-4xl font-black text-white">
                {Math.max(decisionCount, decision.decisions.length > 0 ? 1 : 0)}
              </span>
              <span className="ml-2 text-sm text-slate-500">เรื่อง</span>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${risk.className}`}
            >
              ความเสี่ยง {risk.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricProps {
  icon: typeof Ship;
  label: string;
  value: string;
  suffix: string;
  valueClass: string;
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
  valueClass,
}: MetricProps) {
  return (
    <div className="bg-slate-950/45 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-sky-500" />
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className={`text-4xl font-black ${valueClass}`}>{value}</span>
        <span className="pb-1 text-sm text-slate-500">{suffix}</span>
      </div>
    </div>
  );
}
