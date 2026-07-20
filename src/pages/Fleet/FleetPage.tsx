import { useMemo, useState } from "react";
import { AlertTriangle, Gauge, ShipWheel } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";

import FleetSearch from "@/components/fleet/FleetSearch";
import { FleetFilter } from "@/components/fleet/FleetFilter";
import FleetShipDetailModal from "@/components/fleet/FleetShipDetailModal";

import { useFleet } from "@/context/FleetContext";

import { calculateReadiness } from "@/engine/calculateReadiness";
import { calculateAlerts } from "@/engine/alertEngine";
import type { Ship } from "@/types/ship";

export default function FleetPage() {

  const { fleet } = useFleet();

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);

  const summary = useMemo(() => {
    const results = fleet.map(calculateReadiness);
    return {
      total: fleet.length,
      Y: results.filter((item) => item.readiness === "Y").length,
      Q: results.filter((item) => item.readiness === "Q").length,
      N: results.filter((item) => item.readiness === "N").length,
      average: results.length
        ? results.reduce((sum, item) => sum + item.score, 0) / results.length
        : 0,
    };
  }, [fleet]);

  const filteredFleet = fleet.filter((ship) => {

    const readiness =
      calculateReadiness(ship);

    const matchSearch =
      ship.shipName
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      ship.hullNumber
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : readiness.readiness === filter;

    return matchSearch && matchFilter;

  });

  return (

    <MainLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">Fleet Status Module · Prototype</p>
          <h1 className="text-3xl font-bold text-white">ภาพรวมสถานะกองเรือ</h1>

          <p className="text-slate-400">

            สรุปความพร้อม เลือกเรือ และตรวจรายละเอียดเพื่อการตัดสินใจ

          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <SummaryCard label="เรือทั้งหมด" value={summary.total} icon={<ShipWheel className="h-5 w-5" />} color="text-sky-300" />
          <SummaryCard label="พร้อม (Y)" value={summary.Y} color="text-emerald-300" />
          <SummaryCard label="มีข้อจำกัด (Q)" value={summary.Q} color="text-amber-300" />
          <SummaryCard label="ไม่พร้อม (N)" value={summary.N} color="text-rose-300" />
          <SummaryCard label="ความพร้อมเฉลี่ย" value={`${summary.average.toFixed(1)}%`} icon={<Gauge className="h-5 w-5" />} color="text-cyan-300" />
        </div>

        {/* Search + Filter */}

        <div className="flex flex-col gap-4 md:flex-row">

          <div className="flex-1">

            <FleetSearch
              value={search}
              onChange={setSearch}
            />

          </div>

          <FleetFilter
            value={filter}
            onChange={setFilter}
          />

        </div>

        <p className="text-sm text-slate-400">แสดง {filteredFleet.length} จาก {fleet.length} ลำ · กดการ์ดเพื่อเปิด Decision Detail</p>

        {/* Fleet Cards */}

        <div className="
grid
grid-cols-1
lg:grid-cols-2
2xl:grid-cols-3
gap-6
">

          {filteredFleet.length > 0 ? (

            filteredFleet.map((ship) => (

              <FleetStatusCard key={ship.id} ship={ship} onSelect={() => setSelectedShip(ship)} />

            ))

          ) : (

            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/70 p-10 text-center">

              <p className="text-lg text-slate-400">

                ไม่พบข้อมูลเรือ

              </p>

            </div>

          )}

        </div>

      </div>

      {selectedShip && <FleetShipDetailModal ship={selectedShip} onClose={() => setSelectedShip(null)} />}

    </MainLayout>

  );

}

function SummaryCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><div className="flex items-center justify-between text-slate-500"><span className="text-xs">{label}</span>{icon}</div><p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p></div>;
}

function FleetStatusCard({ ship, onSelect }: { ship: Ship; onSelect: () => void }) {
  const readiness = calculateReadiness(ship);
  const alerts = calculateAlerts(ship);
  const primaryAlert = alerts[0]?.message ?? "No critical limitation";
  const styles = {
    Y: { dot: "bg-emerald-400", text: "text-emerald-300", label: "พร้อม" },
    Q: { dot: "bg-amber-400", text: "text-amber-300", label: "มีข้อจำกัด" },
    N: { dot: "bg-rose-400", text: "text-rose-300", label: "ไม่พร้อม" },
  }[readiness.readiness];

  return (
    <button type="button" onClick={onSelect} className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:bg-slate-900/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3"><span className={`mt-2 h-3 w-3 shrink-0 rounded-full ${styles.dot}`} /><div><h2 className="text-xl font-bold text-white">{ship.hullNumber}</h2><p className="text-sm text-slate-400">{ship.shipName}</p></div></div>
        <div className="text-right"><p className={`text-sm font-bold ${styles.text}`}>{styles.label} ({readiness.readiness})</p><p className="text-2xl font-bold text-sky-300">{readiness.score}%</p></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-slate-500">หน่วย</p><p className="text-slate-200">{ship.squadron}</p></div><div><p className="text-slate-500">กำลังพล</p><p className="text-slate-200">{ship.crew}/{ship.authorizedCrew}</p></div></div>
      <div className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${alerts.length ? "border-rose-500/20 bg-rose-500/5 text-rose-200" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"}`}><AlertTriangle className="h-4 w-4 shrink-0" />{primaryAlert}</div>
    </button>
  );
}
