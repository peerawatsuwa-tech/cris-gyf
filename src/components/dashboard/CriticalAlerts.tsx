import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const alerts = [
  {
    ship: "ต.274",
    issue: "Night Vision Camera Failure",
    level: "HIGH",
    color: "text-red-500",
  },
  {
    ship: "ต.221",
    issue: "RHIB #2 Not Ready",
    level: "MEDIUM",
    color: "text-yellow-400",
  },
  {
    ship: "ต.232",
    issue: "VBSS Personnel Shortage",
    level: "LOW",
    color: "text-sky-400",
  },
];

export default function CriticalAlerts() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">
          🚨 Critical Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.ship}
            className="flex justify-between items-start border-b border-slate-800 pb-3"
          >
            <div>
              <div className="font-semibold text-white">
                {alert.ship}
              </div>

              <div className="text-sm text-slate-400">
                {alert.issue}
              </div>
            </div>

            <span className={`font-bold ${alert.color}`}>
              {alert.level}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}