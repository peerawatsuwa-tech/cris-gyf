import type { Ship } from "@/types/fleet";
import { Link } from "react-router-dom";
import { calculateReadiness } from "@/engine/calculateReadiness";
interface Props {
  ship: Ship;
}

export default function FleetCard({ ship }: Props) {
  const result = calculateReadiness(ship);
 const readiness = {
    Y: {
        color: "bg-emerald-500",
        text: "Ready",
    },
    Q: {
        color: "bg-yellow-500",
        text: "Limited",
    },
    N: {
        color: "bg-red-500",
        text: "Not Ready",
    },
}[result.readiness];

  
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-6">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className={`h-4 w-4 rounded-full ${readiness.color}`} />

          <h2 className="text-xl font-bold text-white">
            {ship.hullNumber}
          </h2>

        </div>

        <span className="rounded bg-slate-800 px-3 py-1 text-sm text-slate-300">
          {ship.cRating}
        </span>

      </div>

      <div className="mt-4 space-y-1">

        <div className="text-lg font-semibold text-white">
          {ship.shipName}
        </div>

        <div className="text-slate-400">
          {ship.squadron}
        </div>

        <div className="text-slate-500">
          {ship.shipClass}
        </div>

      </div>

      <div className="mt-6 border-t border-slate-800 pt-4">

        <div className="flex justify-between">

          <span className="text-slate-400">
            Readiness
          </span>

          <span className="font-semibold text-white">
            {readiness.text}
          </span>

        </div>

        <div className="mt-2 flex justify-between">

          <span className="text-slate-400">
            Status
          </span>

          <span className="text-white">
            {result.readiness}
          </span>

        </div>

      </div>

      <Link
  to={`/ship/${ship.id}`}
  className="
    mt-6
    block
    w-full
    rounded-lg
    bg-sky-600
    py-2
    text-center
    font-semibold
    text-white
    transition
    hover:bg-sky-500
  "
>
  View Detail →
</Link>

    </div>
  );
}