import { useFleet } from "@/context/FleetContext";
import { calculateActions } from "@/engine/actionEngine";

export default function ImmediateActionCard() {
  const { fleet } = useFleet();

  const actions = fleet.flatMap(ship =>
    calculateActions(ship)
  );

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">

        Immediate Actions

      </h2>

      <div className="mt-5 space-y-4">

        {actions.map((item,index)=>(

          <div
            key={index}
            className="rounded-xl bg-slate-900 p-4"
          >

            <p className="font-semibold text-white">

              {item.ship}

            </p>

            <p className="mt-1 text-slate-300">

              {item.title}

            </p>

            <span
              className={
                item.priority==="HIGH"
                ? "text-red-400 text-sm"
                : "text-yellow-400 text-sm"
              }
            >

              {item.priority}

            </span>

          </div>

        ))}

      </div>

    </div>

  );

}