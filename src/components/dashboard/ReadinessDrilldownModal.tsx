import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import { ACTIVE_MISSIONS, type ActiveMissionId } from "@/constants/missions";
import { equipmentStatusText, readinessStatusText, UI } from "@/constants/uiText";
import {
  affectedSystems,
  deficiencySeverity,
  deficiencyValue,
  impactedMissions,
  insightText,
  latestUpdate,
  matchesDeficiency,
  meaningfulDetail,
  missionLimitation,
  pendingFields,
  shipReasons,
  SYSTEM_LABELS,
  type DeficiencyKey,
} from "@/lib/readinessDetailPresenter";
import { aggregateMissionCapability, type MissionCapability } from "@/lib/missionAggregation";
import { evaluateMission, evaluateShip, REQUIRED_SYSTEMS, summarizeFleet, type ReadinessStatus } from "@/lib/readinessV027";
import type { Ship } from "@/types/ship";

export type DrilldownSelection =
  | { kind: "status"; status: ReadinessStatus }
  | { kind: "deficiency"; key: DeficiencyKey; title: string }
  | { kind: "mission"; missionId: ActiveMissionId }
  | { kind: "supportMission" };

const tone: Record<ReadinessStatus, string> = {
  Y: "border-emerald-500/30 text-emerald-300",
  Q: "border-amber-500/30 text-amber-300",
  N: "border-rose-500/30 text-rose-300",
  U: "border-sky-500/30 text-sky-200",
};

