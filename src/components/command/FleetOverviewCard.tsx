import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function FleetOverviewCard() {
  const { total, ready, limited, notReady, averagePersonnel, averageEquipment } = useCommanderSnapshot();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-sky-400">กำลังกองเรือยามฝั่ง</p>
          <h2 className="mt-2 text-xl font-bold text-white">ภาพรวมเรือทั้งกองเรือ</h2>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-white">{total}</p>
          <p className="text-xs text-slate-400">ลำ</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Status label="พร้อม (Y)" value={ready} className="text-emerald-400" />
        <Status label="มีข้อจำกัด (Q)" value={limited} className="text-yellow-400" />
        <Status label="ไม่พร้อม (N)" value={notReady} className="text-red-400" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Metric label="ความพร้อมกำลังพลเฉลี่ย" value={`${averagePersonnel.toFixed(1)}%`} />
        <Metric label="ความพร้อมยุทโธปกรณ์เฉลี่ย" value={`${averageEquipment.toFixed(1)}%`} />
      </div>

      <p className="mt-4 text-xs text-slate-500">ข้อมูลความพร้อมเป็นข้อมูลจำลองสำหรับการสาธิตระบบ</p>
    </section>
  );
}

function Status({ label, value, className }: { label: string; value: number; className: string }) {
  return <div className="rounded-xl bg-slate-900 p-4 text-center"><p className={`text-3xl font-bold ${className}`}>{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4"><span className="text-sm text-slate-400">{label}</span><span className="font-bold text-sky-400">{value}</span></div>;
}
