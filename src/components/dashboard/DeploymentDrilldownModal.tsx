import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import { assignmentGroupLabel, assignmentLabel, type AssignmentGroup } from "@/constants/assignments";
import { readinessStatusText, UI } from "@/constants/uiText";
import { meaningfulDetail } from "@/lib/readinessDetailPresenter";
import { evaluateShip } from "@/lib/readinessV027";
import type { Ship } from "@/types/ship";

export type DeploymentSelection = AssignmentGroup | "unspecified";

export default function DeploymentDrilldownModal({ ships, selection, onClose }: { ships: Ship[]; selection: DeploymentSelection; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const selected = ships.filter((ship) => selection === "unspecified"
    ? !ship.currentReadiness.assignmentGroup
    : ship.currentReadiness.assignmentGroup === selection);
  const grouped = selected.reduce<Record<string, Ship[]>>((groups, ship) => {
    const location = ship.currentReadiness.assignmentLocation ?? "ยังไม่ระบุ (Not Specified)";
    groups[location] = [...(groups[location] ?? []), ship];
    return groups;
  }, {});

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = overflow; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="deployment-modal-title" onKeyDown={(event) => event.key === "Escape" && onClose()} className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-sky-500/30 bg-[#07152a] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-700/70 p-4 sm:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">การกระจายกำลังเรือ (Fleet Deployment)</p>
            <h2 id="deployment-modal-title" className="mt-1 text-2xl font-black text-white">{assignmentGroupLabel(selection)} — {selected.length} ลำ</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="ปิดหน้าต่าง (Close)" className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-sky-400 hover:text-white"><X className="h-5 w-5" /></button>
        </header>
        <div className="overflow-y-auto p-4 sm:p-5">
          {selected.length === 0 ? <p className="rounded-xl border border-sky-800/50 p-8 text-center text-sky-200">ไม่มีเรือในกลุ่มนี้</p> : Object.entries(grouped).map(([location, locationShips]) => (
            <section key={location} className="mb-5">
              <h3 className="mb-3 text-lg font-bold text-sky-200">{location}</h3>
              <div className="space-y-3">
                {locationShips.map((ship) => {
                  const readiness = evaluateShip(ship).status;
                  const deficiency = meaningfulDetail(ship.currentReadiness.majorDeficiencies);
                  return (
                    <article key={ship.id} className="rounded-xl border border-slate-700/70 bg-slate-950/45 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="font-black text-white">{ship.hullNumber} · {readinessStatusText(readiness)}</h4>
                          <p className="mt-1 text-sm text-slate-400">{assignmentLabel(ship.currentReadiness.assignmentGroup ?? null, ship.currentReadiness.assignmentLocation ?? null)}</p>
                          <p className="mt-1 text-xs text-slate-500">กำลังพล {ship.currentReadiness.crew ?? "—"}/{ship.authorizedCrew} · {UI.labels.lastUpdated}: {formatTimestamp(ship.currentReadiness.updatedAt)}</p>
                          {deficiency && <p className="mt-1 text-xs text-amber-200">{UI.sections.majorDeficiencies}: {deficiency}</p>}
                        </div>
                        <Link to={`/ship/${ship.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-500">{UI.actions.openShipDetail}<ArrowRight className="h-4 w-4" /></Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatTimestamp(value: string | null) {
  if (!value) return "—";
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime())
    ? value
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(timestamp);
}