export default function ReadinessDrilldownModal({
  fleet,
  selection,
  onClose,
}: {
  fleet: Ship[];
  selection: DrilldownSelection;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const summary = useMemo(() => summarizeFleet(fleet), [fleet]);
  const detail = useMemo(() => {
    if (selection.kind === "status") {
      return {
        title: readinessStatusText(selection.status),
        ships: summary.shipResults.filter((item) => item.status === selection.status).map((item) => item.ship),
      };
    }
    if (selection.kind === "deficiency") {
      return { title: selection.title, ships: fleet.filter((ship) => matchesDeficiency(ship, selection.key)) };
    }
    if (selection.kind === "mission") {
      const mission = ACTIVE_MISSIONS.find((item) => item.id === selection.missionId)!;
      return { title: mission.name, ships: fleet };
    }
    return { title: "สนับสนุนภารกิจอื่น ๆ (Other Mission Support)", ships: fleet };
  }, [fleet, selection, summary.shipResults]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  const mission = selection.kind === "mission"
    ? summary.missions.find((item) => item.id === selection.missionId)
    : selection.kind === "supportMission"
      ? { distribution: summary.counts }
      : null;
  const missionCapability = mission ? aggregateMissionCapability(mission.distribution) : null;
  const updatedAt = latestUpdate(detail.ships);
  const percentage = fleet.length ? (detail.ships.length / fleet.length) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="readiness-drilldown-title"
        onKeyDown={handleKeyDown}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-sky-500/30 bg-[#07152a] shadow-2xl shadow-sky-950/70"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-700/70 p-4 sm:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">รายละเอียดความพร้อม (Readiness Detail)</p>
            <h2 id="readiness-drilldown-title" className="mt-1 text-xl font-black text-white sm:text-2xl">{detail.title}</h2>
            <p className="mt-1 text-sm text-slate-400">
              {selection.kind === "mission" || selection.kind === "supportMission" ? `สถานะภาพรวม ${readinessStatusText(missionCapability!.status)}` : `${detail.ships.length} ลำ จาก ${fleet.length} ลำ · ${percentage.toFixed(1)}%`}
              {updatedAt ? ` · ${UI.labels.lastUpdated}: ${formatDate(updatedAt)}` : ""}
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="ปิดหน้าต่าง (Close)" className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-sky-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-4 sm:p-5">
          {missionCapability && (
            <CommanderAssessment capability={missionCapability} notReady={mission!.distribution.N} />
          )}
          <InsightBar counts={summary.counts} total={fleet.length} />

          {selection.kind === "mission" && (
            <section className="mt-4 rounded-xl border border-sky-800/50 bg-slate-950/40 p-4">
              <p className="text-sm font-bold text-white">ระบบที่ภารกิจต้องใช้ (Required Systems)</p>
              <p className="mt-2 text-sm text-slate-300">{REQUIRED_SYSTEMS[selection.missionId].map((key) => SYSTEM_LABELS[key]).join(" · ")}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["Y", "Q", "N", "U"] as ReadinessStatus[]).map((status) => (
                  <div key={status} className={`rounded-lg border bg-slate-950/60 p-3 ${tone[status]}`}>
                    <p className="text-xs">{readinessStatusText(status)}</p>
                    <p className="mt-1 text-2xl font-black">{mission!.distribution[status]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {selection.kind === "supportMission" && (
            <section className="mt-4 rounded-xl border border-sky-800/50 bg-slate-950/40 p-4">
              <p className="text-sm font-bold text-white">กฎการรวมผลภารกิจ</p>
              <p className="mt-2 text-sm text-slate-300">ใช้ Fleet Capability และ Mission Aggregation เดียวกับ 3 ภารกิจเดิม โดยไม่เพิ่มหรือเปลี่ยนกฎประเมินรายลำ</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["Y", "Q", "N", "U"] as ReadinessStatus[]).map((status) => (
                  <div key={status} className={`rounded-lg border bg-slate-950/60 p-3 ${tone[status]}`}>
                    <p className="text-xs">{readinessStatusText(status)}</p>
                    <p className="mt-1 text-2xl font-black">{summary.counts[status]}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {detail.ships.length === 0 ? (
            <div className="mt-5 rounded-xl border border-sky-800/50 bg-sky-950/30 p-8 text-center text-sky-200">
              {selection.kind === "status" && selection.status === "U" ? "ไม่มีเรือรอการประเมิน" : "ไม่พบเรือในกลุ่มนี้"}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {detail.ships.map((ship) => (
                <ShipRow key={ship.id} ship={ship} selection={selection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommanderAssessment({ capability, notReady }: { capability: MissionCapability; notReady: number }) {
  return (
    <section className="mb-4 rounded-xl border border-emerald-500/35 bg-emerald-500/5 p-4" aria-label="การประเมินสำหรับผู้บังคับบัญชา (Commander Assessment)">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">การประเมินสำหรับผู้บังคับบัญชา (Commander Assessment)</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <AssessmentMetric label="Mission Capability" value={capability.level} />
        <AssessmentMetric label="Deployable Fleet" value={`${capability.deployable} Ships`} detail={`${capability.readyPercent.toFixed(1)}%`} />
        <AssessmentMetric label="Recommendation" value={capability.recommendation} detail={notReady > 0 ? `ควรเร่งแก้ไขเรือไม่พร้อม ${notReady} ลำ` : undefined} compact />
      </div>
    </section>
  );
}

function AssessmentMetric({ label, value, detail, compact = false }: { label: string; value: string; detail?: string; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-950/45 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 font-black text-white ${compact ? "text-sm leading-5" : "text-xl"}`}>{value}</p>
      {detail && <p className="mt-1 text-xs text-amber-200">{detail}</p>}
    </div>
  );
}

function InsightBar({ counts, total }: { counts: Record<ReadinessStatus, number>; total: number }) {
  return (
    <section className="rounded-xl border border-sky-700/50 bg-sky-950/30 p-4" aria-label="ข้อมูลประกอบสำหรับผู้บังคับบัญชา (Commander Insight)">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["Y", "Q", "N", "U"] as ReadinessStatus[]).map((status) => (
          <div key={status} className="rounded-lg bg-slate-950/45 px-3 py-2">
            <p className="text-xs text-slate-400">{readinessStatusText(status)}</p>
            <p className={`mt-1 font-black ${tone[status].split(" ").at(-1)}`}>{counts[status]} · {total ? ((counts[status] / total) * 100).toFixed(1) : "0.0"}%</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-sky-100">{insightText(counts, total)}</p>
    </section>
  );
}

function ShipRow({ ship, selection }: { ship: Ship; selection: DrilldownSelection }) {
  const overall = evaluateShip(ship);
  const missionId = selection.kind === "mission" ? selection.missionId : undefined;
  const missionResult = missionId ? evaluateMission(ship, missionId) : null;
  const reasons = shipReasons(ship, missionId);
  const systems = affectedSystems(ship, missionId);
  const limitation = missionLimitation(ship);
  const majorDeficiency = meaningfulDetail(ship.currentReadiness.majorDeficiencies);
  const missing = pendingFields(ship);

  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-950/45 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-white">{ship.hullNumber}{ship.shipName ? ` · ${ship.shipName}` : ""}</h3>
            <span className={`rounded-md border px-2 py-1 text-xs font-bold ${tone[missionResult?.status ?? overall.status]}`}>{readinessStatusText(missionResult?.status ?? overall.status)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">{UI.labels.currentCrew}: {ship.currentReadiness.crew ?? "—"}/{ship.authorizedCrew} · {UI.labels.lastUpdated}: {formatDate(ship.currentReadiness.updatedAt)}</p>
        </div>
        <Link to={`/ship/${ship.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">
          {UI.actions.openShipDetail} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <DetailBlock title="เหตุผลหลัก (Primary Reasons)" values={reasons} />
        {selection.kind === "deficiency" ? (
          <DetailBlock title="ค่าที่ทำให้ถูกนับ (Trigger Value)" values={[
            deficiencyValue(ship, selection.key),
            `ระดับความรุนแรง: ${deficiencySeverity(ship, selection.key)}`,
            `ผลต่อภารกิจ: ${impactedMissions(ship).join(", ") || "ไม่กระทบภารกิจตาม Rule ปัจจุบัน"}`,
          ]} />
        ) : (
          <DetailBlock title="ระบบที่มีข้อจำกัด (Limited Systems)" values={systems.length ? systems.map((item) => `${item.label}: ${equipmentStatusText(item.status)}`) : ["ระบบที่จำเป็นพร้อมใช้งาน"]} />
        )}
        {(limitation || majorDeficiency) && (
          <DetailBlock title="ข้อจำกัดและข้อขัดข้อง (Limitations & Deficiencies)" values={[
            limitation ? `${UI.sections.missionLimitations}: ${limitation}` : "",
            majorDeficiency ? `${UI.sections.majorDeficiencies}: ${majorDeficiency}` : "",
          ].filter(Boolean)} />
        )}
        {(overall.status === "U" || missionResult?.status === "U") && <DetailBlock title={UI.labels.pendingItems} values={missionResult?.missing.length ? missionResult.missing : missing} />}
      </div>
    </article>
  );
}

function DetailBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-sky-400">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        {values.map((value) => <li key={value}>• {value}</li>)}
      </ul>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}
