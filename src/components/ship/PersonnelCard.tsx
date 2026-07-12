import { useEffect, useState } from "react";

import type { Ship } from "@/types/ship";

import { calculateReadiness } from "@/engine/calculateReadiness";

interface Props {
  ship: Ship;
  onCrewChange?: (crew: number) => void;
}

export default function PersonnelCard({
  ship,
  onCrewChange,
}: Props) {

  const [crew, setCrew] = useState(ship.crew);

  useEffect(() => {
    setCrew(ship.crew);
  }, [ship]);

  const previewShip = {
    ...ship,
    crew,
  };

  const result = calculateReadiness(previewShip);

  const missing =
    Math.max(
      ship.authorizedCrew - crew,
      0
    );

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        กำลังพล (Personnel)
      </h3>

      <div className="mt-5">

        <label className="text-sm text-slate-400">
          กำลังพลปัจจุบัน
        </label>

        <input
          type="number"
          min={0}
          max={ship.authorizedCrew}
          value={crew}
          onChange={(e) => {

            const value =
              Number(e.target.value);

            setCrew(value);

            onCrewChange?.(value);

          }}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white outline-none focus:border-sky-500"
        />

      </div>

      <div className="mt-5">

        <p className="text-sm text-slate-400">
          อัตรากำลัง
        </p>

        <p className="mt-1 text-2xl font-bold text-white">

          {crew} / {ship.authorizedCrew}

        </p>

      </div>

      <div className="mt-5">

        <p className="text-sm text-slate-400">

          ความพร้อมด้านกำลังพล

        </p>

        <p className="mt-1 text-2xl font-bold text-sky-400">

          {result.personnel.toFixed(1)}%

        </p>

        <div className="mt-3 h-2 rounded-full bg-slate-700">

          <div
            className="h-2 rounded-full bg-sky-500 transition-all duration-300"
            style={{
              width: `${result.personnel}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-5 flex justify-between">

        <span className="text-slate-400">

          กำลังพลขาด

        </span>

        <span className="font-semibold text-red-400">

          {missing}

        </span>

      </div>

    </div>

  );

}