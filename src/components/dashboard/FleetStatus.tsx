import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FleetStatus() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">Fleet Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span>Communication</span>
            <span className="font-semibold text-emerald-400">Stable</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Fuel Reserve</span>
            <span className="font-semibold text-sky-400">Healthy</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Weather Risk</span>
            <span className="font-semibold text-amber-400">Moderate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
