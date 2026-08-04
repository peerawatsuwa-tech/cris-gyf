import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Radio, ShipWheel, Users } from "lucide-react";

import ReadinessDrilldownModal, { type DrilldownSelection } from "@/components/dashboard/ReadinessDrilldownModal";
import DeploymentDrilldownModal, { type DeploymentSelection } from "@/components/dashboard/DeploymentDrilldownModal";
import { MainLayout } from "@/components/layout/MainLayout";
import { useFleet } from "@/context/FleetContext";
import { readinessStatusText, UI } from "@/constants/uiText";
import { ASSIGNMENT_GROUPS, assignmentGroupLabel } from "@/constants/assignments";
import { aggregateMissionCapability } from "@/lib/missionAggregation";
import { summarizeFleet, type ReadinessStatus } from "@/lib/readinessV027";

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
    const current = fleet.map((ship) => ship.currentReadiness);
    return {
      ...summary,
      missions: summary.missions.map((mission) => {
        const capability = aggregateMissionCapability(mission.distribution);
        return { ...mission, status: capability.status, capability };
      }),
      deficiencies: [
        {
          key: "crew" as const,
          label: "กำลังพล",
          value: fleet.filter(
            (ship) =>
              ship.currentReadiness.crew !== null &&
              ship.currentReadiness.crew / ship.authorizedCrew < 0.9,
          ).length,
          unknown: current.filter((item) => item.crew === null).length,
          detail: "ลำต่ำกว่า 90%",
          icon: Users,
        },
        {
          key: "rhib" as const,
          label: "RHIB",
          value: current.filter(
            (item) => item.rhib === "Limited" || item.rhib === "Not Ready",
          ).length,
          unknown: current.filter((item) => item.rhib === null).length,
          detail: "ลำมีข้อจำกัด",
          icon: ShipWheel,
        },
        {
          key: "radar" as const,
          label: UI.equipment.radar,
          value: current.filter(
            (item) => item.radar === "Limited" || item.radar === "Not Ready",
          ).length,
          unknown: current.filter((item) => item.radar === null).length,
          detail: "ลำมีข้อจำกัด",
          icon: Radio,
        },
        {
          key: "critical" as const,
          label: "อุปกรณ์สำคัญ",
          value: current.filter((item) =>
            [
              item.propulsion,
              item.radar,
              item.communication,
              item.navigation,
              item.weapon,
              item.rhib,
              item.eoir,
            ].some((status) => status === "Not Ready"),
          ).length,
          unknown: current.filter((item) =>
            [
              item.propulsion,
              item.radar,
              item.communication,
              item.navigation,
              item.weapon,
              item.rhib,
              item.eoir,
            ].some((status) => status === null),
          ).length,
          detail: "ลำมีระบบไม่พร้อม",
          icon: AlertTriangle,
        },
      ],
    };
  }, [fleet]);

  const deployment = useMemo(() => {
    const counts = Object.fromEntries(ASSIGNMENT_GROUPS.map((group) => [group, fleet.filter((ship) => ship.currentReadiness.assignmentGroup === group).length])) as Record<(typeof ASSIGNMENT_GROUPS)[number], number>;
    const unspecified = fleet.filter((ship) => !ship.currentReadiness.assignmentGroup).length;
    const operatingAreas = counts["ทรภ.1"] + counts["ทรภ.2"] + counts["ทรภ.3"];
    return {
      counts,
      unspecified,
      summary: `เรือพร้อมที่ตั้งปกติ ${counts["พร้อมที่ตั้งปกติ"]} ลำ ปฏิบัติราชการในพื้นที่ ทรภ.1–3 รวม ${operatingAreas} ลำ และอยู่ระหว่างซ่อมทำ ${counts["ซ่อมทำ"]} ลำ${unspecified > 0 ? ` · ยังมีเรือ ${unspecified} ลำที่ยังไม่ระบุสถานะการปฏิบัติราชการ` : ""}`,
    };
  }, [fleet]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-400">
            CRIS v0.28 · {UI.labels.cloudDataset}
          </p>
          <h1 className="mt-1 text-3xl font-black text-white">{UI.pages.dashboard}</h1>
        </section>

        <section className="rounded-2xl border border-sky-700/40 bg-sky-950/25 p-5">
          <SectionTitle title={UI.sections.commanderSummary} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CommanderMetric label={UI.labels.allShips} value={fleet.length} />
            <CommanderMetric
              label={UI.labels.assessed}
              value={dashboard.counts.Y + dashboard.counts.Q + dashboard.counts.N}
            />
            <CommanderMetric label={UI.status.U} value={dashboard.counts.U} tone="text-sky-200" />
            <CommanderMetric label={UI.status.N} value={dashboard.counts.N} tone="text-rose-300" />
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
          <div className="mt-3 grid auto-rows-fr gap-3 lg:grid-cols-3">
            {dashboard.missions.map((mission) => (
              <button
                key={mission.id}
                type="button"
                onClick={(event) => openDrilldown({ kind: "mission", missionId: mission.id }, event.currentTarget)}
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
          <SectionTitle title={UI.sections.majorDeficiencies} />
          <div className="mt-3 grid auto-rows-fr grid-cols-2 gap-3 xl:grid-cols-4">
            {dashboard.deficiencies.map(({ key, label, value, unknown, detail, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={(event) => openDrilldown({ kind: "deficiency", key, title: label }, event.currentTarget)}
                aria-label={`เปิดรายละเอียด ${label} ${value} ลำ`}
                className="h-full cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-600/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <p className="text-sm font-semibold">{label}</p>
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{detail}</p>
                <p className="mt-2 text-xs text-sky-300/70">รอการประเมิน {unknown} ลำ</p>
                <p className="mt-3 text-xs font-semibold text-sky-300/80">กดเพื่อดูรายละเอียด (View Detail)</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="การกระจายกำลังเรือ (Fleet Deployment)" />
          <p className="mt-2 rounded-xl border border-sky-800/40 bg-sky-950/20 p-3 text-sm leading-6 text-sky-100">{deployment.summary}</p>
          <div className="mt-3 grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-4">
            {[...ASSIGNMENT_GROUPS, "unspecified" as const].map((group) => {
              const value = group === "unspecified" ? deployment.unspecified : deployment.counts[group];
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
    <div className="flex min-h-24 items-end justify-between rounded-xl border border-sky-800/40 bg-slate-950/45 p-4">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
      </div>
      <span className="pb-1 text-sm text-slate-500">ลำ</span>
    </div>
  );
}

function FleetCell({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}
