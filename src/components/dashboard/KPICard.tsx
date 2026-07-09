import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type KPICardProps = {
  title: string
  value: string
  subtitle: string
  color: string
}

export function KPICard({ title, value, subtitle, color }: KPICardProps) {
  return (
    <Card className="border-slate-800 bg-slate-950/70" style={{ borderTop: `5px solid ${color}` }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-semibold text-white" style={{ color }}>
          {value}
        </div>
        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
      </CardContent>
    </Card>
  )
}