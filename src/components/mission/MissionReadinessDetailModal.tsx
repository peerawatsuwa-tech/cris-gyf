import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShipWheel, Target, X } from "lucide-react";

import type {
  MissionImpactResult,
  RecoveryAction,
} from "@/engine/commanderIntelligenceEngine";
import type { Ship } from "@/types/ship";

type Props = {
  mission: MissionImpactResult | null;
  fleet: Ship[];
  recoveryActions: RecoveryAction[];
  onClose: () => void;
};

const statusLabel = {
  Y: "พร้อมปฏิบัติ",
  Q: "มีข้อจำกัด",
  N: "ไม่พร้อม",
};

export function MissionReadinessDetailModal({
  mission,
  fleet,
  recoveryActions,
  onClose,
}: Props) {
  useEffect(() => {
    if (!mission) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mission, onClose]);

  const relatedActions = useMemo(() => {
    if (!mission) return [];
    return recoveryActions
      .map((action) => ({
        action,
        gain:
          action.missionGains.find((gain) => gain.mission === mission.id)?.gain ??
          0,
      }))
      .filter((item) => item.gain > 0)
      .sort((a, b) => b.gain - a.gain);
  }, [mission, recoveryActions]);

  if (!mission) return null;

  const affected = fleet.filter((ship) =>
    mission.affectedShips.includes(ship.hullNumber),
  );
  const supporting = fleet
    .filter(
      (ship) =>
        ship.readiness === "Y" &&
        !mission.affectedShips.includes(ship.hullNumber),
    )
    .slice(0, 8);
  const primaryAction = relatedActions[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-detail-title"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-sky-500/40 bg-slate-950 shadow-2xl shadow-sky-950/60"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/95 p-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-sky-950 p-3 text-sky-400">
              <Target className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400">
                Mission Decision Detail · {mission.id}
              </p>
              <h2 id="mission-detail-title" className="mt-1 text-2xl font-bold text-white">
                {mission.title}
              </h2>
              <p className="text-sm text-slate-500">{mission.shortTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดรายละเอียด"
            className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-sky-500 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <DecisionCell label="Current Status" value={`${mission.status} · ${statusLabel[mission.status]}`} />
            <DecisionCell label="Mission Score" value={`${mission.score}%`} />
            <DecisionCell label="Mission Impact" value={`${affected.length} ลำต้องตรวจสอบ`} />
            <DecisionCell label="Recovery Potential" value={`+${mission.recoveryPotential}%`} accent />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <AlertTriangle className="h-5 w-5 text-amber-400" /> Critical Dependency
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {mission.causes.length > 0 ? (
                  mission.causes.map((cause) => (
                    <li key={cause} className="rounded-lg bg-amber-950/20 px-4 py-3 text-amber-100">
                      {cause}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" /> ไม่พบข้อจำกัดสำคัญ
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-5">
              <h3 className="font-bold text-white">Recommended Attention</h3>
              <p className="mt-3 text-lg font-semibold text-cyan-300">
                {primaryAction?.action.title ?? "ติดตามสถานการณ์และรักษาระดับความพร้อม"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {primaryAction
                  ? `${primaryAction.action.reason} คาดเพิ่มคะแนนภารกิจ ${mission.id} ประมาณ ${primaryAction.gain}%`
                  : "ผลประเมินยังอยู่ในระดับพร้อม ให้ติดตามข้อมูลเรือและข้อจำกัดอย่างต่อเนื่อง"}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ShipList title="เรือที่ต้องตรวจสอบ" ships={affected} empty="ไม่พบเรือที่ต้องให้ความสนใจ" />
            <ShipList title="เรือพร้อมสนับสนุนภารกิจ" ships={supporting} empty="ยังไม่มีเรือในสถานะ Y" />
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-5">
            <h3 className="font-bold text-emerald-300">Key Supporting Evidence</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
              <p>• ประเมินจากเรือทั้งหมด {fleet.length} ลำใน FleetContext</p>
              <p>• คะแนนและสถานะมาจาก Commander Intelligence Engine</p>
              <p>• เรือที่ได้รับผลกระทบ: {mission.affectedShips.join(", ") || "ไม่พบ"}</p>
              <p>• ควรตรวจสอบข้อมูลต้นทางก่อนออกคำสั่ง</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DecisionCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-2 text-lg font-bold ${accent ? "text-emerald-400" : "text-sky-300"}`}>{value}</p>
    </div>
  );
}

function ShipList({ title, ships, empty }: { title: string; ships: Ship[]; empty: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="flex items-center gap-2 font-bold text-white">
        <ShipWheel className="h-5 w-5 text-sky-400" /> {title}
      </h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ships.length > 0 ? (
          ships.map((ship) => (
            <Link
              key={ship.id}
              to={`/ship/${ship.id}`}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
            >
              {ship.hullNumber} · {ship.readiness}
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500">{empty}</p>
        )}
      </div>
    </div>
  );
}
