import { fleetSummary } from '@/lib/mockDashboard'

export default function FleetSummary() {
  const cards = [
    {
      title: 'เรือทั้งหมด',
      value: fleetSummary.totalShips,
      color: 'bg-slate-700',
    },
    {
      title: 'พร้อมรบ',
      value: fleetSummary.ready,
      color: 'bg-green-600',
    },
    {
      title: 'จำกัด',
      value: fleetSummary.limited,
      color: 'bg-yellow-500',
    },
    {
      title: 'ไม่พร้อม',
      value: fleetSummary.notReady,
      color: 'bg-red-600',
    },
  ]

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className={`${card.color} rounded-xl p-6 text-white shadow`}>
          <div className="text-sm opacity-80">{card.title}</div>
          <div className="mt-3 text-5xl font-bold">{card.value}</div>
        </div>
      ))}
    </div>
  )
}
