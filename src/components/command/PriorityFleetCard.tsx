import { fleet } from "@/data/fleet";
import { calculateReadiness } from "@/engine/calculateReadiness";

export default function PriorityFleetCard() {

  const ships = fleet
    .map((ship) => ({
      ship,
      result: calculateReadiness(ship),
    }))
    .sort((a, b) => a.result.score - b.result.score);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">

        Top Priority Ships

      </h2>

      <div className="mt-5 space-y-4">

        {ships.slice(0,5).map((item,index)=>(

          <div
            key={item.ship.id}
            className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
          >

            <div>

              <p className="text-white font-semibold">

                #{index+1} {item.ship.shipName}

              </p>

              <p className="text-slate-400 text-sm">

                {item.ship.hullNumber}

              </p>

            </div>

            <div className="text-right">

              <p className="text-sky-400 font-bold">

                {item.result.score.toFixed(1)}%

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );

}