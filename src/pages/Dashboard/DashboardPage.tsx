import { useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import ReadinessDrilldownModal, { type DrilldownSelection } from "@/components/dashboard/ReadinessDrilldownModal";
import DeploymentDrilldownModal, { type DeploymentSelection } from "@/components/dashboard/DeploymentDrilldownModal";
import { MainLayout } from "@/components/layout/MainLayout";
import { useFleet } from "@/context/FleetContext";
import { readinessStatusText, UI } from "@/constants/uiText";
import { ASSIGNMENT_GROUPS, assignmentGroupLabel } from "@/constants/assignments";
import { aggregateMissionCapability } from "@/lib/missionAggregation";
import { summarizeFleet, type ReadinessStatus } from "@/lib/readinessV027";
import {
  EQUIPMENT_SYSTEMS,
  systemEquipmentStatuses,
} from "@/constants/equipmentCatalog";
import { AUTHORIZED_PERSONNEL, PERSONNEL_FIELDS } from "@/constants/personnelCatalog";
import { meaningfulDetail } from "@/lib/readinessDetailPresenter";
import { evaluateShip } from "@/lib/readinessV027";

const statusTone: Record<ReadinessStatus, string> = {
  Y: "text-emerald-300 border-emerald-500/30 bg-emerald-500/5",
  Q: "text-amber-300 border-amber-500/30 bg-amber-500/5",
  N: "text-rose-300 border-rose-500/30 bg-rose-500/5",
  U: "text-sky-200 border-sky-700/50 bg-sky-950/35",
};

export default function DashboardPage() {
  const { fleet } = useFleet();
  const [selection, setSelection] = useState<DrilldownSelection | null>(null);
  const [deploymentSelection, setDeploymentSelection] = useState<DeploymentSelection | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function openDrilldown(next: DrilldownSelection, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelection(next);
  }

  function closeDrilldown() {
    setSelection(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function closeDeployment() {
    setDeploymentSelection(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  const dashboard = useMemo(() => {
    const summary = summarizeFleet(fleet);
    const missions = [
      ...summary.missions,
      {
        id: "M5" as const,
        name: "สนับสนุนภารกิจอื่น ๆ (Other Mission Support)",
        distribution: summary.counts,
      },
    ];
    return {
      ...summary,
      missions: missions.map((mission) => {
        const capability = aggregateMissionCapability(mission.distribution);
        return { ...mission, status: capability.status, capability };
      }),
      equipment: EQUIPMENT_SYSTEMS.map((system) => {
        const counts = { Y: 0, Q: 0, N: 0, U: 0 };
        fleet.forEach((ship) => {
          const statuses = systemEquipmentStatuses(ship.currentReadiness.equipmentDetails, system.id);
          const assessed = statuses.filter((status) => status !== null);
          if (statuses.includes("Not Ready")) counts.N += 1;
          else if (statuses.includes("Limited")) counts.Q += 1;
          else if (assessed.length === system.items.length) counts.Y += 1;
          else counts.U += 1;
        });
        return { key: `detail:${system.id}` as const, label: system.label, counts };
      }),
      personnel: PERSONNEL_FIELDS.map(({ key, label }) => {
        let shortage = 0;
        let assessedShips = 0;
        fleet.forEach((ship) => {
          const required = AUTHORIZED_PERSONNEL[ship.hullNumber]?.[key];
          const current = ship.currentReadiness.personnel?.[key];
          if (required !== undefined && current !== null && current !== undefined) {
            assessedShips += 1;
            shortage += Math.max(required - current, 0);
          }
        });
        return { key, label, shortage, assessedShips };
      }),
      risks: fleet
        .map((ship) => ({
          ship,
          status: evaluateShip(ship).status,
          deficiency: meaningfulDetail(ship.currentReadiness.majorDeficiencies),
          updatedAt: ship.currentReadiness.updatedAt,
        }))
        .filter((risk) => risk.status === "N" || risk.status === "Q" || risk.deficiency)
        .sort((left, right) => {
          const rank = { N: 0, Q: 1, Y: 2, U: 3 };
          return rank[left.status] - rank[right.status]
            || Number(Boolean(right.deficiency)) - Number(Boolean(left.deficiency))
            || new Date(left.updatedAt ?? 0).getTime() - new Date(right.updatedAt ?? 0).getTime();
        })
        .slice(0, 10),
    };
  }, [fleet]);

  const deployment = useMemo(() => {
    const counts = Object.fromEntries(ASSIGNMENT_GROUPS.map((group) => [group, fleet.filter((ship) => ship.currentReadiness.assignmentGroup === group).length])) as Record<(typeof ASSIGNMENT_GROUPS)[number], number>;
    const operatingAreas = counts["ทรภ.1"] + counts["ทรภ.2"] + counts["ทรภ.3"] + counts["มรภ.ฐท.สส."];
    const operationalPercent = fleet.length ? (operatingAreas / fleet.length) * 100 : 0;
    const readyPercent = fleet.length ? (dashboard.counts.Y / fleet.length) * 100 : 0;
    return {
      counts,
      operatingAreas,
      operationalPercent,
      readyPercent,
    };
  }, [dashboard.counts.Y, fleet]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-400">
            CRIS v0.28 · {UI.labels.cloudDataset}
          </p>
          <h1 className="mt-1 text-3xl font-black text-white">{UI.pages.dashboard}</h1>
        </section>

        <section className="rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/55 to-slate-950/80 p-5">
          <SectionTitle title="สถานการณ์กองเรือวันนี้ (Fleet Today)" />
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            <CommanderMetric label={UI.labels.allShips} value={fleet.length} />
            <CommanderMetric label={UI.status.Y} value={dashboard.counts.Y} tone="text-emerald-300" />
            <CommanderMetric label={UI.status.Q} value={dashboard.counts.Q} tone="text-amber-300" />
            <CommanderMetric label={UI.status.N} value={dashboard.counts.N} tone="text-rose-300" />
            <CommanderMetric label="ออกปฏิบัติราชการ" value={deployment.operatingAreas} tone="text-sky-200" />
            <CommanderMetric label="ซ่อมทำ" value={deployment.counts["ซ่อมทำ"]} tone="text-amber-200" />
            <CommanderMetric label="พร้อมที่ตั้ง" value={deployment.counts["พร้อมที่ตั้งปกติ"]} />
          </div>
        </section>

        <section>
          <SectionTitle title={UI.sections.fleetReadiness} />
          <div className="mt-3 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(["Y", "Q", "N", "U"] as ReadinessStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={(event) => openDrilldown({ kind: "status", status }, event.currentTarget)}
                aria-label={`เปิดรายละเอียด ${readinessStatusText(status)} ${dashboard.counts[status]} ลำ`}
                className={`h-full cursor-pointer rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${statusTone[status]}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{readinessStatusText(status)}</p>
                  <span className="rounded-lg border border-current/25 px-2 py-1 text-xs font-black">
                    {status === "U" ? "—" : status}
                  </span>
                </div>
                <p className="mt-3 text-4xl font-black">{dashboard.counts[status]}</p>
                <p className="mt-1 text-xs text-slate-500">ลำ</p>
                <p className="mt-3 text-xs font-semibold text-sky-300/80">กดเพื่อดูรายละเอียด (View Detail)</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={UI.sections.missionReadiness} />
          <div className="mt-3 grid auto-rows-fr gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dashboard.missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={(event) => openDrilldown(
                  mission.id === "M5"
                    ? { kind: "supportMission" }
                    : { kind: "mission", missionId: mission.id },
                  event.currentTarget,
                )}
                aria-label={`เปิดรายละเอียดภารกิจ ${mission.name}`}
                className={`h-full cursor-pointer rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${statusTone[mission.status]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-sky-400">{mission.id}</p>
                    <h2 className="mt-2 text-lg font-bold text-white">{mission.name}</h2>
                  </div>
                  <span className="text-lg font-black">
                    {readinessStatusText(mission.status)}
                  </span>
                </div>
                <p className="mt-5 text-xs text-slate-400">
                  Y {mission.distribution.Y} · Q {mission.distribution.Q} · N {mission.distribution.N} · รอ {mission.distribution.U}
                </p>
                <div className="mt-3 rounded-lg border border-current/20 bg-slate-950/35 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Deployable Fleet</p>
                  <div className="mt-1 flex items-baseline justify-between gap-2">
                    <p className="text-xl font-black text-white">{mission.capability.deployable} Ships</p>
                    <p className="text-lg font-black">{mission.capability.readyPercent.toFixed(1)}%</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{mission.capability.recommendation}</p>
                  <p className="text-xs text-slate-500">พร้อมปฏิบัติ {mission.capability.deployable} จาก {mission.capability.assessed} ลำ</p>
                </div>
                <p className="mt-3 text-xs font-semibold text-sky-300/80">กดเพื่อดูรายละเอียด (View Detail)</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="สรุปความพร้อมอุปกรณ์ (Equipment Readiness Summary)" />
          <p className="mt-1 text-xs text-slate-500">คำนวณจาก Equipment Assessment โดยตรง ไม่ใช้ข้อความ Major Deficiency</p>
          <div className="mt-3 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dashboard.equipment.map(({ key, label, counts }) => (
              <button
                key={label}
                type="button"
                onClick={(event) => openDrilldown({ kind: "deficiency", key, title: label }, event.currentTarget)}
                aria-label={`เปิดรายละเอียด ${label} Y ${counts.Y} Q ${counts.Q} N ${counts.N} รอ ${counts.U} ลำ`}
                className="h-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-600/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <p className="text-sm font-semibold">{label}</p>
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  <EquipmentCount label="Y" value={counts.Y} tone="text-emerald-300" />
                  <EquipmentCount label="Q" value={counts.Q} tone="text-amber-300" />
                  <EquipmentCount label="N" value={counts.N} tone="text-rose-300" />
                  <EquipmentCount label="รอ" value={counts.U} tone="text-sky-200" />
                </div>
                <p className="mt-3 text-xs font-semibold text-sky-300/80">กดเพื่อดูรายละเอียด (View Detail)</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="ภาพสถานการณ์กองเรือ (Fleet Situation)" />
          <div className="mt-3 grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-4">
            {ASSIGNMENT_GROUPS.map((group) => {
              const value = deployment.counts[group];
              return (
                <button
                  key={group}
                  type="button"
                  onClick={(event) => { triggerRef.current = event.currentTarget; setDeploymentSelection(group); }}
                  aria-label={`เปิดการกระจายกำลัง ${assignmentGroupLabel(group)} ${value} ลำ`}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  <p className="text-sm text-slate-400">{assignmentGroupLabel(group)}</p>
                  <p className="mt-2 text-3xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-500">ลำ · กดเพื่อดูรายละเอียด</p>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <OperationalInsight label="วันนี้มีเรือออกปฏิบัติราชการ" value={deployment.operatingAreas} percent={deployment.operationalPercent} />
            <OperationalInsight label="พร้อมปฏิบัติทันที" value={dashboard.counts.Y} percent={deployment.readyPercent} />
          </div>
        </section>

        <section>
          <SectionTitle title="สรุปความพร้อมกำลังพล (Personnel Summary)" />
          <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {dashboard.personnel.map((item) => (
              <div key={item.key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-amber-200">
                  {item.assessedShips ? `ขาด ${item.shortage}` : "รอการประเมิน"}
                </p>
                <p className="mt-1 text-xs text-sky-300/70">ประเมินแล้ว {item.assessedShips}/{fleet.length} ลำ</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="ความเสี่ยงทางปฏิบัติการสูงสุด (Top Operational Risk)" />
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
            {dashboard.risks.length ? dashboard.risks.map(({ ship, status, deficiency, updatedAt }, index) => (
              <Link key={ship.id} to={`/ship/${ship.id}`} className="flex items-center gap-3 border-b border-slate-800 p-4 transition last:border-0 hover:bg-sky-950/30">
                <span className="w-6 text-center text-xs font-black text-slate-500">{index + 1}</span>
                <ShieldAlert className={`h-5 w-5 shrink-0 ${status === "N" ? "text-rose-300" : "text-amber-300"}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{ship.hullNumber} · {readinessStatusText(status)}</p>
                  <p className="truncate text-xs text-slate-400">{deficiency ?? "ไม่พบข้อความ Major Deficiency"} · {formatTimestamp(updatedAt)}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-sky-300" />
              </Link>
            )) : <p className="p-8 text-center text-emerald-300">ไม่พบความเสี่ยงที่ต้องเร่งดำเนินการ</p>}
          </div>
        </section>

        <section>
          <SectionTitle title={UI.sections.fleetStatus} />
          <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-5">
            <FleetCell label={UI.labels.allShips} value={fleet.length} tone="text-sky-300" />
            <FleetCell label={UI.status.Y} value={dashboard.counts.Y} tone="text-emerald-300" />
            <FleetCell label={UI.status.Q} value={dashboard.counts.Q} tone="text-amber-300" />
            <FleetCell label={UI.status.N} value={dashboard.counts.N} tone="text-rose-300" />
            <FleetCell label={UI.status.U} value={dashboard.counts.U} tone="text-sky-200" />
          </div>
        </section>
      </div>
      {selection && <ReadinessDrilldownModal fleet={fleet} selection={selection} onClose={closeDrilldown} />}
      {deploymentSelection && <DeploymentDrilldownModal ships={fleet} selection={deploymentSelection} onClose={closeDeployment} />}
    </MainLayout>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-black text-white">{title}</h2>
  );
}

function CommanderMetric({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="flex min-h-24 min-w-0 items-end justify-between rounded-xl border border-sky-800/40 bg-slate-950/45 p-4">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
      </div>
      <span className="pb-1 text-sm text-slate-500">ลำ</span>
    </div>
  );
}

function EquipmentCount({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-lg bg-slate-900/80 p-2"><p className={`text-xs font-bold ${tone}`}>{label}</p><p className={`text-xl font-black ${tone}`}>{value}</p></div>;
}

function OperationalInsight({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div className="rounded-xl border border-sky-800/40 bg-sky-950/20 p-4">
      <p className="text-sm text-sky-100">{label}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-3xl font-black text-white">{value} ลำ</p>
        <p className="text-xl font-black text-sky-300">{percent.toFixed(1)}%</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">ของกองเรือทั้งหมด</p>
    </div>
  );
}

function formatTimestamp(value: string | null) {
  if (!value) return "ยังไม่มีเวลาบันทึก";
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? value
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(timestamp);
}

function FleetCell({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
