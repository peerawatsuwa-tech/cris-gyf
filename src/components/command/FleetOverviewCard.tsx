import { useFleet } from "@/context/FleetContext";

export default function FleetOverviewCard() {
  const { fleet } = useFleet();

  const ready = fleet.filter((s) => s.readiness === "Y").length;
  const limited = fleet.filter((s) => s.readiness === "Q").length;
  const notReady = fleet.filter((s) => s.readiness === "N").length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">

      <h2 className="text-xl font-bold text-white">
        ภาพรวมกองเรือ
      </h2>

      <p className="text-sm text-slate-400">
        Fleet Readiness Summary
      </p>

      <div className="mt-6 space-y-5">

        <Row
          label="พร้อมปฏิบัติ"
          value={ready}
          color="text-emerald-400"
        />

        <Row
          label="พร้อมบางส่วน"
          value={limited}
          color="text-yellow-400"
        />

        <Row
          label="ไม่พร้อม"
          value={notReady}
          color="text-red-400"
        />

      </div>

    </div>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-slate-300">
        {label}
      </span>

      <span className={`text-xl font-bold ${color}`}>
        {value} ลำ
      </span>

    </div>
  );
}