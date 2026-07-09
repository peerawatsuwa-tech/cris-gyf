import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MissionCapability() {
  return (
    <Card className="border-slate-800 bg-slate-950/70">
      <CardHeader>
        <CardTitle className="text-white">Mission Capability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span>Search & Rescue</span>
            <span className="font-semibold text-emerald-400">High</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Patrol</span>
            <span className="font-semibold text-sky-400">Medium</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Logistics</span>
            <span className="font-semibold text-amber-400">Medium</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
