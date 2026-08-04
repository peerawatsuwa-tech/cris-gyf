import { useMemo, useState } from "react";
import { ClipboardList, ShipWheel } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import FleetSearch from "@/components/fleet/FleetSearch";
import { FleetFilter } from "@/components/fleet/FleetFilter";
import FleetShipDetailModal from "@/components/fleet/FleetShipDetailModal";
import { useAuth } from "@/context/AuthContext";
import { useFleet } from "@/context/FleetContext";
import { readinessStatusText, UI } from "@/constants/uiText";
import {
  evaluateShip,
  summarizeFleet,
  type ReadinessStatus,
} from "@/lib/readinessV027";
import type { Ship } from "@/types/ship";

const styles: Record<
  ReadinessStatus,
  { dot: string; text: string }
> = {
  Y: { dot: "bg-emerald-400", text: "text-emerald-300" },
  Q: { dot: "bg-amber-400", text: "text-amber-300" },
  N: { dot: "bg-rose-400", text: "text-rose-300" },
  U: { dot: "bg-sky-400", text: "text-sky-200" },
};

export default function FleetPage() {
  const { fleet } = useFleet();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isDemoShip = profile?.role === "ship" && !profile.shipId;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const summary = useMemo(() => summarizeFleet(fleet), [fleet]);

  const filteredFleet = fleet.filter((ship) => {
    const status = evaluateShip(ship).status;
    const term = search.toLowerCase();
    const matchSearch =
      ship.shipName.toLowerCase().includes(term) ||
      ship.hullNumber.toLowerCase().includes(term);
    const matchFilter = filter === "all" || status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
            {isDemoShip
              ? `${UI.navigation.shipEdit} · ${UI.labels.excelDataset}`
              : `${UI.sections.fleetStatus} · ${UI.labels.excelDataset}`}
          </p>
          <h1 className="text-3xl font-bold text-white">
            {isDemoShip ? UI.pages.shipSelection : UI.pages.fleet}
          </h1>
        </div>

        {!isDemoShip && <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <SummaryCard label={UI.labels.allShips} value={fleet.length} icon={<ShipWheel className="h-5 w-5" />} color="text-sky-300" />
          <SummaryCard label={UI.status.Y} value={summary.counts.Y} color="text-emerald-300" />
          <SummaryCard label={UI.status.Q} value={summary.counts.Q} color="text-amber-300" />
          <SummaryCard label={UI.status.N} value={summary.counts.N} color="text-rose-300" />
          <SummaryCard label={UI.status.U} value={summary.counts.U} color="text-sky-200" />
        </div>}

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <FleetSearch value={search} onChange={setSearch} />
          </div>
          <FleetFilter value={filter} onChange={setFilter} />
        </div>

        <p className="text-sm text-slate-400">
          แสดง {filteredFleet.length} จาก {fleet.length} ลำ · กดการ์ดเพื่อเปิดรายละเอียด
        </p>

        <div className="grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredFleet.length > 0 ? (
            filteredFleet.map((ship) => (
              <FleetStatusCard
                key={ship.id}
                ship={ship}
                onSelect={() => isDemoShip
                  ? navigate(`/ship/${encodeURIComponent(ship.id)}`)
                  : setSelectedShip(ship)}
              />
            ))
          ) : (
            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-950/70 p-10 text-center">
              <p className="text-lg text-slate-400">ไม่พบข้อมูลเรือ (No Ship Data)</p>
            </div>
          )}
        </div>
      </div>

      {!isDemoShip && selectedShip && (
        <FleetShipDetailModal
          ship={selectedShip}
          onClose={() => setSelectedShip(null)}
        />
      )}
    </MainLayout>
  );
}

function SummaryCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs">{label}</span>{icon}
      </div>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function FleetStatusCard({ ship, onSelect }: { ship: Ship; onSelect: () => void }) {
  const evaluation = evaluateShip(ship);
  const style = styles[evaluation.status];
  const missing = evaluation.missions.flatMap((mission) => mission.missing);
  const uniqueMissing = [...new Set(missing)];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="h-full w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:bg-slate-900/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`mt-2 h-3 w-3 shrink-0 rounded-full ${style.dot}`} />
          <div>
            <h2 className="text-xl font-bold text-white">{ship.hullNumber}</h2>
          </div>
        </div>
        <p className={`text-right text-sm font-bold ${style.text}`}>
          {readinessStatusText(evaluation.status)}
        </p>
      </div>
      <div className={`mt-5 flex items-center justify-between gap-3 rounded-lg border p-3 text-sm ${uniqueMissing.length ? "border-sky-700/40 bg-sky-950/30 text-sky-200" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"}`}>
        <span className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 shrink-0" />
          {uniqueMissing.length ? UI.status.U : UI.labels.assessed}
        </span>
        <strong>
        {uniqueMissing.length
          ? `${uniqueMissing.length} รายการ`
          : "0 รายการ"}
        </strong>
      </div>
    </button>
  );
}
