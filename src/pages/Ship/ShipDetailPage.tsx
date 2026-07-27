import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ShipWheel,
} from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import EquipmentCard from "@/components/ship/EquipmentCard";
import PersonnelCard from "@/components/ship/PersonnelCard";
import { useFleet } from "@/context/FleetContext";
import {
  evaluateShip,
  missingCurrentFields,
  statusLabel,
  type ReadinessStatus,
} from "@/lib/readinessV027";
import type { CurrentEquipmentStatus, ShipCurrentReadiness } from "@/types/ship";

const readinessStyle: Record<
  ReadinessStatus,
  { text: string; border: string; bg: string }
> = {
  Y: { text: "text-emerald-300", border: "border-emerald-500/30", bg: "bg-emerald-500" },
  Q: { text: "text-amber-300", border: "border-amber-500/30", bg: "bg-amber-500" },
  N: { text: "text-rose-300", border: "border-rose-500/30", bg: "bg-rose-500" },
  U: { text: "text-sky-200", border: "border-sky-700/50", bg: "bg-sky-500" },
};

const equipmentLabels: Array<[
  keyof Pick<
    ShipCurrentReadiness,
    | "propulsion"
    | "radar"
    | "communication"
    | "navigation"
    | "weapon"
    | "rhib"
    | "eoir"
  >,
  string,
]> = [
  ["propulsion", "ระบบขับเคลื่อน"],
  ["radar", "Radar"],
  ["communication", "Communication"],
  ["navigation", "Navigation"],
  ["weapon", "Weapon"],
  ["rhib", "RHIB"],
  ["eoir", "EO/IR"],
];

