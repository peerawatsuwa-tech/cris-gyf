import { fleet } from "@/data/fleet";
import { calculateImpact } from "@/engine/impactEngine";

export default function ImpactCard() {

  const impacts = fleet.flatMap(ship =>
    calculateImpact(ship)
  );

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">

        Operational Impact

      </h2>

      <div className="mt-5 space-y-4">

        {impacts.length === 0 && (

          <p className="text-emerald-400">

            No Operational Impact

          </p>

        )}

        {impacts.map((impact,index)=>(

          <div
            key={index}
            className="rounded-lg bg-slate-900 p-4"
          >

            <p className="font-semibold text-white">

              {impact.title}

            </p>

            <p className="text-slate-400 mt-1">

              {impact.effect}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}