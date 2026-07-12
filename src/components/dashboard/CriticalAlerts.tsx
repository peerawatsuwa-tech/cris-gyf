import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFleet } from "@/context/FleetContext";
import { calculateAlerts } from "@/engine/alertEngine";

export default function CriticalAlerts() {

  const { fleet } = useFleet();

  const alerts = fleet
    .flatMap((ship) => calculateAlerts(ship))
    .sort((a, b) => {

      const priority = {
        HIGH: 1,
        MEDIUM: 2,
      };

      return priority[a.level] - priority[b.level];

    });

  return (

    <Card className="border-slate-800 bg-slate-950/70">

      <CardHeader>

        <CardTitle className="text-white">
          🚨 Critical Alerts
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {alerts.length === 0 ? (

          <div className="rounded-lg border border-emerald-700 bg-emerald-950/30 p-4">

            <p className="font-semibold text-emerald-400">
              ไม่มีเหตุขัดข้องที่มีผลกระทบต่อภารกิจ
            </p>

          </div>

        ) : (

          alerts.slice(0, 5).map((alert, index) => (

            <div
              key={`${alert.ship}-${index}`}
              className="flex items-start justify-between border-b border-slate-800 pb-3"
            >

              <div>

                <p className="font-semibold text-white">
                  {alert.ship}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {alert.message}
                </p>

              </div>

              <span
                className={`font-bold ${
                  alert.level === "HIGH"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {alert.level}
              </span>

            </div>

          ))

        )}

      </CardContent>

    </Card>

  );

}