export default function ShipDetailPage() {
  const { id } = useParams();
  const {
    fleet,
    lastSavedShipId,
    patchCurrentReadiness,
    saveState,
  } = useFleet();
  const ship = fleet.find((item) => item.id === id);

  if (!ship) {
    return (
      <MainLayout>
        <div className="rounded-xl border border-rose-800 bg-rose-950/20 p-10 text-center">
          <h1 className="text-2xl font-bold text-rose-400">ไม่พบข้อมูลเรือ</h1>
          <Link to="/fleet" className="mt-4 inline-block text-sky-300">
            กลับหน้ากองเรือ
          </Link>
        </div>
      </MainLayout>
    );
  }

  const evaluation = evaluateShip(ship);
  const style = readinessStyle[evaluation.status];
  const missing = missingCurrentFields(ship.currentReadiness);

  return (
    <MainLayout>
      <div className="space-y-5">
        <Link
          to="/fleet"
          className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับภาพรวมกองเรือ
        </Link>

        <section className={`overflow-hidden rounded-2xl border ${style.border} bg-slate-950/70`}>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
                <ShipWheel className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                  Ship Decision Summary · Excel Dataset
                </p>
                <h1 className="text-3xl font-bold text-white">
                  {ship.hullNumber} · {ship.shipName}
                </h1>
                <p className="text-sm text-slate-400">
                  {ship.shipClass} · {ship.squadron}
                </p>
              </div>
            </div>
            <div className="text-left lg:text-right">
              <p className={`text-lg font-bold ${style.text}`}>
                {statusLabel(evaluation.status)}
                {evaluation.status !== "U" ? ` (${evaluation.status})` : ""}
              </p>
              <p className="text-sm text-slate-500">
                C-Rating: — · อัปเดตล่าสุด: {ship.currentReadiness.updatedAt ?? "รอการประเมิน"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-3">
            <DecisionBlock label="สถานะปัจจุบัน">
              <p className={`text-xl font-bold ${style.text}`}>
                {statusLabel(evaluation.status)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                กำลังพล {ship.currentReadiness.crew ?? "—"}/{ship.authorizedCrew}
              </p>
            </DecisionBlock>
            <DecisionBlock label="รายการรอการประเมิน">
              {missing.length ? (
                <ul className="space-y-1 text-sm text-amber-200">
                  {missing.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              ) : (
                <p className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" /> ข้อมูลปัจจุบันครบ
                </p>
              )}
            </DecisionBlock>
            <DecisionBlock label="ข้อขัดข้องสำคัญ">
              <p className="text-sm leading-6 text-slate-300">
                {ship.currentReadiness.majorDeficiencies || "รอการประเมิน"}
              </p>
            </DecisionBlock>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">Current Readiness</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {equipmentLabels.map(([key, label]) => (
                <SystemStatus
                  key={key}
                  label={label}
                  value={ship.currentReadiness[key] as CurrentEquipmentStatus}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Communication Readiness จาก Excel:
              {" "}
              {ship.source.communicationReadinessReference === null
                ? "ไม่มีข้อมูล"
                : `${(ship.source.communicationReadinessReference * 100).toFixed(1)}% (ข้อมูลอ้างอิงดิบ)`}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">Personnel</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PersonnelMetric label="กำลังพลปัจจุบัน" value={ship.currentReadiness.crew ?? "—"} />
              <PersonnelMetric label="อัตรากำลัง" value={ship.authorizedCrew} />
              <PersonnelMetric
                label="ความพร้อม"
                value={
                  ship.currentReadiness.crew === null
                    ? "รอการประเมิน"
                    : `${((ship.currentReadiness.crew / ship.authorizedCrew) * 100).toFixed(1)}%`
                }
                pending={ship.currentReadiness.crew === null}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">ผลกระทบต่อภารกิจ</h2>
            <div className="mt-4 space-y-2">
              {evaluation.missions.map((mission) => {
                const missionStyle = readinessStyle[mission.status];
                return (
                  <div key={mission.missionId} className="rounded-xl border border-slate-800 p-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{mission.missionName}</p>
                      <p className={`font-bold ${missionStyle.text}`}>
                        {mission.status === "U"
                          ? "รอการประเมิน"
                          : `${mission.status} · ${statusLabel(mission.status)}`}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {mission.missing.length
                        ? `ขาด: ${mission.missing.join(", ")}`
                        : mission.reasons.join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <details className="group rounded-2xl border border-slate-800 bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                Local Storage Readiness Overlay
              </p>
              <h2 className="text-xl font-bold text-white">ปรับปรุงข้อมูลปัจจุบัน</h2>
              <p className="text-sm text-slate-500">
                ข้อมูลที่กรอกจะไม่ถูกเขียนกลับไปยัง Excel
              </p>
              {lastSavedShipId === ship.id && (
                <p
                  className={`mt-1 text-xs font-semibold ${
                    saveState === "saved" ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {saveState === "saved" ? "บันทึกแล้ว" : "บันทึกไม่สำเร็จ"}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-sky-400 transition group-open:rotate-180" />
          </summary>
          <div className="space-y-4 border-t border-slate-800 p-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <PersonnelCard
                ship={ship}
                onCrewChange={(crew) => patchCurrentReadiness(ship.id, { crew })}
              />
              <EquipmentCard
                ship={ship}
                onEquipmentChange={(patch) => patchCurrentReadiness(ship.id, patch)}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField
                label="ข้อขัดข้องสำคัญ"
                value={ship.currentReadiness.majorDeficiencies}
                onChange={(majorDeficiencies) =>
                  patchCurrentReadiness(ship.id, { majorDeficiencies })
                }
              />
              <TextField
                label="ข้อจำกัดในการปฏิบัติภารกิจ"
                value={ship.currentReadiness.missionLimitations}
                onChange={(missionLimitations) =>
                  patchCurrentReadiness(ship.id, { missionLimitations })
                }
              />
            </div>
            <label className="block max-w-sm">
              <span className="text-sm text-slate-400">วันที่ปรับปรุงข้อมูล</span>
              <input
                aria-label="วันที่ปรับปรุงข้อมูล"
                type="text"
                inputMode="numeric"
                placeholder="YYYY-MM-DD"
                value={ship.currentReadiness.updatedAt ?? ""}
                onChange={(event) =>
                  patchCurrentReadiness(ship.id, {
                    updatedAt: event.target.value || null,
                  })
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-sky-500"
              />
            </label>
          </div>
        </details>

        {missing.length > 0 && (
          <section className="flex gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            เรือที่รอการประเมินจะไม่ถูกนับเป็น Y, Q หรือ N
          </section>
        )}
      </div>
    </MainLayout>
  );
}

function DecisionBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      {children}
    </div>
  );
}

function SystemStatus({ label, value }: { label: string; value: CurrentEquipmentStatus }) {
  const style =
    value === "Operational"
      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"
      : value === "Limited"
        ? "border-amber-500/20 bg-amber-500/5 text-amber-200"
        : value === "Not Ready"
          ? "border-rose-500/20 bg-rose-500/5 text-rose-200"
          : "border-slate-700 bg-slate-900/40 text-slate-400";
  return (
    <div className={`flex justify-between rounded-lg border p-3 text-sm ${style}`}>
      <span>{label}</span>
      <strong className={value === null ? "text-sky-200" : undefined}>
        {value ?? "รอการประเมิน"}
      </strong>
    </div>
  );
}

function PersonnelMetric({
  label,
  value,
  pending = false,
}: {
  label: string;
  value: number | string;
  pending?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${pending ? "text-sky-200" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-400">{label}</span>
      <textarea
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ยังไม่มีข้อมูล"
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-500"
      />
    </label>
  );
}
