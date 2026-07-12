import { KPICard } from '@/components/dashboard/KPICard'
import { mockKpis } from '@/lib/mockDashboard'

export default function KPICards() {
  return (
    <section>

      <div className="mb-4">

        <p className="text-xs uppercase tracking-[0.35em] text-sky-400">
          Executive Overview
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          Fleet Readiness Dashboard
        </h2>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

    </section>
  );
}
