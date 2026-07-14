import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function PriorityFleetCard() {
  const { items } = useCommanderSnapshot();
  const ships = [...items].sort((a, b) => a.result.score - b.result.score);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <h2 className="text-xl font-bold text-white">Top Priority Ships</h2>

      <div className="mt-5 space-y-4">
        {ships.slice(0, 5).map((item, index) => (
          <div
            key={item.ship.id}
            className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
          >
            <div>
              <p className="font-semibold text-white">
                #{index + 1} {item.ship.shipName}
              </p>
              <p className="text-sm text-slate-400">{item.ship.hullNumber}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-sky-400">{item.result.score.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
