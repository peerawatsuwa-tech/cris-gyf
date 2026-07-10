import type { Ship } from "@/types/ship";
import { calculateReadiness } from "@/engine/calculateReadiness";

interface Props {
  ship: Ship;
}

export default function PersonnelCard({ ship }: Props) {
  const result = calculateReadiness(ship);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">

      <h3 className="text-lg font-semibold text-white">
        Personnel
      </h3>

      <p className="mt-4 text-sm text-slate-400">
        Current Crew
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {ship.crew} / {ship.authorizedCrew}
      </p>

      <p className="mt-3 font-semibold text-sky-400">
        {result.personnel.toFixed(1)}%
      </p>

      <div className="mt-3 h-2 w-full rounded-full bg-slate-700">

        <div
          className="h-2 rounded-full bg-sky-500"
          style={{
            width: `${result.personnel}%`,
          }}
        />

      </div>

      <div className="mt-4 flex justify-between text-sm">

        <span className="text-slate-400">
          Missing Crew
        </span>

        <span className="font-semibold text-red-400">
          {ship.authorizedCrew - ship.crew}
        </span>

      </div>

    </div>
  );
}