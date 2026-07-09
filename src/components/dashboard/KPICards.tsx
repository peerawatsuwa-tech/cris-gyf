import { KPICard } from '@/components/dashboard/KPICard'
import { mockKpis } from '@/lib/mockDashboard'

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {mockKpis.map((item) => (
        <KPICard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          color={item.color}
        />
      ))}
    </div>
  )
}
