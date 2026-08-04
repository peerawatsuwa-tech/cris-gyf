import type { Ship } from "@/types/ship";
import { UI } from "@/constants/uiText";

interface Props {
  ship: Ship;
  onCrewChange?: (crew: number | null) => void;
}

export default function PersonnelCard({ ship, onCrewChange }: Props) {
  const crew = ship.currentReadiness.crew;
  const personnelPercent =
    crew === null || ship.authorizedCrew <= 0
      ? null
      : (crew / ship.authorizedCrew) * 100;
  const missing =
    crew === null ? null : Math.max(ship.authorizedCrew - crew, 0);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h3 className="text-lg font-semibold text-white">{UI.sections.personnel}</h3>

      <div className="mt-5">
        <label className="text-sm text-slate-400">{UI.labels.currentCrew}</label>
        <input
          aria-label={UI.labels.currentCrew}
          type="number"
          min={0}
          max={ship.authorizedCrew}
          value={crew ?? ""}
          placeholder={UI.status.U}
          onChange={(event) => {
            const value = event.target.value;
            onCrewChange?.(value === "" ? null : Number(value));
          }}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-500"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-400">อัตรากำลังตาม Excel</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {crew ?? "—"} / {ship.authorizedCrew}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-400">ความพร้อมด้านกำลังพล</p>
        <p className="mt-1 text-2xl font-bold text-sky-400">
          {personnelPercent === null
            ? "รอการประเมิน"
            : `${personnelPercent.toFixed(1)}%`}
        </p>
        <div className="mt-3 h-2 rounded-full bg-slate-700">
          <div
            className="h-2 rounded-full bg-sky-500"
            style={{ width: `${Math.min(100, personnelPercent ?? 0)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <span className="text-slate-400">กำลังพลขาด</span>
        <span className="font-semibold text-red-400">{missing ?? "—"}</span>
      </div>
    </div>
  );
}
