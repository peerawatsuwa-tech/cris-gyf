import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import { useCommanderDecision } from "@/hooks/useCommanderDecision";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

const severityClass = {
  วิกฤต: "border-rose-500/50 bg-rose-950/25 text-rose-300",
  สูง: "border-orange-500/50 bg-orange-950/25 text-orange-300",
  ปานกลาง: "border-amber-500/50 bg-amber-950/20 text-amber-300",
} as const;

export default function CommanderProblemActionPanel() {
  const intelligence = useFleetIntelligence();
  const decision = useCommanderDecision();

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <article className="rounded-2xl border border-slate-800 bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
              <AlertTriangle className="h-4 w-4" />
              ปัญหาสำคัญที่เกิดขึ้น
            </div>
            <p className="mt-1 text-sm text-slate-500">แสดงเฉพาะประเด็นที่กระทบต่อเรือและภารกิจมากที่สุด</p>
          </div>
          <span className="rounded-full bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300">
            สูงสุด 5 ประเด็น
          </span>
        </header>

        <div className="divide-y divide-slate-800">
          {intelligence.issues.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">ไม่พบประเด็นสำคัญที่ต้องเร่งดำเนินการ</div>
          ) : (
            intelligence.issues.slice(0, 5).map((issue, index) => (
              <div key={`${issue.title}-${index}`} className="flex gap-4 px-6 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-white">{issue.title}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClass[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    กระทบเรือ {issue.affectedShips} ลำ · กระทบภารกิจ {issue.affectedMissions} ภารกิจ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-800 bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <ClipboardCheck className="h-4 w-4" />
              ข้อเสนอเพื่อการสั่งการ
            </div>
            <p className="mt-1 text-sm text-slate-500">จัดลำดับตามผลกระทบและความเร่งด่วน</p>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </header>

        <div className="divide-y divide-slate-800">
          {decision.decisions.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">ให้รักษาระดับความพร้อมและติดตามสถานการณ์อย่างต่อเนื่อง</div>
          ) : (
            decision.decisions.slice(0, 5).map((item) => (
              <div key={`${item.priority}-${item.title}`} className="px-6 py-4">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-base font-black text-slate-950">
                    {item.priority}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{item.title}</p>
                      <span className="rounded-full border border-emerald-700/60 bg-emerald-950/30 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                        {item.urgency}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.expectedOutcome}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>เรือ {item.affectedShips} ลำ</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>คาดเพิ่มความพร้อม {item.estimatedReadinessGain}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
