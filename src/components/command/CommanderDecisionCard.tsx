import { ArrowUpRight, Clock3, Target } from "lucide-react";
import { useCommanderDecision } from "@/hooks/useCommanderDecision";

const urgencyStyle = {
  เร่งด่วน: "border-red-900 bg-red-950/40 text-red-300",
  สูง: "border-orange-900 bg-orange-950/40 text-orange-300",
  ตามแผน: "border-sky-900 bg-sky-950/40 text-sky-300",
} as const;

export default function CommanderDecisionCard() {
  const decisionSummary = useCommanderDecision();

  return (
    <section className="rounded-2xl border border-emerald-900 bg-slate-950/80 p-6 xl:col-span-2">
      <div>
        <p className="text-xs font-semibold tracking-[0.3em] text-emerald-400">
          ระบบสนับสนุนการตัดสินใจ
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">
          ข้อเสนอแนะสำหรับผู้บังคับบัญชา
        </h2>
        <p className="mt-3 max-w-4xl text-slate-300">
          {decisionSummary.headline}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {decisionSummary.decisions.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-emerald-400">
            ไม่พบข้อขัดข้องที่ต้องเสนอการดำเนินการเร่งด่วน
          </div>
        ) : (
          decisionSummary.decisions.slice(0, 5).map((decision) => (
            <article
              key={`${decision.priority}-${decision.title}`}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-lg font-bold text-emerald-400">
                    {decision.priority}
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{decision.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      เหตุผล: {decision.reason}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${urgencyStyle[decision.urgency]}`}
                >
                  {decision.urgency}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <DecisionMetric
                  icon={<Target className="h-4 w-4" />}
                  label="ขอบเขตผลกระทบ"
                  value={`${decision.affectedShips} ลำ · ${decision.affectedMissions} ภารกิจ`}
                />
                <DecisionMetric
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  label="ผลที่คาดว่าจะได้รับ"
                  value={`ความพร้อมเพิ่มประมาณ ${decision.estimatedReadinessGain}%`}
                />
                <DecisionMetric
                  icon={<Clock3 className="h-4 w-4" />}
                  label="ลำดับการดำเนินการ"
                  value={decision.priority === 1 ? "ดำเนินการก่อน" : `ลำดับที่ ${decision.priority}`}
                />
              </div>

              <p className="mt-4 rounded-lg bg-slate-950 p-3 text-sm text-slate-300">
                {decision.expectedOutcome}
              </p>
            </article>
          ))
        )}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        หมายเหตุ: ค่าผลลัพธ์เป็นการประมาณการจากข้อมูลความพร้อมที่มีอยู่ในระบบ
      </p>
    </section>
  );
}

function DecisionMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-950 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-200">{value}</p>
    </div>
  );
}
