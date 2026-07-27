import { useMemo } from "react";
import { AlertTriangle, Radio, ShipWheel, Users } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { useFleet } from "@/context/FleetContext";
import { summarizeFleet, type ReadinessStatus } from "@/lib/readinessV027";

const statusText: Record<ReadinessStatus, string> = {
  Y: "พร้อม",
  Q: "จำกัด",
  N: "ไม่พร้อม",
  U: "รอการประเมิน",
};

const statusTone: Record<ReadinessStatus, string> = {
  Y: "text-emerald-300 border-emerald-500/30 bg-emerald-500/5",
  Q: "text-amber-300 border-amber-500/30 bg-amber-500/5",
  N: "text-rose-300 border-rose-500/30 bg-rose-500/5",
  U: "text-sky-200 border-sky-700/50 bg-sky-950/35",
};

export default function DashboardPage() {
  const { fleet } = useFleet();

  const dashboard = useMemo(() => {
    const summary = summarizeFleet(fleet);
    const current = fleet.map((ship) => ship.currentReadiness);
    return {
      ...summary,
      deficiencies: [
        {
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
          label: "RHIB",
          value: current.filter(
            (item) => item.rhib === "Limited" || item.rhib === "Not Ready",
          ).length,
          unknown: current.filter((item) => item.rhib === null).length,
          detail: "ลำมีข้อจำกัด",
          icon: ShipWheel,
        },
        {
          label: "Radar",
          value: current.filter(
            (item) => item.radar === "Limited" || item.radar === "Not Ready",
          ).length,
          unknown: current.filter((item) => item.radar === null).length,
          detail: "ลำมีข้อจำกัด",
          icon: Radio,
        },
        {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-400">
            CRIS v0.27 · Excel Dataset
          </p>
          <h1 className="mt-1 text-3xl font-black text-white">ภาพรวมความพร้อมกองเรือ</h1>
        </section>

        <section className="rounded-2xl border border-sky-700/40 bg-sky-950/25 p-5">
          <SectionTitle title="Commander Summary" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CommanderMetric label="เรือทั้งหมด" value={fleet.length} />
            <CommanderMetric
              label="ประเมินแล้ว"
              value={dashboard.counts.Y + dashboard.counts.Q + dashboard.counts.N}
            />
            <CommanderMetric label="รอการประเมิน" value={dashboard.counts.U} tone="text-sky-200" />
            <CommanderMetric label="ไม่พร้อม" value={dashboard.counts.N} tone="text-rose-300" />
          </div>
        </section>

        <section>
          <SectionTitle title="Fleet Readiness" />
          <div className="mt-3 grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(["Y", "Q", "N", "U"] as ReadinessStatus[]).map((status) => (
              <div key={status} className={`h-full rounded-2xl border p-5 ${statusTone[status]}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{statusText[status]}</p>
                  <span className="rounded-lg border border-current/25 px-2 py-1 text-xs font-black">
                    {status === "U" ? "—" : status}
                  </span>
                </div>
                <p className="mt-3 text-4xl font-black">{dashboard.counts[status]}</p>
                <p className="mt-1 text-xs text-slate-500">ลำ</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Mission Readiness" />
          <div className="mt-3 grid auto-rows-fr gap-3 lg:grid-cols-3">
            {dashboard.missions.map((mission) => (
              <div key={mission.id} className={`h-full rounded-2xl border p-5 ${statusTone[mission.status]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-sky-400">{mission.id}</p>
                    <h2 className="mt-2 text-lg font-bold text-white">{mission.name}</h2>
                  </div>
                  <span className="text-lg font-black">
                    {mission.status === "U" ? "รอการประเมิน" : mission.status}
                  </span>
                </div>
                <p className="mt-5 text-xs text-slate-400">
                  Y {mission.distribution.Y} · Q {mission.distribution.Q} · N {mission.distribution.N} · รอ {mission.distribution.U}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Major Deficiencies" />
          <div className="mt-3 grid auto-rows-fr grid-cols-2 gap-3 xl:grid-cols-4">
            {dashboard.deficiencies.map(({ label, value, unknown, detail, icon: Icon }) => (
              <div key={label} className="h-full rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between text-slate-500">
                  <p className="text-sm font-semibold">{label}</p>
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <p className="mt-3 text-3xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{detail}</p>
                <p className="mt-2 text-xs text-sky-300/70">รอการประเมิน {unknown} ลำ</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="Fleet Status" />
          <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-5">
            <FleetCell label="จำนวนเรือ" value={fleet.length} tone="text-sky-300" />
            <FleetCell label="พร้อม" value={dashboard.counts.Y} tone="text-emerald-300" />
            <FleetCell label="จำกัด" value={dashboard.counts.Q} tone="text-amber-300" />
            <FleetCell label="ไม่พร้อม" value={dashboard.counts.N} tone="text-rose-300" />
            <FleetCell label="รอการประเมิน" value={dashboard.counts.U} tone="text-sky-200" />
          </div>
        </section>
      </div>
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
