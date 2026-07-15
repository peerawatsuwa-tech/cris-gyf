import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

const severityStyle = {
  วิกฤต: "text-red-400",
  สูง: "text-orange-400",
  ปานกลาง: "text-yellow-400",
} as const;

export default function FleetIntelligenceCard() {
  const intelligence = useFleetIntelligence();

  return (
    <section className="rounded-2xl border border-sky-900 bg-slate-950/70 p-6 xl:col-span-2">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-sky-400">
            สารสนเทศเพื่อการตัดสินใจ
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            ภาพรวมสถานการณ์ความพร้อมของกองเรือ
          </h2>
          <p className="mt-3 max-w-4xl text-slate-300">
            {intelligence.headline}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-right">
          <p className="text-xs text-slate-400">คะแนนความพร้อมเฉลี่ย</p>
          <p className="mt-1 text-3xl font-bold text-sky-400">
            {intelligence.averageReadiness.toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-slate-400">
            สถานะ {intelligence.fleetReadiness}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-5">
          <h3 className="font-bold text-white">ประเด็นที่ต้องเฝ้าระวัง</h3>
          <div className="mt-4 space-y-4">
            {intelligence.issues.length === 0 ? (
              <p className="text-sm text-emerald-400">ไม่พบประเด็นสำคัญ</p>
            ) : (
              intelligence.issues.map((issue) => (
                <div key={issue.title}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-200">{issue.title}</p>
                    <span className={`text-xs font-bold ${severityStyle[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    กระทบ {issue.affectedShips} ลำ · {issue.affectedMissions} ภารกิจ
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <h3 className="font-bold text-white">ผลกระทบต่อการปฏิบัติภารกิจ</h3>
          <div className="mt-4 space-y-3">
            {intelligence.missionImpacts.length === 0 ? (
              <p className="text-sm text-emerald-400">ไม่พบผลกระทบสำคัญ</p>
            ) : (
              intelligence.missionImpacts.map((impact) => (
                <div key={impact.title} className="rounded-lg bg-slate-950 p-3">
                  <p className="text-sm text-slate-200">{impact.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    เกี่ยวข้องกับเรือ {impact.affectedShips} ลำ
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <h3 className="font-bold text-white">ข้อเสนอแนะเร่งด่วนสำหรับผู้บังคับบัญชา</h3>
          <ol className="mt-4 space-y-3">
            {intelligence.actions.length === 0 ? (
              <li className="text-sm text-emerald-400">ยังไม่มีข้อสั่งการเร่งด่วน</li>
            ) : (
              intelligence.actions.map((action) => (
                <li key={action.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-950 text-sm font-bold text-sky-400">
                    {action.priority}
                  </span>
                  <div>
                    <p className="text-sm text-slate-200">{action.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      เกี่ยวข้องกับเรือ {action.affectedShips} ลำ
                    </p>
                  </div>
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
