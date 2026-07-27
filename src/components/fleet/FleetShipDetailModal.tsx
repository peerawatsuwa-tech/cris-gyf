import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, ShipWheel, X } from "lucide-react";

import {
  evaluateShip,
  statusLabel,
  type ReadinessStatus,
} from "@/lib/readinessV027";
import type { Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  onClose: () => void;
}

const readinessStyle: Record<ReadinessStatus, string> = {
  Y: "text-emerald-300",
  Q: "text-amber-300",
  N: "text-rose-300",
  U: "text-sky-200",
};

export default function FleetShipDetailModal({ ship, onClose }: Props) {
  const evaluation = evaluateShip(ship);
  const missing = [...new Set(evaluation.missions.flatMap((mission) => mission.missing))];

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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-400">
                Fleet Detail · Excel Dataset
              </p>
              <h2 id="fleet-ship-modal-title" className="text-2xl font-bold text-white">
                {ship.hullNumber} · {ship.shipName}
              </h2>
              <p className="text-sm text-slate-400">{ship.shipClass} · {ship.squadron}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-sky-500 hover:text-white"
            aria-label="ปิดรายละเอียด"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <section className="grid gap-3 sm:grid-cols-4">
            <Metric
              label="สถานะ"
              value={statusLabel(evaluation.status)}
              tone={readinessStyle[evaluation.status]}
            />
            <Metric
              label="Y / Q / N"
              value={evaluation.status === "U" ? "—" : evaluation.status}
              tone={readinessStyle[evaluation.status]}
            />
            <Metric label="กำลังพล" value={`${ship.currentReadiness.crew ?? "—"}/${ship.authorizedCrew}`} />
            <Metric label="C-Rating" value="—" />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
              <h3 className="mb-3 font-semibold text-white">รายการรอการประเมิน</h3>
              {missing.length ? (
                <div className="space-y-2">
                  {missing.map((item) => (
                    <div key={item} className="flex gap-2 rounded-lg bg-amber-500/8 p-3 text-sm text-amber-200">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-300">ข้อมูลขั้นต่ำครบ</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
              <h3 className="mb-3 font-semibold text-white">ผลต่อภารกิจ</h3>
              <div className="space-y-2">
                {evaluation.missions.map((mission) => (
                  <div key={mission.missionId} className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm">
                    <span className="text-slate-300">{mission.missionName}</span>
                    <span className={`font-bold ${readinessStyle[mission.status]}`}>
                      {mission.status === "U" ? "รอการประเมิน" : mission.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Link
              to={`/ship/${ship.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-500"
            >
              เปิด Ship Detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
