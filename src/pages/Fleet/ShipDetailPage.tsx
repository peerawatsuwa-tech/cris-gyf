import { MainLayout } from '@/components/layout/MainLayout'

export function ShipDetailPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
            Vessel Profile
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Aegis-01</h2>
          <p className="mt-3 text-sm text-slate-400">
            Detailed telemetry, mission readiness, and maintenance notes for the selected vessel.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Current status</h3>
            <p className="mt-2 text-sm text-slate-400">Operational • ETA 14:30</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-semibold text-white">Maintenance</h3>
            <p className="mt-2 text-sm text-slate-400">Next service in 11 days</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
