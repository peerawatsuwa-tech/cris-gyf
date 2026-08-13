import { useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useFleet } from "@/context/FleetContext";
import {
  ASSIGNMENT_GROUPS,
  assignmentGroupLabel,
  assignmentLabel,
  assignmentLocations,
  automaticAssignmentLocation,
  type AssignmentGroup,
  type AssignmentLocation,
} from "@/constants/assignments";
import { AUTHORIZED_PERSONNEL, PERSONNEL_FIELDS } from "@/constants/personnelCatalog";
import {
  EQUIPMENT_SYSTEMS,
  equipmentItemKey,
  systemDeficiencyCounts,
} from "@/constants/equipmentCatalog";
import {
  equipmentStatusText,
  readinessDetailText,
  readinessStatusText,
  UI,
} from "@/constants/uiText";
import {
  evaluateShip,
  missingCurrentFields,
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
  ["propulsion", UI.equipment.propulsion],
  ["radar", UI.equipment.radar],
  ["communication", UI.equipment.communication],
  ["navigation", UI.equipment.navigation],
  ["weapon", UI.equipment.weapon],
  ["rhib", UI.equipment.rhib],
  ["eoir", UI.equipment.eoir],
];

export default function ShipDetailPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const {
    fleet,
    loading,
    lastSavedShipId,
    patchCurrentReadiness,
    saveState,
  } = useFleet();
  const ship = fleet.find((item) => item.id === id);
  const canEdit =
    profile?.role === "admin" ||
    (profile?.role === "ship" && (!profile.shipId || profile.shipId === id));

  if (loading) {
    return (
      <MainLayout>
        <section role="status" aria-live="polite" className="rounded-xl border border-sky-800 bg-sky-950/20 p-10 text-center">
          <h1 className="text-xl font-bold text-sky-200">กำลังโหลดข้อมูลเรือ...</h1>
          <p className="mt-2 text-sm text-slate-400">ระบบกำลังรับข้อมูลล่าสุดจากฐานข้อมูลกลาง</p>
        </section>
      </MainLayout>
    );
  }

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
        {profile?.role !== "ship" && (
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {UI.actions.backToFleet}
          </Link>
        )}

        <section className={`overflow-hidden rounded-2xl border ${style.border} bg-slate-950/70`}>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-sky-500/15 p-3 text-sky-300">
                <ShipWheel className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                  สรุปการตัดสินใจของเรือ (Ship Decision Summary) · {UI.labels.excelDataset}
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
                {readinessStatusText(evaluation.status)}
              </p>
              <p className="text-sm text-slate-500">
                C-Rating: — · {UI.labels.lastUpdated}: {formatTrustedTimestamp(ship.currentReadiness.updatedAt)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-3">
            <DecisionBlock label="สถานะปัจจุบัน">
              <p className={`text-xl font-bold ${style.text}`}>
                {readinessStatusText(evaluation.status)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                กำลังพล {ship.currentReadiness.crew ?? "—"}/{ship.authorizedCrew}
              </p>
            </DecisionBlock>
            <DecisionBlock label="รายการรอการประเมิน">
              {missing.length ? (
                <ul className="space-y-1 text-sm text-amber-200">
                  {missing.map((item) => <li key={item}>• {readinessDetailText(item)}</li>)}
                </ul>
              ) : (
                <p className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" /> ข้อมูลปัจจุบันครบ
                </p>
              )}
            </DecisionBlock>
            <DecisionBlock label={UI.sections.majorDeficiencies}>
              <p className="text-sm leading-6 text-slate-300">
                {ship.currentReadiness.majorDeficiencies || "รอการประเมิน"}
              </p>
            </DecisionBlock>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="rounded-2xl border border-sky-800/50 bg-sky-950/20 p-5">
            <h2 className="text-xl font-bold text-white">สถานะการปฏิบัติราชการ (Operational Assignment)</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PersonnelMetric label="พื้นที่หรือหน่วยหลัก (Assignment Group)" value={ship.currentReadiness.assignmentGroup ? assignmentGroupLabel(ship.currentReadiness.assignmentGroup) : "ยังไม่ระบุ (Not Specified)"} />
              <PersonnelMetric label="จุดปฏิบัติราชการ (Assignment Location)" value={ship.currentReadiness.assignmentLocation ?? "ยังไม่ระบุ (Not Specified)"} />
            </div>
            <p className="mt-3 text-sm text-sky-200/80">{assignmentLabel(ship.currentReadiness.assignmentGroup ?? null, ship.currentReadiness.assignmentLocation ?? null)}</p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">{UI.sections.currentReadiness}</h2>
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
              ความพร้อมของระบบสื่อสารจาก Excel (Communication Readiness):
              {" "}
              {ship.source.communicationReadinessReference === null
                ? "ไม่มีข้อมูล"
                : `${(ship.source.communicationReadinessReference * 100).toFixed(1)}% (ข้อมูลอ้างอิงดิบ)`}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">ข้อขัดข้องรายระบบจาก Excel</h2>
            <p className="mt-1 text-xs text-slate-500">Operational Limitation (Q) และ Mission Critical (N) เป็นข้อมูลรายงานเพิ่มเติม ไม่เปลี่ยนผล Readiness รายลำ</p>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {EQUIPMENT_SYSTEMS.map((system) => {
                const counts = systemDeficiencyCounts(ship.currentReadiness.equipmentDetails, system.id);
                const affected = system.items
                  .map((item) => ({ item, status: ship.currentReadiness.equipmentDetails?.[equipmentItemKey(system.id, item)] ?? null }))
                  .filter(({ status }) => status === "Limited" || status === "Not Ready");
                return (
                  <div key={system.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-white">{system.label}</p><p className="text-xs text-slate-500">Excel: {system.sourceSheet}</p></div>
                      <p className="shrink-0 text-xs"><span className="text-amber-300">Q {counts.limited}</span> · <span className="text-rose-300">N {counts.critical}</span></p>
                    </div>
                    <ul className="mt-3 space-y-1 text-xs text-slate-300">
                      {affected.length
                        ? affected.map(({ item, status }) => <li key={item}>• {item}: {status === "Limited" ? "Operational Limitation (Q)" : "Mission Critical (N)"}</li>)
                        : <li className="text-sky-200">{counts.recorded === system.items.length ? "ไม่พบข้อขัดข้อง" : "รอการประเมินรายการอุปกรณ์"}</li>}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h2 className="text-xl font-bold text-white">{UI.sections.personnel}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {PERSONNEL_FIELDS.map(({ key, label }) => (
                <PersonnelMetric
                  key={key}
                  label={label}
                  value={`${ship.currentReadiness.personnel?.[key] ?? "—"} / ${AUTHORIZED_PERSONNEL[ship.hullNumber]?.[key] ?? "—"}`}
                  pending={ship.currentReadiness.personnel?.[key] === null || ship.currentReadiness.personnel?.[key] === undefined}
                />
              ))}
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
            <h2 className="text-xl font-bold text-white">{UI.sections.missionImpact}</h2>
            <div className="mt-4 space-y-2">
              {evaluation.missions.map((mission) => {
                const missionStyle = readinessStyle[mission.status];
                return (
                  <div key={mission.missionId} className="rounded-xl border border-slate-800 p-3">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-white">{mission.missionName}</p>
                      <p className={`font-bold ${missionStyle.text}`}>
                        {mission.status === "U"
                          ? UI.status.U
                          : readinessStatusText(mission.status)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {mission.missing.length
                        ? `ขาด: ${mission.missing.map(readinessDetailText).join(", ")}`
                        : mission.reasons.map(readinessDetailText).join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {canEdit && (
        <details open={profile?.role === "ship"} className="group rounded-2xl border border-slate-800 bg-slate-950/60">
          <summary className="flex cursor-pointer list-none items-center justify-between p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                ข้อมูลปรับปรุงความพร้อมบนคลาวด์ (Cloud Readiness Overlay)
              </p>
              <h2 className="text-xl font-bold text-white">{UI.sections.shipEdit}</h2>
              <p className="text-sm text-slate-500">
                ข้อมูลที่กรอกจะไม่ถูกเขียนกลับไปยัง Excel
              </p>
              {lastSavedShipId === ship.id && (
                <p
                  className={`mt-1 text-xs font-semibold ${
                    saveState === "saved" ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {saveState === "saved" ? UI.save.saved : UI.save.failed}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-sky-400 transition group-open:rotate-180" />
          </summary>
          <div className="space-y-4 border-t border-slate-800 p-5">
            <ReportingWorkflowSteps saveState={lastSavedShipId === ship.id ? saveState : "idle"} />
            <WorkflowSectionLabel step="1" title="ภารกิจราชการและพื้นที่" />
            <OperationalAssignmentEditor
              group={ship.currentReadiness.assignmentGroup ?? null}
              location={ship.currentReadiness.assignmentLocation ?? null}
              onChange={(assignmentGroup, assignmentLocation) =>
                patchCurrentReadiness(ship.id, { assignmentGroup, assignmentLocation })
              }
            />
            <WorkflowSectionLabel step="2" title="กำลังพล" />
            <div className="grid gap-4 lg:grid-cols-2">
              <PersonnelCard
                ship={ship}
                onPersonnelChange={(personnel) => patchCurrentReadiness(ship.id, { personnel })}
              />
              <div>
                <WorkflowSectionLabel step="3" title="อุปกรณ์" compact />
              <EquipmentCard
                ship={ship}
                onEquipmentChange={(patch) => patchCurrentReadiness(ship.id, patch)}
                onEquipmentDetailsChange={(equipmentDetails) => patchCurrentReadiness(ship.id, { equipmentDetails })}
              />
              </div>
            </div>
            <WorkflowSectionLabel step="4" title="ข้อจำกัดและข้อขัดข้อง" />
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField
                label={UI.sections.majorDeficiencies}
                value={ship.currentReadiness.majorDeficiencies}
                onChange={(majorDeficiencies) =>
                  patchCurrentReadiness(ship.id, { majorDeficiencies })
                }
              />
              <TextField
                label={UI.sections.missionLimitations}
                value={ship.currentReadiness.missionLimitations}
                onChange={(missionLimitations) =>
                  patchCurrentReadiness(ship.id, { missionLimitations })
                }
              />
            </div>
            <p className="rounded-lg border border-sky-800/40 bg-sky-950/20 p-3 text-xs text-sky-100">
              ขั้นตอนบันทึกและยืนยันเวลา · {UI.labels.lastUpdated}: {formatTrustedTimestamp(ship.currentReadiness.updatedAt)} · กำหนดโดยฐานข้อมูลออนไลน์อัตโนมัติ
            </p>
          </div>
        </details>
        )}

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

function ReportingWorkflowSteps({ saveState }: { saveState: "idle" | "saved" | "error" }) {
  const stateText = saveState === "saved"
    ? "บันทึกสำเร็จ"
    : saveState === "error"
      ? "บันทึกไม่สำเร็จ"
      : "ระบบบันทึกอัตโนมัติเมื่อแก้ไขข้อมูล";
  return (
    <section className="rounded-xl border border-sky-800/50 bg-sky-950/20 p-4">
      <p className="text-sm font-bold text-white">ขั้นตอนรายงานข้อมูลเรือ</p>
      <p className="mt-2 text-sm text-sky-100">เลือกเรือ → ตรวจข้อมูล → แก้ข้อมูล → บันทึก → ยืนยันเวลาจากระบบ</p>
      <p className={`mt-2 text-xs font-semibold ${saveState === "error" ? "text-rose-300" : saveState === "saved" ? "text-emerald-300" : "text-slate-400"}`}>{stateText}</p>
    </section>
  );
}

function WorkflowSectionLabel({ step, title, compact = false }: { step: string; title: string; compact?: boolean }) {
  return <p className={`${compact ? "mb-2" : ""} text-xs font-black uppercase tracking-[0.16em] text-sky-400`}>ขั้นที่ {step} · {title}</p>;
}

function formatTrustedTimestamp(value: string | null) {
  if (!value) return "รอการบันทึกบนระบบออนไลน์";
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? value
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(timestamp);
}

function OperationalAssignmentEditor({
  group,
  location,
  onChange,
}: {
  group: AssignmentGroup | null;
  location: AssignmentLocation | null;
  onChange: (group: AssignmentGroup | null, location: AssignmentLocation | null) => void;
}) {
  const [draftGroup, setDraftGroup] = useState(group);
  const [draftLocation, setDraftLocation] = useState(location);
  useEffect(() => { setDraftGroup(group); setDraftLocation(location); }, [group, location]);
  const locations = assignmentLocations(draftGroup);
  const fixedLocation = automaticAssignmentLocation(draftGroup);
  const hideLocation = draftGroup === "มรภ.ฐท.สส.";
  const valid = draftGroup === null || hideLocation || fixedLocation !== null || draftLocation !== null;
  return (
    <section className="rounded-xl border border-sky-800/50 bg-sky-950/20 p-4">
      <h3 className="font-bold text-white">สถานะการปฏิบัติราชการ (Operational Assignment)</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-400">พื้นที่หรือหน่วยหลัก (Assignment Group)</span>
          <select
            aria-label="พื้นที่หรือหน่วยหลัก (Assignment Group)"
            value={draftGroup ?? ""}
            onChange={(event) => {
              const nextGroup = event.target.value ? event.target.value as AssignmentGroup : null;
              setDraftGroup(nextGroup);
              setDraftLocation(automaticAssignmentLocation(nextGroup));
            }}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-sky-500"
          >
            <option value="">ยังไม่ระบุ (Not Specified)</option>
            {ASSIGNMENT_GROUPS.map((item) => <option key={item} value={item}>{assignmentGroupLabel(item)}</option>)}
          </select>
        </label>
        {!hideLocation && (
          <label className="block">
            <span className="text-sm text-slate-400">จุดปฏิบัติราชการ (Assignment Location)</span>
            <select
              aria-label="จุดปฏิบัติราชการ (Assignment Location)"
              value={draftLocation ?? fixedLocation ?? ""}
              disabled={!draftGroup || Boolean(fixedLocation)}
              onChange={(event) => setDraftLocation(event.target.value ? event.target.value as AssignmentLocation : null)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">เลือกจุดปฏิบัติราชการ</option>
              {locations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        )}
      </div>
      <button
        type="button"
        disabled={!valid}
        onClick={() => onChange(draftGroup, draftLocation ?? fixedLocation)}
        className="mt-4 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        บันทึกสถานะการปฏิบัติราชการ (Save Assignment)
      </button>
      {!valid && <p className="mt-2 text-xs text-amber-200">กรุณาเลือกจุดปฏิบัติราชการให้ตรงกับพื้นที่หรือหน่วยหลัก</p>}
    </section>
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
        {equipmentStatusText(value)}
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
        placeholder={UI.labels.noData}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-500"
      />
    </label>
  );
}
