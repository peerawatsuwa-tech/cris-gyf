import { useEffect, useMemo, useState } from "react";

import { AUTHORIZED_PERSONNEL, PERSONNEL_FIELDS } from "@/constants/personnelCatalog";
import { UI } from "@/constants/uiText";
import type { PersonnelBreakdown, Ship } from "@/types/ship";

interface Props {
  ship: Ship;
  onPersonnelChange?: (personnel: PersonnelBreakdown) => void;
}

const EMPTY_PERSONNEL: PersonnelBreakdown = {
  officers: null,
  seniorNcos: null,
  pettyOfficers: null,
  conscripts: null,
};

export default function PersonnelCard({ ship, onPersonnelChange }: Props) {
  const current = ship.currentReadiness.personnel ?? EMPTY_PERSONNEL;
  const [draft, setDraft] = useState<PersonnelBreakdown>(current);
  useEffect(() => setDraft(current), [current]);

  const authorized = AUTHORIZED_PERSONNEL[ship.hullNumber];
  const values = Object.values(draft);
  const complete = values.every((value) => value !== null);
  const allEmpty = values.every((value) => value === null);
  const total = complete ? values.reduce<number>((sum, value) => sum + (value ?? 0), 0) : null;
  const personnelPercent = total === null || ship.authorizedCrew <= 0
    ? null
    : (total / ship.authorizedCrew) * 100;
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(current), [current, draft]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h3 className="text-lg font-semibold text-white">{UI.sections.personnel}</h3>
      <p className="mt-1 text-xs text-slate-500">อัตรากำลังแยกประเภทอ้างอิงจาก Sheet “ด้านกำลังพล”</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {PERSONNEL_FIELDS.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="text-sm text-slate-400">{label}</span>
            <div className="mt-2 flex items-center gap-2">
              <input
                aria-label={`${label}ปัจจุบัน`}
                type="number"
                min={0}
                max={authorized?.[key]}
                value={draft[key] ?? ""}
                placeholder="รอการประเมิน"
                onChange={(event) => setDraft((previous) => ({
                  ...previous,
                  [key]: event.target.value === "" ? null : Number(event.target.value),
                }))}
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-500"
              />
              <span className="shrink-0 text-xs text-slate-500">/ {authorized?.[key] ?? "—"}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <PersonnelSummary label="กำลังพลรวม" value={total ?? ship.currentReadiness.crew ?? "—"} />
        <PersonnelSummary label="อัตรากำลังรวม" value={ship.authorizedCrew} />
        <PersonnelSummary
          label="ความพร้อม"
          value={personnelPercent === null ? "รอการประเมิน" : `${personnelPercent.toFixed(1)}%`}
        />
        <PersonnelSummary
          label="กำลังพลขาด"
          value={total === null ? "—" : Math.max(ship.authorizedCrew - total, 0)}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!dirty || (!complete && !allEmpty)}
          onClick={() => onPersonnelChange?.(draft)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          บันทึกกำลังพล
        </button>
        <button
          type="button"
          onClick={() => setDraft(EMPTY_PERSONNEL)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-sky-500"
        >
          ล้างการประเมิน
        </button>
      </div>
      {!complete && !allEmpty && <p className="mt-2 text-xs text-amber-200">กรุณากรอกกำลังพลให้ครบทั้ง 4 ประเภทก่อนบันทึก</p>}
    </div>
  );
}

function PersonnelSummary({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
