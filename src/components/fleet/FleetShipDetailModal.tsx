import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, ShipWheel, X } from "lucide-react";

import { calculateAlerts } from "@/engine/alertEngine";
import { calculateMission } from "@/engine/MissionEngine";
import { calculateReadiness } from "@/engine/calculateReadiness";
import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  onClose: () => void;
}

const equipmentLabels = {
  radar: "เรดาร์",
  communication: "การสื่อสาร",
  weapon: "ระบบอาวุธ",
  navigation: "การเดินเรือ",
  eoir: "EO/IR",
  rhib: "RHIB",
} satisfies Record<keyof Ship["equipment"], string>;

const statusStyle = {
  Operational: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Limited: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Not Ready": "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const readinessStyle = {
  Y: "text-emerald-300",
  Q: "text-amber-300",
  N: "text-rose-300",
};

const alertLabels: Record<string, string> = {
  "Crew below 90%": "กำลังพลต่ำกว่าร้อยละ 90",
  "Radar unavailable": "เรดาร์ไม่พร้อมใช้งาน",
  "Weapon unavailable": "ระบบอาวุธไม่พร้อมใช้งาน",
  "RHIB unavailable": "RHIB ไม่พร้อมใช้งาน",
};

export default function FleetShipDetailModal({ ship, onClose }: Props) {
  const readiness = calculateReadiness(ship);
  const missions = calculateMission(ship);
  const alerts = calculateAlerts(ship);
  const limitations = Object.entries(ship.equipment).filter(
    ([, status]) => status !== "Operational",
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fleet-ship-modal-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-sky-500/30 bg-[#07152a] shadow-2xl shadow-sky-950/60">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-700/70 bg-[#07152a]/95 p-5 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
              <ShipWheel className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-400">Ship Decision Detail</p>
              <h2 id="fleet-ship-modal-title" className="text-2xl font-bold text-white">
                {ship.hullNumber} · {ship.shipName}
              </h2>
              <p className="text-sm text-slate-400">{ship.shipClass} · {ship.squadron}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-sky-500 hover:text-white" aria-label="ปิดรายละเอียด">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <section className="grid gap-3 sm:grid-cols-4">
            <Metric label="ความพร้อม" value={`${readiness.score}%`} tone={readinessStyle[readiness.readiness]} />
            <Metric label="สถานะ" value={readiness.readiness} tone={readinessStyle[readiness.readiness]} />
            <Metric label="กำลังพล" value={`${ship.crew}/${ship.authorizedCrew}`} />
            <Metric label="C-Rating" value={ship.cRating} />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
              <h3 className="mb-3 font-semibold text-white">ข้อจำกัดสำคัญ</h3>
              {alerts.length > 0 ? (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div key={alert.message} className="flex gap-2 rounded-lg bg-rose-500/8 p-3 text-sm text-rose-200">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      {alertLabels[alert.message] ?? alert.message}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-300">ไม่พบข้อจำกัดวิกฤตจากข้อมูลปัจจุบัน</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
              <h3 className="mb-3 font-semibold text-white">ผลต่อภารกิจ</h3>
              <div className="space-y-2">
                {missions.map((mission) => (
                  <div key={mission.mission} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm">
                    <span className="text-slate-300">{mission.mission}</span>
                    <span className={`font-bold ${readinessStyle[mission.readiness]}`}>{mission.readiness} · {mission.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
            <h3 className="mb-3 font-semibold text-white">สถานะระบบสำคัญ</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.entries(ship.equipment) as [keyof Ship["equipment"], Ship["equipment"][keyof Ship["equipment"]]][]).map(([key, status]) => (
                <div key={key} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${statusStyle[status]}`}>
                  <span>{equipmentLabels[key]}</span><strong>{status}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4">
            <h3 className="font-semibold text-sky-200">ข้อเสนอแนะ</h3>
            <p className="mt-1 text-sm text-slate-300">
              {limitations.length > 0
                ? `ให้ตรวจสอบและแก้ไข ${limitations.map(([key]) => equipmentLabels[key as keyof Ship["equipment"]]).join(", ")} ก่อนมอบหมายภารกิจที่เกี่ยวข้อง`
                : "เรือพร้อมรับการมอบหมายตามผลประเมินภารกิจปัจจุบัน"}
            </p>
          </section>

          <div className="flex justify-end">
            <Link to={`/ship/${ship.id}`} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-500">
              เปิด Ship Detail เต็มรูปแบบ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "text-white" }: { label: string; value: string; tone?: string }) {
  return <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4"><p className="text-xs text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p></div>;
}
