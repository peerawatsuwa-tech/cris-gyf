import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function CommanderStatusBar() {
  const { ready, limited, notReady, average } = useCommanderSnapshot();

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Status title="พร้อมปฏิบัติ" subtitle="สถานะ Y" value={ready} color="text-emerald-400" />
      <Status title="พร้อมแบบมีข้อจำกัด" subtitle="สถานะ Q" value={limited} color="text-yellow-400" />
      <Status title="ไม่พร้อมปฏิบัติ" subtitle="สถานะ N" value={notReady} color="text-red-400" />
      <Status title="คะแนนความพร้อมเฉลี่ย" subtitle="ภาพรวมกองเรือ" value={`${average.toFixed(1)}%`} color="text-sky-400" />
    </div>
  );
}

function Status({
  title,
  subtitle,
  value,
  color,
}: {
  title: string;
  subtitle: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs tracking-wider text-slate-500">{subtitle}</p>
      <p className={`mt-3 text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
