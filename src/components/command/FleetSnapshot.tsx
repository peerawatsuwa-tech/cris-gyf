import { AlertTriangle, CheckCircle2, Ship, ShieldAlert } from "lucide-react";
import { useCommanderSnapshot } from "@/hooks/useCommanderSnapshot";

export default function FleetSnapshot() {
  const snapshot = useCommanderSnapshot();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
            <Ship className="h-4 w-4" />
            FLEET SNAPSHOT
          </div>
          <p className="mt-1 text-sm text-slate-500">
            สถานะเรือแบบย่อก่อนตรวจสอบการวางกำลัง
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <StatusChip
            icon={CheckCircle2}
            label="พร้อม (Y)"
            value={snapshot.ready}
            className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
          />
          <StatusChip
            icon={AlertTriangle}
            label="มีข้อจำกัด (Q)"
            value={snapshot.limited}
            className="border-amber-500/30 bg-amber-950/20 text-amber-300"
          />
          <StatusChip
            icon={ShieldAlert}
            label="ไม่พร้อม (N)"
            value={snapshot.notReady}
            className="border-rose-500/30 bg-rose-950/20 text-rose-300"
          />
        </div>
      </div>
    </section>
  );
}

function StatusChip({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Ship;
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={`flex min-w-[170px] items-center gap-3 rounded-xl border px-4 py-3 ${className}`}>
      <Icon className="h-5 w-5" />
      <div>
        <p className="text-[11px] opacity-75">{label}</p>
        <p className="text-2xl font-black">{value} ลำ</p>
      </div>
    </div>
  );
}
