import type { Ship } from "@/types/ship";
import { calculateReadiness } from "@/engine/calculateReadiness";

interface Props {
  ship: Ship;
}

export default function ShipHeader({ ship }: Props) {
  const result = calculateReadiness(ship);

  const readiness = {
    Y: "READY",
    Q: "LIMITED",
    N: "NOT READY",
  }[result.readiness];

  const color = {
    Y: "text-emerald-400",
    Q: "text-yellow-400",
    N: "text-red-400",
  }[result.readiness];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">

      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Combat Readiness Assessment
      </p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {ship.shipName}
      </h2>

      <p className="mt-1 text-slate-400">
        {ship.hullNumber} • {ship.shipClass}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-6">

        <div>

          <p className="text-sm text-slate-400">
            Readiness
          </p>

          <p className={`mt-1 text-2xl font-bold ${color}`}>
            {readiness}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">
            Overall Score
          </p>

          <p className="mt-1 text-2xl font-bold text-sky-400">
            {result.score.toFixed(1)}%
          </p>

        </div>

      </div>

    </section>
  );
}