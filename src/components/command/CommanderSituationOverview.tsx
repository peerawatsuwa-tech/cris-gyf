import { AlertTriangle, CheckCircle2, CircleGauge, Ship, ShieldAlert } from "lucide-react";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

const readinessMeta = {
  Y: { label: "พร้อม", className: "text-emerald-300", dot: "bg-emerald-400" },
  Q: { label: "มีข้อจำกัด", className: "text-amber-300", dot: "bg-amber-400" },
  N: { label: "ไม่พร้อม", className: "text-rose-300", dot: "bg-rose-500" },
} as const;

export default function CommanderSituationOverview() {
  const snapshot = useCommanderSnapshot();

  const level =
    snapshot.average >= 85 ? "ระดับสูง" : snapshot.average >= 70 ? "ระดับปานกลาง" : "ต้องเร่งแก้ไข";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-slate-950/30">
      <div className="border-b border-slate-800 bg-gradient-to-r from-sky-950/80 via-slate-900 to-slate-900 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
              <CircleGauge className="h-4 w-4" />
              ภาพรวมความพร้อมของกองเรือ
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">
              กองเรือมีความพร้อมโดยรวม {level}
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              ข้อมูลสาธิตเชิงปฏิบัติการของเรือ {snapshot.total} ลำ ใช้เพื่อแสดงแนวคิดระบบและไม่ใช่สถานะทางราชการ
            </p>
          </div>

          <div className="rounded-2xl border border-sky-800/70 bg-slate-950/70 px-6 py-4 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-400">ความพร้อมรวม</p>
            <p className="mt-1 text-5xl font-black text-sky-300">{snapshot.average.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-slate-800 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-slate-900 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">เรือทั้งหมด</span>
            <Ship className="h-5 w-5 text-sky-400" />
          </div>
          <p className="mt-3 text-4xl font-black text-white">{snapshot.total}</p>
          <p className="mt-1 text-sm text-slate-500">ลำในชุดข้อมูลสาธิต</p>
        </div>

        {(["Y", "Q", "N"] as const).map((status) => {
          const count = status === "Y" ? snapshot.ready : status === "Q" ? snapshot.limited : snapshot.notReady;
          const Icon = status === "Y" ? CheckCircle2 : status === "Q" ? AlertTriangle : ShieldAlert;
          return (
            <div key={status} className="bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{readinessMeta[status].label} ({status})</span>
                <Icon className={`h-5 w-5 ${readinessMeta[status].className}`} />
              </div>
              <div className="mt-3 flex items-end gap-3">
                <p className={`text-4xl font-black ${readinessMeta[status].className}`}>{count}</p>
                <span className="pb-1 text-sm text-slate-500">ลำ</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${readinessMeta[status].dot}`}
                  style={{ width: `${snapshot.total > 0 ? (count / snapshot.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
