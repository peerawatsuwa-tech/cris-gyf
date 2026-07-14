import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function FleetHeatMap() {
  const { items } = useCommanderSnapshot();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <h3 className="text-xl font-bold text-white">Fleet Readiness</h3>

      <div className="mt-5 space-y-3">
        {items.map(({ ship, result }) => {
          const color =
            result.readiness === "Y"
              ? "bg-emerald-500"
              : result.readiness === "Q"
                ? "bg-yellow-500"
                : "bg-red-500";

          return (
            <div
              key={ship.id}
              className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <div>
                  <p className="font-semibold text-white">{ship.shipName}</p>
                  <p className="text-sm text-slate-400">{ship.hullNumber}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-sky-400">{result.score.toFixed(1)}%</p>
                <p className="text-sm text-slate-400">{result.readiness}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
