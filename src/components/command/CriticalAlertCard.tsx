import { useFleet } from "@/context/FleetContext";
import { calculateAlerts } from "@/engine/alertEngine";

export default function CriticalAlertCard() {
  const { fleet } = useFleet();

  const alerts = fleet.flatMap(ship =>
    calculateAlerts(ship)
  );

  return (

    <div className="rounded-2xl border border-red-900 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-red-400">

        🚨 Critical Alerts

      </h2>

      <div className="mt-5 space-y-4">

        {alerts.length === 0 && (

          <p className="text-emerald-400">
            No Critical Alerts
          </p>

        )}

        {alerts.map((alert, index) => (

          <div
            key={index}
            className="rounded-lg bg-slate-900 p-3"
          >

            <p className="font-semibold text-white">

              {alert.ship}

            </p>

            <p className="text-slate-400">

              {alert.message}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}