import { AlertTriangle, CheckCircle2, ShieldAlert, Target } from "lucide-react";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

function readinessText(limited: number, notReady: number) {
  if (notReady > 0) return "ต้องเร่งแก้ไขข้อขัดข้องที่กระทบภารกิจสำคัญ";
  if (limited > 0) return "พร้อมปฏิบัติภารกิจโดยรวม แต่ยังมีข้อจำกัดบางส่วน";
  return "พร้อมปฏิบัติภารกิจตามที่ได้รับมอบหมาย";
}

export default function CommanderCOPPanel() {
  const { ready, limited, notReady, total, average } = useCommanderSnapshot();
  const intelligence = useFleetIntelligence();
  const topIssue = intelligence.issues[0];
  const topAction = intelligence.actions[0];

  return (
    <section className="rounded-2xl border border-sky-900 bg-slate-950/80 p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-sky-400">
            ภาพรวมสถานการณ์ร่วม
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            สถานการณ์ความพร้อมสำหรับผู้บังคับบัญชา
          </h2>
          <p className="mt-3 text-slate-300">
            {readinessText(limited, notReady)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-right">
          <p className="text-xs text-slate-400">ระดับความพร้อมเฉลี่ย</p>
          <p className="mt-1 text-3xl font-bold text-sky-400">{average.toFixed(1)}%</p>
          <p className="mt-1 text-sm text-slate-400">จากเรือทั้งหมด {total} ลำ</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryItem
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          label="พร้อมปฏิบัติ"
          value={`${ready} ลำ`}
          detail="พร้อมรับภารกิจ"
        />
        <SummaryItem
          icon={<AlertTriangle className="h-5 w-5 text-yellow-400" />}
          label="พร้อมแบบมีข้อจำกัด"
          value={`${limited} ลำ`}
          detail="ต้องกำหนดข้อจำกัดในการใช้กำลัง"
        />
        <SummaryItem
          icon={<ShieldAlert className="h-5 w-5 text-red-400" />}
          label="ไม่พร้อมปฏิบัติ"
          value={`${notReady} ลำ`}
          detail="ต้องเร่งแก้ไขก่อนมอบหมายภารกิจ"
        />
        <SummaryItem
          icon={<Target className="h-5 w-5 text-sky-400" />}
          label="ข้อสั่งการเร่งด่วน"
          value={topAction ? "1 รายการสำคัญ" : "ไม่มี"}
          detail={topAction?.title ?? "ยังไม่มีข้อสั่งการเร่งด่วน"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold text-white">ประเด็นสำคัญที่สุด</p>
          <p className="mt-2 text-sm text-slate-300">
            {topIssue?.title ?? "ไม่พบประเด็นที่กระทบความพร้อมอย่างมีนัยสำคัญ"}
          </p>
          {topIssue && (
            <p className="mt-2 text-xs text-slate-500">
              กระทบเรือ {topIssue.affectedShips} ลำ และ {topIssue.affectedMissions} ภารกิจ
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold text-white">ข้อเสนอแนะลำดับแรก</p>
          <p className="mt-2 text-sm text-slate-300">
            {topAction?.title ?? "รักษาระดับความพร้อมและติดตามสถานการณ์อย่างต่อเนื่อง"}
          </p>
          {topAction && (
            <p className="mt-2 text-xs text-slate-500">
              เกี่ยวข้องกับเรือ {topAction.affectedShips} ลำ
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryItem({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
