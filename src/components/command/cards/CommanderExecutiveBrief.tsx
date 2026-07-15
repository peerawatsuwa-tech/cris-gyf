import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";
import { useFleetIntelligence } from "@/hooks/useFleetIntelligence";

export default function CommanderExecutiveBrief() {
  const { ready, limited, notReady, average } = useCommanderSnapshot();
  const intelligence = useFleetIntelligence();
  const topAction = intelligence.actions[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <p className="text-xs tracking-[0.35em] text-sky-400">สรุปสถานการณ์</p>
      <h2 className="mt-2 text-2xl font-bold text-white">สาระสำคัญสำหรับผู้บังคับบัญชา</h2>

      <div className="mt-6 space-y-4">
        <Row title="เรือพร้อมปฏิบัติ" value={`${ready} ลำ`} color="text-emerald-400" />
        <Row title="เรือพร้อมแบบมีข้อจำกัด" value={`${limited} ลำ`} color="text-yellow-400" />
        <Row title="เรือไม่พร้อมปฏิบัติ" value={`${notReady} ลำ`} color="text-red-400" />
        <Row title="ความพร้อมเฉลี่ยของกองเรือ" value={`${average.toFixed(1)}%`} color="text-sky-400" />
      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        <p className="text-sm text-slate-400">ข้อเสนอแนะลำดับแรก</p>
        <p className="mt-2 font-semibold text-white">
          {topAction?.title ?? "รักษาระดับความพร้อมและติดตามสถานการณ์อย่างต่อเนื่อง"}
        </p>
      </div>
    </div>
  );
}

function Row({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{title}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
