import { MainLayout } from '@/components/layout/MainLayout'

const sections = [
  'Mission',
  'Personnel',
  'Equipment',
  'Maintenance',
  'Risk',
  'History',
  'Assessment',
]

export function ShipDetailPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
            Ship Detail
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">เรือ ต.991</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Vessel profile and readiness summary for the patrol craft ต.991.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
            >
              <h3 className="text-lg font-semibold text-white">{section}</h3>
              <p className="mt-2 text-sm text-slate-400">
                Detailed information for the {section.toLowerCase()} section will be displayed here.
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
